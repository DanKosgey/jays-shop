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
import { MoreHorizontal, PlusCircle, File } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockTickets } from "@/lib/mock-data";
import { RepairTicket } from "@/lib/types";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const statusVariant: { [key in RepairTicket["status"]]: "default" | "secondary" | "destructive" | "outline" } = {
    received: "outline",
    diagnosing: "secondary",
    awaiting_parts: "secondary",
    repairing: "default",
    quality_check: "default",
    ready: "outline",
    completed: "secondary",
    cancelled: "destructive",
}

export default function TicketsPage() {
  const allTickets = mockTickets;
  const activeTickets = mockTickets.filter(t => t.status !== 'completed' && t.status !== 'cancelled');
  const completedTickets = mockTickets.filter(t => t.status === 'completed');
  const cancelledTickets = mockTickets.filter(t => t.status === 'cancelled');

  const renderTicketTable = (tickets: RepairTicket[]) => (
     <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticket ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Est. Cost</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className="font-medium">{ticket.ticketNumber}</TableCell>
              <TableCell>{ticket.customerName}</TableCell>
              <TableCell>{ticket.deviceBrand} {ticket.deviceModel}</TableCell>
              <TableCell>
                <Badge variant={statusVariant[ticket.status]} className="capitalize">
                  {ticket.status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {ticket.estimatedCost ? `Ksh${ticket.estimatedCost.toFixed(2)}` : 'N/A'}
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
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Update Status</DropdownMenuItem>
                    <DropdownMenuItem>Print Label</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Cancel Ticket</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
  )

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AdminHeader title="Repair Tickets" />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Tabs defaultValue="active">
            <div className="flex items-center">
                 <TabsList>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                    <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                    <Button size="sm" variant="outline" className="h-8 gap-1">
                        <File className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
                    </Button>
                    <Button size="sm" className="h-8 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Create Ticket</span>
                    </Button>
                </div>
            </div>
            <Card className="mt-4">
                <CardContent className="p-0">
                    <TabsContent value="active">
                        {renderTicketTable(activeTickets)}
                    </TabsContent>
                    <TabsContent value="completed">
                        {renderTicketTable(completedTickets)}
                    </TabsContent>
                    <TabsContent value="cancelled">
                        {renderTicketTable(cancelledTickets)}
                    </TabsContent>
                    <TabsContent value="all">
                        {renderTicketTable(allTickets)}
                    </TabsContent>
                </CardContent>
            </Card>
        </Tabs>
      </main>
    </div>
  );
}
