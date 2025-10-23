// Test script for storage API functionality
async function testStorageAPI() {
  try {
    console.log('Testing storage sign API...');
    
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
    
    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', result);
    
    if (!response.ok) {
      console.error('Failed to get signed upload URL:', result);
      return;
    }
    
    console.log('Successfully got signed upload URL:', result);
    
  } catch (error) {
    console.error('Error testing storage API:', error);
  }
}

testStorageAPI();