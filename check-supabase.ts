import { createClient } from '@supabase/supabase-js'

// Your Supabase credentials
const supabaseUrl = 'https://qivobmyugolhzrimfuht.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpdm9ibXl1Z29saHpyaW1mdWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0MDk4OTIsImV4cCI6MjA3Mzk4NTg5Mn0.YNWC1ntFaJ2BCDSbbI14XRrVVr_HML9SQcX4441YqP4'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSupabase() {
  console.log('🔍 Checking Supabase Connection...\n')
  
  // Test 1: Check if table exists
  console.log('📋 Test 1: Checking if products table exists...')
  const { data: tableData, error: tableError } = await supabase
    .from('products')
    .select('id')
    .limit(1)
  
  if (tableError) {
    console.error('❌ Table check failed:', tableError.message)
    console.error('   Details:', tableError.details)
    console.error('   Hint:', tableError.hint)
    return
  }
  console.log('✅ Products table exists')
  
  // Test 2: Check column structure
  console.log('\n📋 Test 2: Checking table columns...')
  const { data: products, error: columnsError } = await supabase
    .from('products')
    .select('*')
    .limit(1)
  
  if (columnsError) {
    console.error('❌ Column check failed:', columnsError.message)
    return
  }
  
  if (products && products.length > 0) {
    console.log('✅ Sample product columns:', Object.keys(products[0]))
  }
  
  // Test 3: Check for created_at column
  console.log('\n📋 Test 3: Checking created_at column...')
  const { data: dateData, error: dateError } = await supabase
    .from('products')
    .select('created_at')
    .limit(1)
  
  if (dateError) {
    console.error('❌ created_at column missing or has wrong type')
    console.error('   Error:', dateError.message)
    console.error('\n   📝 Fix: Run this SQL in Supabase SQL Editor:')
    console.error('   ALTER TABLE products ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();')
    return
  }
  console.log('✅ created_at column exists')
  
  // Test 4: Try ordering by created_at
  console.log('\n📋 Test 4: Testing ORDER BY created_at...')
  const { data: orderedData, error: orderError } = await supabase
    .from('products')
    .select('id, name, created_at')
    .order('created_at', { ascending: false })
    .limit(5)
  
  if (orderError) {
    console.error('❌ ORDER BY failed:', orderError.message)
    console.error('   This is likely causing the 500 errors!')
    console.error('\n   📝 Fix: Run this SQL in Supabase SQL Editor:')
    console.error('   UPDATE products SET created_at = now() WHERE created_at IS NULL;')
    return
  }
  console.log('✅ ORDER BY works correctly')
  console.log('   Sample results:', orderedData?.map(p => ({ name: p.name, created_at: p.created_at })))
  
  // Test 5: Count products
  console.log('\n📋 Test 5: Counting products...')
  const { count, error: countError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
  
  if (countError) {
    console.error('❌ Count failed:', countError.message)
    return
  }
  console.log(`✅ Total products: ${count}`)
  
  // Test 6: Check RLS policies
  console.log('\n📋 Test 6: Checking Row Level Security...')
  const { data: rlsData, error: rlsError } = await supabase
    .from('products')
    .select('*')
    .limit(1)
  
  if (rlsError && rlsError.message.includes('permission')) {
    console.error('❌ RLS policy issue detected')
    console.error('   Error:', rlsError.message)
    console.error('\n   📝 Fix: Run this SQL in Supabase SQL Editor:')
    console.error('   CREATE POLICY IF NOT EXISTS "Allow public read access"')
    console.error('     ON products FOR SELECT TO anon USING (true);')
    return
  }
  console.log('✅ RLS policies are correctly configured')
  
  // Test 7: Check for products with missing images
  console.log('\n📋 Test 7: Checking image availability...')
  const { data: allProducts } = await supabase
    .from('products')
    .select('id, name, image')
    .limit(100)
  
  if (allProducts) {
    const withImages = allProducts.filter(p => p.image && p.image.trim() !== '').length
    const withoutImages = allProducts.length - withImages
    
    console.log(`✅ Products with images: ${withImages}`)
    console.log(`⚠️  Products without images: ${withoutImages}`)
    
    if (withoutImages > 0) {
      console.log('\n   💡 Tip: Upload images to Supabase Storage and update the image column')
    }
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('🎉 Diagnostic Complete!')
  console.log('='.repeat(60))
}

// Run the diagnostic
checkSupabase().catch(error => {
  console.error('💥 Diagnostic failed:', error)
})

