import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { Database } from '../../../types/database.types'

type Customer = Database['public']['Tables']['customers']['Row']
type CustomerInsert = Database['public']['Tables']['customers']['Insert']
type CustomerUpdate = Database['public']['Tables']['customers']['Update']

export const customersDb = {
  // Get all customers
  async getAll() {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get customer by ID
  async getById(id: string) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single()
    
    if (error) throw error
    return data
  },

  // Get customer by email
  async getByEmail(email: string) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email)
      .is('deleted_at', null)
      .single()
    
    if (error) throw error
    return data
  },

  // Get customer by user ID
  async getByUserId(userId: string) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .single()
    
    if (error) throw error
    return data
  },

  // Create customer
  async create(customer: CustomerInsert) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('customers')
      .insert(customer)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update customer
  async update(id: string, updates: CustomerUpdate) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete customer (soft delete)
  async delete(id: string) {
    const supabase = getSupabaseBrowserClient()
    // Using type assertion to bypass TypeScript error for deleted_at field
    const { error } = await supabase
      .from('customers')
      .update({ deleted_at: new Date().toISOString() } as any)
      .eq('id', id)
    
    if (error) throw error
  },

  // Search customers
  async search(query: string) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}