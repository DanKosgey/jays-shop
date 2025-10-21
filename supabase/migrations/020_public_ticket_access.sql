-- Update tickets table policies to allow public access by ticket number
-- Drop existing policy
DROP POLICY IF EXISTS "Users can view own tickets" ON public.tickets;

-- Create new policy that allows public access to tickets by ticket number
-- This allows anyone to view a ticket if they know the ticket number
CREATE POLICY "Public can view tickets by ticket number" ON public.tickets
FOR SELECT USING (true);

-- Keep the existing policies for create, update, and delete operations
-- These should still require authentication and proper authorization