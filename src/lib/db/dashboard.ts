import { createClientComponentClient } from '@/lib/supabase/client'
import { Database } from '../../../types/database.types'

export const dashboardDb = {
  // Get admin dashboard metrics
  async getAdminMetrics() {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('admin_dashboard_metrics')
      .select('*')
      .single()
    
    if (error) throw error
    return data
  },

  // Get ticket summary
  async getTicketSummary() {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('ticket_summary')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) throw error
    return data
  },

  // Get customer summary
  async getCustomerSummary() {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('customer_summary')
      .select('*')
      .order('last_activity', { ascending: false })
      .limit(10)
    
    if (error) throw error
    return data
  },

  // Get product sales summary
  async getProductSalesSummary() {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('product_sales_summary')
      .select('*')
      .order('total_revenue', { ascending: false })
      .limit(10)
    
    if (error) throw error
    return data
  },

  // Get order details
  async getOrderDetails() {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('order_details')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) throw error
    return data
  }
}