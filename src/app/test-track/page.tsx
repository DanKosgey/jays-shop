"use client"

import { useState } from 'react'
import { getSupabaseBrowserClient } from '@/server/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestTrackPage() {
  const [status, setStatus] = useState('')
  const [error, setError] = useState(null)
  const [customerName, setCustomerName] = useState('John Doe')
  const [customerPhone, setCustomerPhone] = useState('(555) 123-4567')

  const createTestTicket = async () => {
    try {
      setStatus('Creating test ticket...')
      setError(null)
      
      const supabase = getSupabaseBrowserClient()
      
      // Get the current user ID or use a placeholder
      const { data: { user } } = await supabase.auth.getUser()
      const userId = user?.id || '00000000-0000-0000-0000-000000000000'
      
      // Generate a unique ticket number
      const ticketNumber = `TKT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`
      
      // Create a test ticket
      const { data, error: insertError } = await supabase
        .from('tickets')
        .insert({
          user_id: userId,
          ticket_number: ticketNumber,
          customer_name: customerName,
          customer_phone: customerPhone,
          device_type: 'Smartphone',
          device_brand: 'Apple',
          device_model: 'iPhone 15',
          issue_description: 'Screen replacement needed',
          status: 'received',
          priority: 'normal'
        })
        .select()
        .single()
      
      if (insertError) {
        setStatus('Failed to create test ticket')
        setError(insertError.message)
      } else {
        setStatus(`Test ticket created successfully! Ticket ID: ${data.id}`)
        setError(null)
      }
    } catch (err) {
      setStatus('Failed to create test ticket')
      setError(err.message)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Test Track Functionality</CardTitle>
          <CardDescription>
            Create a test ticket to verify the tracking functionality works with name and phone number
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerPhone">Phone Number</Label>
            <Input
              id="customerPhone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>
          {status && (
            <div className={`p-2 rounded ${error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {status}
            </div>
          )}
          {error && (
            <div className="p-2 bg-red-100 text-red-800 rounded">
              <strong>Error:</strong> {error}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={createTestTicket} className="w-full">
            Create Test Ticket
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}