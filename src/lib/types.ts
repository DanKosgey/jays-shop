export type RepairTicket = {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  deviceType: string;
  deviceBrand: string;
  deviceModel: string;
  issueDescription: string;
  status: 'received' | 'diagnosing' | 'awaiting_parts' | 'repairing' | 'quality_check' | 'ready' | 'completed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  estimatedCost: number | null;
  finalCost: number | null;
  createdAt: string;
  updatedAt: string;
  estimatedCompletion: string | null;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  imageHint: string;
  isFeatured: boolean;
};

export type SecondHandProduct = Product & {
    condition: 'Like New' | 'Good' | 'Fair';
    sellerName: string;
};

export type User = {
  name: string;
  email: string;
  avatar: string;
};
