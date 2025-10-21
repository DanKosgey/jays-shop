-- Migration: Add SecondHandProduct table
-- Description: Manages second-hand product listings

-- Step 1: Create second_hand_products table
CREATE TABLE IF NOT EXISTS public.second_hand_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  condition TEXT NOT NULL CHECK (condition IN ('Like New', 'Good', 'Fair')),
  seller_name TEXT NOT NULL,
  seller_phone TEXT,
  seller_email TEXT,
  price NUMERIC(10, 2),
  description TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 2: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_second_hand_products_product_id 
  ON public.second_hand_products(product_id);
CREATE INDEX IF NOT EXISTS idx_second_hand_products_seller_id 
  ON public.second_hand_products(seller_id);
CREATE INDEX IF NOT EXISTS idx_second_hand_products_condition 
  ON public.second_hand_products(condition);
CREATE INDEX IF NOT EXISTS idx_second_hand_products_is_available 
  ON public.second_hand_products(is_available);
CREATE INDEX IF NOT EXISTS idx_second_hand_products_created_at 
  ON public.second_hand_products(created_at);

-- Step 3: Create trigger for updated_at timestamp
DROP TRIGGER IF EXISTS set_second_hand_products_updated_at ON public.second_hand_products;
CREATE TRIGGER set_second_hand_products_updated_at
BEFORE UPDATE ON public.second_hand_products
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Step 4: Enable Row Level Security
ALTER TABLE public.second_hand_products ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view second hand products" ON public.second_hand_products;
DROP POLICY IF EXISTS "Authenticated users can create second hand products" ON public.second_hand_products;
DROP POLICY IF EXISTS "Users can update their own second hand products" ON public.second_hand_products;
DROP POLICY IF EXISTS "Users can delete their own second hand products" ON public.second_hand_products;
DROP POLICY IF EXISTS "Admins can manage all second hand products" ON public.second_hand_products;

-- Step 6: Create RLS policies
-- Everyone can view available second-hand products
CREATE POLICY "Users can view second hand products" 
ON public.second_hand_products
FOR SELECT 
USING (is_available = true OR auth.uid() = seller_id);

-- Authenticated users can create second-hand listings
CREATE POLICY "Authenticated users can create second hand products" 
ON public.second_hand_products
FOR INSERT 
WITH CHECK (
  auth.role() = 'authenticated' 
  AND auth.uid() = seller_id
);

-- Users can update their own second-hand listings
CREATE POLICY "Users can update their own second hand products" 
ON public.second_hand_products
FOR UPDATE 
USING (auth.uid() = seller_id);

-- Users can delete their own second-hand listings
CREATE POLICY "Users can delete their own second hand products" 
ON public.second_hand_products
FOR DELETE 
USING (auth.uid() = seller_id);

-- Admins can manage all second-hand products
CREATE POLICY "Admins can manage all second hand products" 
ON public.second_hand_products
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Step 7: Add helpful comments
COMMENT ON TABLE public.second_hand_products IS 'Stores second-hand product listings from users';
COMMENT ON COLUMN public.second_hand_products.seller_id IS 'References the user who created the listing';
COMMENT ON COLUMN public.second_hand_products.condition IS 'Product condition: Like New, Good, or Fair';
COMMENT ON COLUMN public.second_hand_products.is_available IS 'Whether the product is still available for sale';

-- Step 8: Grant permissions
GRANT SELECT ON public.second_hand_products TO authenticated;
GRANT INSERT ON public.second_hand_products TO authenticated;
GRANT UPDATE ON public.second_hand_products TO authenticated;
GRANT DELETE ON public.second_hand_products TO authenticated;