-- Seed services
INSERT INTO services (name, slug, description, duration_minutes, price_pence, deposit_pence, sort_order, active)
VALUES
  ('Korean Lash Lift - In-Studio', 'korean-lash-lift-studio', 'Experience the signature Hauslash Korean lash lift in a calm studio setting. Includes consultation, premium product use, tinting, aftercare guidance, and a refined lifted finish designed for natural lashes and low-maintenance mornings.', 90, 3500, 1500, 1, true),
  ('Korean Lash Lift - Mobile Outcall', 'korean-lash-lift-mobile', 'The Hauslash Korean lash lift brought to you. Includes professional setup, consultation, premium product use, tinting, and aftercare guidance in the comfort of your own home. After booking, please message Hauslash on Instagram with your location and treatment address. Travel available throughout Stoke-on-Trent and surrounding areas.', 90, 5000, 1500, 2, true),
  ('Patch Test', 'patch-test', 'A free patch test and consultation for first-time Hauslash clients. Results are known after 24 hours, so please book or enquire about this at least 24 hours before your lash lift appointment.', 15, 0, 0, 3, true);

-- Seed availability rules (Mon=1 through Sat=6, Sun=0)
-- Mon-Fri 9am-5pm, Sat 10am-3pm
INSERT INTO availability_rules (weekday, start_time, end_time, buffer_minutes)
VALUES
  (1, '09:00', '17:00', 15),
  (2, '09:00', '17:00', 15),
  (3, '09:00', '17:00', 15),
  (4, '09:00', '17:00', 15),
  (5, '09:00', '17:00', 15),
  (6, '10:00', '15:00', 15);
