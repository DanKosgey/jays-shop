
"use client";

import { AdminHeader } from "../components/header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
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
import { MoreHorizontal, PlusCircle, Search, ListFilter, DollarSign, ShoppingCart, Truck, Ban } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Order = {
    id: string;
    customerName: string;
    date: string;
    status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
    total: number;
}

const mockOrders: Order[] = [
    { id: "ORD-001", customerName: "Alice Johnson", date: "2024-07-22", status: "Delivered", total: 44.98 },
    { id: "ORD-002", customerName: "Bob Williams", date: "2024-07-21", status: "Shipped", total: 89.00 },
    { id: "ORD-003", customerName: "Charlie Brown", date: "2024-07-21", status: "Pending", total: 39.99 },
    { id: "ORD-004", customerName: "Diana Prince", date: "2024-07-20", status: "Cancelled", total: 129.99 },
    { id: "ORD-005", customerName: "Ethan Hunt", date: "2024-07-19", status: "Delivered", total: 14.99 },
    { id: "ORD-006", customerName: "Fiona Glenanne", date: "2024-07-23", status: "Pending", total: 250.00 },
    { id: "ORD-007", customerName: "Alice Johnson", date: "2024-07-24", status: "Shipped", total: 75.50 },
]


const statusVariant: { [key in Order["status"]]: "default" | "secondary" | "destructive" | "outline" } = {
    Pending: "outline",
    Shipped: "default",
    Delivered: "secondary",
    Cancelled: "destructive",
}

const orderStatusOptions: Order["status"][] = ["Pending", "Shipped", "Delivered", "Cancelled"];

function CreateOrderForm() {
    return (
        <form className="grid gap-4 py-4">
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-customerName" className="text-right">Customer</Label>
                <Input id="new-customerName" placeholder="e.g., John Doe" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-items" className="text-right">Items</Label>
                <Textarea id="new-items" placeholder="List items ordered, one per line..." className="col-span-3 min-h-[100px]" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-status" className="text-right">Status</Label>
                 <Select defaultValue="Pending">
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        {orderStatusOptions.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-total" className="text-right">Total (Ksh)</Label>
                <Input id="new-total" type="number" placeholder="e.g., 99.99" className="col-span-3" />
            </div>
        </form>
    )
}

export default function OrdersPage() {
    const [orders, setOrders] = useState(mockOrders);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const summaryStats = useMemo(() => {
        return orders.reduce((acc, order) => {
            acc.totalRevenue += order.status !== 'Cancelled' ? order.total : 0;
            if(order.status === 'Pending') acc.pendingOrders += 1;
            if(order.status === 'Cancelled') acc.cancelledOrders += 1;
            return acc;
        }, { totalRevenue: 0, pendingOrders: 0, cancelledOrders: 0})
    }, [orders]);


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AdminHeader title="Orders" />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh{summaryStats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">from all successful orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-muted-foreground">in total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">awaiting fulfillment</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelled Orders</CardTitle>
              <Ban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{summaryStats.cancelledOrders}</div>
              <p className="text-xs text-muted-foreground">in total</p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                 <div>
                    <CardTitle>Order Management</CardTitle>
                    <CardDescription>View, manage, and create customer orders.</CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <div className="relative flex-1 max-w-xs">
                        <Input placeholder="Search by customer or ID..." className="pl-10 h-10"/>
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
                    </div>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-10 shrink-0">
                                <ListFilter className="mr-2 h-4 w-4"/>
                                Filter
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {orderStatusOptions.map(status => (
                                <DropdownMenuCheckboxItem key={status}>{status}</DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="h-10 gap-1">
                                <PlusCircle className="h-4 w-4" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Create Order</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Order</DialogTitle>
                                <DialogDescription>
                                    Fill in the details to create a new customer order.
                                </DialogDescription>
                            </DialogHeader>
                            <CreateOrderForm />
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                                <Button onClick={() => setIsCreateOpen(false)}>Create Order</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium hidden sm:table-cell">{order.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-xs text-muted-foreground sm:hidden">{order.id}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{new Date(order.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                        <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">Ksh{order.total.toFixed(2)}</TableCell>
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
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Update Status</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Cancel Order</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
