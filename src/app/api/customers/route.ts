import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/server/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');

    // Calculate pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Build query
    let query = supabase
      .from('customers')
      .select(`
        *,
        orders(count)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    // Apply search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching customers:', error);
      return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
    }

    // Transform data to match the expected format
    const transformedData = data?.map(customer => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      totalOrders: customer.orders?.length || 0,
      totalSpent: calculateTotalSpent(customer),
      lastOrder: customer.orders?.length > 0 
        ? new Date(Math.max(...customer.orders.map((o: any) => new Date(o.created_at).getTime()))).toISOString().split('T')[0]
        : null,
      createdAt: customer.created_at
    })) || [];

    return NextResponse.json({
      customers: transformedData,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Unexpected error in customers GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    
    // Parse request body
    const body = await req.json();

    // Insert new customer
    const { data, error } = await supabase
      .from('customers')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error('Error creating customer:', error);
      return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in customers POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    
    // Parse request body
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    // Update customer
    const { data, error } = await supabase
      .from('customers')
      .update(body)
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating customer:', error);
      return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error in customers PUT:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    
    // Get customer ID from query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    // Delete customer
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting customer:', error);
      return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Unexpected error in customers DELETE:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to calculate total spent by a customer
function calculateTotalSpent(customer: any) {
  // Calculate based on orders now that we have the proper relationship
  const orderTotal = customer.orders?.reduce((sum: number, order: any) => {
    return sum + (order.total_amount || 0);
  }, 0) || 0;

  return orderTotal;
}