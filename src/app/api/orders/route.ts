import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/server/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Calculate pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Build query
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          quantity,
          price_per_unit,
          products (
            name,
            image_url
          )
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`customer_name.ilike.%${search}%,order_number.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    // Transform data to match the expected format
    const transformedData = data?.map(order => ({
      id: order.id,
      order_number: order.order_number,
      customer_name: order.customer_name,
      status: order.status,
      total_amount: order.total_amount,
      created_at: order.created_at,
      updated_at: order.updated_at,
      items: order.order_items?.map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_per_unit: item.price_per_unit,
        product_name: item.products?.name,
        product_image: item.products?.image_url
      })) || []
    })) || [];

    return NextResponse.json({
      orders: transformedData,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Unexpected error in orders GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    
    // Parse request body
    const body = await req.json();

    // Insert new order
    const { data, error } = await supabase
      .from('orders')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in orders POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    
    // Parse request body
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Update order
    const { data, error } = await supabase
      .from('orders')
      .update(body)
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating order:', error);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error in orders PUT:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    
    // Get order ID from query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Delete order
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting order:', error);
      return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Unexpected error in orders DELETE:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}