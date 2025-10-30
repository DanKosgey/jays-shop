import { getSupabaseBrowserClient } from '@/server/supabase/client'
import { Database } from '../../../types/database.types'

export type SecondHandProduct = Database['public']['Tables']['second_hand_products']['Row']
export type SecondHandProductInsert = Database['public']['Tables']['second_hand_products']['Insert']
export type SecondHandProductUpdate = Database['public']['Tables']['second_hand_products']['Update']

export const secondHandProductsDb = {
  // Get all available second-hand products
  async getAll() {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('second_hand_products')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get second-hand product by ID
  async getById(id: string) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('second_hand_products')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single()
    
    if (error) throw error
    return data
  },

  // Get second-hand products by condition
  async getByCondition(condition: 'Like New' | 'Good' | 'Fair') {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('second_hand_products')
      .select('*')
      .eq('condition', condition)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Search second-hand products by product name or description
  async search(searchTerm: string) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('second_hand_products')
      .select('*')
      .or(`seller_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get second-hand products by seller
  async getBySeller(sellerId: string) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('second_hand_products')
      .select('*')
      .eq('seller_id', sellerId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Create new second-hand product listing
  async create(product: SecondHandProductInsert) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('second_hand_products')
      .insert(product)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update second-hand product listing
  async update(id: string, updates: SecondHandProductUpdate) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('second_hand_products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete second-hand product listing (soft delete)
  async delete(id: string) {
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase
      .from('second_hand_products')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    
    if (error) throw error
  }
}