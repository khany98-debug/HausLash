import { createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

import { getDb } from '@/lib/db'

type RateLimitOptions = {
  bucket: string
  limit: number
  windowMs: number
  message?: string
}

let schemaReady: Promise<void> | null = null

function getClientIdentifier(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown-ip'
  const userAgent = request.headers.get('user-agent') || 'unknown-agent'

  return `${ip}:${userAgent.slice(0, 120)}`
}

function hashIdentifier(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

async function ensureRateLimitSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getDb()

      await sql`
        CREATE TABLE IF NOT EXISTS rate_limit_events (
          id BIGSERIAL PRIMARY KEY,
          bucket TEXT NOT NULL,
          identifier_hash TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `

      await sql`
        CREATE INDEX IF NOT EXISTS idx_rate_limit_events_lookup
        ON rate_limit_events(bucket, identifier_hash, created_at)
      `
    })()
  }

  await schemaReady
}

export async function enforceRateLimit(
  request: NextRequest,
  options: RateLimitOptions
) {
  await ensureRateLimitSchema()

  const sql = getDb()
  const now = Date.now()
  const windowStart = new Date(now - options.windowMs).toISOString()
  const identifierHash = hashIdentifier(
    `${options.bucket}:${getClientIdentifier(request)}`
  )

  await sql`
    DELETE FROM rate_limit_events
    WHERE created_at < ${new Date(now - 24 * 60 * 60 * 1000).toISOString()}::timestamptz
  `

  const rows = await sql`
    SELECT count(*)::int AS count
    FROM rate_limit_events
    WHERE bucket = ${options.bucket}
    AND identifier_hash = ${identifierHash}
    AND created_at >= ${windowStart}::timestamptz
  `

  const count = Number(rows[0]?.count || 0)

  if (count >= options.limit) {
    const retryAfter = Math.max(1, Math.ceil(options.windowMs / 1000))

    return NextResponse.json(
      {
        error:
          options.message ||
          'Too many attempts. Please wait a little while and try again.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'Cache-Control': 'no-store',
        },
      }
    )
  }

  await sql`
    INSERT INTO rate_limit_events (bucket, identifier_hash)
    VALUES (${options.bucket}, ${identifierHash})
  `

  return null
}
