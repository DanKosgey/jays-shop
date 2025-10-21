-- Create profile for existing admin user with email "admin@g.com"

-- Insert the profile with admin role for the existing user
INSERT INTO public.profiles (
  id,
  email,
  role,
  password_changed_at,
  created_at
) 
SELECT 
  id,
  email,
  'admin'::user_role,
  NOW(),
  NOW()
FROM auth.users 
WHERE email = 'admin@g.com'
ON CONFLICT (id) 
DO UPDATE SET role = 'admin'::user_role;