-- Create admin user with email "admin@g.com" and password "Dan@2020"
-- Note: Using a stronger password that meets Supabase requirements

-- First, insert the user into auth.users table with proper password hashing
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@g.com',
  crypt('Dan@2020', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  'authenticated',
  'authenticated',
  NOW(),
  NOW()
);

-- Then, insert the profile with admin role
-- We need to get the user id first
INSERT INTO public.profiles (
  id,
  email,
  role,
  created_at
) 
SELECT 
  id,
  email,
  'admin'::user_role,
  NOW()
FROM auth.users 
WHERE email = 'admin@g.com'
ON CONFLICT (id) 
DO UPDATE SET role = 'admin'::user_role;