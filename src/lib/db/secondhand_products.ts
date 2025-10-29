import { createClientComponentClient } from '@/lib/supabase/client'

// Define types based on the second_hand_products table schema
export type SecondHandProduct = {
  id: string
  product_id: string
  seller_id: string
  condition: 'Like New' | 'Good' | 'Fair'
  seller_name: string
  seller_phone: string | null
  seller_email: string | null
  price: number | null
  description: string | null
  is_available: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type SecondHandProductInsert = {
  product_id: string
  seller_id: string
  condition: 'Like New' | 'Good' | 'Fair'
  seller_name: string
  seller_phone?: string | null
  seller_email?: string | null
  price?: number | null
  description?: string | null
  is_available?: boolean
}

export type SecondHandProductUpdate = Partial<SecondHandProductInsert>

export const secondHandProductsDb = {
  // Get all available second-hand products
  async getAll() {
    const supabase = createClientComponentClient()
    // Using type assertion to bypass TypeScript error for second_hand_products table
    const { data, error } = await (supabase as any)
      .from('second_hand_products')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as SecondHandProduct[]
  },

  // Get second-hand product by ID
  async getById(id: string) {
    const supabase = createClientComponentClient()
    // Using type assertion to bypass TypeScript error for second_hand_products table
    const { data, error } = await (supabase as any)
      .from('second_hand_products')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single()
    
    if (error) throw error
    return data as SecondHandProduct
  },

  // Get second-hand products by condition
  async getByCondition(condition: 'Like New' | 'Good' | 'Fair') {
    const supabase = createClientComponentClient()
    // Using type assertion to bypass TypeScript error for second_hand_products table
    const { data, error } = await (supabase as any)
      .from('second_hand_products')
      .select('*')
      .eq('condition', condition)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as SecondHandProduct[]
  },

  // Search second-hand products by product name or description
  async search(searchTerm: string) {
    const supabase = createClientComponentClient()
    // Using type assertion to bypass TypeScript error for second_hand_products table
    const { data, error } = await (supabase as any)
      .from('second_hand_products')
      .select('*')
      .or(`seller_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as SecondHandProduct[]
  },

  // Get second-hand products by seller
  async getBySeller(sellerId: string) {
    const supabase = createClientComponentClient()
    // Using type assertion to bypass TypeScript error for second_hand_products table
    const { data, error } = await (supabase as any)
      .from('second_hand_products')
      .select('*')
      .eq('seller_id', sellerId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as SecondHandProduct[]
  },

  // Create new second-hand product listing
  async create(product: SecondHandProductInsert) {
    const supabase = createClientComponentClient()
    // Using type assertion to bypass TypeScript error for second_hand_products table
    const { data, error } = await (supabase as any)
      .from('second_hand_products')
      .insert(product)
      .select()
      .single()
    
    if (error) throw error
    return data as SecondHandProduct
  },

  // Update second-hand product listing
  async update(id: string, updates: SecondHandProductUpdate) {
    const supabase = createClientComponentClient()
    // Using type assertion to bypass TypeScript error for second_hand_products table
    const { data, error } = await (supabase as any)
      .from('second_hand_products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as SecondHandProduct
  },

  // Delete second-hand product listing (soft delete)
  async delete(id: string) {
    const supabase = createClientComponentClient()
    // Using type assertion to bypass TypeScript error for second_hand_products table
    const { error } = await (supabase as any)
      .from('second_hand_products')
      .update({ deleted_at: new Date().toISOString() } as any)
      .eq('id', id)
    
    if (error) throw error
  }
}