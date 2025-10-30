# Quick Setup: Featured Daikin Promotional Product

## ✅ What's Been Implemented

Your promotional Daikin product will now:
- ⭐ Always appear **FIRST** in the product list
- Display a golden **"⭐ FEATURED"** badge
- Show at the top regardless of sorting (by name, price, etc.)
- Work with all filters (brand, category, search, etc.)

## 🚀 Setup Steps

### Step 1: Add the Column to Supabase (One-time)

1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Run this command:

```sql
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
```

### Step 2: Add/Update Your Promotional Product

**Option A: Create New Promotional Product**

1. Open **SQL Editor** in Supabase
2. Copy the contents from `add-featured-daikin-product.sql`
3. Update the `image` field with your cover image
4. Run the SQL

**Option B: Make Existing Product Featured**

If you already have this product in your database:

```sql
-- First, find your product ID
SELECT id, name FROM products 
WHERE name LIKE '%Lowest Price%' 
   OR name LIKE '%Auckland Area Wide%';

-- Then update it to be featured
UPDATE products
SET is_featured = true
WHERE id = 'YOUR_PRODUCT_ID';  -- Replace with actual ID
```

### Step 3: Verify

1. Refresh your website
2. Go to the Products page
3. The promotional product should appear first with a gold "⭐ FEATURED" badge

## 📸 Upload Images

Your promotional product should have:

**Cover Image**: Main product display image
- Upload via Supabase dashboard or use base64
- Add to the `image` column

**Product Images**: Gallery images (optional)
- Upload via the image management interface
- Stored in `product_images` column

## 🎯 Features

### On Product List Page
- Featured badge in top-left corner
- Always appears first
- Works with all filters and searches

### On Product Detail Page
- Featured badge next to brand badges
- Shows all product information
- Contact details and quote button

### Filtering Behavior
- ✅ Works with Category filter (Heat Pumps)
- ✅ Works with Brand filter (Daikin)
- ✅ Works with Search
- ✅ Works with Price range
- ✅ Works with Series filter

### Sorting Behavior
Featured products ALWAYS appear first, then:
- Sort by Name (A-Z)
- Sort by Price (Low to High)
- Sort by Price (High to Low)

## 💡 Managing Featured Products

### Make Another Product Featured
```sql
UPDATE products
SET is_featured = true
WHERE id = 'ANOTHER_PRODUCT_ID';
```

### Remove Featured Status
```sql
UPDATE products
SET is_featured = false
WHERE id = 'PRODUCT_ID';
```

### See All Featured Products
```sql
SELECT id, name, brand, is_featured 
FROM products 
WHERE is_featured = true;
```

## 📝 Product Details Template

For your promotional product, use these details:

**Name**: Lowest Price on Heat pump, Aircon Supply & Installation in Auckland Area Wide

**Brand**: Daikin

**Model**: All Models

**Price**: $0.00 + GST (or leave as 0 for "Contact for Quote")

**Description**: 
```
Totalcare Electrical & HVAC LTD has served the Auckland region with top-notch electrical and heat pump installation services—our team of professional, highly skilled electricians and service technicians. Our warehouse has a wide range of brands stocks and offers VERY VERY competitive prices. We supply and install a wide range of heat pump brand models with a minimum of 5 years warranty. Free Electrical Certificate (CoC) Scan the What's App QR Code in the Photo above or call us at 0277 500 999 for more details and a free quote.
```

**Warranty**: Minimum 5 years warranty

**Series**: Leave empty or set to "Promotional"

**Cooling/Heating Capacity**: Leave empty (shows as "All Models")

**WiFi**: false

**is_featured**: **true** ← This is the important one!

## ❓ Need Help?

See `FEATURED_PRODUCTS_GUIDE.md` for detailed documentation including:
- Troubleshooting
- Best practices
- Advanced usage
- Technical details

## 🎉 You're All Set!

Once you run the SQL commands in Supabase, your featured promotional product will automatically appear first on your products page with the golden featured badge!


