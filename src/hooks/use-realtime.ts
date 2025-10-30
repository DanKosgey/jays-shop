import { useEffect, useRef } from 'react'
import { subscribeToTableChanges, unsubscribeFromChannel } from '@/lib/supabase/realtime'
import { queryClient } from '@/lib/query-client'
import { queryKeys } from '@/lib/query-keys'

// Hook for real-time ticket updates
export const useRealtimeTickets = () => {
  const mountedRef = useRef(true)

  useEffect(() => {
    // Set mounted to true when component mounts
    mountedRef.current = true
    
    // Set mounted to false when component unmounts
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    try {
      const channel = subscribeToTableChanges('tickets', (payload) => {
        // Only update if component is still mounted
        if (!mountedRef.current) return
        
        // Invalidate tickets queries when there are changes
        queryClient.invalidateQueries({ queryKey: queryKeys.tickets.lists() })
        queryClient.invalidateQueries({ queryKey: queryKeys.tickets.details() })
        
        // Also invalidate dashboard queries since they might be affected
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.ticketSummary() })
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics() })
      })

      // Cleanup subscription on unmount
      return () => {
        if (mountedRef.current) {
          unsubscribeFromChannel(channel)
        }
      }
    } catch (error) {
      console.warn('Failed to subscribe to real-time ticket updates:', error)
      return () => {}
    }
  }, [])
}

// Hook for real-time product updates
export const useRealtimeProducts = () => {
  const mountedRef = useRef(true)

  useEffect(() => {
    // Set mounted to true when component mounts
    mountedRef.current = true
    
    // Set mounted to false when component unmounts
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    try {
      const channel = subscribeToTableChanges('products', (payload) => {
        // Only update if component is still mounted
        if (!mountedRef.current) return
        
        // Invalidate products queries when there are changes
        queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
        queryClient.invalidateQueries({ queryKey: queryKeys.products.details() })
        
        // Also invalidate dashboard queries since they might be affected
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.productSalesSummary() })
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics() })
      })

      // Cleanup subscription on unmount
      return () => {
        if (mountedRef.current) {
          unsubscribeFromChannel(channel)
        }
      }
    } catch (error) {
      console.warn('Failed to subscribe to real-time product updates:', error)
      return () => {}
    }
  }, [])
}

// Hook for real-time order updates
export const useRealtimeOrders = () => {
  const mountedRef = useRef(true)

  useEffect(() => {
    // Set mounted to true when component mounts
    mountedRef.current = true
    
    // Set mounted to false when component unmounts
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    try {
      const channel = subscribeToTableChanges('orders', (payload) => {
        // Only update if component is still mounted
        if (!mountedRef.current) return
        
        // Invalidate orders queries when there are changes
        queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() })
        queryClient.invalidateQueries({ queryKey: queryKeys.orders.details() })
        
        // Also invalidate dashboard queries since they might be affected
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.orderDetails() })
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics() })
      })

      // Cleanup subscription on unmount
      return () => {
        if (mountedRef.current) {
          unsubscribeFromChannel(channel)
        }
      }
    } catch (error) {
      console.warn('Failed to subscribe to real-time order updates:', error)
      return () => {}
    }
  }, [])
}

// Hook for real-time customer updates
export const useRealtimeCustomers = () => {
  const mountedRef = useRef(true)

  useEffect(() => {
    // Set mounted to true when component mounts
    mountedRef.current = true
    
    // Set mounted to false when component unmounts
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    try {
      const channel = subscribeToTableChanges('customers', (payload) => {
        // Only update if component is still mounted
        if (!mountedRef.current) return
        
        // Invalidate customers queries when there are changes
        queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() })
        queryClient.invalidateQueries({ queryKey: queryKeys.customers.details() })
        
        // Also invalidate dashboard queries since they might be affected
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.customerSummary() })
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics() })
      })

      // Cleanup subscription on unmount
      return () => {
        if (mountedRef.current) {
          unsubscribeFromChannel(channel)
        }
      }
    } catch (error) {
      console.warn('Failed to subscribe to real-time customer updates:', error)
      return () => {}
    }
  }, [])
}