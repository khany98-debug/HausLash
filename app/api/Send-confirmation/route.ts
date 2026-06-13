import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { isAdminRequest } from '@/lib/admin-auth'
import { confirmPaidBooking } from '@/lib/confirm-booking'
import { getDb } from '@/lib/db'

const requestSchema = z.object({
  bookingId: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const parsed = requestSchema.safeParse(await request.json())

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 })
  }

  const sql = getDb()
  const rows = await sql`
    SELECT stripe_checkout_session_id
    FROM bookings
    WHERE id = ${parsed.data.bookingId}
    AND status = 'confirmed'
  `

  const checkoutSessionId = rows[0]?.stripe_checkout_session_id as
    | string
    | undefined

  if (!checkoutSessionId) {
    return NextResponse.json(
      { error: 'Confirmed booking not found' },
      { status: 404 }
    )
  }

  try {
    const result = await confirmPaidBooking(checkoutSessionId)

    return NextResponse.json({
      success: result.confirmed,
      customerEmailSent: result.customerEmailSent,
    })
  } catch (error) {
    console.error('Could not send booking confirmation:', error)
    return NextResponse.json(
      { error: 'Could not send booking confirmation' },
      { status: 502 }
    )
  }
}
