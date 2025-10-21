-- Add SecondHandProduct table
CREATE TABLE public.second_hand_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  condition TEXT NOT NULL CHECK (condition IN ('Like New', 'Good', 'Fair')),
  seller_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_second_hand_products_product_id ON public.second_hand_products(product_id);
CREATE INDEX idx_second_hand_products_condition ON public.second_hand_products(condition);
CREATE INDEX idx_second_hand_products_created_at ON public.second_hand_products(created_at);

-- Create trigger for updated_at
CREATE TRIGGER set_second_hand_products_updated_at
BEFORE UPDATE ON public.second_hand_products
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Enable RLS
ALTER TABLE public.second_hand_products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view second hand products" ON public.second_hand_products
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create second hand products" ON public.second_hand_products
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own second hand products" ON public.second_hand_products
FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.products WHERE id = product_id));

CREATE POLICY "Users can delete their own second hand products" ON public.second_hand_products
FOR DELETE USING (auth.uid() = (SELECT user_id FROM public.products WHERE id = product_id));