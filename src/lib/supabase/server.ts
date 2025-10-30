import { createClient } from '@supabase/supabase-js'
import { Database } from '../../../types/database.types'

// Server-side Supabase client (for use in server-side functions)
export const getSupabaseServerClient = () => {
  // For Next.js, environment variables are accessed through process.env
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }

  if (!supabaseKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  }

  return createClient<Database>(supabaseUrl, supabaseKey)
}