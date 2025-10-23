const { createClient } = require('@supabase/supabase-js');

// Use the same configuration as in your .env.local
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz';

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? '***' : 'NOT SET');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n1. Testing connection to auth.users (correct schema)...');
    // The auth schema needs to be specified correctly
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email')
      .limit(5);
    
    if (usersError) {
      console.error('Error querying auth.users:', usersError);
      // Try with explicit schema
      console.log('\n1a. Trying with explicit schema...');
      const { data: users2, error: usersError2 } = await supabase
        .schema('auth')
        .from('users')
        .select('id, email')
        .limit(5);
      
      if (usersError2) {
        console.error('Error querying auth.users with schema:', usersError2);
      } else {
        console.log('Success querying auth.users with schema:', users2);
      }
    } else {
      console.log('Success querying auth.users:', users);
    }
    
    console.log('\n2. Testing connection to profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, role')
      .limit(5);
    
    if (profilesError) {
      console.error('Error querying profiles:', profilesError);
    } else {
      console.log('Success querying profiles:', profiles);
    }
    
    console.log('\n3. Testing if admin user exists...');
    const { data: adminProfiles, error: adminError } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('role', 'admin')
      .limit(5);
    
    if (adminError) {
      console.error('Error querying admin profiles:', adminError);
    } else {
      console.log('Admin profiles found:', adminProfiles);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testConnection();