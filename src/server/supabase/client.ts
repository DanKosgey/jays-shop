import { createClient } from '@supabase/supabase-js'
import { Database } from '../../../types/database.types'

// Use a singleton pattern to ensure only one Supabase client instance
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

// Get Supabase browser client
export const getSupabaseBrowserClient = () => {
  // For Next.js, we use NEXT_PUBLIC_ prefix for client-side environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }

  if (!supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
  }

  // Create a singleton Supabase client instance
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