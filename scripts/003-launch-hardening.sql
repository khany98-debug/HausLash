-- Hauslash launch hardening migration
-- Run once against the production Neon database before launch.

-- Bring older availability_slots tables in line with the app API.
ALTER TABLE availability_slots ADD COLUMN IF NOT EXISTS date DATE;
ALTER TABLE availability_slots ADD COLUMN IF NOT EXISTS start_time TIME;
ALTER TABLE availability_slots ADD COLUMN IF NOT EXISTS end_time TIME;
ALTER TABLE availability_slots ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE availability_slots ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'availability_slots' AND column_name = 'start_at'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'availability_slots' AND column_name = 'end_at'
  ) THEN
    EXECUTE '
      UPDATE availability_slots
      SET
        date = COALESCE(date, start_at::date),
        start_time = COALESCE(start_time, start_at::time),
        end_time = COALESCE(end_time, end_at::time)
      WHERE start_at IS NOT NULL AND end_at IS NOT NULL
    ';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_availability_slots_date ON availability_slots(date);
CREATE INDEX IF NOT EXISTS idx_availability_slots_date_start ON availability_slots(date, start_time);

-- Remove exact duplicate availability slots before enforcing uniqueness.
-- Keeps the oldest row for each date/start/end combination.
DELETE FROM availability_slots a
USING (
  SELECT
    ctid,
    ROW_NUMBER() OVER (
      PARTITION BY date, start_time, end_time
      ORDER BY created_at NULLS LAST, ctid
    ) AS row_num
  FROM availability_slots
  WHERE date IS NOT NULL
    AND start_time IS NOT NULL
    AND end_time IS NOT NULL
) duplicates
WHERE a.ctid = duplicates.ctid
  AND duplicates.row_num > 1;

CREATE UNIQUE INDEX IF NOT EXISTS uniq_availability_slots_date_time
  ON availability_slots(date, start_time, end_time)
  WHERE date IS NOT NULL AND start_time IS NOT NULL AND end_time IS NOT NULL;

-- Email audit logs for confirmation, reschedule, cancellation, and reminder delivery.
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  email_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_logs_booking_id ON email_logs(booking_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_type_status ON email_logs(email_type, status);

-- Appointment reminders.
CREATE TABLE IF NOT EXISTS appointment_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('24h', '1h')),
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(booking_id, reminder_type)
);

CREATE INDEX IF NOT EXISTS idx_appointment_reminders_due
  ON appointment_reminders(scheduled_for)
  WHERE sent_at IS NULL;

-- Customer portal one-time access codes.
CREATE TABLE IF NOT EXISTS customer_booking_access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customer_booking_access_codes_lookup
  ON customer_booking_access_codes(email, code_hash, expires_at);

-- Database-backed rate limiting.
CREATE TABLE IF NOT EXISTS rate_limit_events (
  id BIGSERIAL PRIMARY KEY,
  bucket TEXT NOT NULL,
  identifier_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_events_lookup
  ON rate_limit_events(bucket, identifier_hash, created_at);

-- Launch service corrections.
UPDATE services
SET
  price_pence = 500,
  deposit_pence = 500,
  duration_minutes = 15,
  description = 'A patch test and consultation for first-time Hauslash clients. Results are known after 24 hours, so please book this at least 24 hours before your lash lift appointment. The £5 attendance deposit is refunded once you attend.'
WHERE slug = 'patch-test';

UPDATE services
SET duration_minutes = 90
WHERE slug IN ('korean-lash-lift-studio', 'korean-lash-lift-mobile');
