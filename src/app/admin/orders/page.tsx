"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  PlusCircle, 
  ShoppingCart, 
  Search, 
  Edit, 
  Trash2,
  AlertTriangle,
  Printer,
  FileText,
  Menu
} from "lucide-react";
import { differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileNav } from "../components/mobile-nav";

const statusVariant = {
  pending: "outline",
  shipped: "secondary",
  delivered: "default",
  cancelled: "destructive",
};

const statusOptions = ['pending', 'shipped', 'delivered', 'cancelled'];

export default function OrdersPage() {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const sortedOrders = useMemo(() => {
    return [...allOrders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [allOrders]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders', { cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`);
        const json = await res.json();
        setAllOrders(json.orders || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const pendingOrders = sortedOrders.filter(o => o.status === 'pending');
  const shippedOrders = sortedOrders.filter(o => o.status === 'shipped');
  const deliveredOrders = sortedOrders.filter(o => o.status === 'delivered');
  const cancelledOrders = sortedOrders.filter(o => o.status === 'cancelled');

  const handleEditClick = (order) => {
      setSelectedOrder(order);
      setIsEditDialogOpen(true);
  };
  
  const totalOrders = sortedOrders.length;
  const totalPending = pendingOrders.length;
  const totalShipped = shippedOrders.length;

  const renderOrderTable = (orders) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px] hidden sm:table-cell">Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead className="w-[100px] hidden md:table-cell text-center">Items</TableHead>
          <TableHead className="w-[100px] hidden md:table-cell text-center">Age</TableHead>
          <TableHead className="w-[150px]">Status</TableHead>
          <TableHead className="w-[120px] text-right">Total</TableHead>
          <TableHead className="w-[50px]">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length > 0 ? orders.map((order) => {
          const ageInDays = differenceInDays(new Date(), new Date(order.created_at));

          return (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-xs hidden sm:table-cell">{order.order_number}</TableCell>
              <TableCell>
                <div className="font-medium">{order.customer_name}</div>
                <div className="text-xs text-muted-foreground sm:hidden">{order.order_number}</div>
              </TableCell>
              <TableCell className="hidden md:table-cell text-center">
                <span className="text-muted-foreground">
                  {order.items?.length || 0}
                </span>
              </TableCell>
              <TableCell className="hidden md:table-cell text-center">
                <span className="text-muted-foreground">
                  {ageInDays}d
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant[order.status]} className="capitalize">
                  {order.status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                Ksh{order.total_amount?.toFixed(2) || '0.00'}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEditClick(order)}>
                      <Edit className="mr-2 h-4 w-4" />
                      View/Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Printer className="mr-2 h-4 w-4" />
                      Print Invoice
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Cancel Order
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        }) : (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              No orders found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <MobileNav />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        </div>
      </header>

      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">All orders in system</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPending}</div>
              <p className="text-xs text-muted-foreground">Awaiting processing</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shipped Orders</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalShipped}</div>
              <p className="text-xs text-muted-foreground">In transit</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered Orders</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deliveredOrders.length}</div>
              <p className="text-xs text-muted-foreground">Successfully delivered</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table with Tabs */}
        <Tabs defaultValue="all">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Create Order</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px]">
                  <DialogHeader>
                    <DialogTitle>Create New Order</DialogTitle>
                    <DialogDescription>
                      Fill out the form below to create a new order.
                    </DialogDescription>
                  </DialogHeader>
                  <CreateOrderForm />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => setIsCreateDialogOpen(false)}>Create Order</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <Card className="mt-4">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>Manage all customer orders and their status.</CardDescription>
                </div>
                <div className="relative flex-1 sm:ml-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by customer or order ID..."
                    className="pl-8 h-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading && <div className="text-sm text-muted-foreground py-4">Loading orders...</div>}
              {error && <div className="text-sm text-destructive py-4">{error}</div>}
              <TabsContent value="all" className="m-0">
                {renderOrderTable(sortedOrders)}
              </TabsContent>
              <TabsContent value="pending" className="m-0">
                {renderOrderTable(pendingOrders)}
              </TabsContent>
              <TabsContent value="shipped" className="m-0">
                {renderOrderTable(shippedOrders)}
              </TabsContent>
              <TabsContent value="delivered" className="m-0">
                {renderOrderTable(deliveredOrders)}
              </TabsContent>
              <TabsContent value="cancelled" className="m-0">
                {renderOrderTable(cancelledOrders)}
              </TabsContent>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-{sortedOrders.length}</strong> of <strong>{sortedOrders.length}</strong> orders
              </div>
            </CardFooter>
          </Card>
        </Tabs>
      </main>

      {/* Edit Order Dialog */}
      {selectedOrder && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Order: {selectedOrder.order_number}</DialogTitle>
              <DialogDescription>
                Update the details and status of this order. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <EditOrderForm order={selectedOrder} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button type="submit" onClick={() => setIsEditDialogOpen(false)}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function EditOrderForm({ order }) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="customerName" className="text-right">Customer</Label>
        <Input 
          id="customerName" 
          defaultValue={order.customer_name} 
          className="col-span-3" 
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-right">Status</Label>
        <Select defaultValue={order.status}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(status => (
              <SelectItem 
                key={status} 
                value={status} 
                className="capitalize"
              >
                {status.replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="totalAmount" className="text-right">Total Amount</Label>
        <Input 
          id="totalAmount" 
          type="number" 
          defaultValue={order.total_amount || ''} 
          className="col-span-3" 
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="orderItems" className="text-right">Items</Label>
        <Textarea 
          id="orderItems" 
          defaultValue={JSON.stringify(order.items || [], null, 2)} 
          className="col-span-3 min-h-[150px] font-mono text-xs" 
        />
      </div>
    </div>
  );
}

function CreateOrderForm() {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="new-customerName" className="text-right">Customer</Label>
        <Input 
          id="new-customerName" 
          placeholder="e.g., John Doe" 
          className="col-span-3" 
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="new-items" className="text-right">Items</Label>
        <Textarea 
          id="new-items" 
          placeholder="Enter items (JSON format)..." 
          className="col-span-3 min-h-[100px]" 
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="new-totalAmount" className="text-right">Total Amount (Ksh)</Label>
        <Input 
          id="new-totalAmount" 
          type="number" 
          placeholder="e.g., 15000" 
          className="col-span-3" 
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="new-status" className="text-right">Status</Label>
        <Select defaultValue="pending">
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(status => (
              <SelectItem 
                key={status} 
                value={status} 
                className="capitalize"
              >
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}