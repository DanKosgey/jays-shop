import { getSupabaseServerClient } from '@/server/supabase/server'
import { Database } from '../../../types/database.types'

type Product = Database['public']['Tables']['products']['Row']

export const productsDbServer = {
  // Get featured products
  async getFeatured() {
    try {
      const supabase = getSupabaseServerClient()
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    } catch (error: any) {
      // Provide more context about the error
      const errorMessage = error.message || error.toString()
      if (errorMessage.includes('fetch failed') || errorMessage.includes('ECONNREFUSED')) {
        // This is likely a connection error, rethrow with more context
        throw new Error(`Database connection failed: ${errorMessage}`)
      }
      throw error
    }
  },
}