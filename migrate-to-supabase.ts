import { createClient } from '@supabase/supabase-js'
import { products } from './src/data/products.js'

// Your Supabase credentials
const supabaseUrl = 'https://qivobmyugolhzrimfuht.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpdm9ibXl1Z29saHpyaW1mdWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0MDk4OTIsImV4cCI6MjA3Mzk4NTg5Mn0.YNWC1ntFaJ2BCDSbbI14XRrVVr_HML9SQcX4441YqP4'

const supabase = createClient(supabaseUrl, supabaseKey)

// Function to parse price and extract numeric value
function parsePrice(priceStr: string): number {
  const match = priceStr.match(/\$(\d+)/)
  return match ? parseInt(match[1]) : 0
}

// Function to convert your existing products to Supabase format
function convertProductsForSupabase() {
  return products.map(product => ({
    id: product.id,
    name: product.name,
    brand: product.brand,
    description: product.description,
    model: product.model,
    price: product.price,
    price_numeric: parsePrice(product.price),
    cooling_capacity: product.coolingCapacity,
    heating_capacity: product.heatingCapacity,
    has_wifi: product.hasWifi,
    series: product.series,
    image: product.image,
    promotions: product.promotions || null
  }))
}

// Main migration function
async function migrateProducts() {
  try {
    console.log('🚀 Starting product migration to Supabase...')
    
    const convertedProducts = convertProductsForSupabase()
    console.log(`📦 Converting ${convertedProducts.length} products...`)
    
    // Insert products in batches of 10 to avoid overwhelming Supabase
    const batchSize = 10
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < convertedProducts.length; i += batchSize) {
      const batch = convertedProducts.slice(i, i + batchSize)
      
      console.log(`📤 Uploading batch ${Math.floor(i / batchSize) + 1}...`)
      
      const { data, error } = await supabase
        .from('products')
        .insert(batch)
        .select()
      
      if (error) {
        console.error(`❌ Error uploading batch ${Math.floor(i / batchSize) + 1}:`, error)
        errorCount += batch.length
      } else {
        console.log(`✅ Successfully uploaded batch ${Math.floor(i / batchSize) + 1}`)
        successCount += data?.length || 0
      }
      
      // Wait a bit between batches to be nice to Supabase
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    console.log('\n🎉 Migration completed!')
    console.log(`✅ Successfully uploaded: ${successCount} products`)
    console.log(`❌ Failed to upload: ${errorCount} products`)
    
  } catch (error) {
    console.error('💥 Migration failed:', error)
  }
}

// Run the migration
migrateProducts()
