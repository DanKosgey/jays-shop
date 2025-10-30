import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSupabaseServerClient } from '@/server/supabase/server'

// Use the middleware function name but add a comment about the deprecation
// Next.js is moving toward a proxy pattern, but for now we still need to use middleware
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
    // Using select without .single() to avoid Accept header issues
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .limit(1)
    
    // Extract the first item from the array if data exists
    const profile = profileData && profileData.length > 0 ? profileData[0] : null
    
    // If there's an error or user is not admin, redirect to home
    if (error || profile?.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }
  
  return NextResponse.next()
}

// Update the config to be more specific about routes
export const config = {
  matcher: [
    '/admin/:path*',
  ],
}