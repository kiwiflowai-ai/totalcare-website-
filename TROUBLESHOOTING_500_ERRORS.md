# 🔧 Troubleshooting Supabase 500 Errors

## Current Status

✅ **Supabase Connection:** Working  
✅ **Products Loading:** 85+ products successfully loaded  
❌ **500 Server Errors:** Happening on some requests  
⚠️ **Missing Images:** Most products don't have images  

## Root Cause

The **500 Internal Server Error** from Supabase is likely caused by one of these issues:

### 1. Missing `created_at` Column
Your database query uses `.order('created_at', { ascending: false })` but the column might be missing or have NULL values.

### 2. Wrong Column Names
Your Supabase table might have `camelCase` columns instead of `snake_case`:
- ❌ `coolingCapacity` → ✅ `cooling_capacity`
- ❌ `heatingCapacity` → ✅ `heating_capacity`  
- ❌ `hasWifi` → ✅ `has_wifi`

### 3. RLS Policy Issues
Row Level Security might be blocking reads.

## 🚀 Quick Fix (Recommended)

### Step 1: Open Supabase SQL Editor

Go to: https://supabase.com/dashboard/project/qivobmyugolhzrimfuht/sql/new

### Step 2: Run This SQL Script

Copy and paste this entire script, then click **Run**:

```sql
-- =====================================================
-- FIX SUPABASE 500 ERRORS - RUN THIS SCRIPT
-- =====================================================

-- Check if created_at column exists and add if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE products ADD COLUMN created_at timestamptz DEFAULT now() NOT NULL;
        RAISE NOTICE '✅ Added created_at column';
    ELSE
        RAISE NOTICE '✅ created_at column already exists';
    END IF;
END $$;

-- Update any NULL created_at values
UPDATE products 
SET created_at = now() 
WHERE created_at IS NULL;

-- Add other missing columns if needed
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
ALTER TABLE products ADD COLUMN IF NOT EXISTS cooling_capacity text DEFAULT '';
ALTER TABLE products ADD COLUMN IF NOT EXISTS heating_capacity text DEFAULT '';
ALTER TABLE products ADD COLUMN IF NOT EXISTS has_wifi boolean DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_images text[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS warranty text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS promotions text;

-- Ensure RLS is enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and recreate
DROP POLICY IF EXISTS "Allow public read access" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;

-- Create read policy for anonymous users
CREATE POLICY "Allow public read access"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_series ON products(series);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured) WHERE is_featured = true;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '🎉 Fix complete! Refresh your website to test.';
END $$;
```

### Step 3: Verify the Fix

After running the script:

1. **Check for success messages** in the SQL Editor output
2. **Go back to your website** and refresh (Ctrl+F5 or Cmd+Shift+R)
3. **Open browser console** (F12)
4. **Look for:**
   - ✅ No more 500 errors
   - ✅ "Successfully converted X products"
   - ✅ Products loading correctly

## 🔍 Diagnostic Script

If you want to check your database health, run:

```bash
npx ts-node check-supabase.ts
```

This will:
- ✅ Check table structure
- ✅ Verify columns exist
- ✅ Test ordering functionality
- ✅ Check RLS policies
- ✅ Count products and images

## 🖼️ Fixing Missing Images

The ❌ "No image available" errors happen because products don't have images yet.

### Option 1: Upload to Supabase Storage (Recommended)

1. **Go to Storage:**
   https://supabase.com/dashboard/project/qivobmyugolhzrimfuht/storage/buckets

2. **Create a bucket:**
   - Name: `product-images`
   - Make it **Public**

3. **Upload your product images:**
   - Upload images from `src/assets/` folders
   - Organize by brand (e.g., `Daikin/`, `Samsung/`)

4. **Update products table:**
   ```sql
   UPDATE products 
   SET image = 'https://qivobmyugolhzrimfuht.supabase.co/storage/v1/object/public/product-images/Daikin/alira-25.jpg'
   WHERE id = 'daikin-alira-25-32kw-heat-pump';
   ```

### Option 2: Use External URLs

Update products with external image URLs:

```sql
UPDATE products 
SET image = 'https://example.com/images/product.jpg'
WHERE id = 'product-id';
```

### Option 3: Import with Images

If you're starting fresh, run the migration script which includes base64 images:

```bash
npx ts-node migrate-to-supabase.ts
```

## 📊 Expected Console Output (After Fix)

```
🔧 Supabase Configured: true
Fetching products from Supabase...
Supabase response: { data: Array(85), error: null }
Successfully converted 85 products
EV Charger products in converted data: 2
  - Tesla Tesla Gen 3 Wall Connector installed
  - Wallbox Wallbox Pulsar Plus 7.4 kW
Loaded data: { products: 85, brands: 12, series: 8, priceRanges: 4 }
Final filtered products: 85
✅ Image loaded successfully for [product name]
```

## 🐛 Still Having Issues?

### Check Supabase Logs

1. Go to: https://supabase.com/dashboard/project/qivobmyugolhzrimfuht/logs/explorer
2. Filter by: `error`
3. Look for detailed error messages

### Check Database Schema

Run this SQL to see your current schema:

```sql
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;
```

### Check for Corrupt Data

```sql
-- Find products with NULL ids
SELECT COUNT(*) as null_ids FROM products WHERE id IS NULL;

-- Find products with NULL created_at
SELECT COUNT(*) as null_dates FROM products WHERE created_at IS NULL;

-- Find products with empty names
SELECT COUNT(*) as empty_names FROM products WHERE name = '' OR name IS NULL;
```

## 💡 Prevention Tips

1. **Always use snake_case** for database column names
2. **Always set default values** for columns
3. **Always have NOT NULL** on required fields
4. **Always test queries** in SQL Editor first
5. **Always check RLS policies** for public tables

## 📞 Next Steps

1. ✅ Run the SQL fix script above
2. ✅ Refresh your website
3. ✅ Check console for improvements
4. ✅ Upload product images to Supabase Storage
5. ✅ Update image URLs in products table

---

**Status:** Once you run the SQL script, the 500 errors should disappear! 🎉

