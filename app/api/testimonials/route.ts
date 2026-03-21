import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const testimonialSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  serviceId: z.string().min(1).optional().or(z.null()),
  rating: z.number().min(1).max(5),
  review: z.string().min(10).max(1000),
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

    const { name, email, serviceId, rating, review } = parsed.data
    const sql = getDb()

    // Find or create customer profile
    const customerRows = await sql`
      SELECT id FROM customer_profiles WHERE email = ${email}
    `

    let customerId: string | null = null
    if (customerRows.length > 0) {
      customerId = customerRows[0].id
    } else {
      const newCustomerRows = await sql`
        INSERT INTO customer_profiles (name, email)
        VALUES (${name}, ${email})
        RETURNING id
      `
      customerId = newCustomerRows[0].id
    }

    // Create testimonial (pending approval)
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
        ${serviceId || null},
        ${rating},
        ${review},
        'pending'
      )
      RETURNING id, status
    `

    return NextResponse.json({
      success: true,
      message: 'Thank you for your review! It will be displayed after approval.',
      testimonial: testimonialRows[0],
    })
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
    const limit = parseInt(searchParams.get('limit') || '10')

    const sql = getDb()

    // Get all approved testimonials
    const testimonials = await sql`
      SELECT id, customer_name, service_id, rating, review_text, created_at
      FROM testimonials
      WHERE status = 'approved'
      ORDER BY created_at DESC
      LIMIT ${limit}
    `

    return NextResponse.json({ testimonials })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}
