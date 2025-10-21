-- Additional indexes for optimization

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_tickets_status_priority;
DROP INDEX IF EXISTS idx_tickets_created_updated;
DROP INDEX IF EXISTS idx_products_category_featured;
DROP INDEX IF EXISTS idx_products_price_category;
DROP INDEX IF EXISTS idx_orders_status_date;
DROP INDEX IF EXISTS idx_orders_user_date;
DROP INDEX IF EXISTS idx_order_items_product_order;
DROP INDEX IF EXISTS idx_customers_email_name;
DROP INDEX IF EXISTS idx_customers_user_name;
DROP INDEX IF EXISTS idx_tickets_active;
DROP INDEX IF EXISTS idx_orders_active;
DROP INDEX IF EXISTS idx_products_name_pattern;
DROP INDEX IF EXISTS idx_customers_name_pattern;
DROP INDEX IF EXISTS idx_tickets_customer_pattern;

-- Composite indexes for tickets
CREATE INDEX idx_tickets_status_priority ON public.tickets(status, priority);
CREATE INDEX idx_tickets_created_updated ON public.tickets(created_at, updated_at);

-- Composite indexes for products
CREATE INDEX idx_products_category_featured ON public.products(category, is_featured);
CREATE INDEX idx_products_price_category ON public.products(price, category);

-- Composite indexes for orders
CREATE INDEX idx_orders_status_date ON public.orders(status, created_at);
CREATE INDEX idx_orders_user_date ON public.orders(user_id, created_at);

-- Composite indexes for order_items
CREATE INDEX idx_order_items_product_order ON public.order_items(product_id, order_id);

-- Composite indexes for customers
CREATE INDEX idx_customers_email_name ON public.customers(email, name);
CREATE INDEX idx_customers_user_name ON public.customers(user_id, name);

-- Partial indexes for active records
CREATE INDEX idx_tickets_active ON public.tickets(created_at) 
WHERE status NOT IN ('completed', 'cancelled');

CREATE INDEX idx_orders_active ON public.orders(created_at) 
WHERE status NOT IN ('delivered', 'cancelled');

-- Index for text pattern matching
CREATE INDEX idx_products_name_pattern ON public.products(name text_pattern_ops);
CREATE INDEX idx_customers_name_pattern ON public.customers(name text_pattern_ops);
CREATE INDEX idx_tickets_customer_pattern ON public.tickets(customer_name text_pattern_ops);