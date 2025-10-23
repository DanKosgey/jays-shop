const { createClient } = require('@supabase/supabase-js');

// Configuration - using the same as in your .env.local
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'; // Service role key from .env.local

console.log('Testing image access...');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

// Simple test to check if we can access the image URLs
console.log('Testing image URLs...');

// URLs to test
const urls = [
  'http://localhost:54321/storage/v1/object/public/products/test-upload-1761236063448.png',
  'http://localhost:54321/storage/v1/object/public/products/gvrtygbty-1761235079588.png'
];

console.log('Please manually check these URLs in your browser:');
urls.forEach((url, index) => {
  console.log(`${index + 1}. ${url}`);
});

console.log('\nIf the first URL works but shows a 400 error in Next.js image optimization,');
console.log('it might be a configuration issue with Next.js image optimization.');

async function testImageAccess() {
  try {
    // Test accessing the uploaded image
    const testImageName = 'test-upload-1761236063448.png';
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/products/${testImageName}`;
    
    console.log('\n1. Testing public URL access for recently uploaded image...');
    console.log('URL:', publicUrl);
    
    const response = await fetch(publicUrl);
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    if (response.ok) {
      console.log('Image is accessible!');
      const buffer = await response.buffer();
      console.log('Image size:', buffer.length, 'bytes');
    } else {
      console.log('Image is not accessible');
      const text = await response.text();
      console.log('Response text:', text);
    }
    
    // Test accessing the problematic image
    const problematicImageName = 'gvrtygbty-1761235079588.png';
    const problematicUrl = `${supabaseUrl}/storage/v1/object/public/products/${problematicImageName}`;
    
    console.log('\n2. Testing public URL access for problematic image...');
    console.log('URL:', problematicUrl);
    
    const problematicResponse = await fetch(problematicUrl);
    console.log('Response status:', problematicResponse.status);
    
    if (problematicResponse.ok) {
      console.log('Problematic image is accessible!');
      const buffer = await problematicResponse.buffer();
      console.log('Image size:', buffer.length, 'bytes');
    } else {
      console.log('Problematic image is not accessible (expected)');
      const text = await problematicResponse.text();
      console.log('Response text:', text);
    }
    
    console.log('\nImage access test completed!');
  } catch (error) {
    console.error('Unexpected error in image access test:', error);
  }
}

testImageAccess();