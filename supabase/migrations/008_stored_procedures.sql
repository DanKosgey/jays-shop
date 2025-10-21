-- Stored procedures and functions

-- Function to generate ticket number
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'RPR-' || EXTRACT(YEAR FROM NOW()) || '-' || 
         LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'ORD-' || EXTRACT(YEAR FROM NOW()) || '-' || 
         LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to update product stock after order
CREATE OR REPLACE FUNCTION public.update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Decrease stock quantity when order is created
  UPDATE public.products 
  SET stock_quantity = stock_quantity - NEW.quantity
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update product stock
CREATE TRIGGER update_product_stock_trigger
AFTER INSERT ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.update_product_stock();

-- Function to calculate order total
CREATE OR REPLACE FUNCTION public.calculate_order_total(order_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  total NUMERIC := 0;
BEGIN
  SELECT SUM(price_per_unit * quantity)
  INTO total
  FROM public.order_items
  WHERE order_items.order_id = order_items.order_id;
  
  RETURN COALESCE(total, 0);
END;
$$ LANGUAGE plpgsql;

-- Function to get customer statistics
CREATE OR REPLACE FUNCTION public.get_customer_stats(customer_user_id UUID)
RETURNS TABLE(
  total_tickets BIGINT,
  total_orders BIGINT,
  total_spent_on_repairs NUMERIC,
  total_spent_on_products NUMERIC,
  total_lifetime_value NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT t.id) as total_tickets,
    COUNT(DISTINCT o.id) as total_orders,
    COALESCE(SUM(t.final_cost), 0) as total_spent_on_repairs,
    COALESCE(SUM(o.total_amount), 0) as total_spent_on_products,
    COALESCE(SUM(t.final_cost), 0) + COALESCE(SUM(o.total_amount), 0) as total_lifetime_value
  FROM public.profiles p
  LEFT JOIN public.tickets t ON p.id = t.user_id
  LEFT JOIN public.orders o ON p.id = o.user_id
  WHERE p.id = customer_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to search products
CREATE OR REPLACE FUNCTION public.search_products(search_term TEXT)
RETURNS TABLE(
  id UUID,
  name TEXT,
  category TEXT,
  description TEXT,
  price NUMERIC,
  stock_quantity INTEGER,
  image_url TEXT,
  is_featured BOOLEAN,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id, p.name, p.category, p.description, p.price, 
    p.stock_quantity, p.image_url, p.is_featured, p.created_at
  FROM public.products p
  WHERE 
    p.name ILIKE '%' || search_term || '%' OR
    p.description ILIKE '%' || search_term || '%' OR
    p.category ILIKE '%' || search_term || '%'
  ORDER BY 
    CASE 
      WHEN p.name ILIKE search_term || '%' THEN 1
      WHEN p.name ILIKE '%' || search_term || '%' THEN 2
      ELSE 3
    END,
    p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get dashboard metrics
CREATE OR REPLACE FUNCTION public.get_dashboard_metrics()
RETURNS TABLE(
  tickets_received BIGINT,
  tickets_diagnosing BIGINT,
  tickets_repairing BIGINT,
  tickets_ready BIGINT,
  tickets_completed BIGINT,
  orders_pending BIGINT,
  orders_shipped BIGINT,
  orders_delivered BIGINT,
  total_products BIGINT,
  out_of_stock_products BIGINT,
  total_customers BIGINT,
  total_admins BIGINT,
  total_repair_revenue NUMERIC,
  total_product_revenue NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.tickets WHERE status = 'received') as tickets_received,
    (SELECT COUNT(*) FROM public.tickets WHERE status = 'diagnosing') as tickets_diagnosing,
    (SELECT COUNT(*) FROM public.tickets WHERE status = 'repairing') as tickets_repairing,
    (SELECT COUNT(*) FROM public.tickets WHERE status = 'ready') as tickets_ready,
    (SELECT COUNT(*) FROM public.tickets WHERE status = 'completed') as tickets_completed,
    (SELECT COUNT(*) FROM public.orders WHERE status = 'pending') as orders_pending,
    (SELECT COUNT(*) FROM public.orders WHERE status = 'shipped') as orders_shipped,
    (SELECT COUNT(*) FROM public.orders WHERE status = 'delivered') as orders_delivered,
    (SELECT COUNT(*) FROM public.products) as total_products,
    (SELECT COUNT(*) FROM public.products WHERE stock_quantity = 0 OR stock_quantity IS NULL) as out_of_stock_products,
    (SELECT COUNT(*) FROM public.customers) as total_customers,
    (SELECT COUNT(*) FROM public.profiles WHERE role = 'admin') as total_admins,
    (SELECT COALESCE(SUM(final_cost), 0) FROM public.tickets WHERE status = 'completed') as total_repair_revenue,
    (SELECT COALESCE(SUM(total_amount), 0) FROM public.orders WHERE status = 'delivered') as total_product_revenue;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.generate_ticket_number() TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_order_number() TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_product_stock() TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_order_total(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_customer_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_products(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_dashboard_metrics() TO authenticated;