import { createClient } from '@supabase/supabase-js'
import { Database } from '../../../types/database.types'

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

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Create a client component client (for use in React components)
export const createClientComponentClient = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url) {
    throw new Error('Missing SUPABASE_URL environment variable')
  }
  
  if (!key) {
    throw new Error('Missing SUPABASE_ANON_KEY environment variable')
  }
  
  return createClient<Database>(url, key)
}