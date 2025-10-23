import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/server/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    
    // Parse request body
    const body = await req.json();
    const { bucket, filePath } = body;

    // Validate required fields
    if (!bucket || !filePath) {
      return NextResponse.json(
        { error: 'Missing required fields: bucket and filePath are required' }, 
        { status: 400 }
      );
    }

    // Generate signed URL for upload
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(filePath);

    if (error) {
      console.error('Error creating signed upload URL:', error);
      return NextResponse.json(
        { error: 'Failed to create upload URL', details: error.message }, 
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: data.signedUrl,
      fullPath: data.path,
    });
  } catch (error: any) {
    console.error('Unexpected error in storage sign API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message }, 
      { status: 500 }
    );
  }
}