import { getSupabaseBrowserClient } from '@/lib/supabase/client'

// Subscribe to real-time changes for a table
export const subscribeToTableChanges = (
  table: string,
  callback: (payload: any) => void
) => {
  // Check if we're in a development environment where Supabase might not be available
  if (process.env.NODE_ENV === 'development') {
    // In development, if Supabase is not running, we'll silently fail realtime subscriptions
    // This prevents console spam while still allowing the app to function
    try {
      const supabase = getSupabaseBrowserClient()
      // Test if we can connect to Supabase
      if (!supabase) {
        return {
          unsubscribe: () => {},
        }
      }
    } catch (e) {
      // Supabase not available, return mock channel
      return {
        unsubscribe: () => {},
      }
    }
  }

  try {
    const supabase = getSupabaseBrowserClient()
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
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          // Only show detailed errors in development
          if (process.env.NODE_ENV === 'development') {
            console.warn(`Realtime subscription error for table ${table}`)
          }
        } else if (status === 'CLOSED') {
          // Only show detailed errors in development
          if (process.env.NODE_ENV === 'development') {
            console.warn(`Realtime subscription closed for table ${table}`)
          }
        }
      })

    return channel
  } catch (error) {
    // Only show detailed errors in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Failed to create realtime subscription for table ${table}:`, error)
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
  // Check if we're in a development environment where Supabase might not be available
  if (process.env.NODE_ENV === 'development') {
    // In development, if Supabase is not running, we'll silently fail realtime subscriptions
    try {
      const supabase = getSupabaseBrowserClient()
      // Test if we can connect to Supabase
      if (!supabase) {
        return {
          unsubscribe: () => {},
        }
      }
    } catch (e) {
      // Supabase not available, return mock channel
      return {
        unsubscribe: () => {},
      }
    }
  }

  try {
    const supabase = getSupabaseBrowserClient()
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
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          // Only show detailed errors in development
          if (process.env.NODE_ENV === 'development') {
            console.warn(`Realtime subscription error for table ${table}, record ${recordId}`)
          }
        } else if (status === 'CLOSED') {
          // Only show detailed errors in development
          if (process.env.NODE_ENV === 'development') {
            console.warn(`Realtime subscription closed for table ${table}, record ${recordId}`)
          }
        }
      })

    return channel
  } catch (error) {
    // Only show detailed errors in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Failed to create realtime subscription for table ${table}, record ${recordId}:`, error)
    }
    // Return a mock channel object to prevent errors
    return {
      unsubscribe: () => {},
    }
  }
}

// Unsubscribe from a channel
export const unsubscribeFromChannel = (channel: any) => {
  // Check if we're in a development environment where Supabase might not be available
  if (process.env.NODE_ENV === 'development') {
    try {
      const supabase = getSupabaseBrowserClient()
      // Test if we can connect to Supabase
      if (!supabase) {
        return;
      }
    } catch (e) {
      // Supabase not available, silently return
      return;
    }
  }

  try {
    if (channel && typeof channel.unsubscribe === 'function') {
      const supabase = getSupabaseBrowserClient()
      supabase.removeChannel(channel)
    }
  } catch (error) {
    // Only show detailed errors in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to unsubscribe from realtime channel:', error)
    }
  }
}