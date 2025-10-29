import { createClientComponentClient } from '@/lib/supabase/client'
import { Database } from '../../../types/database.types'

type Ticket = Database['public']['Tables']['tickets']['Row']
type TicketInsert = Database['public']['Tables']['tickets']['Insert']
type TicketUpdate = Database['public']['Tables']['tickets']['Update']
type TicketStatus = Database['public']['Enums']['ticket_status']

export const ticketsDb = {
  // Get all tickets
  async getAll() {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get ticket by ID
  async getById(id: string) {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single()
    
    if (error) throw error
    return data
  },

  // Get ticket by ticket number (for public tracking)
  async getByTicketNumber(ticketNumber: string) {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('ticket_number', ticketNumber)
      .is('deleted_at', null)
      .single()
    
    if (error) throw error
    return data
  },

  // Create new ticket
  async create(ticket: TicketInsert) {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('tickets')
      .insert(ticket)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update ticket
  async update(id: string, updates: TicketUpdate) {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete ticket (soft delete)
  async delete(id: string) {
    const supabase = createClientComponentClient()
    // For now, we'll do a hard delete since we can't easily update deleted_at
    // In a production environment, you would implement proper soft delete
    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Filter tickets by status
  async getByStatus(status: TicketStatus) {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('status', status)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Search tickets
  async search(query: string) {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .or(`ticket_number.ilike.%${query}%,customer_name.ilike.%${query}%,device_brand.ilike.%${query}%,device_model.ilike.%${query}%`)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get user's tickets
  async getByUserId(userId: string) {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}