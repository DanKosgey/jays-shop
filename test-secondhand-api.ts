import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

import { getSupabaseAdminClient } from '@/server/supabase/admin';

async function testSecondHandProducts() {
  try {
    console.log('Testing second hand products query...');
    
    const supabase = getSupabaseAdminClient();
    
    // Test the exact query from the API route
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
      return;
    }

    console.log('Query successful!');
    console.log('Data count:', data?.length);
    console.log('Total count:', count);
    
    if (data && data.length > 0) {
      console.log('Sample data:', JSON.stringify(data[0], null, 2));
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testSecondHandProducts();