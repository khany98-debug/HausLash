import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { BlockedTime, Booking } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {

  const { searchParams } = new URL(request.url)

  const date = searchParams.get('date')
  const serviceId = searchParams.get('serviceId')

  if (!date || !serviceId) {
    return NextResponse.json(
      { error: 'date and serviceId are required' },
      { status: 400 }
    )
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: 'Invalid date format' },
      { status: 400 }
    )
  }

  const sql = getDb()

  // Get service duration
  const service = await sql`
    SELECT duration_minutes
    FROM services
    WHERE id = ${serviceId}
    AND active = true
  `

  if (service.length === 0) {
    return NextResponse.json(
      { error: 'Service not found' },
      { status: 404 }
    )
  }

  // Get manual slots for this date
  const slotRows = await sql`
    SELECT start_time, end_time
    FROM availability_slots
    WHERE date = ${date}
    ORDER BY start_time
  `

  if (slotRows.length === 0) {
    return NextResponse.json({ slots: [] })
  }

  // Get blocked times for this day
  const dayStart = `${date}T00:00:00Z`
  const dayEnd = `${date}T23:59:59Z`

  const blocked = (await sql`
    SELECT *
    FROM blocked_times
    WHERE start_at < ${dayEnd}::timestamptz
    AND end_at > ${dayStart}::timestamptz
  `) as BlockedTime[]

  // Get bookings
  const bookings = (await sql`
    SELECT start_at, end_at
    FROM bookings
    WHERE start_at::date = ${date}::date
    AND status IN ('confirmed','pending_payment')
    AND (status != 'pending_payment' OR expires_at > now())
  `) as Pick<Booking,'start_at'|'end_at'>[]

  const slots = []

  for (const s of slotRows) {

    const start = s.start_time.slice(0,5)
    const end = s.end_time.slice(0,5)

    const slotStartISO = `${date}T${start}:00Z`
    const slotEndISO = `${date}T${end}:00Z`

    // prevent past times
    const now = new Date()
    const slotDateTime = new Date(`${date}T${start}:00`)

    if (slotDateTime <= now) continue

    // check blocked times
    const isBlocked = blocked.some(b =>
      new Date(b.start_at) < new Date(slotEndISO) &&
      new Date(b.end_at) > new Date(slotStartISO)
    )

    // check bookings
    const isBooked = bookings.some(b =>
      new Date(b.start_at) < new Date(slotEndISO) &&
      new Date(b.end_at) > new Date(slotStartISO)
    )

    slots.push({
      start,
      end,
      available: !isBlocked && !isBooked
    })

  }

  return NextResponse.json({ slots })

}