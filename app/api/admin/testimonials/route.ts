import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { isAdminRequest } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '100')

    const sql = getDb()

    let testimonials
    if (status) {
      testimonials = await sql`
        SELECT
          t.id, t.customer_id, t.customer_name, t.service_id, t.rating, t.review_text,
          t.status, t.featured, t.created_at, t.updated_at,
          EXISTS (
            SELECT 1
            FROM bookings b
            JOIN customer_profiles cp ON cp.id = t.customer_id
            WHERE lower(b.customer_email) = lower(cp.email)
            AND b.status IN ('confirmed', 'completed')
          ) AS verified_booking
        FROM testimonials t
        WHERE t.status = ${status}
        ORDER BY t.created_at DESC
        LIMIT ${limit}
      `
    } else {
      testimonials = await sql`
        SELECT
          t.id, t.customer_id, t.customer_name, t.service_id, t.rating, t.review_text,
          t.status, t.featured, t.created_at, t.updated_at,
          EXISTS (
            SELECT 1
            FROM bookings b
            JOIN customer_profiles cp ON cp.id = t.customer_id
            WHERE lower(b.customer_email) = lower(cp.email)
            AND b.status IN ('confirmed', 'completed')
          ) AS verified_booking
        FROM testimonials t
        ORDER BY t.created_at DESC
        LIMIT ${limit}
      `
    }

    return NextResponse.json({ testimonials })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}
