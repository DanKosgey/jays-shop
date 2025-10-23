const { createClient } = require('@supabase/supabase-js');

// Configuration - using the same as in your .env.local
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'; // Service role key from .env.local

console.log('Testing Supabase storage connection...');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testStorage() {
  try {
    console.log('\n1. Testing storage bucket access...');
    // Try to list objects in the products bucket
    const { data: objects, error: objectsError } = await supabase
      .storage
      .from('products')
      .list('', {
        limit: 100, // Get more objects
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      });
    
    if (objectsError) {
      console.error('Error listing objects in products bucket:', objectsError);
    } else {
      console.log('Success listing objects in products bucket:');
      console.log('Found', objects.length, 'objects');
      objects.forEach(obj => {
        console.log('  -', obj.name);
      });
    }
    
    console.log('\n2. Testing if specific image exists...');
    // Check if the problematic image exists
    const problematicImage = 'gvrtygbty-1761235079588.png';
    const { data: imageData, error: imageError } = await supabase
      .storage
      .from('products')
      .list('', {
        limit: 100,
        offset: 0,
        search: problematicImage
      });
    
    if (imageError) {
      console.error('Error searching for specific image:', imageError);
    } else {
      console.log('Search results for', problematicImage, ':', imageData);
    }
    
    console.log('\n3. Testing signed URL generation...');
    // Try to generate a signed URL for upload
    const { data: signedData, error: signedError } = await supabase
      .storage
      .from('products')
      .createSignedUploadUrl('test/test-image.jpg');
    
    if (signedError) {
      console.error('Error creating signed upload URL:', signedError);
    } else {
      console.log('Success creating signed upload URL:', signedData);
    }
    
    console.log('\nStorage test completed!');
  } catch (error) {
    console.error('Unexpected error in storage test:', error);
  }
}

testStorage();