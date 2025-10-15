import { createClient } from '@supabase/supabase-js'

// These will be your Supabase project credentials
// You'll get these from your Supabase dashboard
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Create a mock client if credentials are not provided
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if we're using placeholder credentials
export const isSupabaseConfigured = () => {
  return import.meta.env.VITE_SUPABASE_URL && 
         import.meta.env.VITE_SUPABASE_ANON_KEY &&
         !import.meta.env.VITE_SUPABASE_URL.includes('placeholder') &&
         !import.meta.env.VITE_SUPABASE_ANON_KEY.includes('placeholder')
}


