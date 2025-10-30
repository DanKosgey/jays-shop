import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketsDb } from '@/lib/db/tickets'
import { queryKeys } from '@/lib/query-keys'
import type { Database } from '../../types/database.types'

type Ticket = Database['public']['Tables']['tickets']['Row']
type TicketInsert = Database['public']['Tables']['tickets']['Insert']
type TicketUpdate = Database['public']['Tables']['tickets']['Update']
type TicketStatus = Database['public']['Enums']['ticket_status']

// Get all tickets
export const useTickets = () => {
  return useQuery({
    queryKey: queryKeys.tickets.lists(),
    queryFn: () => ticketsDb.getAll(),
  })
}

// Get ticket by ID
export const useTicket = (id: string) => {
  return useQuery({
    queryKey: queryKeys.tickets.detail(id),
    queryFn: () => ticketsDb.getById(id),
    enabled: !!id,
  })
}

// Get ticket by ticket number
export const useTicketByNumber = (ticketNumber: string) => {
  return useQuery({
    queryKey: ['ticketByNumber', ticketNumber],
    queryFn: () => ticketsDb.getByTicketNumber(ticketNumber),
    enabled: !!ticketNumber,
  })
}

// Get tickets by status
export const useTicketsByStatus = (status: TicketStatus) => {
  return useQuery({
    queryKey: queryKeys.tickets.list({ status }),
    queryFn: () => ticketsDb.getByStatus(status),
  })
}

// Search tickets
export const useSearchTickets = (query: string) => {
  return useQuery({
    queryKey: queryKeys.tickets.list({ search: query }),
    queryFn: () => ticketsDb.search(query),
    enabled: !!query,
  })
}

// Get user's tickets
export const useUserTickets = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.tickets.list({ userId }),
    queryFn: () => ticketsDb.getByUserId(userId),
    enabled: !!userId,
  })
}

// Create ticket
export const useCreateTicket = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (ticket: TicketInsert) => ticketsDb.create(ticket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.lists() })
    },
  })
}

// Update ticket
export const useUpdateTicket = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: TicketUpdate }) => 
      ticketsDb.update(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.detail(data.id) })
    },
  })
}

// Delete ticket
export const useDeleteTicket = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => ticketsDb.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.lists() })
    },
  })
}