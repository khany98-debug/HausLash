import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    // If webhook secret is configured, verify signature
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } else {
      // In development/sandbox, parse without verification
      event = JSON.parse(body) as Stripe.Event
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const sql = getDb()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      if (session.payment_status === 'paid') {
        // Update booking to confirmed
        await sql`
          UPDATE bookings 
          SET status = 'confirmed', 
              updated_at = now(), 
              expires_at = NULL
          WHERE stripe_checkout_session_id = ${session.id}
          AND status = 'pending_payment'
        `

        // Create appointment reminders
        try {
          // Get the booking details
          const bookingRows = await sql`
            SELECT id, start_at FROM bookings
            WHERE stripe_checkout_session_id = ${session.id}
            AND status = 'confirmed'
          `

          if (bookingRows.length > 0) {
            const booking = bookingRows[0]
            const appointmentTime = new Date(booking.start_at)

            // Calculate reminder times
            const remind24hBefore = new Date(appointmentTime.getTime() - 24 * 60 * 60 * 1000)
            const remind1hBefore = new Date(appointmentTime.getTime() - 60 * 60 * 1000)

            // Create 24h reminder
            await sql`
              INSERT INTO appointment_reminders (booking_id, reminder_type, scheduled_for)
              VALUES (${booking.id}, '24h', ${remind24hBefore.toISOString()}::timestamptz)
            `

            // Create 1h reminder
            await sql`
              INSERT INTO appointment_reminders (booking_id, reminder_type, scheduled_for)
              VALUES (${booking.id}, '1h', ${remind1hBefore.toISOString()}::timestamptz)
            `
          }
        } catch (err) {
          console.error('Error creating appointment reminders:', err)
          // Don't fail the webhook if reminders fail to create
        }
      }
      break
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session
      // Cancel the booking when checkout expires
      await sql`
        UPDATE bookings 
        SET status = 'cancelled', updated_at = now()
        WHERE stripe_checkout_session_id = ${session.id}
        AND status = 'pending_payment'
      `
      break
    }

    default:
      break
  }

  return NextResponse.json({ received: true })
}
