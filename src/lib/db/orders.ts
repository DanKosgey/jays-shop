import { createClientComponentClient } from '@/lib/supabase/client'
import { Database } from '../../../types/database.types'

type Order = Database['public']['Tables']['orders']['Row']
type OrderInsert = Database['public']['Tables']['orders']['Insert']
type OrderUpdate = Database['public']['Tables']['orders']['Update']
type OrderStatus = Database['public']['Enums']['order_status']

export const ordersDb = {
  // Get all orders with items
  async getAll() {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*, products(name))
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get order by ID
  async getById(id: string) {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*, products(name))
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Get orders by status
  async getByStatus(status: OrderStatus) {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*, products(name))
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get user's orders
  async getByUserId(userId: string) {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*, products(name))
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Create order
  async create(order: OrderInsert) {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update order
  async update(id: string, updates: OrderUpdate) {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete order
  async delete(id: string) {
    const supabase = createClientComponentClient()
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}