'use server';

import { getSupabaseAdminClient } from '@/server/supabase/admin';

export async function checkUserRole(userId: string) {
  try {
    const supabaseAdmin = getSupabaseAdminClient();
    
    console.log('[AUTH_ACTION] Checking role for user:', userId);
    
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    console.log('[AUTH_ACTION] Profile query result:', { profile, error });
    
    if (error) {
      console.log('[AUTH_ACTION] Error fetching profile:', error.message);
      return { isAdmin: false, error: error.message };
    }
    
    const isAdmin = profile?.role === 'admin';
    console.log('[AUTH_ACTION] Admin check result:', { isAdmin, role: profile?.role });
    
    return { isAdmin, error: null };
  } catch (error: any) {
    console.log('[AUTH_ACTION] Exception in checkUserRole:', error.message);
    return { isAdmin: false, error: error.message };
  }
}