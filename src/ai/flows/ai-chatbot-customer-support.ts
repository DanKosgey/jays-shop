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
import { mockTickets, mockProducts } from '@/lib/mock-data';
import type { RepairTicket, Product } from '@/lib/types';


// Tool to get repair ticket status
const getRepairTicketStatus = ai.defineTool(
    {
        name: 'getRepairTicketStatus',
        description: 'Get the status of a repair ticket.',
        inputSchema: z.object({ ticketNumber: z.string() }),
        outputSchema: z.custom<RepairTicket>(),
    },
    async ({ ticketNumber }) => {
        const ticket = mockTickets.find(t => t.ticketNumber.toLowerCase() === ticketNumber.toLowerCase());
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        return ticket;
    }
);

// Tool to get product information
const getProductInfo = ai.defineTool(
    {
        name: 'getProductInfo',
        description: 'Get information about a product, like its price or description.',
        inputSchema: z.object({ productName: z.string() }),
        outputSchema: z.custom<Product>(),
    },
    async ({ productName }) => {
        const product = mockProducts.find(p => p.name.toLowerCase().includes(productName.toLowerCase()));
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }
);

// Tool for shop policies
const getShopPolicy = ai.defineTool(
    {
        name: 'getShopPolicy',
        description: 'Get information about shop policies like warranty, returns, etc.',
        inputSchema: z.object({ topic: z.string().describe('The policy topic, e.g., "warranty", "return policy"') }),
        outputSchema: z.string(),
    },
    async ({ topic }) => {
        if (topic.toLowerCase().includes('warranty')) {
            return 'We offer a 90-day warranty on all repairs, covering defects in parts we replaced and the labor associated with the repair. This does not cover new accidental damage.';
        }
        if (topic.toLowerCase().includes('return')) {
            return 'For accessories, we accept returns within 14 days of purchase for a full refund, provided the item is in its original, unopened packaging. For second-hand items, all sales are final.';
        }
        return `I don't have information on that specific policy. Please contact the shop directly.`;
    }
);


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
    - Location: 123 Tech Street, Silicon Valley, CA 94000
    - Contact: (123) 456-7890
`;

const systemPrompt = `You are a helpful AI assistant for Jays phone repair shop. 

Your capabilities:
- Help customers track their repair status using the getRepairTicketStatus tool.
- Provide repair cost estimates and product prices using the getProductInfo tool.
- Answer questions about products and shop policies using the available tools.
- Explain shop policies using the getShopPolicy tool.
- Offer troubleshooting advice.

Current date: {{currentDate}}

${shopInformation}

Guidelines:
- Be friendly and professional.
- Use the available tools to answer user questions whenever possible.
- If a tool returns an error (e.g., ticket not found), inform the user politely.
- If you don't know something and there's no tool for it, suggest they contact the shop directly.
- For specific pricing, provide ranges based on the knowledge base or use tools.
- Always mention warranty information for repairs when relevant (use the getShopPolicy tool).
- If a customer seems frustrated, be empathetic.
- For urgent issues, suggest calling the shop.
- When providing monetary values, always use "Ksh" as the currency prefix.`;


const prompt = ai.definePrompt({
  name: 'aiChatbotPrompt',
  input: {schema: AIChatbotInputSchema},
  output: {schema: AIChatbotOutputSchema},
  prompt: systemPrompt + '\n\n{{{message}}}',
  tools: [getRepairTicketStatus, getProductInfo, getShopPolicy],
});

const aiChatbotFlow = ai.defineFlow(
  {
    name: 'aiChatbotFlow',
    inputSchema: AIChatbotInputSchema,
    outputSchema: AIChatbotOutputSchema,
  },
  async input => {
    const currentDate = new Date().toLocaleDateString();
    
    // If a ticket number is in the initial message, add it to the context for the AI
    const augmentedInput = { ...input };
    if (input.ticketNumber) {
        augmentedInput.message = `My ticket number is ${input.ticketNumber}. ${input.message}`;
    }

    const {output} = await prompt({...augmentedInput, currentDate});
    return {
      message: output!.message,
    };
  }
);
