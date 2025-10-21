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
import { getSupabaseAdminClient } from '@/server/supabase/admin';
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
        try {
            const supabase = getSupabaseAdminClient();
            const { data, error } = await supabase
                .from('tickets')
                .select('*')
                .eq('ticket_number', ticketNumber)
                .limit(1)
                .maybeSingle();
            if (error) throw new Error(error.message);
            if (!data) throw new Error('Ticket not found');
            const t = data as any;
            const ticket: RepairTicket = {
                id: t.id,
                ticketNumber: t.ticket_number,
                customerId: t.user_id,
                customerName: t.customer_name,
                deviceType: t.device_type,
                deviceBrand: t.device_brand,
                deviceModel: t.device_model,
                issueDescription: t.issue_description,
                status: t.status,
                priority: t.priority,
                estimatedCost: t.estimated_cost === null ? null : Number(t.estimated_cost),
                finalCost: t.final_cost === null ? null : Number(t.final_cost),
                createdAt: t.created_at,
                updatedAt: t.updated_at,
                estimatedCompletion: t.estimated_completion,
            };
            return ticket;
        } catch (error: any) {
            console.error("getRepairTicketStatus error:", error);
            throw new Error(`Failed to get ticket status: ${error?.message ?? 'Unknown error'}`);
        }
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
        const supabase = getSupabaseAdminClient();
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .ilike('name', `%${productName}%`)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
        if (error) throw new Error(error.message);
        if (!data) throw new Error('Product not found');
        const p = data as any;
        const product: Product = {
            id: p.id,
            name: p.name,
            slug: p.slug ?? p.id,
            category: p.category ?? 'General',
            description: p.description,
            price: Number(p.price),
            stockQuantity: p.stock_quantity ?? p.stock ?? 0,
            imageUrl: p.image_url,
            imageHint: 'product image',
            isFeatured: !!p.is_featured,
        };
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

// Tool to get all available products
const getAllProducts = ai.defineTool(
    {
        name: 'getAllProducts',
        description: 'Get a list of all available products in the store with their prices and stock information.',
        inputSchema: z.object({ 
            limit: z.number().optional().describe('Maximum number of products to return, default is 10'),
            category: z.string().optional().describe('Filter products by category')
        }),
        outputSchema: z.array(z.custom<Product>()),
    },
    async ({ limit = 10, category }) => {
        try {
            const supabase = getSupabaseAdminClient();
            
            let query = supabase
                .from('products')
                .select('*')
                .limit(limit);
                
            if (category) {
                query = query.eq('category', category);
            }
            
            const { data, error } = await query;
            
            if (error) throw new Error(error.message);
            
            const products: Product[] = data.map((p: any) => ({
                id: p.id,
                name: p.name,
                slug: p.slug ?? p.id,
                category: p.category ?? 'General',
                description: p.description,
                price: Number(p.price),
                stockQuantity: p.stock_quantity ?? p.stock ?? 0,
                imageUrl: p.image_url,
                imageHint: 'product image',
                isFeatured: !!p.is_featured,
            }));
            
            return products;
        } catch (error: any) {
            console.error("getAllProducts error:", error);
            throw new Error(`Failed to get products: ${error?.message ?? 'Unknown error'}`);
        }
    }
);

// Tool to get product categories
const getProductCategories = ai.defineTool(
    {
        name: 'getProductCategories',
        description: 'Get all available product categories in the store.',
        inputSchema: z.object({}),
        outputSchema: z.array(z.string()),
    },
    async () => {
        try {
            const supabase = getSupabaseAdminClient();
            const { data, error } = await supabase
                .from('products')
                .select('category')
                .neq('category', null);
                
            if (error) throw new Error(error.message);
            
            // Get unique categories
            const categories = [...new Set(data.map((p: any) => p.category))];
            return categories;
        } catch (error: any) {
            console.error("getProductCategories error:", error);
            throw new Error(`Failed to get product categories: ${error?.message ?? 'Unknown error'}`);
        }
    }
);

