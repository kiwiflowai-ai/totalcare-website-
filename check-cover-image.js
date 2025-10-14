import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.log('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCoverImage() {
  try {
    console.log('🔍 Checking cover image for product: daikin-alira-25-32kw-heat-pump-ftxm25wvma');
    
    const { data, error } = await supabase
      .from('products')
      .select('id, name, image, product_images')
      .eq('id', 'daikin-alira-25-32kw-heat-pump-ftxm25wvma')
      .single();

    if (error) {
      console.error('❌ Error fetching product:', error);
      return;
    }

    if (!data) {
      console.log('❌ Product not found');
      return;
    }

    console.log('✅ Product found:');
    console.log('📝 Name:', data.name);
    console.log('🆔 ID:', data.id);
    console.log('📸 Cover Image (image column):');
    console.log('   - Has image:', !!data.image);
    console.log('   - Image length:', data.image?.length || 0);
    console.log('   - Image starts with:', data.image?.substring(0, 50) + '...');
    console.log('   - Image type:', data.image?.startsWith('data:image/') ? '✅ Valid base64' : '❌ Invalid format');
    
    console.log('\n🖼️ Product Images (product_images column):');
    console.log('   - Has product_images:', !!data.product_images);
    console.log('   - Type:', typeof data.product_images);
    
    if (data.product_images) {
      if (typeof data.product_images === 'string') {
        try {
          const parsed = JSON.parse(data.product_images);
          console.log('   - Parsed length:', parsed.length);
          console.log('   - First image starts with:', parsed[0]?.substring(0, 50) + '...');
        } catch (e) {
          console.log('   - ❌ Failed to parse JSON:', e.message);
        }
      } else if (Array.isArray(data.product_images)) {
        console.log('   - Array length:', data.product_images.length);
        console.log('   - First image starts with:', data.product_images[0]?.substring(0, 50) + '...');
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkCoverImage();
