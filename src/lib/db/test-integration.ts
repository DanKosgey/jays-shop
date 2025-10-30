import { ticketsDb } from './tickets';
import { productsDb } from './products';
import { ordersDb } from './orders';
import { customersDb } from './customers';
import { secondHandProductsDb } from './secondhand_products';
import { dashboardDb } from './dashboard';

// Test integration with real Supabase data
export const testIntegration = async () => {
  console.log('Testing integration with real Supabase data...');
  
  try {
    // Test tickets
    console.log('Testing tickets...');
    const tickets = await ticketsDb.getAll();
    console.log(`Found ${tickets.length} tickets`);
    
    // Test products
    console.log('Testing products...');
    const products = await productsDb.getAll();
    console.log(`Found ${products.length} products`);
    
    // Test orders
    console.log('Testing orders...');
    const orders = await ordersDb.getAll();
    console.log(`Found ${orders.length} orders`);
    
    // Test customers
    console.log('Testing customers...');
    const customers = await customersDb.getAll();
    console.log(`Found ${customers.length} customers`);
    
    // Test secondhand products
    console.log('Testing secondhand products...');
    const secondhandProducts = await secondHandProductsDb.getAll();
    console.log(`Found ${secondhandProducts.length} secondhand products`);
    
    // Test dashboard data
    console.log('Testing dashboard data...');
    const adminMetrics = await dashboardDb.getAdminMetrics();
    console.log('Admin metrics:', adminMetrics);
    
    console.log('All integration tests passed successfully!');
    return true;
  } catch (error) {
    console.error('Error testing integration:', error);
    return false;
  }
};

// Run the test if this file is executed directly
if (import.meta.url === new URL(import.meta.url).href) {
  testIntegration();
}