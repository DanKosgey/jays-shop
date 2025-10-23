import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/server/supabase/admin';
import { getSupabaseServerClient } from '@/server/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const condition = searchParams.get('condition');
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');
    
    // If slug is provided, fetch specific second-hand product
    if (slug) {
      try {
        const { data, error } = await supabase
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
          `)
          .eq('products.slug', slug)
          .single();

        if (error) {
          console.error('Database error fetching second hand product by slug:', error);
          return NextResponse.json({ error: 'Failed to fetch second hand product' }, { status: 500 });
        }

        if (!data || !data.products) {
          return NextResponse.json({ products: [] }, { status: 200 });
        }

        // Transform the data to match the expected format
        const product = {
          id: data.id,
          condition: data.condition,
          seller_name: data.seller_name,
          created_at: data.created_at,
          updated_at: data.updated_at,
          ...data.products
        };

        return NextResponse.json({
          products: [product]
        }, { status: 200 });
      } catch (queryError: any) {
        console.error('Database query error:', queryError);
        return NextResponse.json({ error: 'Failed to fetch second hand product', details: queryError.message || 'Unknown error' }, { status: 500 });
      }
    }
    
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

export async function POST(req: NextRequest) {
  try {
    // First, get the authenticated user
    const supabaseServer = await getSupabaseServerClient();
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: User must be authenticated' }, { status: 401 });
    }
    
    const supabase = getSupabaseAdminClient();
    
    // Parse request body
    const body = await req.json();
    
    // Validate required fields
    if (!body.product_id || !body.condition || !body.seller_name) {
      return NextResponse.json({ error: 'Missing required fields: product_id, condition, and seller_name are required' }, { status: 400 });
    }
    
    // Validate condition
    const validConditions = ['Like New', 'Good', 'Fair'];
    if (!validConditions.includes(body.condition)) {
      return NextResponse.json({ error: 'Invalid condition. Must be one of: Like New, Good, Fair' }, { status: 400 });
    }
    
    // Prepare data for insertion - include seller_id from authenticated user
    const secondHandProductData = {
      product_id: body.product_id,
      seller_id: user.id, // Add the authenticated user as the seller
      condition: body.condition,
      seller_name: body.seller_name,
    };

    // Insert new second hand product
    const { data, error } = await supabase
      .from('second_hand_products')
      .insert([secondHandProductData])
      .select()
      .single();

    if (error) {
      console.error('Error creating second hand product:', error);
      return NextResponse.json({ error: 'Failed to create second hand product', details: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Unexpected error in second hand products POST:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    
    // Parse request body
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Second hand product ID is required' }, { status: 400 });
    }

    // Prepare data for update (only include fields that are provided)
    const updateData: any = {};
    if (body.condition !== undefined) updateData.condition = body.condition;
    if (body.seller_name !== undefined) updateData.seller_name = body.seller_name;

    // Update second hand product
    const { data, error } = await supabase
      .from('second_hand_products')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating second hand product:', error);
      return NextResponse.json({ error: 'Failed to update second hand product', details: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Second hand product not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Unexpected error in second hand products PUT:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    
    // Get second hand product ID from query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Second hand product ID is required' }, { status: 400 });
    }

    // Delete second hand product
    const { error } = await supabase
      .from('second_hand_products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting second hand product:', error);
      return NextResponse.json({ error: 'Failed to delete second hand product', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Second hand product deleted successfully' });
  } catch (error: any) {
    console.error('Unexpected error in second hand products DELETE:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}