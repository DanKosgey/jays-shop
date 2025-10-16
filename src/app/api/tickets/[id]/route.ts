import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/server/supabase/server';
import { TicketUpdateSchema } from '@/server/schemas';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from('tickets').select('*').eq('id', params.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getSupabaseServerClient();
  const body = await req.json();
  const parsed = TicketUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 });

  const { data, error } = await supabase.from('tickets').update(parsed.data).eq('id', params.id).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
