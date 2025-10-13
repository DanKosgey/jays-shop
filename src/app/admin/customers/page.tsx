
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
import { MoreHorizontal, PlusCircle, Search, Users, DollarSign, ShoppingCart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { mockTickets } from "@/lib/mock-data";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Customer = {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalTickets: number;
    totalSpent: number;
}

const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
};

function AddCustomerForm() {
    return (
        <form className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customer-name" className="text-right">Name</Label>
                <Input id="customer-name" placeholder="e.g., John Doe" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customer-email" className="text-right">Email</Label>
                <Input id="customer-email" type="email" placeholder="e.g., john.d@example.com" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customer-phone" className="text-right">Phone</Label>
                <Input id="customer-phone" type="tel" placeholder="e.g., 555-0199" className="col-span-3" />
            </div>
        </form>
    );
}

export default function CustomersPage() {
    const customers: Customer[] = useMemo(() => {
        const customerMap = new Map<string, Customer>();
        mockTickets.forEach(ticket => {
            let customer = customerMap.get(ticket.customerId);
            if (!customer) {
                customer = {
                    id: ticket.customerId,
                    name: ticket.customerName,
                    email: `${ticket.customerName.toLowerCase().replace(' ', '.')}@example.com`,
                    phone: `555-01${Math.floor(Math.random() * 90) + 10}`,
                    totalTickets: 0,
                    totalSpent: 0
                }
            }
            customer.totalTickets += 1;
            customer.totalSpent += ticket.finalCost || ticket.estimatedCost || 0;
            customerMap.set(ticket.customerId, customer);
        });
        return Array.from(customerMap.values());
    }, []);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const totalCustomerCount = customers.length;
  const totalRevenue = customers.reduce((acc, customer) => acc + customer.totalSpent, 0);
  const avgRevenuePerCustomer = totalRevenue / totalCustomerCount;

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AdminHeader title="Customers" />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCustomerCount}</div>
              <p className="text-xs text-muted-foreground">Unique customers in the system</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customer Spending</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all orders and repairs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Revenue/Customer</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh{avgRevenuePerCustomer.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Average lifetime value</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                 <div>
                    <CardTitle>Customer List</CardTitle>
                    <CardDescription>Manage your customer database.</CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <div className="relative flex-1 max-w-xs">
                        <Input placeholder="Search customers..." className="pl-10 h-10"/>
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
                    </div>
                     <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="h-10 gap-1">
                                <PlusCircle className="h-4 w-4" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Customer</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Customer</DialogTitle>
                                <DialogDescription>
                                    Enter the details for the new customer.
                                </DialogDescription>
                            </DialogHeader>
                            <AddCustomerForm />
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                                <Button onClick={() => setIsCreateOpen(false)}>Add Customer</Button>
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
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead className="hidden sm:table-cell text-center">Total Tickets</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                         <Avatar className="h-9 w-9">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${customer.email}`} alt={customer.name} />
                            <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{customer.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                        <div className="text-sm text-muted-foreground">{customer.phone}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-center">{customer.totalTickets}</TableCell>
                    <TableCell className="text-right">Ksh{customer.totalSpent.toFixed(2)}</TableCell>
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
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                           <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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
