-- Add customer_id column to orders table to establish direct relationship
ALTER TABLE public.orders 
ADD COLUMN customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);

-- Update existing orders to link to customers where possible
-- This will match orders with customers based on user_id
UPDATE public.orders 
SET customer_id = c.id
FROM public.customers c
WHERE public.orders.user_id = c.user_id;

-- Update the customers API to use the new relationship
-- This will be handled in the application code