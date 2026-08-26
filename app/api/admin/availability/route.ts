import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { isAdminRequest } from '@/lib/admin-auth'
import { localDateTimeInputToUtcIso } from '@/lib/appointment-time'

export const dynamic = 'force-dynamic'

// GET availability rules
export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const sql = getDb()
  const rules = await sql`SELECT * FROM availability_rules ORDER BY weekday ASC`
  return NextResponse.json({ rules })
}

// POST create/update a rule
export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const sql = getDb()

  // Upsert: delete existing rule for this weekday, then insert
  await sql`DELETE FROM availability_rules WHERE weekday = ${body.weekday}`
  if (body.enabled !== false) {
    await sql`
      INSERT INTO availability_rules (weekday, start_time, end_time, buffer_minutes)
      VALUES (${body.weekday}, ${body.start_time}, ${body.end_time}, ${body.buffer_minutes || 15})
    `
  }
  return NextResponse.json({ success: true })
}

// GET blocked times
export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const sql = getDb()
  const blocked = await sql`SELECT * FROM blocked_times ORDER BY start_at DESC`
  return NextResponse.json({ blocked })
}

// PATCH add blocked time
export async function PATCH(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const sql = getDb()

  if (body.action === 'add') {
    let startAt: string
    let endAt: string

    try {
      startAt = localDateTimeInputToUtcIso(body.start_at)
      endAt = localDateTimeInputToUtcIso(body.end_at)
    } catch {
      return NextResponse.json({ error: 'Invalid blocked time' }, { status: 400 })
    }

    if (new Date(startAt) >= new Date(endAt)) {
      return NextResponse.json(
        { error: 'Blocked time must end after it starts' },
        { status: 400 }
      )
    }

    await sql`
      INSERT INTO blocked_times (start_at, end_at, reason)
      VALUES (${startAt}::timestamptz, ${endAt}::timestamptz, ${body.reason || null})
    `
  } else if (body.action === 'delete') {
    await sql`DELETE FROM blocked_times WHERE id = ${body.id}`
  }

  return NextResponse.json({ success: true })
}
