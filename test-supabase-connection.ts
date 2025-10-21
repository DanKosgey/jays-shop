import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('Environment variables after dotenv config:', {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '***' : undefined,
});

import { getSupabaseAdminClient } from '@/server/supabase/admin';

async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    const supabase = getSupabaseAdminClient();
    
    // Test a simple query to see if we can access the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role')
      .limit(1);
    
    if (error) {
      console.error('Supabase query error:', error);
      return;
    }
    
    console.log('Supabase connection successful!');
    console.log('Sample profile data:', data);
  } catch (error) {
    console.error('Supabase connection test failed:', error);
  }
}

testSupabaseConnection();