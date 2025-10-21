-- Add password_changed_at column to profiles table for existing records
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Update existing profiles to have password_changed_at set to created_at
UPDATE public.profiles 
SET password_changed_at = created_at 
WHERE password_changed_at IS NULL;

-- Update the handle_new_user function to include password_changed_at
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, password_changed_at, created_at)
  VALUES (NEW.id, NEW.email, NOW(), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;