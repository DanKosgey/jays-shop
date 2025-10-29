-- Migration 025: Implement sequential ticket number generation
-- Description: Replace random ticket number generation with sequential numbering system

-- Function to generate sequential ticket number
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    counter INTEGER;
BEGIN
    -- Get the count of tickets created today
    SELECT COUNT(*) INTO counter
    FROM tickets
    WHERE DATE(created_at) = CURRENT_DATE;
    
    -- Generate ticket number: TKT-YYYYMMDD-XXXX
    new_number := 'TKT-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD((counter + 1)::TEXT, 4, '0');
    
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Update the trigger function to use the new ticket number generation
CREATE OR REPLACE FUNCTION public.set_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
        NEW.ticket_number := public.generate_ticket_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace the trigger
DROP TRIGGER IF EXISTS trigger_set_ticket_number ON public.tickets;
CREATE TRIGGER trigger_set_ticket_number
BEFORE INSERT ON public.tickets
FOR EACH ROW
EXECUTE FUNCTION public.set_ticket_number();

-- Add helpful comment for documentation
COMMENT ON FUNCTION public.generate_ticket_number() IS 'Generates sequential ticket numbers in format TKT-YYYYMMDD-XXXX';