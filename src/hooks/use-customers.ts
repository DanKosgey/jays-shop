import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customersDb } from '@/lib/db/customers'
import { queryKeys } from '@/lib/query-keys'
import type { Database } from '../../types/database.types'

type Customer = Database['public']['Tables']['customers']['Row']
type CustomerInsert = Database['public']['Tables']['customers']['Insert']
type CustomerUpdate = Database['public']['Tables']['customers']['Update']

// Get all customers
export const useCustomers = () => {
  return useQuery({
    queryKey: queryKeys.customers.lists(),
    queryFn: () => customersDb.getAll(),
  })
}

// Get customer by ID
export const useCustomer = (id: string) => {
  return useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: () => customersDb.getById(id),
    enabled: !!id,
  })
}

// Get customer by email
export const useCustomerByEmail = (email: string) => {
  return useQuery({
    queryKey: ['customerByEmail', email],
    queryFn: () => customersDb.getByEmail(email),
    enabled: !!email,
  })
}

// Get customer by user ID
export const useCustomerByUserId = (userId: string) => {
  return useQuery({
    queryKey: ['customerByUserId', userId],
    queryFn: () => customersDb.getByUserId(userId),
    enabled: !!userId,
  })
}

// Search customers
export const useSearchCustomers = (query: string) => {
  return useQuery({
    queryKey: queryKeys.customers.list({ search: query }),
    queryFn: () => customersDb.search(query),
    enabled: !!query,
  })
}

// Create customer
export const useCreateCustomer = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (customer: CustomerInsert) => customersDb.create(customer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() })
    },
  })
}

// Update customer
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: CustomerUpdate }) => 
      customersDb.update(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.detail(data.id) })
    },
  })
}

// Delete customer
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => customersDb.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() })
    },
  })
}