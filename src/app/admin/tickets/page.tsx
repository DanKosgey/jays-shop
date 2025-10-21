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
  Ticket as TicketIcon, 
  Search, 
  Edit, 
  Trash2,
  AlertTriangle,
  Printer,
  FileText,
  Menu
} from "lucide-react";
import { RepairTicket } from "@/lib/types";
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
import { fetchTickets } from "@/lib/data-fetching";
import { transformTicketsData } from "@/lib/data-transform";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileNav } from "../components/mobile-nav";
import { PageLogger } from "../components/page-logger";

const statusVariant: { [key in RepairTicket["status"]]: "default" | "secondary" | "destructive" | "outline" } = {
    received: "outline",
    diagnosing: "secondary",
    awaiting_parts: "secondary",
    repairing: "default",
    quality_check: "default",
    ready: "outline",
    completed: "secondary",
    cancelled: "destructive",
};

const statusOptions: RepairTicket["status"][] = [
  'received', 
  'diagnosing', 
  'awaiting_parts', 
  'repairing', 
  'quality_check', 
  'ready', 
  'completed', 
  'cancelled'
];

const priorityOptions: RepairTicket["priority"][] = ['low', 'normal', 'high', 'urgent'];

const priorityIcon: { [key in RepairTicket["priority"]]: React.ReactNode } = {
    low: <div className="h-2 w-2 rounded-full bg-gray-400" />,
    normal: <div className="h-2 w-2 rounded-full bg-blue-500" />,
    high: <div className="h-2 w-2 rounded-full bg-orange-500" />,
    urgent: <div className="h-2 w-2 rounded-full bg-red-600" />,
};

export default function TicketsPage() {
  const [allTickets, setAllTickets] = useState<RepairTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<RepairTicket | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const sortedTickets = useMemo(() => {
    return [...allTickets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [allTickets]);

  useEffect(() => {
    const fetchTicketsData = async () => {
      try {
        const res = await fetch('/api/tickets', { cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed to fetch tickets: ${res.status}`);
        const json = await res.json();
        const tickets = transformTicketsData(json.tickets);
        setAllTickets(tickets);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTicketsData();
  }, []);

  const activeTickets = sortedTickets.filter(t => t.status !== 'completed' && t.status !== 'cancelled');
  const completedTickets = sortedTickets.filter(t => t.status === 'completed');
  const cancelledTickets = sortedTickets.filter(t => t.status === 'cancelled');

  const handleEditClick = (ticket: RepairTicket) => {
      setSelectedTicket(ticket);
      setIsEditDialogOpen(true);
  };
  
  const totalActive = activeTickets.length;
  const totalOverdue = activeTickets.filter(ticket => {
    const ageInDays = differenceInDays(new Date(), new Date(ticket.createdAt));
    return ageInDays > 7 && ticket.status !== 'completed' && ticket.status !== 'cancelled';
  }).length;
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
                    <DropdownMenuItem>
                      <Printer className="mr-2 h-4 w-4" />
                      Print Label
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Cancel Ticket
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        }) : (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              No tickets found.
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
          <h1 className="text-2xl font-bold text-foreground">Repair Tickets</h1>
        </div>
      </header>

      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        {/* Stats Cards */}
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
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAwaitingParts}</div>
              <p className="text-xs text-muted-foreground">Tickets waiting for components</p>
            </CardContent>
          </Card>
        </div>

        {/* Tickets Table with Tabs */}
        <Tabs defaultValue="active">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Create Ticket</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px]">
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Repair Tickets</CardTitle>
                  <CardDescription>Manage all repair tickets and their status.</CardDescription>
                </div>
                <div className="relative flex-1 sm:ml-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by customer or ticket ID..."
                    className="pl-8 h-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading && <div className="text-sm text-muted-foreground py-4">Loading tickets...</div>}
              {error && <div className="text-sm text-destructive py-4">{error}</div>}
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
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-{sortedTickets.length}</strong> of <strong>{sortedTickets.length}</strong> tickets
              </div>
            </CardFooter>
          </Card>
        </Tabs>
      </main>

      {/* Edit Ticket Dialog */}
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

function EditTicketForm({ ticket }: { ticket: RepairTicket }) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="customerName" className="text-right">Customer</Label>
        <Input 
          id="customerName" 
          defaultValue={ticket.customerName} 
          className="col-span-3" 
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="device" className="text-right">Device</Label>
        <Input 
          id="device" 
          defaultValue={`${ticket.deviceBrand} ${ticket.deviceModel}`} 
          className="col-span-3" 
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="issue" className="text-right">Issue</Label>
        <Textarea 
          id="issue" 
          defaultValue={ticket.issueDescription} 
          className="col-span-3 min-h-[100px]" 
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-right">Status</Label>
        <Select defaultValue={ticket.status}>
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
        <Label htmlFor="priority" className="text-right">Priority</Label>
        <Select defaultValue={ticket.priority}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map(priority => (
              <SelectItem 
                key={priority} 
                value={priority} 
                className="capitalize"
              >
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="estimatedCost" className="text-right">Est. Cost</Label>
        <Input 
          id="estimatedCost" 
          type="number" 
          defaultValue={ticket.estimatedCost || ''} 
          className="col-span-3" 
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="finalCost" className="text-right">Final Cost</Label>
        <Input 
          id="finalCost" 
          type="number" 
          defaultValue={ticket.finalCost || ''} 
          className="col-span-3" 
        />
      </div>
    </div>
  );
}

function CreateTicketForm() {
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
        <Label htmlFor="new-device" className="text-right">Device</Label>
        <Input 
          id="new-device" 
          placeholder="e.g., Apple iPhone 14 Pro" 
          className="col-span-3" 
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="new-issue" className="text-right">Issue</Label>
        <Textarea 
          id="new-issue" 
          placeholder="Describe the issue..." 
          className="col-span-3 min-h-[100px]" 
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="new-priority" className="text-right">Priority</Label>
        <Select defaultValue="normal">
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map(priority => (
              <SelectItem 
                key={priority} 
                value={priority} 
                className="capitalize"
              >
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="new-estimatedCost" className="text-right">Est. Cost (Ksh)</Label>
        <Input 
          id="new-estimatedCost" 
          type="number" 
          placeholder="e.g., 15000" 
          className="col-span-3" 
        />
      </div>
    </div>
  );
}