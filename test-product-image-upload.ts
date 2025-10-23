import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testImageUpload() {
  try {
    // Test creating a signed upload URL
    const { data, error } = await supabase.storage
      .from('products')
      .createSignedUploadUrl('test-image.jpg');

    if (error) {
      console.error('Error creating signed upload URL:', error);
      return;
    }

    console.log('Signed upload URL created successfully:', data);
    
    // Test listing files in the bucket
    const { data: files, error: listError } = await supabase.storage
      .from('products')
      .list();

    if (listError) {
      console.error('Error listing files:', listError);
      return;
    }

    console.log('Files in products bucket:', files);
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testImageUpload();