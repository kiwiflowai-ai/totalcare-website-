# Quick Setup: Connect to Supabase

## 🚀 Quick Start (3 Easy Steps)

### Step 1: Create Environment File

Create a new file called `.env.local` in the root of your project with these exact values:

```env
VITE_SUPABASE_URL=https://qivobmyugolhzrimfuht.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpdm9ibXl1Z29saHpyaW1mdWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0MDk4OTIsImV4cCI6MjA3Mzk4NTg5Mn0.YNWC1ntFaJ2BCDSbbI14XRrVVr_HML9SQcX4441YqP4
```

### Step 2: Restart Your Development Server

```bash
# Stop the server (Ctrl+C)
# Then start it again:
npm run dev
```

### Step 3: Test the Connection

1. Open your website in the browser (usually http://localhost:5173)
2. Navigate to the Products page
3. Open the browser console (press F12)
4. Look for these messages:
   - ✅ `🔧 Supabase Configured: true`
   - ✅ `Loading data from Supabase...`
   - ✅ `Successfully converted X products`

If you see these messages, congratulations! Your products are now loading from Supabase! 🎉

## 📊 Check Your Products in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project (qivobmyugolhzrimfuht)
3. Click on "Table Editor" in the sidebar
4. Select the `products` table
5. You should see all your products listed there

## 🔧 Troubleshooting

### "Supabase not configured" message?
- Make sure `.env.local` file is in the root directory (same level as `package.json`)
- Restart your development server after creating the file
- Check that there are no extra spaces or quotes in the `.env.local` file

### No products showing up?
- Go to Supabase Dashboard → Table Editor → products
- Check if the products table has data
- If empty, you may need to run the migration script (see below)

### Need to import products to Supabase?

If your Supabase products table is empty, run the migration:

```bash
# Install ts-node if you haven't
npm install -D ts-node

# Run the migration script
npx ts-node migrate-to-supabase.ts
```

This will upload all products from your local data file to Supabase.

## ✅ What's Already Done

Your application is already configured to:
- ✅ Fetch products from Supabase
- ✅ Fall back to local data if Supabase is unavailable
- ✅ Display products with images, descriptions, and pricing
- ✅ Filter by brand, series, and price range
- ✅ Show featured products
- ✅ Support product search

All you need to do is add the environment variables and restart! 🚀

## 🌐 For Production (Vercel/Netlify)

When deploying to production, add these environment variables in your hosting platform:

**Variable Name:** `VITE_SUPABASE_URL`
**Value:** `https://qivobmyugolhzrimfuht.supabase.co`

**Variable Name:** `VITE_SUPABASE_ANON_KEY`
**Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpdm9ibXl1Z29saHpyaW1mdWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0MDk4OTIsImV4cCI6MjA3Mzk4NTg5Mn0.YNWC1ntFaJ2BCDSbbI14XRrVVr_HML9SQcX4441YqP4`

Then redeploy your application.

