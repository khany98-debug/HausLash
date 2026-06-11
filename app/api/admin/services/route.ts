import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { isAdminRequest } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

// GET all services (including inactive)
export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const sql = getDb()
  const services = await sql`SELECT * FROM services ORDER BY sort_order ASC`
  return NextResponse.json({ services })
}

// POST create a new service
export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const sql = getDb()
  const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  await sql`
    INSERT INTO services (name, slug, description, duration_minutes, price_pence, deposit_pence, active, sort_order)
    VALUES (${body.name}, ${slug}, ${body.description || null}, ${body.duration_minutes}, ${body.price_pence || null}, ${body.deposit_pence || 1500}, ${body.active ?? true}, ${body.sort_order || 0})
  `
  return NextResponse.json({ success: true })
}

// PATCH update a service
export async function PATCH(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const sql = getDb()

  await sql`
    UPDATE services SET 
      name = ${body.name},
      description = ${body.description || null},
      duration_minutes = ${body.duration_minutes},
      price_pence = ${body.price_pence || null},
      deposit_pence = ${body.deposit_pence || 1500},
      active = ${body.active ?? true},
      sort_order = ${body.sort_order || 0}
    WHERE id = ${body.id}
  `
  return NextResponse.json({ success: true })
}
