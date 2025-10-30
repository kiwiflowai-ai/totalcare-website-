# Supabase Setup Guide - Connect Your Products Database

This guide will help you connect your Supabase products database to your website.

## Step 1: Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click on the **Settings** icon (gear) in the sidebar
4. Go to **API** section
5. You'll see two important values:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (a long string starting with `eyJ...`)

## Step 2: Configure Environment Variables

1. Open the `.env.local` file in the root of your project
2. Replace the placeholder values with your actual Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

## Step 3: Verify Your Database Schema

Your Supabase database should have a `products` table with the following columns:

| Column Name        | Type        | Description                           |
|-------------------|-------------|---------------------------------------|
| `id`              | text (PK)   | Unique product identifier             |
| `name`            | text        | Product name                          |
| `brand`           | text        | Brand name (e.g., Daikin, Samsung)    |
| `description`     | text        | Product description                   |
| `model`           | text        | Model number                          |
| `price`           | text        | Price (e.g., "$1553+GST")            |
| `price_numeric`   | numeric     | Numeric price for sorting             |
| `cooling_capacity`| text        | Cooling capacity (e.g., "2.5kW")     |
| `heating_capacity`| text        | Heating capacity (e.g., "3.0kW")     |
| `has_wifi`        | boolean     | WiFi capability                       |
| `series`          | text        | Product series (e.g., "Standard")     |
| `image`           | text        | Main image URL or path                |
| `product_images`  | text[]      | Array of additional images            |
| `promotions`      | text        | Promotional information (optional)    |
| `warranty`        | text        | Warranty information (optional)       |
| `is_featured`     | boolean     | Featured product flag (optional)      |
| `created_at`      | timestamptz | Created timestamp                     |
| `updated_at`      | timestamptz | Updated timestamp                     |

### SQL to Create the Table

If you need to create the table, run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE products (
  id text PRIMARY KEY,
  name text NOT NULL,
  brand text NOT NULL,
  description text,
  model text,
  price text,
  price_numeric numeric,
  cooling_capacity text,
  heating_capacity text,
  has_wifi boolean DEFAULT false,
  series text,
  image text,
  product_images text[],
  promotions text,
  warranty text,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security (recommended)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access
CREATE POLICY "Allow public read access"
  ON products
  FOR SELECT
  TO anon
  USING (true);

-- Create an index on brand for faster filtering
CREATE INDEX idx_products_brand ON products(brand);

-- Create an index on is_featured for faster featured product queries
CREATE INDEX idx_products_featured ON products(is_featured);
```

## Step 4: Import Your Existing Products (Optional)

If you need to import products from your existing data, you can use the migration script:

```bash
npm run dev
```

Then check the migration files in the project root.

## Step 5: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to the products page
3. Open the browser console (F12) and look for these log messages:
   - `🔍 Supabase Configuration Debug:`
   - `🔧 Supabase Configured: true`
   - `Loading data from Supabase...`
   - `Successfully converted X products`

4. If you see "Supabase Configured: false", double-check your `.env.local` file

## Troubleshooting

### Issue: "Supabase not configured, using fallback products"
- **Solution**: Make sure your `.env.local` file has the correct credentials
- Restart your development server after adding/changing environment variables

### Issue: "Error fetching products" in console
- **Solution**: Check that your Supabase project is active and the table exists
- Verify your Row Level Security policies allow public read access

### Issue: Products not showing up
- **Solution**: Check that you have data in your `products` table
- Run this query in Supabase SQL Editor: `SELECT * FROM products LIMIT 10;`

### Issue: Images not loading
- **Solution**: 
  - If using Supabase Storage, make sure your images are uploaded and public
  - Update the `image` and `product_images` columns with the correct URLs
  - Supabase Storage URLs look like: `https://xxxxx.supabase.co/storage/v1/object/public/bucket-name/file-path`

## Environment Variables for Production (Vercel)

When deploying to Vercel or other platforms:

1. Go to your project settings
2. Find the "Environment Variables" section
3. Add these variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Redeploy your application

## Security Notes

- The `.env.local` file is already in `.gitignore` and will not be committed to Git
- The anon key is safe to expose in your frontend (it's designed for public access)
- Row Level Security (RLS) protects your data from unauthorized modifications
- Only SELECT (read) operations are allowed with the anon key by default

## Need Help?

If you encounter issues:
1. Check the browser console for error messages
2. Check the Supabase logs in your dashboard
3. Verify your table schema matches the expected format
4. Ensure RLS policies are configured correctly

Your products will automatically load from Supabase once the connection is established!

