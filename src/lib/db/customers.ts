import { createClientComponentClient } from '@/lib/supabase/client'
import { Database } from '../../../types/database.types'

type Customer = Database['public']['Tables']['customers']['Row']
type CustomerInsert = Database['public']['Tables']['customers']['Insert']
type CustomerUpdate = Database['public']['Tables']['customers']['Update']

export const customersDb = {
  // Get all customers
  async getAll() {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get customer by ID
  async getById(id: string) {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Get customer by email
  async getByEmail(email: string) {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) throw error
    return data
  },

  // Get customer by user ID
  async getByUserId(userId: string) {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  // Create customer
  async create(customer: CustomerInsert) {
    const supabase = createClientComponentClient()
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
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete customer
  async delete(id: string) {
    const supabase = createClientComponentClient()
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Search customers
  async search(query: string) {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}