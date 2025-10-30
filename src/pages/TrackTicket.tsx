"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Wrench } from "lucide-react"
import { ticketsDb } from "@/lib/db/tickets"

export default function TrackTicket() {
  const [customerName, setCustomerName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [ticketsData, setTicketsData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName || !phoneNumber) {
      setError("Please enter both your name and phone number")
      return
    }

    // Basic validation for phone number format
    // Allow common phone number formats: (123) 456-7890, 123-456-7890, 123.456.7890, 1234567890
    const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/
    if (!phoneRegex.test(phoneNumber)) {
      setError("Please enter a valid phone number (e.g., (555) 123-4567 or 555-123-4567)")
      return
    }

    // Basic validation for customer name (at least 2 characters)
    if (customerName.trim().length < 2) {
      setError("Please enter a valid name (at least 2 characters)")
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      // Fetch tickets data from the database by customer name and phone number
      const data = await ticketsDb.getByCustomerInfo(customerName.trim(), phoneNumber.trim())
      
      if (data && data.length > 0) {
        setTicketsData(data)
      } else {
        setError("No repair tickets found for the provided name and phone number.")
      }
    } catch (error: any) {
      console.error("Error fetching tickets:", error)
      setError("Failed to fetch ticket information. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleContactSupport = () => {
    toast({
      title: "Contact Support",
      description: "You can reach our support team at support@repairhub.com or call (555) 123-4567.",
    });
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in progress': 
      case 'repairing': 
      case 'quality_check': 
      case 'diagnosing': return 'bg-blue-100 text-blue-800'
      case 'pending': 
      case 'received': 
      case 'awaiting_parts': return 'bg-yellow-100 text-yellow-800'
      case 'ready': return 'bg-purple-100 text-purple-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Track Your Repairs</CardTitle>
              <CardDescription className="text-center">
                Enter your name and phone number to check the status of your repairs
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Full Name</Label>
                  <Input
                    id="customerName"
                    placeholder="e.g., John Smith"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="e.g., (555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Searching..." : "Track Repairs"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {ticketsData.length > 0 && (
            <div className="mt-6 space-y-4">
              <h2 className="text-xl font-bold">Your Repair Tickets</h2>
              {ticketsData.map((ticketData) => (
                <Card key={ticketData.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">Repair Ticket #{ticketData.ticket_number}</CardTitle>
                        <CardDescription>{ticketData.customer_name}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(ticketData.status)}>
                        {ticketData.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Wrench className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Device</p>
                          <p className="font-medium">{ticketData.device_brand} {ticketData.device_model}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Issue</p>
                          <p className="font-medium">{ticketData.issue_description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Created</p>
                          <p className="font-medium">
                            {new Date(ticketData.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Estimated Completion</p>
                          <p className="font-medium">
                            {ticketData.estimated_completion 
                              ? new Date(ticketData.estimated_completion).toLocaleDateString()
                              : 'Not set'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Card>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={handleContactSupport}>
                    Contact Support
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}