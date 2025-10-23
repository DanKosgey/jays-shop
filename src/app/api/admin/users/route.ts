import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/server/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    
    // Log that we're attempting to fetch users
    console.log('[ADMIN_USERS_API] Attempting to fetch users');
    
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Calculate pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Log the query parameters
    console.log('[ADMIN_USERS_API] Query params:', { page, limit, from, to });

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

    // Log the result of the query
    console.log('[ADMIN_USERS_API] Query result:', { users, usersError, count });

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json({ error: 'Failed to fetch users', details: usersError.message }, { status: 500 });
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
    return NextResponse.json({ error: 'Internal server error', details: (error as Error).message }, { status: 500 });
  }
}