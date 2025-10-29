import { createClient } from '@supabase/supabase-js'
import { Database } from '../../../types/database.types'

// Server-side Supabase client (for use in server-side functions)
export const createServerClient = () => {
  // In Vite, environment variables are accessed through import.meta.env
  // But for server-side code, we can also use process.env
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
                     import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
                     process.env.VITE_SUPABASE_URL || 
                     process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || 
                     process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error('Missing SUPABASE_URL environment variable')
  }

  if (!supabaseKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  }

  return createClient<Database>(supabaseUrl, supabaseKey)
}