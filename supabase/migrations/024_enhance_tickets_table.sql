-- Migration 024: Enhance tickets table with additional fields for phone repair management
-- Description: Add missing columns to support full ticket functionality including customer contact info, device details, payment tracking, and photo management

-- Add new columns to tickets table
ALTER TABLE public.tickets 
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT,
ADD COLUMN IF NOT EXISTS device_imei TEXT,
ADD COLUMN IF NOT EXISTS actual_cost NUMERIC,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid')),
ADD COLUMN IF NOT EXISTS device_photos TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS customer_notes TEXT,
ADD COLUMN IF NOT EXISTS actual_completion_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS deposit_paid NUMERIC DEFAULT 0;

-- Create indexes for new columns to improve query performance
CREATE INDEX IF NOT EXISTS idx_tickets_customer_email ON public.tickets(customer_email);
CREATE INDEX IF NOT EXISTS idx_tickets_customer_phone ON public.tickets(customer_phone);
CREATE INDEX IF NOT EXISTS idx_tickets_device_imei ON public.tickets(device_imei);
CREATE INDEX IF NOT EXISTS idx_tickets_payment_status ON public.tickets(payment_status);
CREATE INDEX IF NOT EXISTS idx_tickets_actual_completion_date ON public.tickets(actual_completion_date);

-- Update existing tickets with default values for new required fields
UPDATE public.tickets 
SET payment_status = 'unpaid' 
WHERE payment_status IS NULL;

-- Add helpful comments for documentation
COMMENT ON COLUMN public.tickets.customer_email IS 'Customer email address for communication';
COMMENT ON COLUMN public.tickets.customer_phone IS 'Customer phone number for communication';
COMMENT ON COLUMN public.tickets.device_imei IS 'Device IMEI number for identification';
COMMENT ON COLUMN public.tickets.actual_cost IS 'Actual cost of repair after diagnosis';
COMMENT ON COLUMN public.tickets.payment_status IS 'Payment status: unpaid, partial, or paid';
COMMENT ON COLUMN public.tickets.device_photos IS 'Array of URLs to device photos stored in Supabase Storage';
COMMENT ON COLUMN public.tickets.notes IS 'Internal notes for repair technicians';
COMMENT ON COLUMN public.tickets.customer_notes IS 'Notes visible to customer';
COMMENT ON COLUMN public.tickets.actual_completion_date IS 'Actual date when repair was completed';
COMMENT ON COLUMN public.tickets.deposit_paid IS 'Amount of deposit paid by customer';

-- Create storage bucket for device photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('device-photos', 'device-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for device photos
DO $$
BEGIN
  -- Check if policy exists before creating
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Anyone can view device photos'
  ) THEN
    CREATE POLICY "Anyone can view device photos" ON storage.objects
      FOR SELECT
      USING (bucket_id = 'device-photos');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Authenticated users can upload device photos'
  ) THEN
    CREATE POLICY "Authenticated users can upload device photos" ON storage.objects
      FOR INSERT
      WITH CHECK (bucket_id = 'device-photos' AND auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Authenticated users can update device photos'
  ) THEN
    CREATE POLICY "Authenticated users can update device photos" ON storage.objects
      FOR UPDATE
      USING (bucket_id = 'device-photos' AND auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Authenticated users can delete device photos'
  ) THEN
    CREATE POLICY "Authenticated users can delete device photos" ON storage.objects
      FOR DELETE
      USING (bucket_id = 'device-photos' AND auth.role() = 'authenticated');
  END IF;
END $$;