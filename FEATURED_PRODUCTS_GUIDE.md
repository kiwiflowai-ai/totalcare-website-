# Featured Products Guide

## Overview
The featured products system allows you to pin important promotional products to the top of your product list. Featured products will always appear first, regardless of sorting options (by name, price, etc.).

## How It Works

### 1. Visual Indicators
Featured products display with:
- ⭐ **FEATURED** badge in amber/orange gradient on product cards
- Same badge on product detail pages
- Always appear at the top of search/filter results

### 2. Database Setup

#### Add the `is_featured` Column (if not exists)
Run this in your Supabase SQL Editor:

```sql
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
```

#### Make a Product Featured
To make any existing product featured:

```sql
UPDATE products
SET is_featured = true
WHERE id = 'YOUR_PRODUCT_ID';
```

To find a product ID:
```sql
SELECT id, name, brand FROM products 
WHERE name LIKE '%your search%';
```

#### Add the Promotional Daikin Product
Use the provided SQL script `add-featured-daikin-product.sql`:

1. Open Supabase Dashboard → SQL Editor
2. Copy the contents of `add-featured-daikin-product.sql`
3. Add your cover image (base64 or URL) to the `image` field
4. Add product images to the `product_images` column if needed
5. Click "Run"

### 3. Managing Featured Products

#### To Unfeature a Product
```sql
UPDATE products
SET is_featured = false
WHERE id = 'YOUR_PRODUCT_ID';
```

#### List All Featured Products
```sql
SELECT id, name, brand, is_featured 
FROM products 
WHERE is_featured = true
ORDER BY created_at DESC;
```

### 4. Frontend Behavior

#### Sorting Priority
1. **Featured products** always appear first
2. Then regular products are sorted by:
   - Name (A-Z) - default
   - Price: Low to High
   - Price: High to Low

#### Filtering
Featured products respect all filters:
- Category (Heat Pumps / EV Chargers)
- Brand filter
- Series filter
- Price range filter
- Search terms

If a featured product doesn't match the current filters, it won't appear.

### 5. Best Practices

1. **Limit Featured Products**: Use sparingly (1-3 products max) to maintain impact
2. **Update Regularly**: Rotate featured products to highlight different promotions
3. **Clear Description**: Ensure featured products have compelling descriptions
4. **Quality Images**: Use high-quality cover and product images
5. **Competitive Pricing**: Feature your best deals or unique offerings

### 6. Example Use Cases

- Seasonal promotions (summer cooling specials)
- Bundle deals (heat pump + installation package)
- New product launches
- Clearance items
- Popular best-sellers
- Exclusive Auckland area offers

## Troubleshooting

### Featured Product Not Appearing First
1. Check `is_featured` is set to `true` in database
2. Verify product matches current filters
3. Clear browser cache and refresh
4. Check console for any errors

### Featured Badge Not Showing
1. Confirm `is_featured` field exists in database
2. Verify product data is being fetched correctly
3. Check browser console for React errors

## Technical Details

### Database Schema
```typescript
interface Product {
  id: string
  name: string
  brand: string
  // ... other fields
  is_featured?: boolean  // Optional boolean flag
}
```

### Files Modified
- `src/types/database.ts` - Added `is_featured` field
- `src/data/products.ts` - Maps `is_featured` from Supabase
- `src/pages/Products.tsx` - Priority sorting logic
- `src/components/ProductCardNew.tsx` - Featured badge display
- `src/pages/ProductDetail.tsx` - Featured badge on detail page


