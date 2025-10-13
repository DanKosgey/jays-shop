
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
import { MoreHorizontal, PlusCircle, File, Edit, Search, ListFilter, AlertTriangle, Ticket as TicketIcon, Package, ChevronUp, ChevronDown, ChevronsUp, ChevronsDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
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

const priorityIcon: { [key in RepairTicket["priority"]]: React.ReactNode } = {
    low: <ChevronDown className="h-4 w-4 text-gray-400" />,
    normal: <div className="h-1 w-4 bg-gray-400 rounded-full" />,
    high: <ChevronUp className="h-4 w-4 text-orange-500" />,
    urgent: <ChevronsUp className="h-4 w-4 text-red-600" />,
}

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

function CreateTicketForm() {
    return (
        <form className="grid gap-4 py-4">
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-customerName" className="text-right">Customer</Label>
                <Input id="new-customerName" placeholder="e.g., John Doe" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-device" className="text-right">Device</Label>
                <Input id="new-device" placeholder="e.g., Apple iPhone 14 Pro" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-issue" className="text-right">Issue</Label>
                <Textarea id="new-issue" placeholder="Describe the issue..." className="col-span-3 min-h-[100px]" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-priority" className="text-right">Priority</Label>
                 <Select defaultValue="normal">
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
                <Label htmlFor="new-estimatedCost" className="text-right">Est. Cost (Ksh)</Label>
                <Input id="new-estimatedCost" type="number" placeholder="e.g., 15000" className="col-span-3" />
            </div>
        </form>
    )
}


export default function TicketsPage() {
  const [allTickets, setAllTickets] = useState(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<RepairTicket | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
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
  
  const totalActive = activeTickets.length;
  const totalOverdue = activeTickets.filter(ticket => differenceInDays(new Date(), new Date(ticket.createdAt)) > 7).length;
  const totalAwaitingParts = activeTickets.filter(ticket => ticket.status === 'awaiting_parts').length;


  const renderTicketTable = (tickets: RepairTicket[]) => (
     <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] hidden sm:table-cell">Ticket ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="w-[120px] hidden md:table-cell text-center">Priority</TableHead>
            <TableHead className="w-[100px] hidden md:table-cell text-center">Age</TableHead>
            <TableHead className="w-[150px]">Status</TableHead>
            <TableHead className="w-[120px] text-right hidden sm:table-cell">Est. Cost</TableHead>
            <TableHead className="w-[50px]">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.length > 0 ? tickets.map((ticket) => {
            const ageInDays = differenceInDays(new Date(), new Date(ticket.createdAt));
            const isOverdue = ageInDays > 7 && ticket.status !== 'completed' && ticket.status !== 'cancelled';

            return (
                <TableRow key={ticket.id} className={cn(isOverdue && "bg-destructive/10 hover:bg-destructive/20")}>
                <TableCell className="font-mono text-xs hidden sm:table-cell">{ticket.ticketNumber}</TableCell>
                <TableCell>
                    <div className="font-medium">{ticket.customerName}</div>
                    <div className="text-xs text-muted-foreground sm:hidden">{ticket.ticketNumber}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-center">
                    <div className="flex items-center justify-center gap-2" title={ticket.priority}>
                        {priorityIcon[ticket.priority]}
                        <span className="capitalize sr-only">{ticket.priority}</span>
                    </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-center">
                    <span className={cn("font-semibold", isOverdue ? "text-destructive" : "text-muted-foreground")}>
                        {ageInDays}d
                    </span>
                </TableCell>
                <TableCell>
                    <Badge variant={statusVariant[ticket.status]} className="capitalize">
                    {ticket.status.replace("_", " ")}
                    </Badge>
                </TableCell>
                <TableCell className="text-right hidden sm:table-cell">
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
        }) : (
            <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">No tickets found.</TableCell>
            </TableRow>
        )}
        </TableBody>
      </Table>
  )

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AdminHeader title="Repair Tickets" />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Active Tickets</CardTitle>
              <TicketIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalActive}</div>
              <p className="text-xs text-muted-foreground">Currently in the repair pipeline</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Tickets</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{totalOverdue}</div>
              <p className="text-xs text-muted-foreground">Older than 7 days</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Awaiting Parts</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAwaitingParts}</div>
              <p className="text-xs text-muted-foreground">Tickets waiting for components</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                 <TabsList>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                    <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-8 gap-1">
                                <File className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                             <DialogHeader>
                                <DialogTitle>Export Not Implemented</DialogTitle>
                                <DialogDescription>
                                This feature is for demonstration purposes only.
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="h-8 gap-1">
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Create Ticket</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                             <DialogHeader>
                                <DialogTitle>Create New Repair Ticket</DialogTitle>
                                <DialogDescription>
                                    Fill out the form below to create a new service ticket.
                                </DialogDescription>
                            </DialogHeader>
                            <CreateTicketForm />
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                                <Button onClick={() => setIsCreateDialogOpen(false)}>Create Ticket</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <Card className="mt-4">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Input placeholder="Search by customer or ticket ID..." className="pl-10 h-10"/>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="shrink-0">
                                    <ListFilter className="mr-2 h-4 w-4"/>
                                    Filter
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {statusOptions.map(status => (
                                    <DropdownMenuCheckboxItem key={status}>
                                        <span className="capitalize">{status.replace('_', ' ')}</span>
                                    </DropdownMenuCheckboxItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                                {priorityOptions.map(priority => (
                                    <DropdownMenuCheckboxItem key={priority}>
                                        <span className="capitalize">{priority}</span>
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <TabsContent value="active" className="m-0">
                        {renderTicketTable(activeTickets)}
                    </TabsContent>
                    <TabsContent value="completed" className="m-0">
                        {renderTicketTable(completedTickets)}
                    </TabsContent>
                    <TabsContent value="cancelled" className="m-0">
                        {renderTicketTable(cancelledTickets)}
                    </TabsContent>
                    <TabsContent value="all" className="m-0">
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
