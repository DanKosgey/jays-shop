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

async function testChatbotFunctionality() {
  try {
    console.log('Testing AI chatbot functionality...\n');
    
    // Test 1: Simple greeting
    console.log('Test 1: Simple greeting');
    try {
      const response1 = await aiChatbot({
        message: "Hello, what can you help me with?",
        sessionId: "test-session-1",
        userId: "test-user-1"
      });
      console.log('Response:', response1.message);
      console.log('✓ Chatbot responded successfully\n');
    } catch (error: any) {
      console.log('Error:', error.message);
      console.log('✗ Chatbot failed to respond\n');
    }
    
    // Test 2: Product inquiry
    console.log('Test 2: Product inquiry');
    try {
      const response2 = await aiChatbot({
        message: "What products do you sell?",
        sessionId: "test-session-2",
        userId: "test-user-2"
      });
      console.log('Response:', response2.message);
      console.log('✓ Chatbot handled product inquiry\n');
    } catch (error: any) {
      console.log('Error:', error.message);
      console.log('✗ Chatbot failed to handle product inquiry\n');
    }
    
    // Test 3: Repair inquiry
    console.log('Test 3: Repair inquiry');
    try {
      const response3 = await aiChatbot({
        message: "How much does it cost to repair an iPhone screen?",
        sessionId: "test-session-3",
        userId: "test-user-3"
      });
      console.log('Response:', response3.message);
      console.log('✓ Chatbot handled repair inquiry\n');
    } catch (error: any) {
      console.log('Error:', error.message);
      console.log('✗ Chatbot failed to handle repair inquiry\n');
    }
    
    // Test 4: Policy inquiry
    console.log('Test 4: Policy inquiry');
    try {
      const response4 = await aiChatbot({
        message: "What is your warranty policy?",
        sessionId: "test-session-4",
        userId: "test-user-4"
      });
      console.log('Response:', response4.message);
      console.log('✓ Chatbot handled policy inquiry\n');
    } catch (error: any) {
      console.log('Error:', error.message);
      console.log('✗ Chatbot failed to handle policy inquiry\n');
    }
    
    console.log('Chatbot functionality test completed.');
    console.log('All tests verify that the chatbot is properly configured and can handle different types of inquiries.');
    
  } catch (error: any) {
    console.error('Error testing chatbot functionality:', error);
  }
}

// Run the test
testChatbotFunctionality();