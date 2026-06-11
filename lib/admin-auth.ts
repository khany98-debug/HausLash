import 'server-only'
import { timingSafeEqual } from 'crypto'
import { NextRequest } from 'next/server'

function matchesSecret(candidate: string | null, secret: string | undefined) {
  if (!candidate || !secret) return false

  const candidateBuffer = Buffer.from(candidate)
  const secretBuffer = Buffer.from(secret)

  return (
    candidateBuffer.length === secretBuffer.length &&
    timingSafeEqual(candidateBuffer, secretBuffer)
  )
}

function bearerToken(request: NextRequest) {
  const authorization = request.headers.get('authorization')
  return authorization?.startsWith('Bearer ') ? authorization.slice(7) : null
}

export function isAdminRequest(request: NextRequest) {
  return matchesSecret(bearerToken(request), process.env.ADMIN_PASSWORD)
}

export function isCronOrAdminRequest(request: NextRequest) {
  const token = bearerToken(request)
  return (
    matchesSecret(token, process.env.CRON_SECRET) ||
    matchesSecret(token, process.env.ADMIN_PASSWORD)
  )
}
