import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSupabaseServerClient } from '@/server/supabase/server'
import { cookies } from 'next/headers'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the request is for an admin route
  if (pathname.startsWith('/admin')) {
    // Create Supabase server client
    const supabase = getSupabaseServerClient()
    
    // Get the user session
    const { data: { session } } = await supabase.auth.getSession()
    
    // If no session, redirect to login
    if (!session) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
    
    // Get user role from profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()
    
    // If there's an error or user is not admin, redirect to home
    if (error || profile?.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}