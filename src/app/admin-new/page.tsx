'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'

export default function AdminNewPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (isAuthenticated && user?.role === 'admin') {
      // Redirect to admin dashboard
      router.push('/admin')
    } else if (isAuthenticated) {
      // Authenticated but not admin, redirect to home
      router.push('/')
    } else {
      // Not authenticated, redirect to login
      router.push('/login?redirect=/admin')
    }
  }, [isAuthenticated, user, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  )
}