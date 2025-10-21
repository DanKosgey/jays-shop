const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH';
const serviceRoleKey = 'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz';

// Create Supabase clients
const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Sign up the user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: 'admin@g.com',
      password: 'Dan@2020',
    });
    
    if (signUpError) {
      console.error('Sign up error:', signUpError);
      return;
    }
    
    console.log('User signed up:', authData);
    
    // If signup was successful, update the user's role to admin
    if (authData.user) {
      // Wait a moment for the profile to be created by the trigger
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the profile to set role to admin
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', authData.user.id);
      
      if (profileError) {
        console.error('Profile update error:', profileError);
        return;
      }
      
      console.log('Profile updated to admin role:', profileData);
    }
    
    console.log('Admin user created successfully!');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser();