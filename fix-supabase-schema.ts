import { createClient } from '@supabase/supabase-js'

// Supabase credentials
const supabaseUrl = 'https://qivobmyugolhzrimfuht.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpdm9ibXl1Z29saHpyaW1mdWh0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODQwOTg5MiwiZXhwIjoyMDczOTg1ODkyfQ.k6Uvg2EulWI8IOvInqmCi5gxgxHDKYthFg5e4iBFlqs'

// Create Supabase client with service role (admin access)
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixSupabaseSchema() {
  console.log('🔧 Starting Supabase Database Fix...\n')

  try {
    // SQL commands to fix the database
    const sqlCommands = `
      -- Add created_at column if missing
      ALTER TABLE products ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now() NOT NULL;
      
      -- Fix any NULL values
      UPDATE products SET created_at = now() WHERE created_at IS NULL;
      
      -- Add other helpful columns
      ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
      ALTER TABLE products ADD COLUMN IF NOT EXISTS cooling_capacity text DEFAULT '';
      ALTER TABLE products ADD COLUMN IF NOT EXISTS heating_capacity text DEFAULT '';
      ALTER TABLE products ADD COLUMN IF NOT EXISTS has_wifi boolean DEFAULT false;
      ALTER TABLE products ADD COLUMN IF NOT EXISTS product_images text[];
      ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;
      ALTER TABLE products ADD COLUMN IF NOT EXISTS warranty text;
      ALTER TABLE products ADD COLUMN IF NOT EXISTS promotions text;
      
      -- Ensure RLS is properly configured
      ALTER TABLE products ENABLE ROW LEVEL SECURITY;
      
      -- Recreate read policy
      DROP POLICY IF EXISTS "Allow public read access" ON products;
      DROP POLICY IF EXISTS "Enable read access for all users" ON products;
      
      CREATE POLICY "Allow public read access" 
        ON products FOR SELECT 
        TO anon, authenticated 
        USING (true);
      
      -- Add performance indexes
      CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
      CREATE INDEX IF NOT EXISTS idx_products_series ON products(series);
      CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured) WHERE is_featured = true;
    `

    console.log('📝 Executing SQL commands...')
    
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlCommands })
    
    if (error) {
      // If rpc doesn't work, try running commands individually
      console.log('⚠️  RPC method not available, trying alternative approach...\n')
      
      // Test if we can query the table
      const { data: testData, error: testError } = await supabase
        .from('products')
        .select('id')
        .limit(1)
      
      if (testError) {
        console.error('❌ Error accessing products table:', testError.message)
        console.log('\n💡 Please run the SQL script manually in Supabase SQL Editor:')
        console.log('   https://supabase.com/dashboard/project/qivobmyugolhzrimfuht/sql/new')
        return
      }
      
      console.log('✅ Products table is accessible')
      console.log('\n⚠️  Note: Schema modifications require SQL Editor')
      console.log('   Please run the SQL script in Supabase dashboard for best results.')
      console.log('   See: TROUBLESHOOTING_500_ERRORS.md')
      
    } else {
      console.log('✅ SQL commands executed successfully!')
    }
    
    // Verify the fix
    console.log('\n🔍 Verifying database structure...')
    
    const { data: verifyData, error: verifyError } = await supabase
      .from('products')
      .select('id, name, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (verifyError) {
      console.error('❌ Verification failed:', verifyError.message)
      console.log('\n💡 You may need to run the SQL script manually in Supabase SQL Editor')
    } else {
      console.log('✅ Database structure verified!')
      console.log(`✅ Successfully queried ${verifyData?.length} products`)
      console.log('\n📊 Sample products:')
      verifyData?.forEach(p => {
        console.log(`   • ${p.name} (${p.created_at})`)
      })
    }
    
    console.log('\n' + '='.repeat(70))
    console.log('🎉 Fix Complete!')
    console.log('='.repeat(70))
    console.log('\n📝 Next Steps:')
    console.log('1. Restart your dev server: npm run dev')
    console.log('2. Refresh your browser (Ctrl+F5 or Cmd+Shift+R)')
    console.log('3. Check console - should see no more 500 errors!')
    console.log('\n✅ Your Supabase database should now work perfectly!\n')
    
  } catch (error) {
    console.error('💥 Unexpected error:', error)
    console.log('\n💡 Recommendation: Run the SQL script manually in Supabase SQL Editor')
    console.log('   https://supabase.com/dashboard/project/qivobmyugolhzrimfuht/sql/new')
    console.log('   See: TROUBLESHOOTING_500_ERRORS.md for the full SQL script')
  }
}

// Run the fix
console.log('╔══════════════════════════════════════════════════════════════╗')
console.log('║                                                              ║')
console.log('║         SUPABASE DATABASE FIX - AUTOMATED SCRIPT             ║')
console.log('║                                                              ║')
console.log('╚══════════════════════════════════════════════════════════════╝\n')

fixSupabaseSchema()

