-- Fix archive table structure and trigger function for proper deletion

-- Drop existing triggers
DROP TRIGGER IF EXISTS archive_deleted_profiles ON public.profiles;
DROP TRIGGER IF EXISTS archive_deleted_products ON public.products;
DROP TRIGGER IF EXISTS archive_deleted_tickets ON public.tickets;
DROP TRIGGER IF EXISTS archive_deleted_orders ON public.orders;
DROP TRIGGER IF EXISTS archive_deleted_order_items ON public.order_items;
DROP TRIGGER IF EXISTS archive_deleted_customers ON public.customers;
DROP TRIGGER IF EXISTS archive_deleted_second_hand_products ON public.second_hand_products;

-- Drop existing archive tables
DROP TABLE IF EXISTS public.profiles_archive;
DROP TABLE IF EXISTS public.products_archive;
DROP TABLE IF EXISTS public.tickets_archive;
DROP TABLE IF EXISTS public.orders_archive;
DROP TABLE IF EXISTS public.order_items_archive;
DROP TABLE IF EXISTS public.customers_archive;
DROP TABLE IF EXISTS public.second_hand_products_archive;

-- Recreate archive tables with correct structure
CREATE TABLE public.profiles_archive (
  id UUID,
  email TEXT,
  role user_role,
  password_changed_at TIMESTAMPTZ,
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
  seller_id UUID,
  condition TEXT,
  seller_name TEXT,
  seller_phone TEXT,
  seller_email TEXT,
  price NUMERIC(10, 2),
  description TEXT,
  is_available BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recreate the archive function with proper column mapping
CREATE OR REPLACE FUNCTION public.archive_deleted_record()
RETURNS TRIGGER AS $$
BEGIN
  -- Archive the deleted record based on the table name
  IF TG_TABLE_NAME = 'profiles' THEN
    INSERT INTO public.profiles_archive (id, email, role, password_changed_at, created_at, deleted_at, archived_at)
    VALUES (OLD.id, OLD.email, OLD.role, OLD.password_changed_at, OLD.created_at, OLD.deleted_at, NOW());
  ELSIF TG_TABLE_NAME = 'products' THEN
    INSERT INTO public.products_archive (id, user_id, name, slug, category, description, price, stock_quantity, image_url, is_featured, created_at, updated_at, deleted_at, archived_at)
    VALUES (OLD.id, OLD.user_id, OLD.name, OLD.slug, OLD.category, OLD.description, OLD.price, OLD.stock_quantity, OLD.image_url, OLD.is_featured, OLD.created_at, OLD.updated_at, OLD.deleted_at, NOW());
  ELSIF TG_TABLE_NAME = 'tickets' THEN
    INSERT INTO public.tickets_archive (id, user_id, ticket_number, customer_name, device_type, device_brand, device_model, issue_description, status, priority, estimated_cost, final_cost, estimated_completion, created_at, updated_at, deleted_at, archived_at)
    VALUES (OLD.id, OLD.user_id, OLD.ticket_number, OLD.customer_name, OLD.device_type, OLD.device_brand, OLD.device_model, OLD.issue_description, OLD.status, OLD.priority, OLD.estimated_cost, OLD.final_cost, OLD.estimated_completion, OLD.created_at, OLD.updated_at, OLD.deleted_at, NOW());
  ELSIF TG_TABLE_NAME = 'orders' THEN
    INSERT INTO public.orders_archive (id, user_id, order_number, customer_name, status, total_amount, created_at, updated_at, deleted_at, archived_at)
    VALUES (OLD.id, OLD.user_id, OLD.order_number, OLD.customer_name, OLD.status, OLD.total_amount, OLD.created_at, OLD.updated_at, OLD.deleted_at, NOW());
  ELSIF TG_TABLE_NAME = 'order_items' THEN
    INSERT INTO public.order_items_archive (id, order_id, product_id, quantity, price_per_unit, created_at, deleted_at, archived_at)
    VALUES (OLD.id, OLD.order_id, OLD.product_id, OLD.quantity, OLD.price_per_unit, OLD.created_at, OLD.deleted_at, NOW());
  ELSIF TG_TABLE_NAME = 'customers' THEN
    INSERT INTO public.customers_archive (id, user_id, name, email, phone, created_at, updated_at, deleted_at, archived_at)
    VALUES (OLD.id, OLD.user_id, OLD.name, OLD.email, OLD.phone, OLD.created_at, OLD.updated_at, OLD.deleted_at, NOW());
  ELSIF TG_TABLE_NAME = 'second_hand_products' THEN
    INSERT INTO public.second_hand_products_archive (id, product_id, seller_id, condition, seller_name, seller_phone, seller_email, price, description, is_available, created_at, updated_at, deleted_at, archived_at)
    VALUES (OLD.id, OLD.product_id, OLD.seller_id, OLD.condition, OLD.seller_name, OLD.seller_phone, OLD.seller_email, OLD.price, OLD.description, OLD.is_available, OLD.created_at, OLD.updated_at, OLD.deleted_at, NOW());
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Recreate triggers for archiving deleted records
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

-- Recreate indexes for archive tables
CREATE INDEX idx_profiles_archive_deleted_at ON public.profiles_archive(deleted_at);
CREATE INDEX idx_products_archive_deleted_at ON public.products_archive(deleted_at);
CREATE INDEX idx_tickets_archive_deleted_at ON public.tickets_archive(deleted_at);
CREATE INDEX idx_orders_archive_deleted_at ON public.orders_archive(deleted_at);
CREATE INDEX idx_order_items_archive_deleted_at ON public.order_items_archive(deleted_at);
CREATE INDEX idx_customers_archive_deleted_at ON public.customers_archive(deleted_at);
CREATE INDEX idx_second_hand_products_archive_deleted_at ON public.second_hand_products_archive(deleted_at);