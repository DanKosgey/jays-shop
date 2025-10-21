import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

import { getSupabaseAdminClient } from '@/server/supabase/admin';

async function testAdminAuth() {
  try {
    console.log('Testing admin authentication logic...');
    
    const supabase = getSupabaseAdminClient();
    
    // Simulate what happens in the admin layout
    // First, try to get the user (this would come from the session in real code)
    console.log('Attempting to get user...');
    
    // In a real scenario, we would get the user from the session
    // For this test, let's assume we have a user ID
    const userId = '6b4dab7f-6157-4dcd-a91f-d9275049ad6c'; // The admin user ID
    const userEmail = 'admin@g.com';
    
    console.log('Getting profile for user:', { userId, userEmail });
    
    // Try to get the profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    console.log('Profile query result:', { profile, profileError });
    
    if (profileError) {
      console.log('Profile error detected:', profileError.message);
      // Check if this is an RLS error
      if (profileError.code === 'PGRST116' || profileError.message.includes('row-level security')) {
        console.log('RLS error detected, assuming admin role');
        console.log('User would be allowed access');
      } else {
        console.log('Other profile error, access would be denied');
      }
    } else {
      const isAdmin = profile?.role === 'admin';
      console.log('Profile found, isAdmin:', isAdmin);
      if (isAdmin) {
        console.log('User is admin, access granted');
      } else {
        console.log('User is not admin, access denied');
      }
    }
  } catch (error) {
    console.error('Admin auth test failed:', error);
  }
}

testAdminAuth();