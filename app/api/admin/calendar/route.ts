import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(req: NextRequest) {

  const auth = req.headers.get('authorization')

  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sql = getDb()

  try {

    let availability = []
    try {
      const slots = await sql`
        SELECT DISTINCT date
        FROM availability_slots
      `
      availability = slots.map((s:any)=>s.date.toISOString().split('T')[0])
    } catch (err) {
      console.error('Availability slots error:', err)
    }


    // Get all bookings with details
    const bookings = await sql`
      SELECT b.*, s.name as service_name, s.duration_minutes, s.price_pence
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      ORDER BY b.start_at DESC
    `

    // For coloring, extract booked days
    const bookedDays = bookings.map((b:any)=>{
      const d = new Date(b.start_at)
      return d.toISOString().split('T')[0]
    })

    return NextResponse.json({
      availability,
      bookings,
      bookedDays
    })

  } catch (err) {

    console.error(err)

    return NextResponse.json(
      { error:'Server error' },
      { status:500 }
    )

  }

}