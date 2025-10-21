import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getEnv } from '@/server/env';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // ✅ IMPORTANT: Let login page load without ANY processing
  if (pathname === '/admin/login' || pathname === '/admin') {
    console.log('[MIDDLEWARE] Allowing access to login page');
    return NextResponse.next();
  }
  
  const env = getEnv();
  const res = NextResponse.next();

  // Check if required environment variables are present
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('[MIDDLEWARE] Missing Supabase environment variables');
    return NextResponse.next();
  }

  const supabase = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        res.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: any) {
        res.cookies.set({ name, value: '', ...options, maxAge: 0 });
      },
    },
  });

  // Protect all admin routes except login
  if (pathname.startsWith('/admin/')) {
    console.log('[MIDDLEWARE] Checking authentication for admin route:', pathname);
    const { data: { user } } = await supabase.auth.getUser();
    console.log('[MIDDLEWARE] User authentication result:', { user });
    
    if (!user) {
      console.log('[MIDDLEWARE] No user found, redirecting to login');
      const url = new URL('/admin/login', req.url);
      return NextResponse.redirect(url);
    }
    
    console.log('[MIDDLEWARE] User authenticated, allowing access');
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};