// Tool to get shop pricing information
const getShopPricingInfo = ai.defineTool(
    {
        name: 'getShopPricingInfo',
        description: 'Get comprehensive pricing information for all products and services.',
        inputSchema: z.object({ 
            productCategory: z.string().optional().describe('Filter by product category'),
            serviceName: z.string().optional().describe('Filter by service name (e.g., screen replacement, battery replacement)')
        }),
        outputSchema: z.object({
            products: z.array(z.custom<Product>()),
            services: z.array(z.object({
                name: z.string(),
                priceRange: z.string(),
                description: z.string()
            }))
        }),
    },
    async ({ productCategory, serviceName }) => {
        try {
            const supabase = getSupabaseAdminClient();
            
            // Get products
            let productQuery = supabase.from('products').select('*');
            if (productCategory) {
                productQuery = productQuery.eq('category', productCategory);
            }
            
            const { data: productsData, error: productsError } = await productQuery;
            
            if (productsError) throw new Error(`Products error: ${productsError.message}`);
            
            const products: Product[] = productsData.map((p: any) => ({
                id: p.id,
                name: p.name,
                slug: p.slug ?? p.id,
                category: p.category ?? 'General',
                description: p.description,
                price: Number(p.price),
                stockQuantity: p.stock_quantity ?? p.stock ?? 0,
                imageUrl: p.image_url,
                imageHint: 'product image',
                isFeatured: !!p.is_featured,
            }));
            
            // Define common services and their pricing
            const allServices = [
                {
                    name: "Screen Replacement",
                    priceRange: "Ksh15,000 - Ksh35,000",
                    description: "Complete screen replacement for various phone models"
                },
                {
                    name: "Battery Replacement",
                    priceRange: "Ksh8,000 - Ksh15,000",
                    description: "Battery replacement to restore your phone's battery life"
                },
                {
                    name: "Charging Port Repair",
                    priceRange: "Ksh7,000 - Ksh12,000",
                    description: "Repair or replacement of charging port"
                },
                {
                    name: "Water Damage Treatment",
                    priceRange: "Ksh5,000 - Ksh20,000",
                    description: "Professional water damage treatment to prevent corrosion"
                }
            ];
            
            // Filter services if needed
            const services = serviceName 
                ? allServices.filter(service => service.name.toLowerCase().includes(serviceName.toLowerCase()))
                : allServices;
            
            return { products, services };
        } catch (error: any) {
            console.error("getShopPricingInfo error:", error);
            throw new Error(`Failed to get shop pricing info: ${error?.message ?? 'Unknown error'}`);
        }
    }
);

// Tool to get detailed ticket information
const getDetailedTicketInfo = ai.defineTool(
    {
        name: 'getDetailedTicketInfo',
        description: 'Get detailed information about a repair ticket including customer details, device information, and status history.',
        inputSchema: z.object({ ticketNumber: z.string() }),
        outputSchema: z.object({
            ticket: z.custom<RepairTicket>(),
            statusHistory: z.array(z.object({
                status: z.string(),
                timestamp: z.string(),
                notes: z.string().optional()
            }))
        }),
    },
    async ({ ticketNumber }) => {
        try {
            const supabase = getSupabaseAdminClient();
            
            // Get ticket information
            const { data: ticketData, error: ticketError } = await supabase
                .from('tickets')
                .select('*')
                .eq('ticket_number', ticketNumber)
                .limit(1)
                .maybeSingle();
                
            if (ticketError) throw new Error(`Ticket error: ${ticketError.message}`);
            if (!ticketData) throw new Error('Ticket not found');
            
            const ticket: RepairTicket = {
                id: ticketData.id,
                ticketNumber: ticketData.ticket_number,
                customerId: ticketData.user_id,
                customerName: ticketData.customer_name,
                deviceType: ticketData.device_type,
                deviceBrand: ticketData.device_brand,
                deviceModel: ticketData.device_model,
                issueDescription: ticketData.issue_description,
                status: ticketData.status,
                priority: ticketData.priority,
                estimatedCost: ticketData.estimated_cost === null ? null : Number(ticketData.estimated_cost),
                finalCost: ticketData.final_cost === null ? null : Number(ticketData.final_cost),
                createdAt: ticketData.created_at,
                updatedAt: ticketData.updated_at,
                estimatedCompletion: ticketData.estimated_completion,
            };
            
            // For status history, we would typically have a separate table or log
            // For now, we'll create a simple history based on the current status
            const statusHistory = [
                {
                    status: "Received",
                    timestamp: ticketData.created_at,
                    notes: "Ticket created"
                },
                {
                    status: ticketData.status,
                    timestamp: ticketData.updated_at,
                    notes: "Current status"
                }
            ];
            
            return { ticket, statusHistory };
        } catch (error: any) {
            console.error("getDetailedTicketInfo error:", error);
            throw new Error(`Failed to get detailed ticket info: ${error?.message ?? 'Unknown error'}`);
        }
    }
);

// Tool to get inventory information
const getInventoryInfo = ai.defineTool(
    {
        name: 'getInventoryInfo',
        description: 'Get comprehensive inventory information including stock levels and availability.',
        inputSchema: z.object({ 
            lowStockThreshold: z.number().optional().describe('Threshold for low stock items, default is 5'),
            category: z.string().optional().describe('Filter by product category')
        }),
        outputSchema: z.object({
            totalProducts: z.number(),
            lowStockItems: z.array(z.custom<Product>()),
            outOfStockItems: z.array(z.custom<Product>()),
            categories: z.record(z.string(), z.number()) // category name -> count
        }),
    },
    async ({ lowStockThreshold = 5, category }) => {
        try {
            const supabase = getSupabaseAdminClient();
            
            // Get all products
            let productQuery = supabase.from('products').select('*');
            if (category) {
                productQuery = productQuery.eq('category', category);
            }
            
            const { data: productsData, error: productsError } = await productQuery;
            
            if (productsError) throw new Error(`Products error: ${productsError.message}`);
            
            const products: Product[] = productsData.map((p: any) => ({
                id: p.id,
                name: p.name,
                slug: p.slug ?? p.id,
                category: p.category ?? 'General',
                description: p.description,
                price: Number(p.price),
                stockQuantity: p.stock_quantity ?? p.stock ?? 0,
                imageUrl: p.image_url,
                imageHint: 'product image',
                isFeatured: !!p.is_featured,
            }));
            
            // Calculate inventory statistics
            const totalProducts = products.length;
            const lowStockItems = products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= lowStockThreshold);
            const outOfStockItems = products.filter(p => p.stockQuantity === 0);
            
            // Group by category
            const categories: Record<string, number> = {};
            products.forEach(p => {
                const cat = p.category || 'Uncategorized';
                categories[cat] = (categories[cat] || 0) + 1;
            });
            
            return { totalProducts, lowStockItems, outOfStockItems, categories };
        } catch (error: any) {
            console.error("getInventoryInfo error:", error);
            throw new Error(`Failed to get inventory info: ${error?.message ?? 'Unknown error'}`);
        }
    }
);

