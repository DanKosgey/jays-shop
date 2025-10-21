-- Migration: Add password expiration tracking
-- Description: Tracks password changes and enforces 90-day expiration policy

-- Step 1: Add password_changed_at column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMPTZ DEFAULT NOW();

-- Step 2: Update existing profiles to set initial password_changed_at
UPDATE public.profiles 
SET password_changed_at = COALESCE(password_changed_at, created_at, NOW())
WHERE password_changed_at IS NULL;

-- Step 3: Make the column NOT NULL after setting defaults
ALTER TABLE public.profiles 
ALTER COLUMN password_changed_at SET NOT NULL;

-- Step 4: Create function to update password_changed_at in profiles
CREATE OR REPLACE FUNCTION public.update_profile_password_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the profiles table when auth.users password changes
  IF NEW.encrypted_password IS DISTINCT FROM OLD.encrypted_password THEN
    UPDATE public.profiles 
    SET password_changed_at = NOW() 
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Create trigger on auth.users to track password changes
DROP TRIGGER IF EXISTS update_password_changed_at ON auth.users;
CREATE TRIGGER update_password_changed_at
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (NEW.encrypted_password IS DISTINCT FROM OLD.encrypted_password)
EXECUTE FUNCTION public.update_profile_password_timestamp();

-- Step 6: Create function to check if password has expired
CREATE OR REPLACE FUNCTION public.is_password_expired(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  password_age INTERVAL;
  max_age INTERVAL := INTERVAL '90 days';
  pwd_changed_at TIMESTAMPTZ;
BEGIN
  SELECT password_changed_at 
  INTO pwd_changed_at
  FROM public.profiles 
  WHERE id = user_id;
  
  -- If no record found, consider password expired
  IF pwd_changed_at IS NULL THEN
    RETURN TRUE;
  END IF;
  
  password_age := NOW() - pwd_changed_at;
  RETURN password_age > max_age;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Create function to get days until password expires
CREATE OR REPLACE FUNCTION public.days_until_password_expires(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  password_age INTERVAL;
  max_age INTERVAL := INTERVAL '90 days';
  pwd_changed_at TIMESTAMPTZ;
  days_remaining INTEGER;
BEGIN
  SELECT password_changed_at 
  INTO pwd_changed_at
  FROM public.profiles 
  WHERE id = user_id;
  
  IF pwd_changed_at IS NULL THEN
    RETURN -1; -- Expired or no data
  END IF;
  
  password_age := NOW() - pwd_changed_at;
  days_remaining := 90 - EXTRACT(DAY FROM password_age)::INTEGER;
  
  RETURN days_remaining;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 8: Create function to check password expiration on login
CREATE OR REPLACE FUNCTION public.check_password_expiration_on_login()
RETURNS TRIGGER AS $$
DECLARE
  is_expired BOOLEAN;
  days_remaining INTEGER;
BEGIN
  -- Check if password has expired
  is_expired := public.is_password_expired(NEW.id);
  days_remaining := public.days_until_password_expires(NEW.id);
  
  IF is_expired THEN
    RAISE NOTICE 'Password expired for user %. Password reset required.', NEW.email;
    -- You can also update a flag in profiles table if needed
    UPDATE public.profiles 
    SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
        jsonb_build_object('password_expired', true)
    WHERE id = NEW.id;
  ELSIF days_remaining <= 7 AND days_remaining > 0 THEN
    RAISE NOTICE 'Password expires in % days for user %', days_remaining, NEW.email;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 9: Create trigger to check password expiration on login
DROP TRIGGER IF EXISTS check_password_expiration_trigger ON auth.users;
CREATE TRIGGER check_password_expiration_trigger
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at)
EXECUTE FUNCTION public.check_password_expiration_on_login();

-- Step 10: Add helpful comments
COMMENT ON COLUMN public.profiles.password_changed_at IS 'Timestamp of last password change, used for 90-day expiration policy';
COMMENT ON FUNCTION public.is_password_expired IS 'Returns true if password is older than 90 days';
COMMENT ON FUNCTION public.days_until_password_expires IS 'Returns number of days until password expires, negative if already expired';

-- Step 11: Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.is_password_expired TO authenticated;
GRANT EXECUTE ON FUNCTION public.days_until_password_expires TO authenticated;