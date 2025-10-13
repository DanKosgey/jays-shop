"use client";

import { AdminHeader } from "../components/header";
import {
  Card,
  CardContent,
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
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockTickets } from "@/lib/mock-data";
import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AdminHeader title="Customers" />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="flex items-center">
            <div className="ml-auto flex items-center gap-2">
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Customer</span>
                </Button>
            </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customer List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-center">Total Tickets</TableHead>
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
                    <TableCell>
                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                        <div className="text-sm text-muted-foreground">{customer.phone}</div>
                    </TableCell>
                    <TableCell className="text-center">{customer.totalTickets}</TableCell>
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
