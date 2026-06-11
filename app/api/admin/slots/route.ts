import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { isAdminRequest } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')

  if (!date) {
    return NextResponse.json({ slots: [] })
  }

  const sql = getDb()

  const slots = await sql`
    SELECT *
    FROM availability_slots
    WHERE date = ${date}
    ORDER BY start_time
  `

  return NextResponse.json({ slots })
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { date, start_time, end_time } = await request.json()
  const sql = getDb()

  await sql`
    INSERT INTO availability_slots (date,start_time,end_time)
    VALUES (${date},${start_time},${end_time})
  `

  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await request.json()
  const sql = getDb()

  await sql`
    DELETE FROM availability_slots
    WHERE id = ${id}
  `

  return NextResponse.json({ success: true })
}
