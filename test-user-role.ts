import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config({ path: '.env.local' });

async function testUserRole() {
  try {
    // Initialize Supabase client with service role key for admin access
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('Supabase URL:', supabaseUrl);
    
    // List all users
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, role');
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }
    
    console.log('All users:', users);
    
    // Find the admin user
    const adminUser = users.find(user => user.email === 'admin@g.com');
    
    if (!adminUser) {
      console.log('Admin user not found');
      return;
    }
    
    console.log('Admin user profile:', adminUser);
    
    // If user is not admin, update the role
    if (adminUser.role !== 'admin') {
      console.log('Updating user role to admin...');
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', adminUser.id);
      
      if (updateError) {
        console.error('Failed to update user role:', updateError);
      } else {
        console.log('Successfully updated user role to admin');
      }
    } else {
      console.log('User already has admin role');
    }
    
    // Test creating a signed upload URL
    console.log('Testing signed upload URL creation...');
    const { data: signedUrl, error: signError } = await supabase.storage
      .from('products')
      .createSignedUploadUrl('test/test-image.jpg');
    
    if (signError) {
      console.error('Error creating signed upload URL:', signError);
    } else {
      console.log('Signed upload URL created successfully:', signedUrl);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testUserRole();