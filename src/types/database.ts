// This defines the structure of your products table in Supabase
export interface Product {
  id: string
  name: string
  brand: string
  description: string
  model: string
  price: string
  price_numeric: number
  cooling_capacity: string
  heating_capacity: string
  has_wifi: boolean
  series: string
  image: string
  promotions?: string
  created_at?: string
  updated_at?: string
}

// This defines the structure of your Supabase database
export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product
        Insert: Omit<Product, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}





