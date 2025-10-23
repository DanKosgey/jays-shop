// Test the image utility functions
const { generateProductImageUrl, getFallbackImageUrl, isImageUrlValid } = require('./src/lib/image-utils');

async function testImageUtils() {
  console.log('Testing Image Utility Functions');
  console.log('==============================');
  
  // Test generateProductImageUrl
  console.log('\n1. Testing generateProductImageUrl...');
  const testFileName = 'test-image.png';
  const generatedUrl = generateProductImageUrl(testFileName);
  console.log('Generated URL:', generatedUrl);
  
  // Test getFallbackImageUrl
  console.log('\n2. Testing getFallbackImageUrl...');
  const fallbackUrl = getFallbackImageUrl();
  console.log('Fallback URL:', fallbackUrl);
  
  // Test isImageUrlValid with a known good URL
  console.log('\n3. Testing isImageUrlValid with placeholder service...');
  try {
    const isValid = await isImageUrlValid('https://placehold.co/400x400/png?text=Test');
    console.log('Placeholder URL is valid:', isValid);
  } catch (error) {
    console.log('Error testing placeholder URL:', error.message);
  }
  
  console.log('\n✅ Image utility functions test completed!');
}

testImageUtils().catch(console.error);