-- Seed services
INSERT INTO services (name, slug, description, duration_minutes, price_pence, deposit_pence, sort_order, active)
VALUES
  ('Korean Lash Lift - In-Studio', 'korean-lash-lift-studio', 'Experience our signature Korean lash lift technique in our serene studio setting. This advanced treatment creates beautifully curled, lifted lashes that appear longer and fuller for 8-10 weeks. Includes professional tinting and our signature aftercare treatment. Perfect for those seeking a dramatic yet natural transformation without daily maintenance.', 75, 3500, 1500, 1, true),
  ('Korean Lash Lift - Mobile Outcall', 'korean-lash-lift-mobile', 'Luxury brings itself to you. Our mobile Korean lash lift service offers the same premium treatment in the comfort of your own home. Includes full setup of professional equipment, consultation, and aftercare guidance. Ideal for busy professionals or those preferring a personalised at-home experience. Travel available throughout Stoke-on-Trent and surrounding areas.', 90, 5000, 1500, 2, true);

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
