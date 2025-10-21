import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/server/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const level = searchParams.get('level');
    const search = searchParams.get('search');
    const email = searchParams.get('email');
    const date = searchParams.get('date');

    // Calculate pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Build query
    let query = supabase
      .from('admin_logs')
      .select('*', { count: 'exact' })
      .order('timestamp', { ascending: false })
      .range(from, to);

    // Apply filters
    if (level && level !== 'all') {
      query = query.eq('level', level);
    }

    if (search) {
      query = query.or(`message.ilike.%${search}%,user_email.ilike.%${search}%`);
    }

    if (email) {
      query = query.eq('user_email', email);
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      
      query = query.gte('timestamp', startDate.toISOString())
                   .lt('timestamp', endDate.toISOString());
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching admin logs:', error);
      return NextResponse.json({ error: 'Failed to fetch admin logs' }, { status: 500 });
    }

    return NextResponse.json({
      logs: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Unexpected error in admin logs GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}