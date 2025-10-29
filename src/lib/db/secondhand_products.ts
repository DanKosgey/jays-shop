import { createClientComponentClient } from '@/lib/supabase/client'
import { Database } from '../../../types/database.types'

// Since the second_hand_products table is not in the generated types, we'll define the types here
type SecondHandProduct = {
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
  // We'll also include product information for display
  products?: {
    name: string
    image_url: string
  } | null
}

type SecondHandProductInsert = {
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

type SecondHandProductUpdate = Partial<SecondHandProductInsert>

export const secondHandProductsDb = {
  // Get all available second-hand products with product details
  async getAll() {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('second_hand_products')
      .select(`
        *,
        products(name, image_url)
      `)
      .eq('is_available', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as SecondHandProduct[]
  },

  // Get second-hand product by ID with product details
  async getById(id: string) {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('second_hand_products')
      .select(`
        *,
        products(name, image_url)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as SecondHandProduct
  },

  // Get second-hand products by condition
  async getByCondition(condition: 'Like New' | 'Good' | 'Fair') {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('second_hand_products')
      .select(`
        *,
        products(name, image_url)
      `)
      .eq('condition', condition)
      .eq('is_available', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as SecondHandProduct[]
  },

  // Search second-hand products by product name or description
  async search(searchTerm: string) {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('second_hand_products')
      .select(`
        *,
        products(name, image_url)
      `)
      .eq('is_available', true)
      .or(`products.name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as SecondHandProduct[]
  },

  // Get second-hand products by seller
  async getBySeller(sellerId: string) {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('second_hand_products')
      .select(`
        *,
        products(name, image_url)
      `)
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as SecondHandProduct[]
  },

  // Create new second-hand product listing
  async create(product: SecondHandProductInsert) {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('second_hand_products')
      .insert(product)
      .select(`
        *,
        products(name, image_url)
      `)
      .single()
    
    if (error) throw error
    return data as SecondHandProduct
  },

  // Update second-hand product listing
  async update(id: string, updates: SecondHandProductUpdate) {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('second_hand_products')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        products(name, image_url)
      `)
      .single()
    
    if (error) throw error
    return data as SecondHandProduct
  },

  // Delete second-hand product listing (soft delete by marking as unavailable)
  async delete(id: string) {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('second_hand_products')
      .update({ is_available: false })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}