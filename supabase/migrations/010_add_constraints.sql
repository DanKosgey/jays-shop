-- Add constraints and validation checks for all tables

-- Add constraints to profiles table
ALTER TABLE public.profiles 
ADD CONSTRAINT chk_profiles_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add constraints to products table
ALTER TABLE public.products 
ADD CONSTRAINT chk_products_price_positive CHECK (price > 0),
ADD CONSTRAINT chk_products_stock_quantity_non_negative CHECK (stock_quantity >= 0),
ADD CONSTRAINT chk_products_name_length CHECK (LENGTH(name) > 0),
ADD CONSTRAINT chk_products_description_length CHECK (LENGTH(description) > 0),
ADD CONSTRAINT chk_products_image_url_format CHECK (image_url ~* '^https?://');

-- Add constraints to tickets table
ALTER TABLE public.tickets
ADD CONSTRAINT chk_tickets_customer_name_length CHECK (LENGTH(customer_name) > 0),
ADD CONSTRAINT chk_tickets_device_type_length CHECK (LENGTH(device_type) > 0),
ADD CONSTRAINT chk_tickets_device_brand_length CHECK (LENGTH(device_brand) > 0),
ADD CONSTRAINT chk_tickets_device_model_length CHECK (LENGTH(device_model) > 0),
ADD CONSTRAINT chk_tickets_issue_description_length CHECK (LENGTH(issue_description) > 0),
ADD CONSTRAINT chk_tickets_ticket_number_format CHECK (ticket_number ~* '^TICKET-[0-9]{4,}$'),
ADD CONSTRAINT chk_tickets_estimated_cost_positive CHECK (estimated_cost > 0),
ADD CONSTRAINT chk_tickets_final_cost_positive CHECK (final_cost > 0);

-- Add constraints to orders table
ALTER TABLE public.orders
ADD CONSTRAINT chk_orders_customer_name_length CHECK (LENGTH(customer_name) > 0),
ADD CONSTRAINT chk_orders_order_number_format CHECK (order_number ~* '^ORDER-[0-9]{4,}$'),
ADD CONSTRAINT chk_orders_total_amount_positive CHECK (total_amount > 0);

-- Add constraints to order_items table
ALTER TABLE public.order_items
ADD CONSTRAINT chk_order_items_quantity_positive CHECK (quantity > 0),
ADD CONSTRAINT chk_order_items_price_per_unit_positive CHECK (price_per_unit > 0);

-- Add constraints to customers table
ALTER TABLE public.customers
ADD CONSTRAINT chk_customers_name_length CHECK (LENGTH(name) > 0),
ADD CONSTRAINT chk_customers_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
ADD CONSTRAINT chk_customers_phone_format CHECK (phone ~* '^[+]?[0-9\s\-\(\)]{7,15}$');

-- Add constraints to second_hand_products table
ALTER TABLE public.second_hand_products
ADD CONSTRAINT chk_second_hand_products_seller_name_length CHECK (LENGTH(seller_name) > 0);