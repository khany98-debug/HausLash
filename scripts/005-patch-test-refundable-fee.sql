-- Patch test refundable attendance deposit
-- Run once against production after the launch hardening migration.

UPDATE services
SET
  price_pence = 500,
  deposit_pence = 500,
  duration_minutes = 15,
  description = 'A patch test and consultation for first-time Hauslash clients. Results are known after 24 hours, so please book this at least 24 hours before your lash lift appointment. The £5 attendance deposit is refunded once you attend.'
WHERE slug = 'patch-test';
