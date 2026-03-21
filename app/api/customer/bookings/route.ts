import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const loginSchema = z.object({
  email: z.string().email(),
})

// POST: Login with email to get booking history
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid email' },
        { status: 400 }
      )
    }

    const { email } = parsed.data
    const sql = getDb()

    // Find bookings for this email
    const bookings = await sql`
      SELECT 
        b.id,
        b.service_id,
        s.name as service_name,
        b.start_at,
        b.end_at,
        b.status,
        b.deposit_amount_pence,
        b.created_at
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      WHERE b.customer_email = ${email}
      ORDER BY b.start_at DESC
    `

    // Get or create customer profile
    const profileRows = await sql`
      SELECT * FROM customer_profiles WHERE email = ${email}
    `

    let profile
    if (profileRows.length > 0) {
      profile = profileRows[0]
    } else {
      // Create profile on first login
      const newProfileRows = await sql`
        INSERT INTO customer_profiles (email, name)
        VALUES (${email}, 'Customer')
        RETURNING id, email, name, created_at
      `
      profile = newProfileRows[0]
    }

    return NextResponse.json({
      success: true,
      profile,
      bookings,
    })
  } catch (error) {
    console.error('Error in customer login:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve bookings' },
      { status: 500 }
    )
  }
}

// GET: Get customer bookings if email is provided
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const sql = getDb()

    const bookings = await sql`
      SELECT 
        b.id,
        b.service_id,
        s.name as service_name,
        s.duration_minutes,
        b.start_at,
        b.end_at,
        b.status,
        b.deposit_amount_pence,
        b.notes,
        b.created_at
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      WHERE b.customer_email = ${email}
      ORDER BY b.start_at DESC
    `

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
