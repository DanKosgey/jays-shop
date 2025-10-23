// Test the complete image upload flow
async function testCompleteUpload() {
  try {
    console.log('Testing complete image upload flow...');
    
    // Step 1: Get signed upload URL
    const signResponse = await fetch('http://localhost:9003/api/storage/sign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucket: 'products',
        filePath: 'test/test-image.jpg',
      }),
    });
    
    console.log('Sign response status:', signResponse.status);
    
    if (!signResponse.ok) {
      const error = await signResponse.text();
      console.error('Failed to get signed upload URL:', error);
      return;
    }
    
    const signResult = await signResponse.json();
    console.log('Signed upload URL:', signResult.url);
    
    // Step 2: Upload a test file using the signed URL
    const testContent = 'This is a test image file';
    const uploadResponse = await fetch(signResult.url, {
      method: 'PUT',
      body: testContent,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    
    console.log('Upload response status:', uploadResponse.status);
    
    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      console.error('Failed to upload file:', error);
      return;
    }
    
    console.log('File uploaded successfully!');
    
    // Step 3: Verify the file exists by trying to access it
    const publicUrl = `http://127.0.0.1:54321/storage/v1/object/public/products/test/test-image.jpg`;
    console.log('Public URL:', publicUrl);
    
    const verifyResponse = await fetch(publicUrl);
    console.log('Verification response status:', verifyResponse.status);
    
    if (verifyResponse.ok) {
      console.log('File is accessible publicly!');
    } else {
      console.log('File may not be accessible yet, but upload was successful');
    }
    
  } catch (error) {
    console.error('Error testing complete upload flow:', error);
  }
}

testCompleteUpload();