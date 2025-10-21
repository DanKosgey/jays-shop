import { createClient } from '@supabase/supabase-js';
import { getEnv } from '@/server/env';

export function getSupabaseAdminClient() {
  const env = getEnv();
  
  // Ensure we have valid strings for the Supabase client
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';
  
  // Check if we have valid values
  if (!supabaseUrl || !supabaseKey) {
    console.error('[ADMIN_CLIENT] Missing Supabase configuration:', { supabaseUrl, supabaseKey });
    throw new Error('Missing Supabase configuration for admin client');
  }
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}