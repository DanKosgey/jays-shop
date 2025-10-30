import { getSupabaseBrowserClient } from '@/server/supabase/client'
import { Database } from '../../../types/database.types'

// Define types for materialized views that may not be in the auto-generated types
interface MonthlyTicketTrends {
  month: string
  ticket_count: number
  unique_customers: number
  total_revenue: number
}

interface TicketStatusDistribution {
  status: string
  count: number
  percentage: number
}

interface TopProductsBySales {
  id: string
  name: string
  category: string
  total_orders: number
  total_quantity_sold: number
  total_revenue: number
  average_price: number
}

export const dashboardDb = {
  // Get admin dashboard metrics
  async getAdminMetrics() {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('admin_dashboard_metrics')
      .select('*')
      .single()
    
    if (error) throw error
    return data
  },

  // Get ticket summary
  async getTicketSummary() {
    const supabase = getSupabaseBrowserClient()
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
    const supabase = getSupabaseBrowserClient()
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
    const supabase = getSupabaseBrowserClient()
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
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('order_details')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) throw error
    return data
  },

  // Get monthly revenue trends
  async getMonthlyRevenueTrends() {
    const supabase = getSupabaseBrowserClient()
    // Using RPC to query materialized views as they're not in the auto-generated types
    const { data, error } = await (supabase as any)
      .from('monthly_ticket_trends')
      .select('*')
      .order('month', { ascending: true })
    
    if (error) throw error
    return data as MonthlyTicketTrends[]
  },

  // Get ticket status distribution
  async getTicketStatusDistribution() {
    const supabase = getSupabaseBrowserClient()
    // Using RPC to query materialized views as they're not in the auto-generated types
    const { data, error } = await (supabase as any)
      .from('ticket_status_distribution')
      .select('*')
    
    if (error) throw error
    return data as TicketStatusDistribution[]
  },

  // Get top products by sales
  async getTopProductsBySales() {
    const supabase = getSupabaseBrowserClient()
    // Using RPC to query materialized views as they're not in the auto-generated types
    const { data, error } = await (supabase as any)
      .from('top_products_by_sales')
      .select('*')
      .order('total_revenue', { ascending: false })
      .limit(10)
    
    if (error) throw error
    return data as TopProductsBySales[]
  }
}