import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../../../types/database.types'

// Global singleton instance
let supabaseClient: SupabaseClient<Database> | null = null

// Create Supabase client
// In Vite, environment variables are accessed through import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Ensure environment variables are defined
if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing SUPABASE_ANON_KEY environment variable')
}

// Create a singleton Supabase client instance
export const getSupabaseClient = (): SupabaseClient<Database> => {
  if (!supabaseClient) {
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  }
  return supabaseClient
}

// Export the client directly for backward compatibility
export const supabase = getSupabaseClient()

// Create a client component client (for use in React components)
// This will return the singleton instance to avoid multiple clients
export const createClientComponentClient = () => {
  return getSupabaseClient()
}