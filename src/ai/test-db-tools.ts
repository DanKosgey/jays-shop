// Simple test script to verify database tools are working
import { getSupabaseAdminClient } from '@/server/supabase/admin';

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    const supabase = getSupabaseAdminClient();
    
    // Test connection by querying a simple table
    const { data, error } = await supabase
      .from('products')
      .select('count()', { count: 'exact' });
      
    if (error) {
      console.log('Database connection error:', error.message);
      return;
    }
    
    console.log('Database connection successful');
    console.log('Product count:', data);
    
  } catch (error) {
    console.error('Error testing database connection:', error);
  }
}

// Run the test
testDatabaseConnection();