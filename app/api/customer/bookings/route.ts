import { createHash, randomInt } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import CustomerBookingAccessCodeEmail from '@/emails/customer-booking-access-code'
import { getDb } from '@/lib/db'
import { resend } from '@/lib/email'
import { enforceRateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const accessSchema = z.object({
  email: z.string().email().max(254),
  code: z.string().regex(/^\d{6}$/).optional(),
})

let schemaReady: Promise<void> | null = null

async function ensureAccessCodeSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getDb()

      await sql`
        CREATE TABLE IF NOT EXISTS customer_booking_access_codes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT NOT NULL,
          code_hash TEXT NOT NULL,
          expires_at TIMESTAMPTZ NOT NULL,
          used_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `

      await sql`
        CREATE INDEX IF NOT EXISTS idx_customer_booking_access_codes_lookup
        ON customer_booking_access_codes(email, code_hash, expires_at)
      `
    })()
  }

  await schemaReady
}

function hashCode(email: string, code: string) {
  const secret =
    process.env.CRON_SECRET ||
    process.env.ADMIN_PASSWORD ||
    process.env.STRIPE_WEBHOOK_SECRET ||
    'hauslash-booking-access'

  return createHash('sha256').update(`${email}:${code}:${secret}`).digest('hex')
}

async function sendAccessCode(email: string) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured')
  }

  await ensureAccessCodeSchema()

  const sql = getDb()
  const code = String(randomInt(100000, 1000000))
  const codeHash = hashCode(email, code)
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

  await sql`
    DELETE FROM customer_booking_access_codes
    WHERE created_at < now() - interval '24 hours'
  `

  await sql`
    INSERT INTO customer_booking_access_codes (email, code_hash, expires_at)
    VALUES (${email}, ${codeHash}, ${expiresAt}::timestamptz)
  `

  const response = await resend.emails.send({
    from: process.env.RESEND_FROM_ADDRESS || 'noreply@hauslash.co',
    to: email,
    replyTo: process.env.ADMIN_EMAIL || 'Hauslash@outlook.com',
    subject: 'Your Hauslash booking access code',
    react: CustomerBookingAccessCodeEmail({ code }),
  })

  if (response.error) {
    throw new Error(`Resend rejected booking access code: ${response.error.message}`)
  }
}

async function getVerifiedBookings(email: string, code: string) {
  await ensureAccessCodeSchema()

  const sql = getDb()
  const codeHash = hashCode(email, code)

  const accessRows = await sql`
    SELECT id
    FROM customer_booking_access_codes
    WHERE email = ${email}
    AND code_hash = ${codeHash}
    AND expires_at > now()
    AND used_at IS NULL
    ORDER BY created_at DESC
    LIMIT 1
  `

  if (accessRows.length === 0) {
    return null
  }

  await sql`
    UPDATE customer_booking_access_codes
    SET used_at = now()
    WHERE id = ${accessRows[0].id}
  `

  return sql`
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
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = accessSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const email = parsed.data.email.toLowerCase()

    if (!parsed.data.code) {
      const limited = await enforceRateLimit(request, {
        bucket: 'customer-booking-code-request',
        limit: 5,
        windowMs: 60 * 60 * 1000,
      })

      if (limited) return limited

      await sendAccessCode(email)

      return NextResponse.json(
        {
          success: true,
          verificationRequired: true,
          message: 'We sent a secure access code to that email address.',
        },
        { headers: { 'Cache-Control': 'no-store' } }
      )
    }

    const limited = await enforceRateLimit(request, {
      bucket: 'customer-booking-code-verify',
      limit: 10,
      windowMs: 15 * 60 * 1000,
    })

    if (limited) return limited

    const bookings = await getVerifiedBookings(email, parsed.data.code)

    if (!bookings) {
      return NextResponse.json(
        { error: 'Invalid or expired code. Please request a new one.' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      )
    }

    return NextResponse.json(
      { success: true, bookings },
      { headers: { 'Cache-Control': 'private, no-store' } }
    )
  } catch (error) {
    console.error('Error in customer booking access:', error)
    return NextResponse.json(
      { error: 'Failed to access bookings' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
