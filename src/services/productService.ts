import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Product } from '@/types/database'
import { products as fallbackProducts } from '@/data/products'

// Function to get all products from Supabase
export async function getAllProducts(): Promise<Product[]> {
  try {
    // If Supabase is not configured, use fallback data
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using fallback products')
      return fallbackProducts
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      return fallbackProducts
    }

    return data || fallbackProducts
  } catch (error) {
    console.error('Error fetching products:', error)
    return fallbackProducts
  }
}

// Function to get products by brand
export async function getProductsByBrand(brand: string): Promise<Product[]> {
  try {
    // If Supabase is not configured, use fallback data
    if (!isSupabaseConfigured()) {
      return fallbackProducts.filter(p => p.brand.toLowerCase() === brand.toLowerCase())
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('brand', brand)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products by brand:', error)
      return fallbackProducts.filter(p => p.brand.toLowerCase() === brand.toLowerCase())
    }

    return data || fallbackProducts.filter(p => p.brand.toLowerCase() === brand.toLowerCase())
  } catch (error) {
    console.error('Error fetching products by brand:', error)
    return fallbackProducts.filter(p => p.brand.toLowerCase() === brand.toLowerCase())
  }
}

// Function to search products
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    // If Supabase is not configured, use fallback data
    if (!isSupabaseConfigured()) {
      const lowerQuery = query.toLowerCase()
      return fallbackProducts.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.brand.toLowerCase().includes(lowerQuery) ||
        p.model.toLowerCase().includes(lowerQuery)
      )
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%, brand.ilike.%${query}%, model.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching products:', error)
      const lowerQuery = query.toLowerCase()
      return fallbackProducts.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.brand.toLowerCase().includes(lowerQuery) ||
        p.model.toLowerCase().includes(lowerQuery)
      )
    }

    return data || []
  } catch (error) {
    console.error('Error searching products:', error)
    const lowerQuery = query.toLowerCase()
    return fallbackProducts.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery) ||
      p.model.toLowerCase().includes(lowerQuery)
    )
  }
}

// Function to add a new product
export async function addProduct(product: Omit<Product, 'created_at' | 'updated_at'>): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single()

    if (error) {
      console.error('Error adding product:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error adding product:', error)
    return null
  }
}

// Function to update a product
export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating product:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error updating product:', error)
    return null
  }
}

// Function to delete a product
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting product:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting product:', error)
    return false
  }
}





