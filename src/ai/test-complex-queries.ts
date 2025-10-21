'use server';

import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

import { aiChatbot } from './flows/ai-chatbot-customer-support';

// Also load the Google API key if needed
if (process.env.GENKIT_GOOGLE_API_KEY) {
  process.env.GOOGLE_API_KEY = process.env.GENKIT_GOOGLE_API_KEY;
}

async function testComplexQueries() {
  try {
    console.log('Testing AI chatbot with complex queries...\n');
    
    // Test 1: Complex query about products and pricing
    console.log('Test 1: Complex query about products and pricing');
    try {
      const response1 = await aiChatbot({
        message: "What products do you have available and what are their prices? Also, do you have any phones in stock?",
        sessionId: "test-session-1",
        userId: "test-user-1"
      });
      console.log('Response:', response1.message);
    } catch (error: any) {
      console.log('Error:', error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 2: Complex query about repairs and policies
    console.log('Test 2: Complex query about repairs and policies');
    try {
      const response2 = await aiChatbot({
        message: "I dropped my iPhone 13 and the screen is cracked. How much would it cost to repair? Also, what is your warranty policy?",
        sessionId: "test-session-2",
        userId: "test-user-2"
      });
      console.log('Response:', response2.message);
    } catch (error: any) {
      console.log('Error:', error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 3: Complex query about inventory and specific product search
    console.log('Test 3: Complex query about inventory and specific product search');
    try {
      const response3 = await aiChatbot({
        message: "Do you have any Samsung phones in stock? What is your current inventory situation for smartphones?",
        sessionId: "test-session-3",
        userId: "test-user-3"
      });
      console.log('Response:', response3.message);
    } catch (error: any) {
      console.log('Error:', error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 4: Complex query about troubleshooting and booking
    console.log('Test 4: Complex query about troubleshooting and booking');
    try {
      const response4 = await aiChatbot({
        message: "My phone is running very slow. What can I do to fix it? Can I book an appointment for a diagnosis?",
        sessionId: "test-session-4",
        userId: "test-user-4"
      });
      console.log('Response:', response4.message);
    } catch (error: any) {
      console.log('Error:', error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 5: Complex query combining multiple services
    console.log('Test 5: Complex query combining multiple services');
    try {
      const response5 = await aiChatbot({
        message: "I'm looking for a new phone. What categories of products do you sell? Do you have any deals on batteries or screen protectors?",
        sessionId: "test-session-5",
        userId: "test-user-5"
      });
      console.log('Response:', response5.message);
    } catch (error: any) {
      console.log('Error:', error.message);
    }
    
    console.log('\nTesting completed.');
    
  } catch (error: any) {
    console.error('Error testing complex queries:', error);
  }
}

// Run the test
testComplexQueries();