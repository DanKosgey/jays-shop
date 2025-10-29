-- Migration 026: Fix ticket number format constraint
-- Description: Update the ticket number constraint to match the actual format TKT-YYYYMMDD-XXXX

-- Drop the old constraint
ALTER TABLE public.tickets
DROP CONSTRAINT IF EXISTS chk_tickets_ticket_number_format;

-- Add the new constraint that matches the actual format TKT-YYYYMMDD-XXXX
ALTER TABLE public.tickets
ADD CONSTRAINT chk_tickets_ticket_number_format CHECK (ticket_number ~* '^TKT-[0-9]{8}-[0-9]{4}$');