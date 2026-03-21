-- Update existing services with new descriptions and names

UPDATE services 
SET 
  name = 'Korean Lash Lift - In-Studio',
  slug = 'korean-lash-lift-studio',
  description = 'Experience our signature Korean lash lift technique in our serene studio setting. This advanced treatment creates beautifully curled, lifted lashes that appear longer and fuller for 8-10 weeks. Includes professional tinting and our signature aftercare treatment. Perfect for those seeking a dramatic yet natural transformation without daily maintenance.',
  duration_minutes = 75,
  price_pence = 3500,
  deposit_pence = 1500
WHERE slug = 'classic-lash-lift' OR name LIKE '%Lash Lift%' AND duration_minutes = 60;

UPDATE services 
SET 
  name = 'Korean Lash Lift - Mobile Outcall',
  slug = 'korean-lash-lift-mobile',
  description = 'Luxury brings itself to you. Our mobile Korean lash lift service offers the same premium treatment in the comfort of your own home. Includes full setup of professional equipment, consultation, and aftercare guidance. Ideal for busy professionals or those preferring a personalised at-home experience. Travel available throughout Stoke-on-Trent and surrounding areas.',
  duration_minutes = 90,
  price_pence = 5000,
  deposit_pence = 1500
WHERE slug = 'korean-lash-lift' AND duration_minutes = 75;

-- Optional: Delete any other services if you want only these two
DELETE FROM services WHERE slug IN ('lash-lift-brow-lamination', 'brow-lamination', 'lash-tint');
