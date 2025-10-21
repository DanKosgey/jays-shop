import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

import { getSupabaseServerClient } from '@/server/supabase/server';

async function testSecondHandProductsServerClient() {
  try {
    console.log('Testing second hand products query with server client...');
    
    const supabase = await getSupabaseServerClient();
    
    // Test the exact query from the API route
    console.log('Executing query...');
    const { data, error, count } = await supabase
      .from('second_hand_products')
      .select(`
        id,
        condition,
        seller_name,
        created_at,
        updated_at,
        products (
          id,
          name,
          slug,
          category,
          description,
          price,
          stock_quantity,
          image_url,
          is_featured
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(0, 11);

    if (error) {
      console.error('Query error:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return;
    }

    console.log('Query successful!');
    console.log('Data count:', data?.length);
    console.log('Total count:', count);
    
    if (data && data.length > 0) {
      console.log('Sample data:', JSON.stringify(data[0], null, 2));
    } else {
      console.log('No data found');
    }
    
    // Also test a simpler query to see if the table is accessible
    console.log('Testing simple query...');
    const { data: simpleData, error: simpleError } = await supabase
      .from('second_hand_products')
      .select('id, condition, seller_name')
      .limit(5);
      
    if (simpleError) {
      console.error('Simple query error:', simpleError);
    } else {
      console.log('Simple query successful, count:', simpleData?.length);
    }
  } catch (error) {
    console.error('Test failed with exception:', error);
  }
}

testSecondHandProductsServerClient();