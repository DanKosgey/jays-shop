import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Eye, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { ordersDb } from "@/lib/db/orders";
import { Database } from "../../../types/database.types";

type Order = Database['public']['Tables']['orders']['Row'] & {
  order_items: (Database['public']['Tables']['order_items']['Row'] & {
    products: Database['public']['Tables']['products']['Row'] | null
  })[]
};

const statusColors = {
  pending: "bg-status-diagnosing/20 text-status-diagnosing border-status-diagnosing/30",
  shipped: "bg-status-repairing/20 text-status-repairing border-status-repairing/30",
  delivered: "bg-status-completed/20 text-status-completed border-status-completed/30",
  cancelled: "bg-destructive/20 text-destructive border-destructive/30",
};

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersDb.getAll();
      setOrders(data as Order[] || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    // In a real implementation, you would filter orders based on the search term
    // For now, we'll just refetch all orders
    fetchOrders();
  };

  const updateOrderStatus = async (orderId: string, newStatus: Database['public']['Enums']['order_status']) => {
    try {
      const updatedOrder = await ordersDb.update(orderId, { status: newStatus });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, ...updatedOrder } : order
      ) as Order[]);
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, ...updatedOrder } as Order);
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground">Manage customer orders</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex justify-center items-center h-32">
            <p>Loading orders...</p>
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
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground">Manage customer orders</p>
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
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full md:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
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
                <TableHead>Order Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.order_number}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customer_name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{order.order_items.length} item(s)</TableCell>
                    <TableCell className="font-semibold">KSh {order.total_amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[order.status]}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Order Details</DialogTitle>
                            <DialogDescription>
                              Order {order.order_number}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Customer</p>
                                <p className="font-medium">{order.customer_name}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Status</p>
                                <Badge variant="outline" className={statusColors[order.status]}>
                                  {order.status}
                                </Badge>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-2">Order Items</p>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {order.order_items.map((item) => (
                                    <TableRow key={item.id}>
                                      <TableCell>{item.products?.name || "Unknown Product"}</TableCell>
                                      <TableCell>{item.quantity}</TableCell>
                                      <TableCell className="text-right">KSh {item.price_per_unit.toLocaleString()}</TableCell>
                                      <TableCell className="text-right">
                                        KSh {(item.price_per_unit * item.quantity).toLocaleString()}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>

                            <div className="border-t pt-4">
                              <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>KSh {order.total_amount.toLocaleString()}</span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => updateOrderStatus(order.id, "shipped")}
                                disabled={order.status === "shipped" || order.status === "delivered" || order.status === "cancelled"}
                              >
                                Mark as Shipped
                              </Button>
                              <Button 
                                className="flex-1"
                                onClick={() => updateOrderStatus(order.id, "delivered")}
                                disabled={order.status === "delivered" || order.status === "cancelled"}
                              >
                                Mark as Delivered
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No orders found
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

export default AdminOrders;