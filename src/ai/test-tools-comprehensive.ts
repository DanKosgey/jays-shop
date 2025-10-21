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

async function testTools() {
  try {
    console.log('Environment variables loaded:');
    console.log('- GENKIT_GOOGLE_API_KEY:', process.env.GENKIT_GOOGLE_API_KEY ? 'YES' : 'NO');
    console.log('- GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? 'YES' : 'NO');
    console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    
    console.log('\nTesting getAllProducts tool...');
    try {
      const products = await getAllProducts({ limit: 5 });
      console.log('Products:', products);
    } catch (error: any) {
      console.log('getAllProducts error (expected if no products):', error.message);
    }
    
    console.log('\nTesting getProductCategories tool...');
    try {
      const categories = await getProductCategories({});
      console.log('Categories:', categories);
    } catch (error: any) {
      console.log('getProductCategories error (expected if no products):', error.message);
    }
    
    console.log('\nTesting searchProducts tool...');
    try {
      const searchResults = await searchProducts({ query: 'phone', limit: 3 });
      console.log('Search results:', searchResults);
    } catch (error: any) {
      console.log('searchProducts error (expected if no products):', error.message);
    }
    
    console.log('\nTesting getShopPricingInfo tool...');
    try {
      const pricingInfo = await getShopPricingInfo({});
      console.log('Pricing info:', JSON.stringify(pricingInfo, null, 2));
    } catch (error: any) {
      console.log('getShopPricingInfo error:', error.message);
    }
    
    console.log('\nTesting getInventoryInfo tool...');
    try {
      const inventoryInfo = await getInventoryInfo({ lowStockThreshold: 5 });
      console.log('Inventory info:', JSON.stringify(inventoryInfo, null, 2));
    } catch (error: any) {
      console.log('getInventoryInfo error (expected if no products):', error.message);
    }
    
    console.log('\nTesting getRepairTicketStatus tool...');
    try {
      // This will likely fail since we don't have a valid ticket number
      const ticketStatus = await getRepairTicketStatus({ ticketNumber: 'TICKET-001' });
      console.log('Ticket status:', ticketStatus);
    } catch (error: any) {
      console.log('getRepairTicketStatus error (expected if no tickets):', error.message);
    }
    
    console.log('\nTesting getDetailedTicketInfo tool...');
    try {
      // This will likely fail since we don't have a valid ticket number
      const detailedTicketInfo = await getDetailedTicketInfo({ ticketNumber: 'TICKET-001' });
      console.log('Detailed ticket info:', JSON.stringify(detailedTicketInfo, null, 2));
    } catch (error: any) {
      console.log('getDetailedTicketInfo error (expected if no tickets):', error.message);
    }
    
    console.log('\nTesting other tools...');
    try {
      const productInfo = await getProductInfo({ productName: 'iPhone' });
      console.log('Product info:', productInfo);
    } catch (error: any) {
      console.log('getProductInfo error (expected if no products):', error.message);
    }
    
    try {
      const shopPolicy = await getShopPolicy({ topic: 'warranty' });
      console.log('Shop policy:', shopPolicy);
    } catch (error: any) {
      console.log('getShopPolicy error:', error.message);
    }
    
    try {
      const repairCost = await getRepairCostEstimate({ deviceModel: 'iPhone 13', repairType: 'screen' });
      console.log('Repair cost estimate:', repairCost);
    } catch (error: any) {
      console.log('getRepairCostEstimate error:', error.message);
    }
    
    try {
      const troubleshooting = await troubleshootIssue({ issue: 'phone not charging' });
      console.log('Troubleshooting:', troubleshooting);
    } catch (error: any) {
      console.log('troubleshootIssue error:', error.message);
    }
    
    try {
      const appointment = await bookAppointment({ customerName: 'John Doe', date: '2023-10-25', time: '10:00 AM' });
      console.log('Appointment booking:', appointment);
    } catch (error: any) {
      console.log('bookAppointment error:', error.message);
    }
    
  } catch (error: any) {
    console.error('Error testing tools:', error);
  }
}

// Run the test
testTools();