import { getSupabaseBrowserClient } from '@/server/supabase/client'

// Subscribe to real-time changes for a table
export const subscribeToTableChanges = (
  table: string,
  callback: (payload: any) => void
) => {
  try {
    const supabase = getSupabaseBrowserClient()
    
    // Check if Supabase client is available
    if (!supabase) {
      return {
        unsubscribe: () => {},
      }
    }
    
    const channel = supabase
      .channel(`realtime:${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        callback
      )
      .subscribe((status, err) => {
        if (status === 'CHANNEL_ERROR') {
          // Log error only in development and only if there's an actual error object
          if (process.env.NODE_ENV === 'development' && err) {
            console.warn(`Realtime subscription error for table ${table}:`, err.message || 'Unknown error')
          }
        } else if (status === 'CLOSED') {
          // This is normal when components unmount, so we don't need to log it
          // Only log unexpected closures in development
          if (process.env.NODE_ENV === 'development') {
            // We don't log CLOSED status as it's expected behavior
          }
        }
      })

    return channel
  } catch (error) {
    // Only show detailed errors in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Failed to create realtime subscription for table ${table}:`, error instanceof Error ? error.message : 'Unknown error')
    }
    // Return a mock channel object to prevent errors
    return {
      unsubscribe: () => {},
    }
  }
}

// Subscribe to real-time changes for a specific record
export const subscribeToRecordChanges = (
  table: string,
  recordId: string,
  callback: (payload: any) => void
) => {
  try {
    const supabase = getSupabaseBrowserClient()
    
    // Check if Supabase client is available
    if (!supabase) {
      return {
        unsubscribe: () => {},
      }
    }
    
    const channel = supabase
      .channel(`realtime:${table}:${recordId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: `id=eq.${recordId}`,
        },
        callback
      )
      .subscribe((status, err) => {
        if (status === 'CHANNEL_ERROR') {
          // Log error only in development and only if there's an actual error object
          if (process.env.NODE_ENV === 'development' && err) {
            console.warn(`Realtime subscription error for table ${table}, record ${recordId}:`, err.message || 'Unknown error')
          }
        } else if (status === 'CLOSED') {
          // This is normal when components unmount, so we don't need to log it
        }
      })

    return channel
  } catch (error) {
    // Only show detailed errors in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Failed to create realtime subscription for table ${table}, record ${recordId}:`, error instanceof Error ? error.message : 'Unknown error')
    }
    // Return a mock channel object to prevent errors
    return {
      unsubscribe: () => {},
    }
  }
}

// Unsubscribe from a channel
export const unsubscribeFromChannel = (channel: any) => {
  try {
    if (channel && typeof channel.unsubscribe === 'function') {
      const supabase = getSupabaseBrowserClient()
      if (supabase) {
        supabase.removeChannel(channel)
      }
    }
  } catch (error) {
    // Only show detailed errors in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to unsubscribe from realtime channel:', error instanceof Error ? error.message : 'Unknown error')
    }
  }
}