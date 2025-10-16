import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/server/supabase/server';
import { ProductsResponseSchema } from '@/server/schemas';

export async function GET() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const products = (data ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug ?? undefined,
    category: p.category ?? undefined,
    description: p.description,
    price: Number(p.price),
    stock: typeof p.stock === 'number' ? p.stock : undefined,
    stock_quantity: typeof p.stock_quantity === 'number' ? p.stock_quantity : undefined,
    image_url: p.image_url,
    created_at: p.created_at ?? undefined,
    is_featured: typeof p.is_featured === 'boolean' ? p.is_featured : undefined,
  }));
  const parsed = ProductsResponseSchema.safeParse({ products });
  if (!parsed.success) return NextResponse.json({ error: 'Invalid product data shape' }, { status: 500 });
  return NextResponse.json(parsed.data);
}
