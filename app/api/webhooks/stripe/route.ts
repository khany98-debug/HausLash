import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { confirmPaidBooking } from '@/lib/confirm-booking'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured')
    return NextResponse.json(
      { error: 'Webhook is not configured' },
      { status: 500 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
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
