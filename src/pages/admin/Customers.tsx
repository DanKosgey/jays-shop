import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Eye, User, Mail, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { customersDb } from "@/lib/db/customers";
import { ticketsDb } from "@/lib/db/tickets";
import { ordersDb } from "@/lib/db/orders";
import { Database } from "../../../types/database.types";

type Customer = Database['public']['Tables']['customers']['Row'];
type Ticket = Database['public']['Tables']['tickets']['Row'];
type Order = Database['public']['Tables']['orders']['Row'];

const AdminCustomers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerTickets, setCustomerTickets] = useState<Ticket[]>([]);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customersDb.getAll();
      setCustomers(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      fetchCustomers();
      return;
    }
    
    try {
      setLoading(true);
      const data = await customersDb.search(term);
      setCustomers(data || []);
      setError(null);
    } catch (err) {
      console.error("Error searching customers:", err);
      setError("Failed to search customers");
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDetails = async (customer: Customer) => {
    setSelectedCustomer(customer);
    
    try {
      // Fetch customer's tickets
      if (customer.user_id) {
        const tickets = await ticketsDb.getByUserId(customer.user_id);
        setCustomerTickets(tickets || []);
        
        // Fetch customer's orders
        const orders = await ordersDb.getByUserId(customer.user_id);
        setCustomerOrders(orders || []);
      }
    } catch (err) {
      console.error("Error fetching customer details:", err);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Customers</h1>
            <p className="text-muted-foreground">Manage customer information</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex justify-center items-center h-32">
            <p>Loading customers...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Customers</h1>
            <p className="text-muted-foreground">Manage customer information</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex justify-center items-center h-32">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage customer information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full md:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Tickets</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="font-medium">{customer.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {customerTickets.filter(t => t.user_id === customer.user_id).length} Tickets
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {customerOrders.filter(o => o.user_id === customer.user_id).length} Orders
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => fetchCustomerDetails(customer)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Customer Details</DialogTitle>
                            <DialogDescription>
                              Complete customer information and history
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Name</p>
                                <p className="font-medium">{customer.name}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Email</p>
                                <p className="font-medium">{customer.email}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                                <p className="font-medium">{customer.phone || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Joined</p>
                                <p className="font-medium">
                                  {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : "N/A"}
                                </p>
                              </div>
                            </div>

                            <Tabs defaultValue="tickets">
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="tickets">
                                  Tickets ({customerTickets.filter(t => t.user_id === customer.user_id).length})
                                </TabsTrigger>
                                <TabsTrigger value="orders">
                                  Orders ({customerOrders.filter(o => o.user_id === customer.user_id).length})
                                </TabsTrigger>
                              </TabsList>
                              <TabsContent value="tickets" className="space-y-4">
                                <div className="border rounded-lg">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Ticket Number</TableHead>
                                        <TableHead>Device</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {customerTickets
                                        .filter(t => t.user_id === customer.user_id)
                                        .map((ticket) => (
                                          <TableRow key={ticket.id}>
                                            <TableCell className="font-medium">{ticket.ticket_number}</TableCell>
                                            <TableCell>
                                              {ticket.device_brand} {ticket.device_model}
                                            </TableCell>
                                            <TableCell>
                                              <Badge variant="outline">{ticket.status}</Badge>
                                            </TableCell>
                                            <TableCell>
                                              {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : "N/A"}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      {customerTickets.filter(t => t.user_id === customer.user_id).length === 0 && (
                                        <TableRow>
                                          <TableCell colSpan={4} className="text-center text-muted-foreground">
                                            No tickets found
                                          </TableCell>
                                        </TableRow>
                                      )}
                                    </TableBody>
                                  </Table>
                                </div>
                              </TabsContent>
                              <TabsContent value="orders" className="space-y-4">
                                <div className="border rounded-lg">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Order Number</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {customerOrders
                                        .filter(o => o.user_id === customer.user_id)
                                        .map((order) => (
                                          <TableRow key={order.id}>
                                            <TableCell className="font-medium">{order.order_number}</TableCell>
                                            <TableCell>KSh {order.total_amount.toLocaleString()}</TableCell>
                                            <TableCell>
                                              <Badge variant="outline">{order.status}</Badge>
                                            </TableCell>
                                            <TableCell>
                                              {order.created_at ? new Date(order.created_at).toLocaleDateString() : "N/A"}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      {customerOrders.filter(o => o.user_id === customer.user_id).length === 0 && (
                                        <TableRow>
                                          <TableCell colSpan={4} className="text-center text-muted-foreground">
                                            No orders found
                                          </TableCell>
                                        </TableRow>
                                      )}
                                    </TableBody>
                                  </Table>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No customers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCustomers;