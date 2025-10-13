"use client";

import { AdminHeader } from "../components/header";
import {
  Card,
  CardContent,
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
import { MoreHorizontal, PlusCircle, File, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockTickets } from "@/lib/mock-data";
import { RepairTicket } from "@/lib/types";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useState, useMemo } from "react";
import { differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

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

const statusOptions: RepairTicket["status"][] = ['received', 'diagnosing', 'awaiting_parts', 'repairing', 'quality_check', 'ready', 'completed', 'cancelled'];
const priorityOptions: RepairTicket["priority"][] = ['low', 'normal', 'high', 'urgent'];

function EditTicketForm({ ticket }: { ticket: RepairTicket }) {
    return (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customerName" className="text-right">Customer</Label>
                <Input id="customerName" defaultValue={ticket.customerName} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="device" className="text-right">Device</Label>
                <Input id="device" defaultValue={`${ticket.deviceBrand} ${ticket.deviceModel}`} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="issue" className="text-right">Issue</Label>
                <Textarea id="issue" defaultValue={ticket.issueDescription} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                 <Select defaultValue={ticket.status}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        {statusOptions.map(status => (
                            <SelectItem key={status} value={status} className="capitalize">{status.replace('_', ' ')}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">Priority</Label>
                 <Select defaultValue={ticket.priority}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                        {priorityOptions.map(priority => (
                            <SelectItem key={priority} value={priority} className="capitalize">{priority}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="estimatedCost" className="text-right">Est. Cost</Label>
                <Input id="estimatedCost" type="number" defaultValue={ticket.estimatedCost || ''} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="finalCost" className="text-right">Final Cost</Label>
                <Input id="finalCost" type="number" defaultValue={ticket.finalCost || ''} className="col-span-3" />
            </div>
        </div>
    )
}


export default function TicketsPage() {
  const [allTickets, setAllTickets] = useState(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<RepairTicket | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const sortedTickets = useMemo(() => {
    return [...allTickets].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [allTickets]);

  const activeTickets = sortedTickets.filter(t => t.status !== 'completed' && t.status !== 'cancelled');
  const completedTickets = sortedTickets.filter(t => t.status === 'completed');
  const cancelledTickets = sortedTickets.filter(t => t.status === 'cancelled');

  const handleEditClick = (ticket: RepairTicket) => {
      setSelectedTicket(ticket);
      setIsEditDialogOpen(true);
  }

  const renderTicketTable = (tickets: RepairTicket[]) => (
     <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticket ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Age (Days)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Est. Cost</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => {
            const ageInDays = differenceInDays(new Date(), new Date(ticket.createdAt));
            const isOverdue = ageInDays > 7 && ticket.status !== 'completed' && ticket.status !== 'cancelled';

            return (
                <TableRow key={ticket.id} className={cn(isOverdue && "bg-destructive/10 hover:bg-destructive/20")}>
                <TableCell className="font-medium">{ticket.ticketNumber}</TableCell>
                <TableCell>{ticket.customerName}</TableCell>
                <TableCell>
                    <span className={cn("font-semibold", isOverdue ? "text-destructive" : "text-muted-foreground")}>
                        {ageInDays}
                    </span>
                </TableCell>
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
                        <DropdownMenuItem onClick={() => handleEditClick(ticket)}>
                            <Edit className="mr-2 h-4 w-4" />
                            View/Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Print Label</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Cancel Ticket</DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
                </TableRow>
            )
        })}
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
                        {renderTicketTable(sortedTickets)}
                    </TabsContent>
                </CardContent>
            </Card>
        </Tabs>
      </main>

       {selectedTicket && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Ticket: {selectedTicket.ticketNumber}</DialogTitle>
                    <DialogDescription>
                        Update the details and status of this repair ticket. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <EditTicketForm ticket={selectedTicket} />
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

    