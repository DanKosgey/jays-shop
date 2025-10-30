import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsDb } from '@/lib/db/products'
import { queryKeys } from '@/lib/query-keys'
import type { Database } from '../../types/database.types'

type Product = Database['public']['Tables']['products']['Row']
type ProductInsert = Database['public']['Tables']['products']['Insert']
type ProductUpdate = Database['public']['Tables']['products']['Update']

// Get all products
export const useProducts = () => {
  return useQuery({
    queryKey: queryKeys.products.lists(),
    queryFn: () => productsDb.getAll(),
  })
}

// Get product by ID
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsDb.getById(id),
    enabled: !!id,
  })
}

// Get product by slug
export const useProductBySlug = (slug: string | null) => {
  return useQuery({
    queryKey: ['productBySlug', slug],
    queryFn: () => productsDb.getBySlug(slug),
    enabled: !!slug,
  })
}

// Search products
export const useSearchProducts = (searchTerm: string) => {
  return useQuery({
    queryKey: queryKeys.products.list({ search: searchTerm }),
    queryFn: () => productsDb.search(searchTerm),
    enabled: !!searchTerm,
  })
}

// Get featured products
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: queryKeys.products.featured(),
    queryFn: () => productsDb.getFeatured(),
  })
}

// Get products by category
export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: queryKeys.products.list({ category }),
    queryFn: () => productsDb.getByCategory(category),
  })
}

// Get low stock products
export const useLowStockProducts = (threshold: number = 5) => {
  return useQuery({
    queryKey: queryKeys.products.lowStock(),
    queryFn: () => productsDb.getLowStock(threshold),
  })
}

// Get out of stock products
export const useOutOfStockProducts = () => {
  return useQuery({
    queryKey: queryKeys.products.outOfStock(),
    queryFn: () => productsDb.getOutOfStock(),
  })
}

// Create product
export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (product: ProductInsert) => productsDb.create(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
    },
  })
}

// Update product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ProductUpdate }) => 
      productsDb.update(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(data.id) })
    },
  })
}

// Delete product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => productsDb.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
    },
  })
}