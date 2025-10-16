import { z } from 'zod';

export const TicketStatus = z.union([
  z.literal('received'),
  z.literal('diagnosing'),
  z.literal('awaiting_parts'),
  z.literal('repairing'),
  z.literal('quality_check'),
  z.literal('ready'),
  z.literal('completed'),
  z.literal('cancelled'),
]);

export const TicketSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  ticket_number: z.string(),
  customer_name: z.string(),
  device_type: z.string(),
  device_brand: z.string(),
  device_model: z.string(),
  issue_description: z.string(),
  status: TicketStatus,
  priority: z.union([z.literal('low'), z.literal('normal'), z.literal('high'), z.literal('urgent')]),
  estimated_cost: z.number().nullable(),
  final_cost: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  estimated_completion: z.string().nullable(),
});

export const TicketCreateSchema = z.object({
  customer_name: z.string().min(1),
  device_type: z.string().min(1),
  device_brand: z.string().min(1),
  device_model: z.string().min(1),
  issue_description: z.string().min(1),
  priority: z.union([z.literal('low'), z.literal('normal'), z.literal('high'), z.literal('urgent')]).default('normal'),
});

export const TicketUpdateSchema = z.object({
  status: TicketStatus.optional(),
  estimated_cost: z.number().nullable().optional(),
  final_cost: z.number().nullable().optional(),
  issue_description: z.string().optional(),
  priority: z.union([z.literal('low'), z.literal('normal'), z.literal('high'), z.literal('urgent')]).optional(),
});

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string().optional(),
  category: z.string().optional(),
  description: z.string(),
  price: z.number(),
  stock: z.number().int().nonnegative().optional(),
  stock_quantity: z.number().int().nonnegative().optional(),
  image_url: z.string().url(),
  created_at: z.string().optional(),
  is_featured: z.boolean().optional(),
});

export const ProductsResponseSchema = z.object({
  products: z.array(ProductSchema),
});

export const TicketsResponseSchema = z.object({
  tickets: z.array(TicketSchema),
});

export const ErrorSchema = z.object({
  error: z.string(),
});
