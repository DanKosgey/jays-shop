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

export default function Dashboard() {
  const { toast } = useToast()
  const router = useRouter()

  // Mock data
  const stats = [
    { title: "Total Tickets", value: "142", change: "+12%", icon: Wrench },
    { title: "Products Sold", value: "243", change: "+8%", icon: Package },
    { title: "Orders", value: "89", change: "+5%", icon: ShoppingCart },
    { title: "Customers", value: "1,243", change: "+3%", icon: Users },
  ]

  const recentTickets = [
    { id: "TKT-2023-001", customer: "John Doe", device: "iPhone 13", status: "In Progress", date: "2023-06-15" },
    { id: "TKT-2023-002", customer: "Jane Smith", device: "Samsung Galaxy S21", status: "Completed", date: "2023-06-14" },
    { id: "TKT-2023-003", customer: "Robert Johnson", device: "Google Pixel 6", status: "Pending", date: "2023-06-14" },
  ]

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
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{ticket.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {ticket.customer} • {ticket.device}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {ticket.date}
                    </span>
                  </div>
                </div>
              ))}
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