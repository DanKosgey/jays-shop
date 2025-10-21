-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles insert controlled by trigger" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

DROP POLICY IF EXISTS "Public can view products" ON public.products;
DROP POLICY IF EXISTS "Admins can create products" ON public.products;
DROP POLICY IF EXISTS "Users can create own second hand products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Users can update own products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
DROP POLICY IF EXISTS "Users can delete own products" ON public.products;

DROP POLICY IF EXISTS "Users can view own tickets" ON public.tickets;
DROP POLICY IF EXISTS "Users can create own tickets" ON public.tickets;
DROP POLICY IF EXISTS "Users can update own tickets" ON public.tickets;
DROP POLICY IF EXISTS "Admins can delete tickets" ON public.tickets;
DROP POLICY IF EXISTS "Public can view ticket progress" ON public.tickets;

-- ============================================
-- PROFILES TABLE POLICIES
-- ============================================
-- Only admins can view profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (
  auth.jwt() ->> 'role' = 'admin'
);

-- Profiles insert controlled by trigger (on signup)
CREATE POLICY "Profiles insert controlled by trigger" ON public.profiles
FOR INSERT WITH CHECK (FALSE);

-- Only admins can update profiles
CREATE POLICY "Admins can update profiles" ON public.profiles
FOR UPDATE USING (
  auth.jwt() ->> 'role' = 'admin'
);

-- Only admins can delete profiles
CREATE POLICY "Admins can delete profiles" ON public.profiles
FOR DELETE USING (
  auth.jwt() ->> 'role' = 'admin'
);

-- ============================================
-- PRODUCTS TABLE POLICIES
-- ============================================
-- ANYONE (authenticated or not) can view all products
CREATE POLICY "Public can view all products" ON public.products
FOR SELECT USING (true);

-- Only admins can create products
CREATE POLICY "Only admins can create products" ON public.products
FOR INSERT WITH CHECK (
  auth.jwt() ->> 'role' = 'admin'
);

-- Only admins can update products
CREATE POLICY "Only admins can update products" ON public.products
FOR UPDATE USING (
  auth.jwt() ->> 'role' = 'admin'
);

-- Only admins can delete products
CREATE POLICY "Only admins can delete products" ON public.products
FOR DELETE USING (
  auth.jwt() ->> 'role' = 'admin'
);

-- ============================================
-- TICKETS TABLE POLICIES
-- ============================================
-- ANYONE (authenticated or not) can view all tickets (for customer lookup)
CREATE POLICY "Public can view all tickets" ON public.tickets
FOR SELECT USING (true);

-- Only admins can create tickets
CREATE POLICY "Only admins can create tickets" ON public.tickets
FOR INSERT WITH CHECK (
  auth.jwt() ->> 'role' = 'admin'
);

-- Only admins can update tickets
CREATE POLICY "Only admins can update tickets" ON public.tickets
FOR UPDATE USING (
  auth.jwt() ->> 'role' = 'admin'
);

-- Only admins can delete tickets
CREATE POLICY "Only admins can delete tickets" ON public.tickets
FOR DELETE USING (
  auth.jwt() ->> 'role' = 'admin'
);