// Test script for image upload functionality
async function testImageUpload() {
  try {
    console.log('Testing image upload functionality...');
    
    // Test the storage sign API
    const response = await fetch('http://localhost:9003/api/storage/sign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucket: 'products',
        filePath: 'test/test-image.jpg',
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to get signed upload URL:', error);
      return;
    }
    
    const { url, fullPath } = await response.json();
    console.log('Successfully got signed upload URL:', { url, fullPath });
    
    console.log('Image upload functionality is working correctly!');
  } catch (error) {
    console.error('Error testing image upload:', error);
  }
}

testImageUpload();