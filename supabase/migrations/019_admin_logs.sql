-- Create admin logs table for tracking authentication events
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  level TEXT NOT NULL CHECK (level IN ('info', 'warn', 'error')),
  message TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_admin_logs_timestamp ON public.admin_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_admin_logs_level ON public.admin_logs(level);
CREATE INDEX IF NOT EXISTS idx_admin_logs_user_email ON public.admin_logs(user_email);
CREATE INDEX IF NOT EXISTS idx_admin_logs_ip_address ON public.admin_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON public.admin_logs(created_at);

-- Enable RLS on admin_logs table
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_logs
-- Only admins can view logs
CREATE POLICY "Admins can view all logs" ON public.admin_logs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- Only admins can insert logs (application controlled)
CREATE POLICY "Admins can insert logs" ON public.admin_logs
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- Only admins can update logs
CREATE POLICY "Admins can update logs" ON public.admin_logs
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- Only admins can delete logs
CREATE POLICY "Admins can delete logs" ON public.admin_logs
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- Grant permissions to authenticated users
GRANT ALL ON public.admin_logs TO authenticated;

-- Grant permissions to service role for application access
GRANT ALL ON public.admin_logs TO service_role;

-- Add a function to insert log entries
CREATE OR REPLACE FUNCTION public.insert_admin_log(
  log_level TEXT,
  log_message TEXT,
  log_user_id UUID DEFAULT NULL,
  log_user_email TEXT DEFAULT NULL,
  log_ip_address INET DEFAULT NULL,
  log_user_agent TEXT DEFAULT NULL,
  log_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.admin_logs (
    level,
    message,
    user_id,
    user_email,
    ip_address,
    user_agent,
    metadata
  )
  VALUES (
    log_level,
    log_message,
    log_user_id,
    log_user_email,
    log_ip_address,
    log_user_agent,
    log_metadata
  )
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.insert_admin_log TO authenticated;
GRANT EXECUTE ON FUNCTION public.insert_admin_log TO service_role;