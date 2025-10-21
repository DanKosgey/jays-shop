import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/server/supabase/server';
import { TicketCreateSchema, TicketUpdateSchema } from '@/server/schemas';

export async function GET(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const ticketNumber = searchParams.get('ticketNumber');

    // Calculate pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Build query
    let query = supabase
      .from('tickets')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    // Apply filters
    if (ticketNumber) {
      // If ticketNumber is provided, filter by exact match
      query = query.eq('ticket_number', ticketNumber);
    } else {
      // Only apply other filters when ticketNumber is not provided
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      if (search) {
        query = query.or(`customer_name.ilike.%${search}%,device_model.ilike.%${search}%`);
      }
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching tickets:', error);
      return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
    }

    return NextResponse.json({
      tickets: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Unexpected error in tickets GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    
    // Parse and validate request body
    const body = await req.json();
    const result = TicketCreateSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid request body', details: result.error.flatten() }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('tickets')
      .insert([result.data])
      .select()
      .single();

    if (error) {
      console.error('Error creating ticket:', error);
      return NextResponse.json({ error: 'Failed to create ticket', details: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in tickets POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    
    // Parse and validate request body
    const body = await req.json();
    
    if (!body.id) {
      return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
    }

    const result = TicketUpdateSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid request body', details: result.error.flatten() }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('tickets')
      .update(result.data)
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating ticket:', error);
      return NextResponse.json({ error: 'Failed to update ticket', details: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error in tickets PUT:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}