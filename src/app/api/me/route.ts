import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/server/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get additional profile data from the profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
    }

    const userData = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      avatar: user.user_metadata?.avatar_url || '',
      role: profile?.role || 'user'
    };

    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error in me API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}