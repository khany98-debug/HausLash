import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { z } from 'zod'
import { isAdminRequest } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

const updateSchema = z.object({
  status: z.enum(['approved', 'rejected', 'pending']),
})

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

export async function PATCH(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { pathname } = new URL(request.url)
    const id = pathname.split('/').pop()

    if (!id) {
      return NextResponse.json(
        { error: 'Testimonial ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const parsed = updateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { status } = parsed.data
    const sql = getDb()

    const result = await sql`
      UPDATE testimonials
      SET status = ${status}, updated_at = now()
      WHERE id = ${id}
      RETURNING id, status
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      testimonial: result[0],
    })
  } catch (error) {
    console.error('Error updating testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { pathname } = new URL(request.url)
    const id = pathname.split('/').pop()

    if (!id) {
      return NextResponse.json(
        { error: 'Testimonial ID is required' },
        { status: 400 }
      )
    }

    const sql = getDb()

    const result = await sql`
      DELETE FROM testimonials
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted',
    })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    )
  }
}
