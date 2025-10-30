"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Wrench, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  AlertCircle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ticketsDb } from "@/lib/db/tickets"
import { productsDb } from "@/lib/db/products"
import { Database } from "../../types/database.types"

type Ticket = Database['public']['Tables']['tickets']['Row']
type Product = Database['public']['Tables']['products']['Row']

export default function Dashboard() {
  const { toast } = useToast()
  const router = useRouter()
  const [stats, setStats] = useState([
    { title: "Total Tickets", value: "0", change: "+0%", icon: Wrench },
    { title: "Products Sold", value: "0", change: "+0%", icon: Package },
    { title: "Orders", value: "0", change: "+0%", icon: ShoppingCart },
    { title: "Customers", value: "0", change: "+0%", icon: Users },
  ])
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch tickets data
      const tickets = await ticketsDb.getAll()
      
      // Update stats with real data
      const updatedStats = [...stats]
      updatedStats[0].value = tickets.length.toString()
      
      // For now, we'll use mock values for other stats
      // In a real application, you would fetch actual data for products, orders, and customers
      updatedStats[1].value = "243"
      updatedStats[2].value = "89"
      updatedStats[3].value = "1,243"
      
      setStats(updatedStats)
      setRecentTickets(tickets.slice(0, 3)) // Get first 3 tickets as recent
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch dashboard data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewTicket = () => {
    router.push("/admin/tickets/new")
  }

  const handleAddProduct = () => {
    router.push("/admin/products/new")
  }

  const handleNewCustomer = () => {
    router.push("/admin/customers/new")
  }

  const handleNewOrder = () => {
    router.push("/admin/orders/new")
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in progress': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard. Here's what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
            <CardDescription>
              Latest repair tickets and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTickets.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No tickets found</p>
              ) : (
                recentTickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{ticket.ticket_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {ticket.customer_name} • {ticket.device_brand} {ticket.device_model}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks you can perform quickly
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={handleNewTicket}>
              <Wrench className="h-5 w-5" />
              <span>New Ticket</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={handleAddProduct}>
              <Package className="h-5 w-5" />
              <span>Add Product</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={handleNewCustomer}>
              <Users className="h-5 w-5" />
              <span>New Customer</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={handleNewOrder}>
              <ShoppingCart className="h-5 w-5" />
              <span>New Order</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}