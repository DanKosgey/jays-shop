import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/server/supabase/server';
import { TicketCreateSchema, TicketsResponseSchema } from '@/server/schemas';

export async function GET(req: NextRequest) {
  const supabase = getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { searchParams } = new URL(req.url);
  const ticketNumber = searchParams.get('ticketNumber');

  let query = supabase.from('tickets').select('*').order('created_at', { ascending: false });
  if (ticketNumber) {
    query = query.eq('ticket_number', ticketNumber);
  }
  // RLS should enforce user visibility; admins can see all
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const tickets = (data ?? []).map((t: any) => ({
    id: t.id,
    user_id: t.user_id,
    ticket_number: t.ticket_number,
    customer_name: t.customer_name,
    device_type: t.device_type,
    device_brand: t.device_brand,
    device_model: t.device_model,
    issue_description: t.issue_description,
    status: t.status,
    priority: t.priority,
    estimated_cost: t.estimated_cost === null ? null : Number(t.estimated_cost),
    final_cost: t.final_cost === null ? null : Number(t.final_cost),
    created_at: t.created_at,
    updated_at: t.updated_at,
    estimated_completion: t.estimated_completion,
  }));
  const parsed = TicketsResponseSchema.safeParse({ tickets });
  if (!parsed.success) return NextResponse.json({ error: 'Invalid ticket data shape' }, { status: 500 });
  return NextResponse.json(parsed.data);
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = TicketCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 });

  const payload = parsed.data;
  const ticketNumber = `RPR-${new Date().getFullYear()}-${Math.random().toString().slice(2, 6).padStart(4, '0')}`;

  const { data, error } = await supabase.from('tickets').insert({
    user_id: user.id,
    ticket_number: ticketNumber,
    customer_name: payload.customer_name,
    device_type: payload.device_type,
    device_brand: payload.device_brand,
    device_model: payload.device_model,
    issue_description: payload.issue_description,
    status: 'received',
    priority: payload.priority,
  }).select('*').single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ id: data.id, ticket_number: data.ticket_number }, { status: 201 });
}
