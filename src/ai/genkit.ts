import {genkit} from 'genkit';
// Uncomment the following line if you want to use OpenAI instead
// import {openai} from '@genkit-ai/openai';

// For Google AI (requires API key)
import {googleAI} from '@genkit-ai/google-genai';

// Load environment variables
import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

// Choose one of the following configurations:

// Option 1: Google AI (requires GENKIT_GOOGLE_API_KEY in env)
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GENKIT_GOOGLE_API_KEY || process.env.GOOGLE_API_KEY,
    })
  ],
  model: 'googleai/gemini-2.5-flash',
});

// Option 2: OpenAI (requires OPENAI_API_KEY in env)
// export const ai = genkit({
//   plugins: [openai()],
//   model: 'openai/gpt-4o-mini',
// });