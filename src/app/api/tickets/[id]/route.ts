import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/server/supabase/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await getSupabaseServerClient();
    
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Error fetching ticket:', error);
      return NextResponse.json({ error: 'Failed to fetch ticket' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error in ticket GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await getSupabaseServerClient();
    
    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting ticket:', error);
      return NextResponse.json({ error: 'Failed to delete ticket' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Unexpected error in ticket DELETE:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}