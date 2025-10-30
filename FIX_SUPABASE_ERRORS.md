# Fix Supabase 500 Errors

## Problem Identified

Your browser console shows:
```
Failed to load resource: the server responded with a status of 500
Error fetching products: Object
```

This is a **Supabase server error**, typically caused by:
1. Missing database columns
2. Incorrect data types
3. Row Level Security (RLS) policy issues
4. Corrupt data in the database

## Solution

### Step 1: Check Your Supabase Table Schema

Go to your Supabase Dashboard:
https://supabase.com/dashboard/project/qivobmyugolhzrimfuht/editor

Click on the `products` table and verify these columns exist:

**Required Columns:**
- `id` (text, primary key)
- `name` (text)
- `brand` (text)
- `model` (text)
- `price` (text)
- `description` (text)
- `cooling_capacity` (text) ← **Note: underscore, not camelCase**
- `heating_capacity` (text) ← **Note: underscore, not camelCase**
- `has_wifi` (boolean)
- `series` (text)
- `image` (text, nullable)
- `product_images` (text[], nullable)
- `promotions` (text, nullable)
- `warranty` (text, nullable)
- `is_featured` (boolean, nullable)
- `created_at` (timestamptz) ← **This is likely causing the 500 error**
- `updated_at` (timestamptz, nullable)

### Step 2: Fix Missing Columns

If any columns are missing, run this SQL in Supabase SQL Editor:

```sql
-- Add missing columns if they don't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
ALTER TABLE products ADD COLUMN IF NOT EXISTS cooling_capacity text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS heating_capacity text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS has_wifi boolean DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_images text[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS warranty text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS promotions text;

-- Update existing rows to have created_at if NULL
UPDATE products SET created_at = now() WHERE created_at IS NULL;
UPDATE products SET has_wifi = false WHERE has_wifi IS NULL;
UPDATE products SET is_featured = false WHERE is_featured IS NULL;
```

### Step 3: Check Row Level Security (RLS)

Run this SQL to check and fix RLS policies:

```sql
-- Check current policies
SELECT * FROM pg_policies WHERE tablename = 'products';

-- If no read policy exists, create one
CREATE POLICY IF NOT EXISTS "Allow public read access"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Enable RLS if not already enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
```

### Step 4: Verify Data Integrity

Check for corrupt or problematic data:

```sql
-- Check for rows with NULL id (should be primary key)
SELECT COUNT(*) FROM products WHERE id IS NULL;

-- Check for rows with NULL created_at
SELECT COUNT(*) FROM products WHERE created_at IS NULL;

-- Check for invalid data types
SELECT id, name, 
       pg_typeof(created_at) as created_at_type
FROM products 
LIMIT 5;
```

### Step 5: Test the Fix

After running the SQL commands:

1. Go back to your website
2. Refresh the page (Ctrl+F5 or Cmd+Shift+R)
3. Open browser console (F12)
4. Check for:
   - ✅ No more 500 errors
   - ✅ Products loading successfully
   - ✅ "Successfully converted X products" message

## Quick Fix Script

If you want to recreate the table from scratch, use this SQL:

```sql
-- DANGER: This will delete all existing data!
-- Only run if you're okay losing current data

DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE products (
  id text PRIMARY KEY,
  name text NOT NULL,
  brand text NOT NULL,
  model text DEFAULT '',
  price text DEFAULT '',
  description text DEFAULT '',
  cooling_capacity text DEFAULT '',
  heating_capacity text DEFAULT '',
  has_wifi boolean DEFAULT false,
  series text DEFAULT '',
  image text,
  product_images text[],
  promotions text,
  warranty text,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_series ON products(series);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
```

After recreating the table, run the migration to import products:

```bash
npx ts-node migrate-to-supabase.ts
```

## Common Issues and Solutions

### Issue: "column 'created_at' does not exist"
**Solution:** Add the column with:
```sql
ALTER TABLE products ADD COLUMN created_at timestamptz DEFAULT now() NOT NULL;
```

### Issue: "permission denied for table products"
**Solution:** Check RLS policies:
```sql
-- Allow read access
CREATE POLICY "Allow public read access"
  ON products FOR SELECT TO anon USING (true);
```

### Issue: Products load but images are missing
**Solution:** Images need to be uploaded to Supabase Storage or use external URLs
1. Go to Supabase Dashboard → Storage
2. Create a bucket called `product-images`
3. Make it public
4. Upload your images
5. Update the `image` column with URLs like:
   `https://qivobmyugolhzrimfuht.supabase.co/storage/v1/object/public/product-images/your-image.jpg`

## After Fixing

Your console should show:
```
✅ Supabase Configured: true
✅ Fetching products from Supabase...
✅ Successfully converted 85 products
✅ No 500 errors
```

---

**Need More Help?**
Check the Supabase logs:
https://supabase.com/dashboard/project/qivobmyugolhzrimfuht/logs/explorer

Filter by "error" to see detailed error messages.

