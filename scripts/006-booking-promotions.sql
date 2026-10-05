-- Preserve the agreed discounted total and code used for every website booking.
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS promotion_code TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS discount_amount_pence INT NOT NULL DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS final_price_pence INT;
