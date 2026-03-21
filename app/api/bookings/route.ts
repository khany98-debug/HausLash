import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { stripe } from "@/lib/stripe"
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

    // Get service
    const serviceRows = await sql`
      SELECT * FROM services WHERE id = ${serviceId} AND active = true
    `

    if (serviceRows.length === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    const service = serviceRows[0]

    // Calculate appointment times
    const startAt = `${date}T${time}:00Z`

    const startMinutes =
      parseInt(time.split(":")[0]) * 60 + parseInt(time.split(":")[1])

    const endMinutes = startMinutes + (service.duration_minutes as number)

    const endH = String(Math.floor(endMinutes / 60)).padStart(2, "0")
    const endM = String(endMinutes % 60).padStart(2, "0")

    const endAt = `${date}T${endH}:${endM}:00Z`

    // Prevent double bookings
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

    // Hold booking for 30 minutes
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString()

    const depositPence = service.deposit_pence as number

    // Create booking
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
        'pending_payment',
        ${depositPence},
        ${expiresAt}::timestamptz
      )
      RETURNING id
    `

    const bookingId = bookingRows[0].id as string

    const origin =
      request.headers.get("origin") || request.headers.get("host") || ""

    const baseUrl = origin.startsWith("http") ? origin : `https://${origin}`

    // Stripe checkout
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `${service.name} - Deposit`,
              description: `Appointment on ${date} at ${time}`,
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
      expires_at: Math.floor(Date.now() / 1000) + 1800, // 30 minutes
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
    console.error("Booking creation error:", error)

    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    )
  }
}