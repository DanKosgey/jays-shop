import { createBrowserClient } from '@supabase/ssr';
import { getEnv } from '@/server/env';

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient;
  
  try {
    const env = getEnv();
    
    // Ensure we have valid strings for the Supabase client
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
    const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
    
    // Check if we have valid values
    if (!supabaseUrl || !supabaseKey) {
      console.error('[BROWSER_CLIENT] Missing Supabase configuration:', { supabaseUrl, supabaseKey });
      throw new Error('Missing Supabase configuration for browser client');
    }
    
    browserClient = createBrowserClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.warn('Failed to initialize Supabase client:', error);
    // Return a minimal client that won't throw errors
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
    );
  }
  
  return browserClient;
}