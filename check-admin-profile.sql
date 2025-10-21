-- Check if the admin profile exists
SELECT id, email, role FROM public.profiles WHERE email = 'admin@g.com';

-- Check if the user exists in auth.users
SELECT id, email FROM auth.users WHERE email = 'admin@g.com';