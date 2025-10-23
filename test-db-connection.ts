import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

import { getSupabaseAdminClient } from '@/server/supabase/admin';

async function testDbConnection() {
  try {
    console.log('Testing database connection...');
    
    const supabase = getSupabaseAdminClient();
    
    // Test 1: Check if we can connect and query auth.users
    console.log('\n1. Testing auth.users table...');
    const { data: users, error: usersError } = await supabase
      .from('auth.users')
      .select('id, email')
      .limit(5);
    
    if (usersError) {
      console.error('Error querying auth.users:', usersError);
    } else {
      console.log('Found users in auth.users:', users?.length || 0);
      users?.forEach(user => {
        console.log(`  - ${user.email} (${user.id})`);
      });
    }
    
    // Test 2: Check if we can query public.profiles
    console.log('\n2. Testing public.profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, role')
      .limit(5);
    
    if (profilesError) {
      console.error('Error querying profiles:', profilesError);
    } else {
      console.log('Found profiles:', profiles?.length || 0);
      profiles?.forEach(profile => {
        console.log(`  - ${profile.email} (${profile.id}) - Role: ${profile.role}`);
      });
    }
    
    // Test 3: Check if we can query with range
    console.log('\n3. Testing range query on profiles...');
    const { data: rangedProfiles, error: rangeError, count } = await supabase
      .from('profiles')
      .select('id, email, role', { count: 'exact' })
      .range(0, 9);
    
    if (rangeError) {
      console.error('Error with range query:', rangeError);
    } else {
      console.log(`Found ${count} profiles with range query`);
      rangedProfiles?.forEach(profile => {
        console.log(`  - ${profile.email} (${profile.id}) - Role: ${profile.role}`);
      });
    }
    
    console.log('\nDatabase connection test completed.');
  } catch (error) {
    console.error('Database connection test failed:', error);
  }
}

testDbConnection();