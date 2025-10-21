-- Add account lockout fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS locked_until TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_failed_login_attempt TIMESTAMPTZ;

-- Create function to handle failed login attempts
CREATE OR REPLACE FUNCTION public.handle_failed_login()
RETURNS TRIGGER AS $$
DECLARE
  max_attempts INTEGER := 5;
  lockout_duration INTERVAL := INTERVAL '30 minutes';
BEGIN
  -- Check if account is already locked
  IF NEW.locked_until IS NOT NULL AND NEW.locked_until > NOW() THEN
    RAISE EXCEPTION 'Account is locked until %', NEW.locked_until;
  END IF;
  
  -- Increment failed login attempts
  NEW.failed_login_attempts = NEW.failed_login_attempts + 1;
  NEW.last_failed_login_attempt = NOW();
  
  -- Lock account if max attempts exceeded
  IF NEW.failed_login_attempts >= max_attempts THEN
    NEW.locked_until = NOW() + lockout_duration;
    RAISE NOTICE 'Account locked due to too many failed login attempts';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to reset failed login attempts on successful login
CREATE OR REPLACE FUNCTION public.reset_failed_login_attempts()
RETURNS TRIGGER AS $$
BEGIN
  -- Reset failed login attempts on successful login
  IF NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at THEN
    UPDATE public.profiles 
    SET failed_login_attempts = 0, 
        locked_until = NULL,
        last_failed_login_attempt = NULL
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to handle failed login attempts
-- Note: This would typically be called from application code when login fails
-- For demonstration, we'll create a helper function to call this

-- Create trigger to reset failed login attempts on successful login
CREATE TRIGGER reset_failed_login_attempts_trigger
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at)
EXECUTE FUNCTION public.reset_failed_login_attempts();