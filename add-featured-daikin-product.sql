-- SQL script to add the featured Daikin promotional product
-- Run this in your Supabase SQL Editor

INSERT INTO products (
  id,
  name,
  brand,
  model,
  description,
  price,
  price_numeric,
  cooling_capacity,
  heating_capacity,
  has_wifi,
  series,
  image,
  is_featured,
  warranty
) VALUES (
  'daikin-featured-promo',
  'Lowest Price on Heat pump, Aircon Supply & Installation in Auckland Area Wide',
  'Daikin',
  'All Models',
  'Totalcare Electrical & HVAC LTD has served the Auckland region with top-notch electrical and heat pump installation services—our team of professional, highly skilled electricians and service technicians. Our warehouse has a wide range of brands stocks and offers VERY VERY competitive prices. We supply and install a wide range of heat pump brand models with a minimum of 5 years warranty. Free Electrical Certificate (CoC) Scan the What''s App QR Code in the Photo above or call us at 0277 500 999 for more details and a free quote.',
  '$0.00 + GST',
  0,
  '',
  '',
  false,
  '',
  '',  -- Add your cover image base64 or URL here
  true,  -- This makes it a featured product
  'Minimum 5 years warranty'
)
ON CONFLICT (id) 
DO UPDATE SET
  is_featured = true,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  warranty = EXCLUDED.warranty;

-- Optional: If you want to update an existing product to be featured instead of creating a new one,
-- use this query instead (replace 'YOUR_PRODUCT_ID' with the actual product ID):

-- UPDATE products
-- SET is_featured = true
-- WHERE id = 'YOUR_PRODUCT_ID';

-- To remove featured status from a product:
-- UPDATE products
-- SET is_featured = false
-- WHERE id = 'YOUR_PRODUCT_ID';


