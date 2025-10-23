const { createClient } = require('@supabase/supabase-js');

// Configuration - using the same as in your .env.local
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'; // Service role key from .env.local

console.log('Testing Supabase storage upload process...');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
  try {
    console.log('\n1. Creating a test image file...');
    // Create a simple test image (1x1 pixel PNG)
    const testImageData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64');
    const testFileName = 'test-upload-' + Date.now() + '.png';
    const testFilePath = `products/${testFileName}`;
    
    console.log('Test file name:', testFileName);
    
    console.log('\n2. Testing signed URL generation through API...');
    // Test our API endpoint for signed URLs
    const signResponse = await fetch('http://localhost:9003/api/storage/sign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucket: 'products',
        filePath: testFilePath,
      }),
    });
    
    if (!signResponse.ok) {
      const error = await signResponse.json();
      console.error('Failed to get signed upload URL:', error);
      return;
    }
    
    const { url: signedUrl } = await signResponse.json();
    console.log('Successfully got signed upload URL');
    
    console.log('\n3. Uploading file using signed URL...');
    const uploadResponse = await fetch(signedUrl, {
      method: 'PUT',
      body: testImageData,
      headers: {
        'Content-Type': 'image/png',
      },
    });
    
    if (!uploadResponse.ok) {
      console.error('Upload failed:', uploadResponse.status, uploadResponse.statusText);
      return;
    }
    
    console.log('Upload successful!');
    
    console.log('\n4. Verifying file exists in storage...');
    const { data: fileInfo, error: fileInfoError } = await supabase
      .storage
      .from('products')
      .list('', { search: testFileName });
    
    if (fileInfoError) {
      console.error('Error checking file existence:', fileInfoError);
    } else if (!fileInfo || fileInfo.length === 0) {
      console.log('File not found in storage');
    } else {
      console.log('File found in storage:', fileInfo[0]);
    }
    
    console.log('\n5. Testing public URL access...');
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/products/${testFileName}`;
    console.log('Public URL:', publicUrl);
    
    const publicResponse = await fetch(publicUrl);
    console.log('Public URL response:', publicResponse.status, publicResponse.statusText);
    
    if (publicResponse.ok) {
      console.log('SUCCESS: Image is accessible via public URL!');
    } else {
      console.log('FAILED: Image is not accessible via public URL');
    }
    
    console.log('\nTest completed!');
  } catch (error) {
    console.error('Unexpected error in test:', error);
  }
}

testUpload();