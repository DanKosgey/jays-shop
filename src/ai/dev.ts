import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

// Debug: Log the API key to verify it's loaded
console.log('GENKIT_GOOGLE_API_KEY loaded:', process.env.GENKIT_GOOGLE_API_KEY ? 'YES' : 'NO');
if (process.env.GENKIT_GOOGLE_API_KEY) {
  console.log('API Key starts with:', process.env.GENKIT_GOOGLE_API_KEY.substring(0, 10) + '...');
}

// Set the correct environment variable name for the Google AI plugin
if (process.env.GENKIT_GOOGLE_API_KEY) {
  process.env.GOOGLE_API_KEY = process.env.GENKIT_GOOGLE_API_KEY;
  console.log('Set GOOGLE_API_KEY from GENKIT_GOOGLE_API_KEY');
}

// Import the AI instance which will load the environment variables
import '@/ai/flows/ai-chatbot-customer-support.ts';