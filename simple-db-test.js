const { createClient } = require('@supabase/supabase-js');

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? '[REDACTED]' : 'NOT SET');

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

async function testTickets() {
  try {
    console.log('Fetching tickets...');
    
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Error fetching tickets:', error);
      return;
    }
    
    console.log(`Found ${data.length} tickets:`);
    data.forEach((ticket, index) => {
      console.log(`${index + 1}. Ticket #${ticket.ticket_number} - ${ticket.customer_name} - ${ticket.status}`);
    });
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testTickets();

async function testTicketCreation() {
  // Use the local Supabase instance
  const supabaseUrl = 'http://localhost:54321';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM9zvKv2qMH5FYozX3_TKnIDi6AC0puK9k8hHh8a0';
  
  console.log('Connecting to Supabase at:', supabaseUrl);

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });

  // Test ticket data
  const ticketData = {
    customer_name: 'Test Customer',
    customer_email: 'test@example.com',
    customer_phone: '+1234567890',
    device_type: 'iPhone',
    device_brand: 'Apple',
    device_model: 'iPhone 13',
    device_imei: '123456789012345',
    issue_description: 'Screen cracked',
    priority: 'normal',
    estimated_cost: 5000,
    deposit_paid: 1000,
    payment_status: 'partial',
    status: 'received',
    user_id: 'bc0b9c9f-f248-4dba-aafa-e08fc17bcc93',
  };

  try {
    console.log('Creating ticket...');
    
    const { data, error } = await supabase
      .from('tickets')
      .insert([ticketData])
      .select()
      .single();

    if (error) {
      console.error('Error creating ticket:', error);
      return;
    }

    console.log('Ticket created successfully!');
    console.log('Ticket ID:', data.id);
    console.log('Ticket Number:', data.ticket_number);

    // Verify the ticket number format
    const ticketNumberRegex = /^TKT-[0-9]{8}-[0-9]{4}$/;
    if (ticketNumberRegex.test(data.ticket_number)) {
      console.log('✓ Ticket number format is correct');
    } else {
      console.log('✗ Ticket number format is incorrect');
      console.log('Actual format:', data.ticket_number);
    }

    // Clean up - delete the test ticket
    if (data && data.id) {
      console.log('Cleaning up test ticket...');
      const { error: deleteError } = await supabase
        .from('tickets')
        .delete()
        .eq('id', data.id);

      if (deleteError) {
        console.error('Error deleting test ticket:', deleteError);
      } else {
        console.log('Test ticket deleted successfully');
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the test
testTicketCreation();