import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { confirmPaidBooking } from '@/lib/confirm-booking'
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
        try {
          await confirmPaidBooking(session.id)
        } catch (err) {
          console.error('Error confirming booking:', err)
          return NextResponse.json(
            { error: 'Booking confirmation failed' },
            { status: 500 }
          )
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
