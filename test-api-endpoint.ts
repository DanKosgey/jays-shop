// Test the actual API endpoint
async function testApiEndpoint() {
  try {
    console.log('Testing storage sign API endpoint...');
    
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
    
    console.log('Response status:', response.status);
    
    // Try to parse the response
    let result;
    try {
      result = await response.json();
      console.log('Response data:', result);
    } catch (parseError) {
      const text = await response.text();
      console.log('Response text:', text);
      return;
    }
    
    if (!response.ok) {
      console.error('Failed to get signed upload URL:', result);
      return;
    }
    
    console.log('Successfully got signed upload URL:', result);
    
  } catch (error) {
    console.error('Error testing API endpoint:', error);
  }
}

testApiEndpoint();