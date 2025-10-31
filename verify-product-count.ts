import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qivobmyugolhzrimfuht.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpdm9ibXl1Z29saHpyaW1mdWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0MDk4OTIsImV4cCI6MjA3Mzk4NTg5Mn0.YNWC1ntFaJ2BCDSbbI14XRrVVr_HML9SQcX4441YqP4'

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyProductCount() {
  console.log('🔍 Verifying Product Count in Supabase...\n')
  console.log('='.repeat(70))
  
  try {
    // Method 1: Count using count option
    console.log('\n📊 Method 1: Using count option...')
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('❌ Count error:', countError.message)
    } else {
      console.log(`✅ Total products (count): ${count}`)
    }
    
    // Method 2: Get all products and count length
    console.log('\n📊 Method 2: Fetching all products...')
    const { data: allProducts, error: fetchError } = await supabase
      .from('products')
      .select('id, name, brand, image')
      .order('created_at', { ascending: false })
    
    if (fetchError) {
      console.error('❌ Fetch error:', fetchError.message)
    } else {
      console.log(`✅ Total products (array length): ${allProducts?.length || 0}`)
      
      // Break down by brand
      if (allProducts) {
        const brandCounts: Record<string, number> = {}
        allProducts.forEach(p => {
          brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1
        })
        
        console.log('\n📈 Products by Brand:')
        console.log('-'.repeat(70))
        Object.entries(brandCounts)
          .sort(([, a], [, b]) => b - a)
          .forEach(([brand, count]) => {
            console.log(`  ${brand.padEnd(25)} : ${count} products`)
          })
        
        // Check products with/without images
        const withImages = allProducts.filter(p => p.image && p.image.trim() !== '').length
        const withoutImages = allProducts.length - withImages
        
        console.log('\n🖼️  Image Status:')
        console.log('-'.repeat(70))
        console.log(`  Products with images    : ${withImages}`)
        console.log(`  Products without images : ${withoutImages}`)
        
        // Show sample products
        console.log('\n📋 Sample Products (first 5):')
        console.log('-'.repeat(70))
        allProducts.slice(0, 5).forEach((p, i) => {
          console.log(`  ${i + 1}. ${p.name}`)
          console.log(`     Brand: ${p.brand}`)
          console.log(`     Image: ${p.image ? '✅ Yes' : '❌ No'}`)
          console.log()
        })
      }
    }
    
    // Method 3: Verify using the same query as your website
    console.log('\n📊 Method 3: Using website query (same as getProducts)...')
    const { data: websiteProducts, error: websiteError } = await supabase
      .from('products')
      .select('id,name,brand,model,price,cooling_capacity,heating_capacity,has_wifi,series,image,product_images,is_featured')
      .order('created_at', { ascending: false })
    
    if (websiteError) {
      console.error('❌ Website query error:', websiteError.message)
    } else {
      console.log(`✅ Products (website query): ${websiteProducts?.length || 0}`)
    }
    
    console.log('\n' + '='.repeat(70))
    console.log('📊 SUMMARY:')
    console.log('='.repeat(70))
    
    const finalCount = count || allProducts?.length || websiteProducts?.length || 0
    console.log(`\n✅ Total Products in Supabase: ${finalCount}`)
    
    if (finalCount === 85) {
      console.log('✅ Count matches! Your Supabase has exactly 85 products.')
    } else {
      console.log(`⚠️  Count mismatch! Expected 85, found ${finalCount}`)
    }
    
    console.log('\n💡 This is the count your website should display.')
    console.log('   If your website shows a different number, there may be')
    console.log('   a filtering issue or some products are being excluded.\n')
    
  } catch (error) {
    console.error('💥 Unexpected error:', error)
  }
}

console.log('╔══════════════════════════════════════════════════════════════╗')
console.log('║                                                              ║')
console.log('║         SUPABASE PRODUCT COUNT VERIFICATION                  ║')
console.log('║                                                              ║')
console.log('╚══════════════════════════════════════════════════════════════╝\n')

verifyProductCount()

