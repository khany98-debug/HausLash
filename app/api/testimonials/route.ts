import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const testimonialSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  serviceId: z.string().uuid().optional().or(z.null()),
  rating: z.number().int().min(1).max(5),
  review: z.string().trim().min(20).max(1000),
  website: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = testimonialSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid testimonial data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { name, serviceId, rating, review, website } = parsed.data

    // Honeypot field: acknowledge automated submissions without storing them.
    if (website) {
      return NextResponse.json({ success: true })
    }

    const email = parsed.data.email.trim().toLowerCase()
    const sql = getDb()

    let selectedServiceId: string | null = null
    if (serviceId) {
      const serviceRows = await sql`
        SELECT id
        FROM services
        WHERE id = ${serviceId}
        AND active = true
      `

      if (serviceRows.length === 0) {
        return NextResponse.json(
          { error: 'Please select a valid treatment' },
          { status: 400 }
        )
      }

      selectedServiceId = serviceId
    }

    const existingCustomers = await sql`
      SELECT id
      FROM customer_profiles
      WHERE lower(email) = ${email}
      LIMIT 1
    `

    let customerId: string
    if (existingCustomers.length > 0) {
      customerId = existingCustomers[0].id as string
      await sql`
        UPDATE customer_profiles
        SET name = ${name}, email = ${email}, updated_at = now()
        WHERE id = ${customerId}
      `
    } else {
      const customerRows = await sql`
        INSERT INTO customer_profiles (name, email)
        VALUES (${name}, ${email})
        RETURNING id
      `
      customerId = customerRows[0].id as string
    }

    const recentRows = await sql`
      SELECT id
      FROM testimonials
      WHERE customer_id = ${customerId}
      AND created_at > now() - interval '24 hours'
      LIMIT 1
    `

    if (recentRows.length > 0) {
      return NextResponse.json(
        { error: 'A review from this email was already submitted recently.' },
        {
          status: 429,
          headers: { 'Retry-After': '86400' },
        }
      )
    }

    const verifiedRows = await sql`
      SELECT EXISTS (
        SELECT 1
        FROM bookings
        WHERE lower(customer_email) = ${email}
        AND status IN ('confirmed', 'completed')
      ) AS verified_booking
    `
    const verifiedBooking = Boolean(verifiedRows[0]?.verified_booking)

    const testimonialRows = await sql`
      INSERT INTO testimonials (
        customer_id,
        customer_name,
        service_id,
        rating,
        review_text,
        status
      )
      VALUES (
        ${customerId},
        ${name},
        ${selectedServiceId},
        ${rating},
        ${review},
        'pending'
      )
      RETURNING id, status
    `

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your review! It will be displayed after approval.',
        testimonial: {
          ...testimonialRows[0],
          verified_booking: verifiedBooking,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error submitting testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to submit testimonial' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const requestedLimit = Number.parseInt(searchParams.get('limit') || '10', 10)
    const limit = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(requestedLimit, 1), 50)
      : 10

    const sql = getDb()

    // Get all approved testimonials
    const testimonials = await sql`
      SELECT
        t.id,
        t.customer_name,
        t.service_id,
        t.rating,
        t.review_text,
        t.created_at,
        EXISTS (
          SELECT 1
          FROM bookings b
          JOIN customer_profiles cp ON cp.id = t.customer_id
          WHERE lower(b.customer_email) = lower(cp.email)
          AND b.status IN ('confirmed', 'completed')
        ) AS verified_booking
      FROM testimonials t
      WHERE t.status = 'approved'
      ORDER BY t.created_at DESC
      LIMIT ${limit}
    `

    return NextResponse.json(
      { testimonials },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}
