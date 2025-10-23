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

    // Get user info to check role
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' }, 
        { status: 401 }
      );
    }

    // Check if user has admin role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return NextResponse.json(
        { error: 'Failed to verify user permissions' }, 
        { status: 500 }
      );
    }

    if (profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions: only admins can upload images' }, 
        { status: 403 }
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