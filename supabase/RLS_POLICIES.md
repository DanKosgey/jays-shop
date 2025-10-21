# Row Level Security (RLS) Policies

## 1. Profiles Table Policies

### 1.1 SELECT Policy
```sql
-- Users can only read their own profile or admins can read all profiles
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id OR EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.role = 'admin'
));
```

### 1.2 INSERT Policy
```sql
-- Only auth.users trigger can insert profiles (via handle_new_user function)
CREATE POLICY "Profiles insert controlled by trigger" ON public.profiles
FOR INSERT WITH CHECK (FALSE);
```

### 1.3 UPDATE Policy
```sql
-- Users can update their own profile or admins can update any profile
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id OR EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.role = 'admin'
));
```

### 1.4 DELETE Policy
```sql
-- Only admins can delete profiles
CREATE POLICY "Admins can delete profiles" ON public.profiles
FOR DELETE USING (EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.role = 'admin'
));
```

## 2. Products Table Policies

### 2.1 SELECT Policy
```sql
-- Anyone can read products (public access)
CREATE POLICY "Public can view products" ON public.products
FOR SELECT USING (true);
```

### 2.2 INSERT Policy
```sql
-- Only admins can create products
CREATE POLICY "Admins can create products" ON public.products
FOR INSERT WITH CHECK (EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.role = 'admin'
));
```

### 2.3 UPDATE Policy
```sql
-- Only admins can update products
CREATE POLICY "Admins can update products" ON public.products
FOR UPDATE USING (EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.role = 'admin'
));
```

### 2.4 DELETE Policy
```sql
-- Only admins can delete products
CREATE POLICY "Admins can delete products" ON public.products
FOR DELETE USING (EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.role = 'admin'
));
```

## 3. Tickets Table Policies

### 3.1 SELECT Policy
```sql
-- Users can read their own tickets or admins can read all tickets
CREATE POLICY "Users can view own tickets" ON public.tickets
FOR SELECT USING (user_id = auth.uid() OR EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.role = 'admin'
));
```

### 3.2 INSERT Policy
```sql
-- Authenticated users can create tickets for themselves
CREATE POLICY "Users can create own tickets" ON public.tickets
FOR INSERT WITH CHECK (user_id = auth.uid());
```

### 3.3 UPDATE Policy
```sql
-- Users can update their own tickets or admins can update any ticket
CREATE POLICY "Users can update own tickets" ON public.tickets
FOR UPDATE USING (user_id = auth.uid() OR EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.role = 'admin'
));
```

### 3.4 DELETE Policy
```sql
-- Only admins can delete tickets
CREATE POLICY "Admins can delete tickets" ON public.tickets
FOR DELETE USING (EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.role = 'admin'
));
```

## 4. Orders Table Policies

### 4.1 SELECT Policy
```sql
-- Users can read their own orders or admins can read all orders
CREATE POLICY "Users can view own orders" ON public.orders
FOR SELECT USING (user_id = auth.uid() OR EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.role = 'admin'
));
```

### 4.2 INSERT Policy
```sql
-- Authenticated users can create orders for themselves
CREATE POLICY "Users can create own orders" ON public.orders
FOR INSERT WITH CHECK (user_id = auth.uid());
```

### 4.3 UPDATE Policy
```sql
-- Users can update their own orders or admins can update any order
CREATE POLICY "Users can update own orders" ON public.orders
FOR UPDATE USING (user_id = auth.uid() OR EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.role = 'admin'
));
```

### 4.4 DELETE Policy
```sql
-- Only admins can delete orders
CREATE POLICY "Admins can delete orders" ON public.orders
FOR DELETE USING (EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.role = 'admin'
));
```

## 5. Order Items Table Policies

### 5.1 SELECT Policy
```sql
-- Users can read order items for their own orders or admins can read all order items
CREATE POLICY "Users can view own order items" ON public.order_items
FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.orders o 
  WHERE o.id = order_id AND (o.user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  ))
));
```

### 5.2 INSERT Policy
```sql
-- Only when inserting an order (handled by application logic)
CREATE POLICY "Order items insert controlled by app" ON public.order_items
FOR INSERT WITH CHECK (FALSE);
```

### 5.3 UPDATE Policy
```sql
-- Only admins can update order items
CREATE POLICY "Admins can update order items" ON public.order_items
FOR UPDATE USING (EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.role = 'admin'
));
```

### 5.4 DELETE Policy
```sql
-- Only admins can delete order items
CREATE POLICY "Admins can delete order items" ON public.order_items
FOR DELETE USING (EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.role = 'admin'
));
```

## 6. Customers Table Policies

### 6.1 SELECT Policy
```sql
-- Users can read their own customer record or admins can read all customers
CREATE POLICY "Users can view own customer record" ON public.customers
FOR SELECT USING (user_id = auth.uid() OR EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.role = 'admin'
));
```

### 6.2 INSERT Policy
```sql
-- Authenticated users can create their own customer record
CREATE POLICY "Users can create own customer record" ON public.customers
FOR INSERT WITH CHECK (user_id = auth.uid());
```

### 6.3 UPDATE Policy
```sql
-- Users can update their own customer record or admins can update any customer
CREATE POLICY "Users can update own customer record" ON public.customers
FOR UPDATE USING (user_id = auth.uid() OR EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.role = 'admin'
));
```

### 6.4 DELETE Policy
```sql
-- Only admins can delete customers
CREATE POLICY "Admins can delete customers" ON public.customers
FOR DELETE USING (EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.role = 'admin'
));
```

## 7. Enable RLS on All Tables

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
```