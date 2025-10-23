import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import * as fs from 'fs';
config({ path: '.env.local' });

async function testSupabaseUpload() {
  try {
    // Initialize Supabase client with anon key (like in the browser)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('Supabase URL:', supabaseUrl);
    
    // Test creating a signed upload URL
    const { data, error } = await supabase.storage
      .from('products')
      .createSignedUploadUrl('test/test-image.jpg');

    if (error) {
      console.error('Error creating signed upload URL:', error);
      return;
    }

    console.log('Signed upload URL created successfully:', data);
    
    // Try to upload a simple test file
    // Create a simple test file
    const testContent = 'This is a test file for upload';
    const buffer = Buffer.from(testContent, 'utf-8');
    
    // Upload the file using the signed URL
    const uploadResponse = await fetch(data.signedUrl, {
      method: 'PUT',
      body: buffer,
      headers: {
        'Content-Type': 'text/plain',
      },
    });

    if (!uploadResponse.ok) {
      console.error('Failed to upload file:', uploadResponse.status, await uploadResponse.text());
      return;
    }

    console.log('File uploaded successfully!');
    
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

testSupabaseUpload();