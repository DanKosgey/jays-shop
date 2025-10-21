-- Migration: Add comprehensive indexes for performance optimization
-- Description: Creates indexes on frequently queried columns across all tables

-- Additional indexes for profiles table
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);

-- Additional indexes for products table
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug) WHERE slug IS NOT NULL;
-- Note: products table doesn't have updated_at column, skipping

-- Additional indexes for tickets table
CREATE INDEX IF NOT EXISTS idx_tickets_ticket_number ON public.tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_tickets_device_type ON public.tickets(device_type);
CREATE INDEX IF NOT EXISTS idx_tickets_device_brand ON public.tickets(device_brand);
CREATE INDEX IF NOT EXISTS idx_tickets_updated_at ON public.tickets(updated_at);
CREATE INDEX IF NOT EXISTS idx_tickets_estimated_completion ON public.tickets(estimated_completion) 
  WHERE estimated_completion IS NOT NULL;

-- Additional indexes for orders table
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_name ON public.orders(customer_name);
CREATE INDEX IF NOT EXISTS idx_orders_total_amount ON public.orders(total_amount);
CREATE INDEX IF NOT EXISTS idx_orders_updated_at ON public.orders(updated_at);

-- Additional indexes for order_items table
CREATE INDEX IF NOT EXISTS idx_order_items_quantity ON public.order_items(quantity);
CREATE INDEX IF NOT EXISTS idx_order_items_price_per_unit ON public.order_items(price_per_unit);

-- Additional indexes for customers table
CREATE INDEX IF NOT EXISTS idx_customers_name ON public.customers(name);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON public.customers(created_at);
CREATE INDEX IF NOT EXISTS idx_customers_updated_at ON public.customers(updated_at);
CREATE INDEX IF NOT EXISTS idx_customers_user_created ON public.customers(user_id, created_at);

-- Additional indexes for second_hand_products table (if table exists)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'second_hand_products'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_second_hand_products_seller_name 
      ON public.second_hand_products(seller_name);
    CREATE INDEX IF NOT EXISTS idx_second_hand_products_updated_at 
      ON public.second_hand_products(updated_at);
    CREATE INDEX IF NOT EXISTS idx_second_hand_products_product_condition 
      ON public.second_hand_products(product_id, condition);
  END IF;
END $$;

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_tickets_user_created_status 
  ON public.tickets(user_id, created_at, status);
CREATE INDEX IF NOT EXISTS idx_products_category_price 
  ON public.products(category, price);
CREATE INDEX IF NOT EXISTS idx_orders_user_created_status 
  ON public.orders(user_id, created_at, status);

-- Partial indexes for filtering
CREATE INDEX IF NOT EXISTS idx_products_featured_category 
  ON public.products(category, is_featured) 
  WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_tickets_high_priority 
  ON public.tickets(priority) 
  WHERE priority IN ('high', 'urgent');
CREATE INDEX IF NOT EXISTS idx_orders_high_value 
  ON public.orders(total_amount) 
  WHERE total_amount > 1000;

-- Add helpful comments
COMMENT ON INDEX idx_products_category_price IS 'Optimizes product listings filtered by category and sorted by price';
COMMENT ON INDEX idx_tickets_user_created_status IS 'Optimizes user ticket history queries';
COMMENT ON INDEX idx_orders_user_created_status IS 'Optimizes user order history queries';
COMMENT ON INDEX idx_products_featured_category IS 'Partial index for featured products by category';
COMMENT ON INDEX idx_tickets_high_priority IS 'Partial index for high-priority tickets';
COMMENT ON INDEX idx_orders_high_value IS 'Partial index for high-value orders';