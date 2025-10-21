-- Additional indexes for improved query performance based on application usage patterns

-- Index for ticket number searches (already exists but ensuring it's optimized)
-- This is the most common search pattern in the application
CREATE INDEX IF NOT EXISTS idx_tickets_ticket_number_pattern 
ON public.tickets (ticket_number text_pattern_ops);

-- Composite index for common admin queries filtering by status and priority
-- Used in admin dashboard for filtering tickets
CREATE INDEX IF NOT EXISTS idx_tickets_status_priority_created 
ON public.tickets (status, priority, created_at DESC);

-- Composite index for user-specific ticket queries with sorting
-- Used when users view their own tickets sorted by creation date
CREATE INDEX IF NOT EXISTS idx_tickets_user_id_created_status 
ON public.tickets (user_id, created_at DESC, status);

-- Index for device brand and model searches
-- Used in advanced filtering scenarios
CREATE INDEX IF NOT EXISTS idx_tickets_device_brand_model 
ON public.tickets (device_brand, device_model);

-- Index for customer name searches
-- Used in admin search functionality
CREATE INDEX IF NOT EXISTS idx_tickets_customer_name_pattern 
ON public.tickets (customer_name text_pattern_ops);

-- Partial index for active tickets (non-completed, non-cancelled)
-- Used to quickly fetch active tickets for dashboard metrics
CREATE INDEX IF NOT EXISTS idx_tickets_active_status 
ON public.tickets (created_at DESC) 
WHERE status NOT IN ('completed', 'cancelled');

-- Partial index for overdue tickets
-- Used in admin dashboard to highlight overdue tickets
-- Simplified to just filter by status, with time-based filtering handled in application
CREATE INDEX IF NOT EXISTS idx_tickets_overdue 
ON public.tickets (created_at) 
WHERE status NOT IN ('completed', 'cancelled', 'ready');

-- Index for priority-based sorting
-- Used in admin views to sort by priority
CREATE INDEX IF NOT EXISTS idx_tickets_priority_sort 
ON public.tickets (priority DESC, created_at DESC);

-- Composite index for updated_at queries with status
-- Used in synchronization and recent activity queries
CREATE INDEX IF NOT EXISTS idx_tickets_updated_status 
ON public.tickets (updated_at DESC, status);

-- Index for estimated completion date queries
-- Used in scheduling and planning views
CREATE INDEX IF NOT EXISTS idx_tickets_estimated_completion_sort 
ON public.tickets (estimated_completion) 
WHERE estimated_completion IS NOT NULL;

-- Additional indexes for products table

-- Composite index for category and featured products
-- Used in shop page to filter featured products by category
CREATE INDEX IF NOT EXISTS idx_products_category_featured 
ON public.products (category, is_featured DESC, created_at DESC);

-- Index for product name searches
-- Used in product search functionality
CREATE INDEX IF NOT EXISTS idx_products_name_pattern 
ON public.products (name text_pattern_ops);

-- Composite index for price range queries
-- Used in price filtering
CREATE INDEX IF NOT EXISTS idx_products_price_range 
ON public.products (price, created_at DESC);

-- Partial index for in-stock products
-- Used to quickly filter available products
CREATE INDEX IF NOT EXISTS idx_products_in_stock 
ON public.products (created_at DESC) 
WHERE stock_quantity > 0;

-- Additional indexes for orders table

-- Composite index for order status and date
-- Used in order management
CREATE INDEX IF NOT EXISTS idx_orders_status_date 
ON public.orders (status, created_at DESC);

-- Index for order number searches
-- Used in order tracking
CREATE INDEX IF NOT EXISTS idx_orders_order_number_pattern 
ON public.orders (order_number text_pattern_ops);

-- Composite index for customer orders
-- Used when viewing customer order history
CREATE INDEX IF NOT EXISTS idx_orders_customer_date 
ON public.orders (customer_name, created_at DESC);

-- Index for high-value orders
-- Used in analytics and reporting
CREATE INDEX IF NOT EXISTS idx_orders_high_value_sort 
ON public.orders (total_amount DESC, created_at DESC);

-- Additional indexes for customers table

-- Index for customer name searches
-- Used in customer management
CREATE INDEX IF NOT EXISTS idx_customers_name_pattern 
ON public.customers (name text_pattern_ops);

-- Composite index for customer creation date
-- Used in customer analytics
CREATE INDEX IF NOT EXISTS idx_customers_user_created 
ON public.customers (user_id, created_at DESC);

-- Comments for documentation
COMMENT ON INDEX idx_tickets_ticket_number_pattern IS 'Optimized index for ticket number prefix searches';
COMMENT ON INDEX idx_tickets_status_priority_created IS 'Index for admin dashboard filtering by status and priority';
COMMENT ON INDEX idx_tickets_user_id_created_status IS 'Index for user-specific ticket queries with sorting';
COMMENT ON INDEX idx_tickets_device_brand_model IS 'Index for device brand and model searches';
COMMENT ON INDEX idx_tickets_customer_name_pattern IS 'Index for customer name searches';
COMMENT ON INDEX idx_tickets_active_status IS 'Partial index for active tickets';
COMMENT ON INDEX idx_tickets_overdue IS 'Partial index for overdue tickets';
COMMENT ON INDEX idx_tickets_priority_sort IS 'Index for priority-based sorting';
COMMENT ON INDEX idx_tickets_updated_status IS 'Index for updated_at queries with status';
COMMENT ON INDEX idx_tickets_estimated_completion_sort IS 'Index for estimated completion date queries';
COMMENT ON INDEX idx_products_category_featured IS 'Index for category and featured products';
COMMENT ON INDEX idx_products_name_pattern IS 'Index for product name searches';
COMMENT ON INDEX idx_products_price_range IS 'Index for price range queries';
COMMENT ON INDEX idx_products_in_stock IS 'Partial index for in-stock products';
COMMENT ON INDEX idx_orders_status_date IS 'Index for order status and date';
COMMENT ON INDEX idx_orders_order_number_pattern IS 'Index for order number searches';
COMMENT ON INDEX idx_orders_customer_date IS 'Index for customer orders';
COMMENT ON INDEX idx_orders_high_value_sort IS 'Index for high-value orders';
COMMENT ON INDEX idx_customers_name_pattern IS 'Index for customer name searches';
COMMENT ON INDEX idx_customers_user_created IS 'Index for customer creation date';