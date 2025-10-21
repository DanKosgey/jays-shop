import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/server/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const condition = searchParams.get('condition');
    const category = searchParams.get('category');
    
    // Calculate pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Build query for second hand products with associated product data
    let query = supabase
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
      .range(from, to);

    // Apply filters
    if (condition) {
      query = query.eq('condition', condition);
    }

    if (category) {
      query = query.eq('products.category', category);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching second hand products:', error);
      return NextResponse.json({ error: 'Failed to fetch second hand products' }, { status: 500 });
    }

    // Transform the data to match the expected format
    // Add safety check for item.products
    const transformedData = (data || []).map((item: any) => ({
      id: item.id,
      condition: item.condition,
      seller_name: item.seller_name,
      created_at: item.created_at,
      updated_at: item.updated_at,
      ...(item.products || {}) // Safely spread the product data
    }));

    return NextResponse.json({
      products: transformedData,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Unexpected error in second hand products GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}