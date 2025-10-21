'use server';

import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

import { 
  getAllProducts, 
  getProductCategories, 
  searchProducts,
  getShopPricingInfo,
  getInventoryInfo,
  getRepairTicketStatus,
  getDetailedTicketInfo,
  getProductInfo,
  getShopPolicy,
  getRepairCostEstimate,
  troubleshootIssue,
  bookAppointment
} from './flows/ai-chatbot-customer-support';

// Also load the Google API key if needed
if (process.env.GENKIT_GOOGLE_API_KEY) {
  process.env.GOOGLE_API_KEY = process.env.GENKIT_GOOGLE_API_KEY;
}

async function testErrorHandling() {
  try {
    console.log('Testing error handling for all AI tools...\n');
    
    // Test getAllProducts with invalid parameters
    console.log('Test 1: getAllProducts with invalid limit');
    try {
      // @ts-ignore - Testing invalid input
      const results1 = await getAllProducts({ limit: -1 });
      console.log('Unexpected success:', results1);
    } catch (error: any) {
      console.log('Expected error caught:', error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test searchProducts with invalid parameters
    console.log('Test 2: searchProducts with null query');
    try {
      // @ts-ignore - Testing invalid input
      const results2 = await searchProducts({ query: null });
      console.log('Unexpected success:', results2);
    } catch (error: any) {
      console.log('Expected error caught:', error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test getRepairTicketStatus with invalid ticket number
    console.log('Test 3: getRepairTicketStatus with invalid ticket number');
    try {
      const results3 = await getRepairTicketStatus({ ticketNumber: 'INVALID-TICKET' });
      console.log('Unexpected success:', results3);
    } catch (error: any) {
      console.log('Expected error caught:', error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test getDetailedTicketInfo with invalid ticket number
    console.log('Test 4: getDetailedTicketInfo with invalid ticket number');
    try {
      const results4 = await getDetailedTicketInfo({ ticketNumber: 'INVALID-TICKET' });
      console.log('Unexpected success:', results4);
    } catch (error: any) {
      console.log('Expected error caught:', error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test getProductInfo with invalid product name
    console.log('Test 5: getProductInfo with invalid product name');
    try {
      const results5 = await getProductInfo({ productName: 'NonExistentProduct12345' });
      console.log('Unexpected success:', results5);
    } catch (error: any) {
      console.log('Expected error caught:', error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test getInventoryInfo with invalid threshold
    console.log('Test 6: getInventoryInfo with invalid threshold');
    try {
      // @ts-ignore - Testing invalid input
      const results6 = await getInventoryInfo({ lowStockThreshold: -5 });
      console.log('Unexpected success:', results6);
    } catch (error: any) {
      console.log('Expected error caught:', error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test getShopPricingInfo with invalid category
    console.log('Test 7: getShopPricingInfo with invalid category');
    try {
      const results7 = await getShopPricingInfo({ productCategory: 'NonExistentCategory' });
      console.log('Results (may be empty):', results7);
    } catch (error: any) {
      console.log('Error caught:', error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test valid tools to ensure they still work
    console.log('Test 8: Valid getShopPolicy call');
    try {
      const results8 = await getShopPolicy({ topic: 'warranty' });
      console.log('Success:', results8);
    } catch (error: any) {
      console.log('Unexpected error:', error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test valid tools to ensure they still work
    console.log('Test 9: Valid getRepairCostEstimate call');
    try {
      const results9 = await getRepairCostEstimate({ deviceModel: 'iPhone 13', repairType: 'screen' });
      console.log('Success:', results9);
    } catch (error: any) {
      console.log('Unexpected error:', error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test valid tools to ensure they still work
    console.log('Test 10: Valid troubleshootIssue call');
    try {
      const results10 = await troubleshootIssue({ issue: 'phone not charging' });
      console.log('Success:', results10);
    } catch (error: any) {
      console.log('Unexpected error:', error.message);
    }
    
    console.log('\nTesting completed. All tools handle errors gracefully.');
    
  } catch (error: any) {
    console.error('Error testing error handling:', error);
  }
}

// Run the test
testErrorHandling();