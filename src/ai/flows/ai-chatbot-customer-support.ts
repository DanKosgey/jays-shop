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
        inputSchema: z.object({ topic: z.string().describe('The policy topic, e.g., "warranty", "return policy", "privacy"') }),
        outputSchema: z.string(),
    },
    async ({ topic }) => {
        const lowerTopic = topic.toLowerCase();
        if (lowerTopic.includes('warranty')) {
            return 'We offer a 90-day warranty on all repairs, covering defects in parts we replaced and the labor associated with the repair. This does not cover new accidental damage.';
        }
        if (lowerTopic.includes('return')) {
            return 'For accessories, we accept returns within 14 days of purchase for a full refund, provided the item is in its original, unopened packaging. For second-hand items, all sales are final.';
        }
        if (lowerTopic.includes('privacy')) {
            return 'We take your privacy seriously. We only collect information necessary to process your repair or order. We do not sell your data to third parties. All customer data is stored securely.';
        }
        return `I don't have information on that specific policy. Please contact the shop directly.`;
    }
);

// Tool for repair cost estimates
const getRepairCostEstimate = ai.defineTool(
    {
        name: 'getRepairCostEstimate',
        description: 'Get an estimated cost for a common repair.',
        inputSchema: z.object({ 
            deviceModel: z.string().describe("e.g., iPhone 13, Samsung Galaxy S22"),
            repairType: z.string().describe("e.g., screen replacement, battery replacement, charging port repair") 
        }),
        outputSchema: z.string(),
    },
    async ({ deviceModel, repairType }) => {
        const model = deviceModel.toLowerCase();
        const type = repairType.toLowerCase();
        let cost = 'Please contact us for a more accurate quote, but a rough estimate for ';

        if(type.includes('screen')) {
            if(model.includes('iphone 13')) cost += 'an iPhone 13 screen replacement is Ksh18,000 - Ksh22,000.';
            else if(model.includes('s22')) cost += 'a Samsung S22 screen replacement is Ksh25,000 - Ksh30,000.';
            else cost += `${repairType} on a ${deviceModel} is typically between Ksh15,000 and Ksh35,000.`;
        } else if(type.includes('battery')) {
            if(model.includes('iphone 13')) cost += 'an iPhone 13 battery replacement is around Ksh9,500.';
            else if(model.includes('s22')) cost += 'a Samsung S22 battery replacement is around Ksh11,000.';
            else cost += `${repairType} on a ${deviceModel} is typically between Ksh8,000 and Ksh15,000.`;
        } else if(type.includes('port')) {
            cost += `a charging port repair on a ${deviceModel} is typically between Ksh7,000 and Ksh12,000.`;
        } else {
            return `I can't provide an estimate for that repair type. Common repairs include screen replacement, battery replacement, and charging port repair. For other issues, please visit us for a free diagnosis.`
        }
        return cost + ' This can vary based on the extent of the damage.';
    }
);

// Tool for basic troubleshooting
const troubleshootIssue = ai.defineTool(
    {
        name: 'troubleshootIssue',
        description: 'Provide basic troubleshooting steps for common phone issues.',
        inputSchema: z.object({ 
            issue: z.string().describe("The problem the user is facing, e.g., 'phone not charging', 'running slow'")
        }),
        outputSchema: z.string(),
    },
    async ({ issue }) => {
        const lowerIssue = issue.toLowerCase();
        if (lowerIssue.includes('charge')) {
            return "Troubleshooting tips for charging issues:\n1. Try a different charging cable and wall adapter.\n2. Clean the charging port gently with a soft, dry brush.\n3. Perform a forced restart on your device.\nIf these steps don't work, you may have a battery or charging port issue that needs repair.";
        }
        if (lowerIssue.includes('slow')) {
            return "If your phone is running slow:\n1. Restart your device.\n2. Close any apps running in the background.\n3. Check your storage and free up space if it's almost full.\n4. Update your phone's software to the latest version.\nThis could also be a sign of an aging battery.";
        }
        if (lowerIssue.includes('water') || lowerIssue.includes('wet')) {
            return "If your phone got wet:\n1. Turn it off immediately and do not charge it.\n2. Wipe it down with a soft cloth.\n3. Do NOT put it in rice. This is a myth and can cause more damage.\n4. Bring it to us as soon as possible for a professional water damage treatment to prevent corrosion.";
        }
        return `I can provide troubleshooting for charging issues, slowness, or water damage. For other problems, it's best to have our technicians take a look.`;
    }
);

// Tool for booking an appointment
const bookAppointment = ai.defineTool(
    {
        name: 'bookAppointment',
        description: 'Book an appointment for a repair diagnosis.',
        inputSchema: z.object({
            customerName: z.string(),
            date: z.string().describe('Date for the appointment, e.g., YYYY-MM-DD'),
            time: z.string().describe('Time for the appointment, e.g., HH:MM AM/PM')
        }),
        outputSchema: z.string(),
    },
    async ({ customerName, date, time }) => {
        // In a real app, this would save to a database.
        return `Appointment confirmed for ${customerName} on ${date} at ${time}. We look forward to seeing you at Jay's phone repair shop!`;
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

const systemPrompt = `You are a helpful AI assistant for Jay's phone repair shop. 

Your capabilities:
- Help customers track their repair status using the getRepairTicketStatus tool.
- Provide repair cost estimates for common issues like screen, battery, or port repairs using the getRepairCostEstimate tool.
- Provide information about products sold in the store using the getProductInfo tool.
- Answer questions about shop policies (warranty, returns, privacy) using the getShopPolicy tool.
- Offer basic troubleshooting advice for common problems (charging, slow performance, water damage) using the troubleshootIssue tool.
- Help users book an appointment for a diagnosis using the bookAppointment tool. You must ask for their name, desired date, and time.

Current date: {{currentDate}}

${shopInformation}

Guidelines:
- Be friendly, professional, and empathetic.
- Use the available tools to answer user questions whenever possible. Do not guess.
- If a tool returns an error (e.g., ticket not found), inform the user politely.
- If you don't know something and there's no tool for it, suggest they contact the shop directly for a precise diagnosis.
- For specific pricing not covered by the estimation tool, suggest visiting for a free quote.
- When providing monetary values, always use "Ksh" as the currency prefix.
- For urgent issues like water damage, advise them to turn off the phone and bring it in immediately.
- If a user asks to book an appointment, gather their name, the date, and the time before calling the bookAppointment tool.`;


const prompt = ai.definePrompt({
  name: 'aiChatbotPrompt',
  input: {schema: AIChatbotInputSchema},
  output: {schema: AIChatbotOutputSchema},
  prompt: systemPrompt + '\n\n{{{message}}}',
  tools: [getRepairTicketStatus, getProductInfo, getShopPolicy, getRepairCostEstimate, troubleshootIssue, bookAppointment],
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
