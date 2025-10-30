import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = 'https://qivobmyugolhzrimfuht.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpdm9ibXl1Z29saHpyaW1mdWh0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODQwOTg5MiwiZXhwIjoyMDczOTg1ODkyfQ.k6Uvg2EulWI8IOvInqmCi5gxgxHDKYthFg5e4iBFlqs'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Brand to folder mapping
const brandFolders: Record<string, string> = {
  'Daikin': 'Daikin',
  'Samsung': 'Samsung',
  'Mitsubishi': 'Mitsubishi Electric',
  'Panasonic': 'Panasonic',
  'MHI': 'MHI CIARA',
  'Midea': 'Midea',
  'Haire': 'haire',
  'LG': 'LG',
  'Tesla': 'EV charger',
  'Wallbox': 'EV charger'
}

// Function to find image for a product
function findProductImage(productName: string, brand: string): string | null {
  const assetsPath = path.join(process.cwd(), 'src', 'assets')
  const brandFolder = brandFolders[brand]
  
  if (!brandFolder) return null
  
  const brandPath = path.join(assetsPath, brandFolder)
  
  if (!fs.existsSync(brandPath)) return null
  
  // Get all image files recursively
  const findImages = (dir: string): string[] => {
    const files: string[] = []
    const items = fs.readdirSync(dir)
    
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        files.push(...findImages(fullPath))
      } else if (/\.(jpg|jpeg|png|webp|gif)$/i.test(item)) {
        // Convert absolute path to relative path from src/assets
        const relativePath = fullPath.replace(assetsPath + path.sep, '')
        files.push(`/src/assets/${relativePath}`)
      }
    }
    return files
  }
  
  const images = findImages(brandPath)
  
  // Try to find a matching image based on product name or model
  const nameWords = productName.toLowerCase().split(/[\s\/]+/)
  
  for (const imagePath of images) {
    const imageNameLower = imagePath.toLowerCase()
    
    // Check if image filename contains key words from product name
    const matches = nameWords.filter(word => 
      word.length > 2 && imageNameLower.includes(word)
    )
    
    if (matches.length >= 2) {
      return imagePath
    }
  }
  
  // If no specific match, return first image for that brand
  return images[0] || null
}

async function updateProductImages() {
  console.log('🖼️  Starting Product Image Update...\n')
  
  try {
    // Get all products from Supabase
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, brand, image')
      .order('brand')
    
    if (error) {
      console.error('❌ Error fetching products:', error.message)
      return
    }
    
    if (!products || products.length === 0) {
      console.log('⚠️  No products found in database')
      return
    }
    
    console.log(`📊 Found ${products.length} products\n`)
    
    let updatedCount = 0
    let skippedCount = 0
    let notFoundCount = 0
    
    for (const product of products) {
      // Skip if already has an image
      if (product.image && product.image.trim() !== '') {
        console.log(`⏭️  Skipped: ${product.name} (already has image)`)
        skippedCount++
        continue
      }
      
      // Find matching image
      const imagePath = findProductImage(product.name, product.brand)
      
      if (imagePath) {
        // Update product with image
        const { error: updateError } = await supabase
          .from('products')
          .update({ image: imagePath })
          .eq('id', product.id)
        
        if (updateError) {
          console.error(`❌ Error updating ${product.name}:`, updateError.message)
        } else {
          console.log(`✅ Updated: ${product.name} → ${imagePath}`)
          updatedCount++
        }
      } else {
        console.log(`⚠️  No image found for: ${product.name} (${product.brand})`)
        notFoundCount++
      }
      
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log('\n' + '='.repeat(70))
    console.log('📈 Update Summary:')
    console.log('='.repeat(70))
    console.log(`✅ Updated: ${updatedCount} products`)
    console.log(`⏭️  Skipped: ${skippedCount} products (already had images)`)
    console.log(`⚠️  Not found: ${notFoundCount} products (no matching image)`)
    console.log('\n🎉 Image update complete!\n')
    
  } catch (error) {
    console.error('💥 Unexpected error:', error)
  }
}

// Run the update
updateProductImages()

