"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function Tickets() {
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  // Mock ticket data
  const tickets = [
    { id: "TKT-2023-001", customer: "John Doe", device: "iPhone 13 Pro", issue: "Screen replacement", status: "In Progress", date: "2023-06-15" },
    { id: "TKT-2023-002", customer: "Jane Smith", device: "Samsung Galaxy S21", issue: "Battery replacement", status: "Completed", date: "2023-06-14" },
    { id: "TKT-2023-003", customer: "Robert Johnson", device: "Google Pixel 6", issue: "Camera repair", status: "Pending", date: "2023-06-14" },
    { id: "TKT-2023-004", customer: "Emily Davis", device: "iPhone 12", issue: "Water damage", status: "In Progress", date: "2023-06-13" },
    { id: "TKT-2023-005", customer: "Michael Wilson", device: "Samsung Galaxy Note 20", issue: "Speaker repair", status: "Completed", date: "2023-06-12" },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in progress': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredTickets = tickets.filter(ticket => 
    ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.issue.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewTicket = (ticketId: string) => {
    // In a real app, this would navigate to a ticket details page
    toast({
      title: "View Ticket",
      description: `Viewing details for ticket ${ticketId}`,
    });
  }

  const handleEditTicket = (ticketId: string) => {
    // In a real app, this would navigate to an edit page
    toast({
      title: "Edit Ticket",
      description: `Editing ticket ${ticketId}`,
    });
  }

  const handleDeleteTicket = (ticketId: string) => {
    // In a real app, this would show a confirmation dialog and then delete the ticket
    toast({
      title: "Delete Ticket",
      description: `Ticket ${ticketId} has been deleted`,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Repair Tickets</h1>
          <p className="text-muted-foreground">
            Manage all repair tickets and their status
          </p>
        </div>
        <Link href="/admin/tickets/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-medium">{ticket.id}</TableCell>
                <TableCell>{ticket.customer}</TableCell>
                <TableCell>{ticket.device}</TableCell>
                <TableCell>{ticket.issue}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>
                </TableCell>
                <TableCell>{ticket.date}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleViewTicket(ticket.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEditTicket(ticket.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteTicket(ticket.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}