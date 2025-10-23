import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/server/supabase/server';
import { getSupabaseAdminClient } from '@/server/supabase/admin';
import { cache } from 'react';
import { 
  logDashboardAccess, 
  logDashboardExit,
  logAuthSuccess,
  logAuthFailure
} from '@/lib/admin-logging';

// Cache the admin check to prevent duplicate queries
const getAuthenticatedAdmin = cache(async () => {
  const supabase = await getSupabaseServerClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  // Log authentication status for debugging
  if (user) {
    console.log('[ADMIN_CUSTOMERS] Auth check result:', { userId: user.id, userEmail: user.email, authError });
  } else {
    console.log('[ADMIN_CUSTOMERS] Auth check result:', { user: null, authError });
  }
  
  if (authError || !user) {
    console.log('[ADMIN_CUSTOMERS] Not authenticated, redirecting to login');
    if (user?.email) {
      logAuthFailure(user.email, 'Not authenticated or auth error', 'CLIENT_IP_UNAVAILABLE');
    }
    return { user: null, profile: null, isAdmin: false, error: 'Not authenticated' };
  }

  // Use admin client to get the profile (bypasses RLS)
  const adminClient = getSupabaseAdminClient();
  const { data: profile, error: profileError } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // Log profile check result for debugging
  console.log('[ADMIN_CUSTOMERS] Profile check result:', { profile, profileError });
  
  // If we can't get the profile, handle the error
  if (profileError) {
    console.log('[ADMIN_CUSTOMERS] Profile error:', profileError.message);
    if (user.email) {
      logAuthFailure(user.email, `Profile error: ${profileError.message}`, 'CLIENT_IP_UNAVAILABLE');
    }
    return { user, profile: null, isAdmin: false, error: profileError.message };
  }

  const isAdmin = profile?.role === 'admin';
  console.log('[ADMIN_CUSTOMERS] Admin check result:', { isAdmin, role: profile?.role });
  
  if (!isAdmin) {
    console.log('[ADMIN_CUSTOMERS] Not admin, redirecting to home');
    if (user.email) {
      logAuthFailure(user.email, 'User not admin', 'CLIENT_IP_UNAVAILABLE');
    }
  } else {
    // Log successful authentication
    if (user.email) {
      logAuthSuccess(user.id, user.email, 'CLIENT_IP_UNAVAILABLE');
    }
  }

  return { user, profile, isAdmin, error: null };
});

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, isAdmin, error } = await getAuthenticatedAdmin();
  
  // Redirect to login if not authenticated
  if (!user) {
    redirect('/admin/login');
  }

  // Redirect to home if not admin or if there's an error fetching profile
  if (error || !isAdmin) {
    console.log('[ADMIN_CUSTOMERS] Redirecting due to error or not admin:', { error, isAdmin });
    redirect('/');
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* Sidebar is now rendered in the main admin layout */}
      <div className="flex flex-col flex-1 sm:ml-64">
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}