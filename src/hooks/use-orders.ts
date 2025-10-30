import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersDb } from '@/lib/db/orders'
import { queryKeys } from '@/lib/query-keys'
import type { Database } from '../../types/database.types'

type Order = Database['public']['Tables']['orders']['Row']
type OrderInsert = Database['public']['Tables']['orders']['Insert']
type OrderUpdate = Database['public']['Tables']['orders']['Update']
type OrderStatus = Database['public']['Enums']['order_status']

// Get all orders
export const useOrders = () => {
  return useQuery({
    queryKey: queryKeys.orders.lists(),
    queryFn: () => ordersDb.getAll(),
  })
}

// Get order by ID
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => ordersDb.getById(id),
    enabled: !!id,
  })
}

// Get orders by status
export const useOrdersByStatus = (status: OrderStatus) => {
  return useQuery({
    queryKey: queryKeys.orders.list({ status }),
    queryFn: () => ordersDb.getByStatus(status),
  })
}

// Get user's orders
export const useUserOrders = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.orders.list({ userId }),
    queryFn: () => ordersDb.getByUserId(userId),
    enabled: !!userId,
  })
}

// Create order
export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (order: OrderInsert) => ordersDb.create(order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() })
    },
  })
}

// Update order
export const useUpdateOrder = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: OrderUpdate }) => 
      ordersDb.update(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(data.id) })
    },
  })
}

// Delete order
export const useDeleteOrder = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => ordersDb.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() })
    },
  })
}