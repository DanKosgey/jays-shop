// Utility functions for consistent data transformation between API and client components

import type { RepairTicket, Product } from '@/lib/types';

// Transform ticket data from API format to client format
export function transformTicketData(apiTicket: any): RepairTicket {
  return {
    id: apiTicket.id,
    ticketNumber: apiTicket.ticket_number,
    customerId: apiTicket.user_id,
    customerName: apiTicket.customer_name,
    deviceType: apiTicket.device_type,
    deviceBrand: apiTicket.device_brand,
    deviceModel: apiTicket.device_model,
    issueDescription: apiTicket.issue_description,
    status: apiTicket.status,
    priority: apiTicket.priority,
    estimatedCost: apiTicket.estimated_cost === null ? null : Number(apiTicket.estimated_cost),
    finalCost: apiTicket.final_cost === null ? null : Number(apiTicket.final_cost),
    createdAt: apiTicket.created_at,
    updatedAt: apiTicket.updated_at,
    estimatedCompletion: apiTicket.estimated_completion,
  };
}

// Transform product data from API format to client format
export function transformProductData(apiProduct: any): Product {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    slug: apiProduct.slug ?? '',
    category: apiProduct.category ?? '',
    description: apiProduct.description,
    price: Number(apiProduct.price),
    stockQuantity: apiProduct.stock_quantity ?? apiProduct.stock ?? 0,
    imageUrl: apiProduct.image_url,
    imageHint: 'product image',
    isFeatured: apiProduct.is_featured ?? false,
  };
}

// Transform array of tickets
export function transformTicketsData(apiTickets: any[]): RepairTicket[] {
  return apiTickets.map(transformTicketData);
}

// Transform array of products
export function transformProductsData(apiProducts: any[]): Product[] {
  return apiProducts.map(transformProductData);
}

// Validate ticket data
export function validateTicketData(ticket: any): ticket is RepairTicket {
  return (
    typeof ticket.id === 'string' &&
    typeof ticket.ticketNumber === 'string' &&
    typeof ticket.customerId === 'string' &&
    typeof ticket.customerName === 'string' &&
    typeof ticket.deviceType === 'string' &&
    typeof ticket.deviceBrand === 'string' &&
    typeof ticket.deviceModel === 'string' &&
    typeof ticket.issueDescription === 'string' &&
    ['received', 'diagnosing', 'awaiting_parts', 'repairing', 'quality_check', 'ready', 'completed', 'cancelled'].includes(ticket.status) &&
    ['low', 'normal', 'high', 'urgent'].includes(ticket.priority) &&
    (ticket.estimatedCost === null || typeof ticket.estimatedCost === 'number') &&
    (ticket.finalCost === null || typeof ticket.finalCost === 'number') &&
    typeof ticket.createdAt === 'string' &&
    typeof ticket.updatedAt === 'string' &&
    (ticket.estimatedCompletion === null || typeof ticket.estimatedCompletion === 'string')
  );
}

// Validate product data
export function validateProductData(product: any): product is Product {
  return (
    typeof product.id === 'string' &&
    typeof product.name === 'string' &&
    typeof product.slug === 'string' &&
    typeof product.category === 'string' &&
    typeof product.description === 'string' &&
    typeof product.price === 'number' &&
    typeof product.stockQuantity === 'number' &&
    typeof product.imageUrl === 'string' &&
    typeof product.imageHint === 'string' &&
    typeof product.isFeatured === 'boolean'
  );
}