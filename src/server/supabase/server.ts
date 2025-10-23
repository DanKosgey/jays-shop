import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { getEnv } from '@/server/env';

export async function getSupabaseServerClient() {
  let env;
  try {
    env = getEnv();
  } catch (error) {
    console.warn('Failed to get environment variables:', error);
    // Use fallback values
    env = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key',
    };
  }
  
  // Ensure we have valid strings for the Supabase client
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
  const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
  
  // Check if we have valid values
  if (!supabaseUrl || !supabaseKey) {
    console.error('[SERVER_CLIENT] Missing Supabase configuration:', { supabaseUrl, supabaseKey });
    throw new Error('Missing Supabase configuration for server client');
  }
  
  const cookieStore = await cookies();
  // createServerClient uses cookie get/set to persist auth
  const client = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set(name, value, options);
        } catch {
          // no-op in edge where readonly; middleware handles set via response
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set(name, '', { ...options, maxAge: 0 });
        } catch {
          // no-op
        }
      },
    },
  });
  return client;
}

// For server-side operations that need elevated privileges, use this client
export function getSupabaseServerAdminClient() {
  let env;
  try {
    env = getEnv();
  } catch (error) {
    console.warn('Failed to get environment variables:', error);
    // Use fallback values
    env = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key',
    };
  }
  
  // Ensure we have valid strings for the Supabase client
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';
  
  // Check if we have valid values
  if (!supabaseUrl || !supabaseKey) {
    console.error('[SERVER_ADMIN_CLIENT] Missing Supabase configuration:', { supabaseUrl, supabaseKey });
    throw new Error('Missing Supabase configuration for server admin client');
  }
  
  // Create a client with the service role key for elevated privileges
  const client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
  
  return client;
}