import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

function checkAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return false
  const token = authHeader.replace('Bearer ', '')
  return token === (process.env.ADMIN_PASSWORD || 'admin123')
}

// GET availability rules
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const sql = getDb()
  const rules = await sql`SELECT * FROM availability_rules ORDER BY weekday ASC`
  return NextResponse.json({ rules })
}

// POST create/update a rule
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
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
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const sql = getDb()
  const blocked = await sql`SELECT * FROM blocked_times ORDER BY start_at DESC`
  return NextResponse.json({ blocked })
}

// PATCH add blocked time
export async function PATCH(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const sql = getDb()

  if (body.action === 'add') {
    await sql`
      INSERT INTO blocked_times (start_at, end_at, reason)
      VALUES (${body.start_at}::timestamptz, ${body.end_at}::timestamptz, ${body.reason || null})
    `
  } else if (body.action === 'delete') {
    await sql`DELETE FROM blocked_times WHERE id = ${body.id}`
  }

  return NextResponse.json({ success: true })
}
