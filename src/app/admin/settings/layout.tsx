import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/server/supabase/server';
import { Sidebar } from '../components/sidebar';
import { cache } from 'react';

// Cache the admin check to prevent duplicate queries
const getAuthenticatedAdmin = cache(async () => {
  const supabase = await getSupabaseServerClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { user: null, profile: null, error: 'Not authenticated' };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError) {
    return { user, profile: null, error: profileError.message };
  }

  return { user, profile, error: null };
});

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, error } = await getAuthenticatedAdmin();
  
  // Redirect to login if not authenticated
  if (!user) {
    redirect('/admin/login');
  }

  // Redirect to home if not admin or if there's an error fetching profile
  if (error || profile?.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <Sidebar />
      <div className="flex flex-col flex-1 sm:ml-64">
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}