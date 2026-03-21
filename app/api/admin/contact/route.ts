import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '100')

    const sql = getDb()

    let inquiries
    if (status) {
      inquiries = await sql`
        SELECT id, name, email, phone, message, status, created_at
        FROM contact_inquiries
        WHERE status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `
    } else {
      inquiries = await sql`
        SELECT id, name, email, phone, message, status, created_at
        FROM contact_inquiries
        ORDER BY created_at DESC
        LIMIT ${limit}
      `
    }

    return NextResponse.json({ inquiries })
  } catch (error) {
    console.error('Error fetching inquiries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    )
  }
}
