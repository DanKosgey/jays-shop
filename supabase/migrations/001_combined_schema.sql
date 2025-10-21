-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE ticket_status AS ENUM (
  'received',
  'diagnosing',
  'awaiting_parts',
  'repairing',
  'quality_check',
  'ready',
  'completed',
  'cancelled'
);

CREATE TYPE ticket_priority AS ENUM (
  'low',
  'normal',
  'high',
  'urgent'
);

CREATE TYPE user_role AS ENUM (
  'user',
  'admin'
);

CREATE TYPE order_status AS ENUM (
  'pending',
  'shipped',
  'delivered',
  'cancelled'
);

-- Create tables
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'user',
  password_changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  category TEXT,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  stock_quantity INTEGER,
  image_url TEXT NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ticket_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  device_type TEXT NOT NULL,
  device_brand TEXT NOT NULL,
  device_model TEXT NOT NULL,
  issue_description TEXT NOT NULL,
  status ticket_status NOT NULL DEFAULT 'received',
  priority ticket_priority NOT NULL DEFAULT 'normal',
  estimated_cost NUMERIC,
  final_cost NUMERIC,
  estimated_completion TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  total_amount NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price_per_unit NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_profiles_email ON public.profiles(email);

CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_created_at ON public.products(created_at);
CREATE INDEX idx_products_user_id ON public.products(user_id);

CREATE INDEX idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX idx_tickets_status ON public.tickets(status);
CREATE INDEX idx_tickets_priority ON public.tickets(priority);
CREATE INDEX idx_tickets_created_at ON public.tickets(created_at);

CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);

CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);

CREATE INDEX idx_customers_user_id ON public.customers(user_id);
CREATE INDEX idx_customers_email ON public.customers(email);

-- Composite indexes for better query performance
CREATE INDEX idx_tickets_user_status ON public.tickets(user_id, status);
CREATE INDEX idx_orders_user_status ON public.orders(user_id, status);

-- Create functions
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER set_tickets_updated_at
BEFORE UPDATE ON public.tickets
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, password_changed_at)
  VALUES (NEW.id, NEW.email, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();