import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config({ path: path.resolve(process.cwd(), '.env.local') });

async function applyMigration() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('Applying migration to add customer-order relationship...');
    
    // Add customer_id column to orders table
    const { error: alterError } = await supabase.rpc('execute_sql', {
      sql: `
        ALTER TABLE public.orders 
        ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;
      `
    });

    if (alterError) {
      console.error('Error adding customer_id column:', alterError);
      return;
    }

    console.log('Added customer_id column to orders table');

    // Create index
    const { error: indexError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
      `
    });

    if (indexError) {
      console.error('Error creating index:', indexError);
      return;
    }

    console.log('Created index on customer_id column');

    // Update existing orders to link to customers where possible
    const { error: updateError } = await supabase.rpc('execute_sql', {
      sql: `
        UPDATE public.orders 
        SET customer_id = c.id
        FROM public.customers c
        WHERE public.orders.user_id = c.user_id AND public.orders.customer_id IS NULL;
      `
    });

    if (updateError) {
      console.error('Error updating existing orders:', updateError);
      return;
    }

    console.log('Updated existing orders to link to customers');

    // Test the relationship
    console.log('Testing the new relationship...');
    const { data, error } = await supabase
      .from('customers')
      .select(`
        *,
        orders(count)
      `)
      .limit(5);

    if (error) {
      console.error('Error testing relationship:', error);
      return;
    }

    console.log('Relationship test successful!');
    console.log('Sample data:', JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

applyMigration();