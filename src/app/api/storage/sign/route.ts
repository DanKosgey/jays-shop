import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdminClient } from '@/server/supabase/admin';

const SignInput = z.object({
  bucket: z.enum(['ticket-attachments', 'product-images']),
  path: z.string().min(1),
  expiresIn: z.number().int().positive().max(60 * 60).default(300),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = SignInput.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  const { bucket, path, expiresIn } = parsed.data;

  const supabaseAdmin = getSupabaseAdminClient();

  const { data, error } = await supabaseAdmin.storage.from(bucket).createSignedUploadUrl(path, expiresIn);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
