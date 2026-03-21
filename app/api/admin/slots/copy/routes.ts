import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {

    const auth = req.headers.get('authorization')

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { source_date, start_date, end_date, saturday, sunday } = await req.json()

    const sql = getDb()

    if (!source_date || !start_date || !end_date) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // get slots from source date
    const sourceSlots = await sql`
      SELECT start_time, end_time
      FROM availability_slots
      WHERE date = ${source_date}
    `

    if (!sourceSlots.length) {
      return NextResponse.json({ error: 'No slots found for source date' }, { status: 400 })
    }

    const start = new Date(start_date)
    const end = new Date(end_date)

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {

      const weekday = d.getDay()

      if ((weekday === 6 && saturday) || (weekday === 0 && sunday)) {

        const date = d.toISOString().split('T')[0]

        for (const slot of sourceSlots) {

          await sql`
            INSERT INTO availability_slots (date, start_time, end_time)
            VALUES (${date}, ${slot.start_time}, ${slot.end_time})
          `

        }

      }

    }

    return NextResponse.json({ success: true })

  } catch (error) {

    console.error('COPY ERROR:', error)

    return NextResponse.json({ error: 'Copy failed' }, { status: 500 })

  }
}