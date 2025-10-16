import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { getEnv } from '@/server/env';

export function getSupabaseServerClient() {
  const env = getEnv();
  const cookieStore = cookies();
  // createServerClient uses cookie get/set to persist auth
  const client = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set(name, value, options);
        } catch {
          // no-op in edge where readonly; middleware handles set via response
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set(name, '', { ...options, maxAge: 0 });
        } catch {
          // no-op
        }
      },
    },
  });
  return client;
}
