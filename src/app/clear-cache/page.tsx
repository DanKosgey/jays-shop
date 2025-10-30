"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ClearCachePage() {
  const router = useRouter()

  useEffect(() => {
    // Clear browser cache
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name)
        })
      })
    }
    
    // Clear localStorage
    localStorage.clear()
    
    // Clear sessionStorage
    sessionStorage.clear()
    
    // Force reload without cache
    router.push('/')
  }, [router])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Clearing Cache...</h1>
      <p>Please wait while we clear the cache and redirect you to the homepage.</p>
    </div>
  )
}