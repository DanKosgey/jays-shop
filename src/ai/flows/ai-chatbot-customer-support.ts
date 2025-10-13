'use server';

/**
 * @fileOverview An AI chatbot for customer support.
 *
 * - aiChatbot - A function that handles the chatbot interactions.
 * - AIChatbotInput - The input type for the aiChatbot function.
 * - AIChatbotOutput - The return type for the aiChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIChatbotInputSchema = z.object({
  message: z.string().describe('The message from the user.'),
  ticketNumber: z.string().optional().describe('The ticket number, if the user is asking about a specific ticket.'),
  sessionId: z.string().describe('The session ID of the chat.'),
  userId: z.string().optional().describe('The user ID, if the user is logged in.'),
});
export type AIChatbotInput = z.infer<typeof AIChatbotInputSchema>;

const AIChatbotOutputSchema = z.object({
  message: z.string().describe('The response from the AI chatbot.'),
});
export type AIChatbotOutput = z.infer<typeof AIChatbotOutputSchema>;

export async function aiChatbot(input: AIChatbotInput): Promise<AIChatbotOutput> {
  return aiChatbotFlow(input);
}

const shopInformation = `
    Shop information:
    - Open Monday-Saturday, 9 AM - 7 PM
    - Location: [Shop Address]
    - Contact: [Phone Number]
`;

const systemPrompt = `You are a helpful AI assistant for a phone repair shop. 

Your capabilities:
- Help customers track their repair status
- Provide repair cost estimates
- Answer questions about products
- Explain shop policies
- Offer troubleshooting advice

Current date: {{currentDate}}

${shopInformation}

Guidelines:
- Be friendly and professional
- If you don't know something, suggest they contact the shop directly
- For specific pricing, provide ranges based on the knowledge base
- Always mention warranty information for repairs
- If customer seems frustrated, be empathetic
- For urgent issues, suggest calling the shop`;


const prompt = ai.definePrompt({
  name: 'aiChatbotPrompt',
  input: {schema: AIChatbotInputSchema},
  output: {schema: AIChatbotOutputSchema},
  prompt: systemPrompt + '\n\n{{{message}}}',
});

const aiChatbotFlow = ai.defineFlow(
  {
    name: 'aiChatbotFlow',
    inputSchema: AIChatbotInputSchema,
    outputSchema: AIChatbotOutputSchema,
  },
  async input => {
    const currentDate = new Date().toLocaleDateString();
    const {output} = await prompt({...input, currentDate});
    return {
      message: output!.message,
    };
  }
);
