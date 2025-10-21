-- Add password expiration tracking to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Create function to check password expiration
CREATE OR REPLACE FUNCTION public.check_password_expiration()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is an update to the password, update the password_changed_at timestamp
  IF NEW.encrypted_password IS DISTINCT FROM OLD.encrypted_password THEN
    NEW.password_changed_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update password_changed_at when password changes
DROP TRIGGER IF EXISTS update_password_changed_at ON auth.users;
CREATE TRIGGER update_password_changed_at
BEFORE UPDATE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.check_password_expiration();

-- Create function to check if user's password has expired
CREATE OR REPLACE FUNCTION public.is_password_expired(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  password_age INTERVAL;
  max_age INTERVAL := INTERVAL '90 days';
BEGIN
  SELECT NOW() - password_changed_at 
  INTO password_age
  FROM public.profiles 
  WHERE id = user_id;
  
  RETURN password_age > max_age;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to enforce password reset for expired passwords
CREATE OR REPLACE FUNCTION public.enforce_password_reset()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if password has expired
  IF public.is_password_expired(NEW.id) THEN
    -- In a real implementation, you would redirect to password reset page
    -- For now, we'll just raise a notice
    RAISE NOTICE 'Password has expired for user %. Please reset your password.', NEW.email;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to check password expiration on login
DROP TRIGGER IF EXISTS check_password_expiration_trigger ON auth.users;
CREATE TRIGGER check_password_expiration_trigger
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at)
EXECUTE FUNCTION public.enforce_password_reset();