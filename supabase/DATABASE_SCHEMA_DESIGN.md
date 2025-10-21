# Supabase Database Schema Design

## 1. Enum Definitions

### 1.1 Ticket Status Enum
```sql
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
```

### 1.2 Ticket Priority Enum
```sql
CREATE TYPE ticket_priority AS ENUM (
  'low',
  'normal',
  'high',
  'urgent'
);
```

### 1.3 User Role Enum
```sql
CREATE TYPE user_role AS ENUM (
  'user',
  'admin'
);
```

### 1.4 Order Status Enum
```sql
CREATE TYPE order_status AS ENUM (
  'pending',
  'shipped',
  'delivered',
  'cancelled'
);
```

## 2. Table Definitions

### 2.1 Profiles Table (extends auth.users)
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.2 Products Table
```sql
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  category TEXT,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  stock_quantity INTEGER,
  image_url TEXT NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.3 Repair Tickets Table
```sql
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
```

### 2.4 Orders Table
```sql
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
```

### 2.5 Order Items Table (Junction Table)
```sql
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price_per_unit NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.6 Customers Table
```sql
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## 3. Junction Tables

### 3.1 Order Items (already defined above)
This junction table represents the many-to-many relationship between orders and products.

## 4. Indexes

### 4.1 Profiles Indexes
```sql
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_email ON public.profiles(email);
```

### 4.2 Products Indexes
```sql
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_created_at ON public.products(created_at);
```

### 4.3 Tickets Indexes
```sql
CREATE INDEX idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX idx_tickets_status ON public.tickets(status);
CREATE INDEX idx_tickets_priority ON public.tickets(priority);
CREATE INDEX idx_tickets_created_at ON public.tickets(created_at);
```

### 4.4 Orders Indexes
```sql
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
```

### 4.5 Order Items Indexes
```sql
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);
```

### 4.6 Customers Indexes
```sql
CREATE INDEX idx_customers_user_id ON public.customers(user_id);
CREATE INDEX idx_customers_email ON public.customers(email);
```

## 5. Triggers

### 5.1 Update updated_at timestamp for tickets
```sql
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_tickets_updated_at
BEFORE UPDATE ON public.tickets
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
```

### 5.2 Update updated_at timestamp for orders
```sql
CREATE TRIGGER set_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
```

### 5.3 Update updated_at timestamp for customers
```sql
CREATE TRIGGER set_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
```

## 6. Functions

### 6.1 Handle new user creation
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
```