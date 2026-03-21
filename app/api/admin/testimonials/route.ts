import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '100')

    const sql = getDb()

    let testimonials
    if (status) {
      testimonials = await sql`
        SELECT id, customer_id, customer_name, service_id, rating, review_text, status, featured, created_at, updated_at
        FROM testimonials
        WHERE status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `
    } else {
      testimonials = await sql`
        SELECT id, customer_id, customer_name, service_id, rating, review_text, status, featured, created_at, updated_at
        FROM testimonials
        ORDER BY created_at DESC
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
