import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { sendConfirmedBookingEmails } from "@/lib/confirm-booking"
import { enforceRateLimit } from "@/lib/rate-limit"
import { isMissingDatabaseConfig } from "@/lib/service-fallbacks"
import { isPatchTestService, normalisePublicService } from "@/lib/service-display"
import { stripe } from "@/lib/stripe"
import { Service } from "@/lib/types"
import { getAppointmentTimeWindow } from "@/lib/appointment-time"
import { z } from "zod"

export const dynamic = "force-dynamic"

const bookingSchema = z.object({
  serviceId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  notes: z.string().max(1000).nullable().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const limited = await enforceRateLimit(request, {
      bucket: "booking-create",
      limit: 10,
      windowMs: 15 * 60 * 1000,
    })

    if (limited) return limited

    const body = await request.json()
    const parsed = bookingSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid booking data", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { serviceId, date, time, name, email, phone, notes } = parsed.data
    const sql = getDb()

    const serviceRows = await sql`
      SELECT * FROM services WHERE id = ${serviceId} AND active = true
    `

    if (serviceRows.length === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    const service = normalisePublicService(serviceRows[0] as Service)
    const isPatchTest = isPatchTestService(service)

    let startAt: string
    let endAt: string

    try {
      const window = getAppointmentTimeWindow(
        date,
        time,
        service.duration_minutes as number
      )
      startAt = window.startAt
      endAt = window.endAt
    } catch {
      return NextResponse.json(
        { error: "Invalid appointment date or time" },
        { status: 400 }
      )
    }

    const conflicts = await sql`
      SELECT id FROM bookings
      WHERE start_at < ${endAt}::timestamptz
      AND end_at > ${startAt}::timestamptz
      AND status IN ('confirmed','pending_payment')
      AND (status != 'pending_payment' OR expires_at > now())
    `

    if (conflicts.length > 0) {
      return NextResponse.json(
        { error: "This time slot is no longer available. Please choose another." },
        { status: 409 }
      )
    }

    const depositPence = service.deposit_pence as number
    const isFreeBooking = depositPence <= 0

    const expiresAt = isFreeBooking
      ? null
      : new Date(Date.now() + 30 * 60 * 1000).toISOString()

    const bookingRows = await sql`
      INSERT INTO bookings (
        service_id,
        start_at,
        end_at,
        customer_name,
        customer_email,
        customer_phone,
        notes,
        status,
        deposit_amount_pence,
        expires_at
      )
      VALUES (
        ${serviceId},
        ${startAt}::timestamptz,
        ${endAt}::timestamptz,
        ${name},
        ${email},
        ${phone},
        ${notes || null},
        ${isFreeBooking ? 'confirmed' : 'pending_payment'},
        ${depositPence},
        ${expiresAt ? `${expiresAt}` : null}::timestamptz
      )
      RETURNING id
    `

    const bookingId = bookingRows[0].id as string

    const origin =
      request.headers.get("origin") || request.headers.get("host") || ""

    const baseUrl = origin.startsWith("http") ? origin : `https://${origin}`

    if (isFreeBooking) {
      try {
        await sendConfirmedBookingEmails(bookingId)
      } catch (emailError) {
        console.error("Free booking confirmation email failed:", emailError)
      }

      return NextResponse.json({
        bookingId,
        checkoutUrl: `${baseUrl}/book/success?booking_id=${bookingId}`,
      })
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `${service.name} - Deposit`,
              description: isPatchTest
                ? `Patch test on ${date} at ${time}. This £5 attendance deposit is refunded once you attend.`
                : `Appointment on ${date} at ${time}. Deposits are non-refundable once the booking has been made.`,
            },
            unit_amount: depositPence,
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId,
        serviceId,
        date,
        time,
      },
      customer_email: email,
      success_url: `${baseUrl}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/book?cancelled=true`,
      expires_at: Math.floor(Date.now() / 1000) + 1800,
    })

    await sql`
      UPDATE bookings
      SET stripe_checkout_session_id = ${session.id}
      WHERE id = ${bookingId}
    `

    return NextResponse.json({
      bookingId,
      checkoutUrl: session.url,
    })
  } catch (error: any) {
    if (isMissingDatabaseConfig(error)) {
      return NextResponse.json(
        {
          error:
            "Booking payments are not available in this local preview because the booking database is not configured.",
        },
        { status: 503 }
      )
    }

    console.error("Booking creation error:", error)

    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    )
  }
}
