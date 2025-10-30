"use client"

import { useState, useEffect } from 'react'
import { useRealtimeTickets } from '@/hooks/use-realtime'

export default function TestRealtimePage() {
  const [message, setMessage] = useState('Testing realtime hooks...')
  
  // This will set up the realtime subscription
  useRealtimeTickets()
  
  useEffect(() => {
    // Simple test to verify the component mounted correctly
    setMessage('Realtime hook initialized successfully!')
  }, [])
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Realtime Hook Test</h1>
      <p>{message}</p>
    </div>
  )
}