// Tool to search for products
const searchProducts = ai.defineTool(
    {
        name: 'searchProducts',
        description: 'Search for products by name, description, or category.',
        inputSchema: z.object({ 
            query: z.string().describe('Search query string'),
            limit: z.number().optional().describe('Maximum number of results, default is 10')
        }),
        outputSchema: z.array(z.custom<Product>()),
    },
    async ({ query, limit = 10 }) => {
        try {
            const supabase = getSupabaseAdminClient();
            
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
                .limit(limit);
                
            if (error) throw new Error(error.message);
            
            const products: Product[] = data.map((p: any) => ({
                id: p.id,
                name: p.name,
                slug: p.slug ?? p.id,
                category: p.category ?? 'General',
                description: p.description,
                price: Number(p.price),
                stockQuantity: p.stock_quantity ?? p.stock ?? 0,
                imageUrl: p.image_url,
                imageHint: 'product image',
                isFeatured: !!p.is_featured,
            }));
            
            return products;
        } catch (error: any) {
            console.error("searchProducts error:", error);
            throw new Error(`Failed to search products: ${error?.message ?? 'Unknown error'}`);
        }
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

// Export the tools so they can be imported and tested
export { 
  getRepairTicketStatus, 
  getDetailedTicketInfo,
  getProductInfo, 
  searchProducts,
  getAllProducts,
  getProductCategories,
  getShopPricingInfo,
  getInventoryInfo,
  getShopPolicy, 
  getRepairCostEstimate, 
  troubleshootIssue, 
  bookAppointment 
};

const shopInformation = `
    Shop information:
    - Open Monday-Saturday, 9 AM - 7 PM
    - Location: 123 Tech Street, Silicon Valley, CA 94000
    - Contact: (123) 456-7890
`;

const systemPrompt = `You are a helpful AI assistant for Jay's phone repair shop. 

Your capabilities:
- Help customers track their repair status using the getRepairTicketStatus tool.
- Provide detailed repair ticket information using the getDetailedTicketInfo tool.
- Provide repair cost estimates for common issues like screen, battery, or port repairs using the getRepairCostEstimate tool.
- Provide information about products sold in the store using the getProductInfo tool.
- Search for products using the searchProducts tool.
- Get a list of all available products using the getAllProducts tool.
- Get product categories using the getProductCategories tool.
- Get comprehensive shop pricing information using the getShopPricingInfo tool.
- Get inventory information using the getInventoryInfo tool.
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
- If a user asks to book an appointment, gather their name, the date, and the time before calling the bookAppointment tool.
- When discussing products, provide relevant details like price, availability, and description.
- When discussing inventory, mention if items are low in stock or out of stock.
- When discussing repair services, provide estimated timeframes and pricing information.`;


const prompt = ai.definePrompt({
  name: 'aiChatbotPrompt',
  input: {schema: AIChatbotInputSchema},
  output: {schema: AIChatbotOutputSchema},
  prompt: systemPrompt,
  tools: [
    getRepairTicketStatus, 
    getDetailedTicketInfo,
    getProductInfo, 
    searchProducts,
    getAllProducts,
    getProductCategories,
    getShopPricingInfo,
    getInventoryInfo,
    getShopPolicy, 
    getRepairCostEstimate, 
    troubleshootIssue, 
    bookAppointment
  ],
});

const aiChatbotFlow = ai.defineFlow(
  {
    name: 'aiChatbotFlow',
    inputSchema: AIChatbotInputSchema,
    outputSchema: AIChatbotOutputSchema,
  },
  async input => {
    try {
      const currentDate = new Date().toLocaleDateString();
      
      // If a ticket number is in the initial message, add it to the context for the AI
      const augmentedInput = { ...input };
      if (input.ticketNumber) {
          augmentedInput.message = `My ticket number is ${input.ticketNumber}. ${input.message}`;
      }

      const {output} = await prompt({...augmentedInput});
      return {
        message: output!.message,
      };
    } catch (error: any) {
      console.error("AI chatbot flow error:", error);
      // Handle specific AI service errors
      if (error?.message?.includes("API key")) {
        throw new Error("AI service is not properly configured. Please contact the administrator.");
      }
      if (error?.message?.includes("timeout") || error?.message?.includes("network")) {
        throw new Error("AI service is temporarily unavailable. Please try again later.");
      }
      throw error;
    }
  }
);
