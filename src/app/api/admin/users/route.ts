import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/server/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Calculate pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Fetch users with their profiles
    const { data: users, error: usersError, count } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        role,
        full_name,
        phone,
        created_at
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Unexpected error in users GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    
    // Parse request body
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Prepare data for update (only include fields that are provided)
    const updateData: any = {};
    if (body.role !== undefined) updateData.role = body.role;
    if (body.full_name !== undefined) updateData.full_name = body.full_name;
    if (body.phone !== undefined) updateData.phone = body.phone;

    // Update user profile
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return NextResponse.json({ error: 'Failed to update user', details: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Unexpected error in users PUT:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}