const { createClient } = require('@supabase/supabase-js');

// Configuration
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

console.log('Complete Image Upload Test');
console.log('========================');
console.log('Supabase URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function runCompleteTest() {
  try {
    console.log('\n1. Testing bucket access...');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
      console.error('Failed to list buckets:', bucketError);
      return;
    }
    console.log('Available buckets:', buckets.map(b => b.name));
    
    console.log('\n2. Creating test image data...');
    // Create a simple test image (1x1 pixel PNG)
    const testImageData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64');
    const testFileName = `complete-test-${Date.now()}.png`;
    
    console.log('Test file name:', testFileName);
    
    console.log('\n3. Uploading image directly to products bucket...');
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('products')
      .upload(testFileName, testImageData, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) {
      console.error('Upload failed:', uploadError);
      return;
    }
    
    console.log('Upload successful!');
    console.log('File path:', uploadData.path);
    
    console.log('\n4. Verifying file exists in storage...');
    const { data: fileInfo, error: fileInfoError } = await supabase
      .storage
      .from('products')
      .list('', { search: testFileName });
    
    if (fileInfoError) {
      console.error('Error checking file existence:', fileInfoError);
      return;
    }
    
    if (!fileInfo || fileInfo.length === 0) {
      console.log('File not found in storage');
      return;
    }
    
    console.log('File found in storage:', fileInfo[0].name);
    
    console.log('\n5. Testing public URL access...');
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/products/${testFileName}`;
    console.log('Public URL:', publicUrl);
    
    try {
      const publicResponse = await fetch(publicUrl);
      console.log('Public URL response:', publicResponse.status, publicResponse.statusText);
      
      if (publicResponse.ok) {
        console.log('✅ SUCCESS: Image is accessible via public URL!');
      } else {
        console.log('❌ FAILED: Image is not accessible via public URL');
      }
    } catch (fetchError) {
      console.error('Error fetching public URL:', fetchError);
    }
    
    console.log('\n6. Testing image validation function...');
    const { isImageUrlValid } = require('./src/lib/image-utils');
    
    const isValid = await isImageUrlValid(publicUrl);
    console.log('Image URL validation result:', isValid ? 'Valid' : 'Invalid');
    
    console.log('\n7. Testing generateProductImageUrl function...');
    const { generateProductImageUrl } = require('./src/lib/image-utils');
    
    const generatedUrl = generateProductImageUrl(testFileName);
    console.log('Generated URL:', generatedUrl);
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('Unexpected error in test:', error);
  }
}

runCompleteTest();