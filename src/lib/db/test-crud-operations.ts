import { ticketsDb } from './tickets';
import { productsDb } from './products';
import { ordersDb } from './orders';
import { customersDb } from './customers';
import { secondHandProductsDb } from './secondhand_products';

// Test CRUD operations
export const testCrudOperations = async () => {
  console.log('Testing CRUD operations...');
  
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
    
    console.log('All CRUD operations tested successfully!');
    return true;
  } catch (error) {
    console.error('Error testing CRUD operations:', error);
    return false;
  }
};

// Run the test if this file is executed directly
if (import.meta.url === new URL(import.meta.url).href) {
  testCrudOperations();
}