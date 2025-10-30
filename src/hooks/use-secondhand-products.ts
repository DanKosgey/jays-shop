import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { secondHandProductsDb } from '@/lib/db/secondhand_products'
import { queryKeys } from '@/lib/query-keys'
import type { SecondHandProduct, SecondHandProductInsert, SecondHandProductUpdate } from '@/lib/db/secondhand_products'

// Get all second-hand products
export const useSecondHandProducts = () => {
  return useQuery({
    queryKey: queryKeys.secondHandProducts.lists(),
    queryFn: () => secondHandProductsDb.getAll(),
  })
}

// Get second-hand product by ID
export const useSecondHandProduct = (id: string) => {
  return useQuery({
    queryKey: queryKeys.secondHandProducts.detail(id),
    queryFn: () => secondHandProductsDb.getById(id),
    enabled: !!id,
  })
}

// Get second-hand products by condition
export const useSecondHandProductsByCondition = (condition: 'Like New' | 'Good' | 'Fair') => {
  return useQuery({
    queryKey: queryKeys.secondHandProducts.list({ condition }),
    queryFn: () => secondHandProductsDb.getByCondition(condition),
  })
}

// Search second-hand products
export const useSearchSecondHandProducts = (searchTerm: string) => {
  return useQuery({
    queryKey: queryKeys.secondHandProducts.list({ search: searchTerm }),
    queryFn: () => secondHandProductsDb.search(searchTerm),
    enabled: !!searchTerm,
  })
}

// Get second-hand products by seller
export const useSecondHandProductsBySeller = (sellerId: string) => {
  return useQuery({
    queryKey: queryKeys.secondHandProducts.list({ sellerId }),
    queryFn: () => secondHandProductsDb.getBySeller(sellerId),
    enabled: !!sellerId,
  })
}

// Create second-hand product
export const useCreateSecondHandProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (product: SecondHandProductInsert) => secondHandProductsDb.create(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.secondHandProducts.lists() })
    },
  })
}

// Update second-hand product
export const useUpdateSecondHandProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: SecondHandProductUpdate }) => 
      secondHandProductsDb.update(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.secondHandProducts.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.secondHandProducts.detail(data.id) })
    },
  })
}

// Delete second-hand product
export const useDeleteSecondHandProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => secondHandProductsDb.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.secondHandProducts.lists() })
    },
  })
}