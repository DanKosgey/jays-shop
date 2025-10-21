-- Add last_activity_at column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ;

-- Create function to update last activity on user activity
CREATE OR REPLACE FUNCTION public.update_last_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Update last_activity_at when user signs in or performs significant actions
  IF NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at THEN
    UPDATE public.profiles 
    SET last_activity_at = NOW()
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update last activity on sign in
CREATE TRIGGER update_last_activity_trigger
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at)
EXECUTE FUNCTION public.update_last_activity();

-- Create index on last_activity_at for performance
CREATE INDEX IF NOT EXISTS idx_profiles_last_activity_at ON public.profiles(last_activity_at);