const { createClient } = require('@supabase/supabase-js');

// Configuration - using the same as in your .env.local
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'; // Service role key from .env.local

console.log('Testing detailed Supabase storage listing...');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDetailedList() {
  try {
    console.log('\n1. Listing all objects in products bucket with detailed info...');
    // Try to list objects in the products bucket
    const { data: objects, error: objectsError } = await supabase
      .storage
      .from('products')
      .list('', {
        limit: 1000, // Get more objects
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      });
    
    if (objectsError) {
      console.error('Error listing objects in products bucket:', objectsError);
    } else {
      console.log('Success listing objects in products bucket:');
      console.log('Found', objects.length, 'objects');
      objects.forEach((obj, index) => {
        console.log(`  ${index + 1}.`, obj);
      });
    }
    
    console.log('\n2. Trying to list with prefix "products/"...');
    const { data: prefixedObjects, error: prefixedError } = await supabase
      .storage
      .from('products')
      .list('products/', {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      });
    
    if (prefixedError) {
      console.error('Error listing objects with prefix:', prefixedError);
    } else {
      console.log('Success listing objects with prefix:');
      console.log('Found', prefixedObjects.length, 'objects');
      prefixedObjects.forEach((obj, index) => {
        console.log(`  ${index + 1}.`, obj);
      });
    }
    
    console.log('\nDetailed listing test completed!');
  } catch (error) {
    console.error('Unexpected error in detailed listing test:', error);
  }
}

testDetailedList();