-- Manual SQL migration to add customer-order relationship
-- Run this in the Supabase SQL editor if the automated migration doesn't work

-- Step 1: Add customer_id column to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;

-- Step 2: Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);

-- Step 3: Update existing orders to link to customers where possible
-- This will match orders with customers based on user_id
UPDATE public.orders 
SET customer_id = c.id
FROM public.customers c
WHERE public.orders.user_id = c.user_id AND public.orders.customer_id IS NULL;

-- Step 4: Verify the migration worked
-- This query should return orders with customer information
SELECT o.id, o.order_number, o.customer_name, c.name as customer_name_from_table
FROM public.orders o
LEFT JOIN public.customers c ON o.customer_id = c.id
LIMIT 10;