'use server';

import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

import { searchProducts } from './flows/ai-chatbot-customer-support';

// Also load the Google API key if needed
if (process.env.GENKIT_GOOGLE_API_KEY) {
  process.env.GOOGLE_API_KEY = process.env.GENKIT_GOOGLE_API_KEY;
}

async function testSearchProducts() {
  try {
    console.log('Testing searchProducts tool with various queries...\n');
    
    // Test 1: Search for "phone"
    console.log('Test 1: Searching for "phone"');
    try {
      const results1 = await searchProducts({ query: 'phone', limit: 5 });
      console.log('Results:', results1);
    } catch (error: any) {
      console.log('Error (expected if no products):', error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 2: Search for "screen"
    console.log('Test 2: Searching for "screen"');
    try {
      const results2 = await searchProducts({ query: 'screen', limit: 3 });
      console.log('Results:', results2);
    } catch (error: any) {
      console.log('Error (expected if no products):', error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 3: Search for "battery"
    console.log('Test 3: Searching for "battery"');
    try {
      const results3 = await searchProducts({ query: 'battery', limit: 3 });
      console.log('Results:', results3);
    } catch (error: any) {
      console.log('Error (expected if no products):', error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 4: Search with empty query
    console.log('Test 4: Searching with empty query');
    try {
      const results4 = await searchProducts({ query: '', limit: 5 });
      console.log('Results:', results4);
    } catch (error: any) {
      console.log('Error:', error.message);
    }
    
    console.log('\nTesting completed.');
    
  } catch (error: any) {
    console.error('Error testing searchProducts:', error);
  }
}

// Run the test
testSearchProducts();