import { getSupabaseBrowserClient } from '@/server/supabase/client'
import { Database } from '../../../types/database.types'

type Ticket = Database['public']['Tables']['tickets']['Row']
type TicketInsert = Database['public']['Tables']['tickets']['Insert']
type TicketUpdate = Database['public']['Tables']['tickets']['Update']
type TicketStatus = Database['public']['Enums']['ticket_status']

export const ticketsDb = {
  // Get all tickets
  async getAll() {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
      
      if (error) throw new Error(`Failed to fetch tickets: ${error.message}`)
      return data
    } catch (error) {
      console.error('Error in ticketsDb.getAll:', error)
      throw error
    }
  },

  // Get ticket by ID
  async getById(id: string) {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .single()
      
      if (error) throw new Error(`Failed to fetch ticket: ${error.message}`)
      return data
    } catch (error) {
      console.error('Error in ticketsDb.getById:', error)
      throw error
    }
  },

  // Get ticket by ticket number (for public tracking)
  async getByTicketNumber(ticketNumber: string) {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('ticket_number', ticketNumber)
        .is('deleted_at', null)
        .single()
      
      if (error) throw new Error(`Failed to fetch ticket: ${error.message}`)
      return data
    } catch (error) {
      console.error('Error in ticketsDb.getByTicketNumber:', error)
      throw error
    }
  },

  // Create new ticket
  async create(ticket: TicketInsert) {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase
        .from('tickets')
        .insert(ticket)
        .select()
        .single()
      
      if (error) throw new Error(`Failed to create ticket: ${error.message}`)
      return data
    } catch (error) {
      console.error('Error in ticketsDb.create:', error)
      throw error
    }
  },

  // Update ticket
  async update(id: string, updates: TicketUpdate) {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase
        .from('tickets')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw new Error(`Failed to update ticket: ${error.message}`)
      return data
    } catch (error) {
      console.error('Error in ticketsDb.update:', error)
      throw error
    }
  },

  // Delete ticket (soft delete)
  async delete(id: string) {
    try {
      const supabase = getSupabaseBrowserClient()
      // Using type assertion to bypass TypeScript error for deleted_at field
      const { error } = await supabase
        .from('tickets')
        .update({ deleted_at: new Date().toISOString() } as any)
        .eq('id', id)
      
      if (error) throw new Error(`Failed to delete ticket: ${error.message}`)
    } catch (error) {
      console.error('Error in ticketsDb.delete:', error)
      throw error
    }
  },

  // Filter tickets by status
  async getByStatus(status: TicketStatus) {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('status', status)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
      
      if (error) throw new Error(`Failed to fetch tickets by status: ${error.message}`)
      return data
    } catch (error) {
      console.error('Error in ticketsDb.getByStatus:', error)
      throw error
    }
  },

  // Search tickets
  async search(query: string) {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .or(`ticket_number.ilike.%${query}%,customer_name.ilike.%${query}%,device_brand.ilike.%${query}%,device_model.ilike.%${query}%`)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
      
      if (error) throw new Error(`Failed to search tickets: ${error.message}`)
      return data
    } catch (error) {
      console.error('Error in ticketsDb.search:', error)
      throw error
    }
  },

  // Get user's tickets
  async getByUserId(userId: string) {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
      
      if (error) throw new Error(`Failed to fetch user tickets: ${error.message}`)
      return data
    } catch (error) {
      console.error('Error in ticketsDb.getByUserId:', error)
      throw error
    }
  }
}