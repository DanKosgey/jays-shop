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
  const [ticketNumber, setTicketNumber] = useState('')
  const [ticketData, setTicketData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketNumber) return

    setIsLoading(true)
    setError(null)
    
    try {
      // Fetch ticket data from the database
      const data = await ticketsDb.getByTicketNumber(ticketNumber)
      
      if (data) {
        setTicketData(data)
      } else {
        setError("Ticket not found. Please check the ticket number and try again.")
      }
    } catch (error: any) {
      console.error("Error fetching ticket:", error)
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
      case 'in progress': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Track Your Repair</CardTitle>
              <CardDescription className="text-center">
                Enter your ticket number to check the status of your repair
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ticketNumber">Ticket Number</Label>
                  <Input
                    id="ticketNumber"
                    placeholder="e.g., TKT-2023-00123"
                    value={ticketNumber}
                    onChange={(e) => setTicketNumber(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Searching..." : "Track Repair"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {ticketData && (
            <Card className="mt-6">
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
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={handleContactSupport}>
                  Contact Support
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}