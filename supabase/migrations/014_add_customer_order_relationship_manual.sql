-- Final migration: Add customer-order relationship
-- This establishes a direct link between orders and customers tables

-- Step 1: Add customer_id column to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;

-- Step 2: Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);

-- Step 3: Update existing orders to link to customers
-- Match orders with customers based on user_id
UPDATE public.orders 
SET customer_id = c.id
FROM public.customers c
WHERE public.orders.user_id = c.user_id 
  AND public.orders.customer_id IS NULL;

-- Step 4: Verify the migration (optional check)
DO $$
BEGIN
  RAISE NOTICE 'Migration completed. Checking results...';
  RAISE NOTICE 'Orders with customer links: %', 
    (SELECT COUNT(*) FROM public.orders WHERE customer_id IS NOT NULL);
  RAISE NOTICE 'Orders without customer links: %', 
    (SELECT COUNT(*) FROM public.orders WHERE customer_id IS NULL);
END $$;