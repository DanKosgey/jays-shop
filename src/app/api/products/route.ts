import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/server/supabase/server';
import { ProductsResponseSchema } from '@/server/schemas';

export async function GET(req: NextRequest) {
  try {
    // Initialize Supabase client with better error handling
    let supabase;
    try {
      supabase = await getSupabaseServerClient();
    } catch (initError: any) {
      console.error('Failed to initialize Supabase client:', initError);
      return NextResponse.json({ error: 'Failed to initialize database connection' }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    
    // Ensure page and limit are valid
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100); // Max 100 items per page
    const offset = (validPage - 1) * validLimit;

    // First, let's check if we can connect to the database and table exists
    let healthCheck, healthError;
    try {
      const result = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .limit(1);
      healthCheck = result.data;
      healthError = result.error;
    } catch (dbError: any) {
      console.error('Database connection error:', dbError);
      return NextResponse.json({ error: 'Database connection failed', details: dbError.message || 'Unknown error' }, { status: 500 });
    }
      
    if (healthError && healthError.message.includes('relation "products" does not exist')) {
      // Table doesn't exist, return empty result set
      return NextResponse.json({
        products: [],
        pagination: {
          page: validPage,
          limit: validLimit,
          total: 0,
          totalPages: 0
        }
      }, { status: 200 });
    }

    if (healthError) {
      console.error('Database connection error:', healthError);
      return NextResponse.json({ error: 'Database connection failed', details: healthError.message }, { status: 500 });
    }

    // Query for products (will return empty array if no products exist)
    let data, error, count;
    try {
      const result = await supabase
        .from('products')
        .select('id, name, slug, category, description, price, stock_quantity, image_url, created_at, is_featured', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + validLimit - 1);
        
      data = result.data;
      error = result.error;
      count = result.count;
    } catch (queryError: any) {
      console.error('Database query error:', queryError);
      return NextResponse.json({ error: 'Failed to fetch products', details: queryError.message || 'Unknown error' }, { status: 500 });
    }
      
    if (error) {
      console.error('Database error fetching products:', error);
      return NextResponse.json({ error: 'Failed to fetch products', details: error.message }, { status: 500 });
    }
    
    // Handle case where no products exist but table is valid
    const products = (data ?? []).map((p: any) => ({
      id: p.id,
      name: p.name ?? '',
      slug: p.slug ?? undefined,
      category: p.category ?? undefined,
      description: p.description ?? '',
      price: p.price ? Number(p.price) : 0,
      stock_quantity: typeof p.stock_quantity === 'number' ? p.stock_quantity : 0,
      image_url: p.image_url ?? '',
      created_at: p.created_at ?? undefined,
      is_featured: typeof p.is_featured === 'boolean' ? p.is_featured : false,
    }));
    
    // Validate the response structure
    const parsed = ProductsResponseSchema.safeParse({ products });
    if (!parsed.success) {
      console.error('Data validation error for products:', parsed.error);
      return NextResponse.json({ error: 'Invalid product data', details: parsed.error.errors }, { status: 500 });
    }
    
    // Return paginated response
    return NextResponse.json({
      products: parsed.data.products,
      pagination: {
        page: validPage,
        limit: validLimit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / validLimit)
      }
    }, { status: 200 });
  } catch (error: any) {
    console.error('Unexpected error in products API:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}