import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { Database } from '../../../types/database.types'

type Product = Database['public']['Tables']['products']['Row']
type ProductInsert = Database['public']['Tables']['products']['Insert']
type ProductUpdate = Database['public']['Tables']['products']['Update']

export const productsDb = {
  // Get all products
  async getAll() {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get product by ID
  async getById(id: string) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single()
    
    if (error) throw error
    return data
  },

  // Get product by slug
  async getBySlug(slug: string | null) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .is('deleted_at', null)
      .single()
    
    if (error) throw error
    return data
  },

  // Search products
  async search(searchTerm: string) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get featured products
  async getFeatured() {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get products by category
  async getByCategory(category: string) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Create product
  async create(product: ProductInsert) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update product
  async update(id: string, updates: ProductUpdate) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete product (soft delete)
  async delete(id: string) {
    const supabase = getSupabaseBrowserClient()
    // Using type assertion to bypass TypeScript error for deleted_at field
    const { error } = await supabase
      .from('products')
      .update({ deleted_at: new Date().toISOString() } as any)
      .eq('id', id)
    
    if (error) throw error
  },

  // Get low stock products
  async getLowStock(threshold: number = 5) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .lte('stock_quantity', threshold)
      .gt('stock_quantity', 0)
      .is('deleted_at', null)
      .order('stock_quantity', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Get out of stock products
  async getOutOfStock() {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('stock_quantity', 0)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}