-- Implement proper data archiving strategy for soft deleted records

-- Add deleted_at column to all tables for soft delete functionality
ALTER TABLE public.profiles ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE public.products ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE public.tickets ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE public.order_items ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE public.customers ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE public.second_hand_products ADD COLUMN deleted_at TIMESTAMPTZ;

-- Create indexes for deleted_at columns
CREATE INDEX idx_profiles_deleted_at ON public.profiles(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX idx_products_deleted_at ON public.products(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX idx_tickets_deleted_at ON public.tickets(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX idx_orders_deleted_at ON public.orders(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX idx_order_items_deleted_at ON public.order_items(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX idx_customers_deleted_at ON public.customers(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX idx_second_hand_products_deleted_at ON public.second_hand_products(deleted_at) WHERE deleted_at IS NOT NULL;

-- Create archive tables for long-term data retention
CREATE TABLE public.profiles_archive (
  id UUID,
  email TEXT,
  role user_role,
  created_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.products_archive (
  id UUID,
  user_id UUID,
  name TEXT,
  slug TEXT,
  category TEXT,
  description TEXT,
  price NUMERIC,
  stock_quantity INTEGER,
  image_url TEXT,
  is_featured BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.tickets_archive (
  id UUID,
  user_id UUID,
  ticket_number TEXT,
  customer_name TEXT,
  device_type TEXT,
  device_brand TEXT,
  device_model TEXT,
  issue_description TEXT,
  status ticket_status,
  priority ticket_priority,
  estimated_cost NUMERIC,
  final_cost NUMERIC,
  estimated_completion TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.orders_archive (
  id UUID,
  user_id UUID,
  order_number TEXT,
  customer_name TEXT,
  status order_status,
  total_amount NUMERIC,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.order_items_archive (
  id UUID,
  order_id UUID,
  product_id UUID,
  quantity INTEGER,
  price_per_unit NUMERIC,
  created_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.customers_archive (
  id UUID,
  user_id UUID,
  name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.second_hand_products_archive (
  id UUID,
  product_id UUID,
  condition TEXT,
  seller_name TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for archive tables
CREATE INDEX idx_profiles_archive_deleted_at ON public.profiles_archive(deleted_at);
CREATE INDEX idx_products_archive_deleted_at ON public.products_archive(deleted_at);
CREATE INDEX idx_tickets_archive_deleted_at ON public.tickets_archive(deleted_at);
CREATE INDEX idx_orders_archive_deleted_at ON public.orders_archive(deleted_at);
CREATE INDEX idx_order_items_archive_deleted_at ON public.order_items_archive(deleted_at);
CREATE INDEX idx_customers_archive_deleted_at ON public.customers_archive(deleted_at);
CREATE INDEX idx_second_hand_products_archive_deleted_at ON public.second_hand_products_archive(deleted_at);

-- Create function to archive deleted records
CREATE OR REPLACE FUNCTION public.archive_deleted_record()
RETURNS TRIGGER AS $$
BEGIN
  -- Archive the deleted record based on the table name
  IF TG_TABLE_NAME = 'profiles' THEN
    INSERT INTO public.profiles_archive SELECT OLD.*, NOW();
  ELSIF TG_TABLE_NAME = 'products' THEN
    INSERT INTO public.products_archive SELECT OLD.*, NOW();
  ELSIF TG_TABLE_NAME = 'tickets' THEN
    INSERT INTO public.tickets_archive SELECT OLD.*, NOW();
  ELSIF TG_TABLE_NAME = 'orders' THEN
    INSERT INTO public.orders_archive SELECT OLD.*, NOW();
  ELSIF TG_TABLE_NAME = 'order_items' THEN
    INSERT INTO public.order_items_archive SELECT OLD.*, NOW();
  ELSIF TG_TABLE_NAME = 'customers' THEN
    INSERT INTO public.customers_archive SELECT OLD.*, NOW();
  ELSIF TG_TABLE_NAME = 'second_hand_products' THEN
    INSERT INTO public.second_hand_products_archive SELECT OLD.*, NOW();
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for archiving deleted records
CREATE TRIGGER archive_deleted_profiles
BEFORE DELETE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.archive_deleted_record();

CREATE TRIGGER archive_deleted_products
BEFORE DELETE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.archive_deleted_record();

CREATE TRIGGER archive_deleted_tickets
BEFORE DELETE ON public.tickets
FOR EACH ROW
EXECUTE FUNCTION public.archive_deleted_record();

CREATE TRIGGER archive_deleted_orders
BEFORE DELETE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.archive_deleted_record();

CREATE TRIGGER archive_deleted_order_items
BEFORE DELETE ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.archive_deleted_record();

CREATE TRIGGER archive_deleted_customers
BEFORE DELETE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.archive_deleted_record();

CREATE TRIGGER archive_deleted_second_hand_products
BEFORE DELETE ON public.second_hand_products
FOR EACH ROW
EXECUTE FUNCTION public.archive_deleted_record();

-- Update RLS policies to exclude soft deleted records
DROP POLICY IF EXISTS "Users can view own tickets" ON public.tickets;
CREATE POLICY "Users can view own tickets" ON public.tickets
FOR SELECT USING (user_id = auth.uid() AND deleted_at IS NULL OR EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.role = 'admin' AND p.deleted_at IS NULL
));

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders
FOR SELECT USING (user_id = auth.uid() AND deleted_at IS NULL OR EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.role = 'admin' AND p.deleted_at IS NULL
));

DROP POLICY IF EXISTS "Users can view own customer record" ON public.customers;
CREATE POLICY "Users can view own customer record" ON public.customers
FOR SELECT USING (user_id = auth.uid() AND deleted_at IS NULL OR EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.role = 'admin' AND p.deleted_at IS NULL
));

DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products
FOR SELECT USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "Users can view second hand products" ON public.second_hand_products;
CREATE POLICY "Users can view second hand products" ON public.second_hand_products
FOR SELECT USING (deleted_at IS NULL);