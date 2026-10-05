import 'server-only'

import { getDb } from '@/lib/db'

let schemaReady: Promise<void> | null = null

/**
 * Keeps existing production databases compatible when this release is first
 * used. The matching SQL migration is included for managed deployments too.
 */
export function ensureBookingPromotionSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getDb()
      await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS promotion_code TEXT`
      await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS discount_amount_pence INT NOT NULL DEFAULT 0`
      await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS final_price_pence INT`
    })().catch((error) => {
      schemaReady = null
      throw error
    })
  }

  return schemaReady
}
