import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const loginSchema = z.object({
  email: z.string().email().max(254),
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

    const email = parsed.data.email.toLowerCase()
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
      WHERE lower(b.customer_email) = ${email}
      ORDER BY b.start_at DESC
    `

    return NextResponse.json(
      { success: true, bookings },
      { headers: { 'Cache-Control': 'private, no-store' } },
    )
  } catch (error) {
    console.error('Error in customer login:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve bookings' },
      { status: 500 }
    )
  }
}

// GET: Get customer bookings if email is provided
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
