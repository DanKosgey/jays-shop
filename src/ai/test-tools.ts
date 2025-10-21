'use server';

import { getAllProducts, getProductCategories, searchProducts } from './flows/ai-chatbot-customer-support';

async function testTools() {
  try {
    console.log('Testing getAllProducts tool...');
    const products = await getAllProducts({ limit: 5 });
    console.log('Products:', products);
    
    console.log('\nTesting getProductCategories tool...');
    const categories = await getProductCategories({});
    console.log('Categories:', categories);
    
    console.log('\nTesting searchProducts tool...');
    const searchResults = await searchProducts({ query: 'phone', limit: 3 });
    console.log('Search results:', searchResults);
    
  } catch (error) {
    console.error('Error testing tools:', error);
  }
}

// Run the test
testTools();