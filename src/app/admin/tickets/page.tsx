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
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
  
  const handleDeleteClick = (ticketId: string) => {
      setTicketToDelete(ticketId);
      setIsDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!ticketToDelete) return;
    
    try {
      // For now, we'll update the ticket status to 'cancelled' instead of deleting
      // This is safer and follows the existing data model
      const response = await fetch('/api/tickets', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: ticketToDelete,
          status: 'cancelled'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel ticket');
      }

      // Refresh the data
      window.location.reload();
    } catch (err) {
      console.error('Error cancelling ticket:', err);
      // In a real app, we'd show an error message to the user
    } finally {
      setIsDeleteDialogOpen(false);
      setTicketToDelete(null);
    }
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
          <TableHead className="w-[150px">Status</TableHead>
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
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(ticket.id)}>
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
            {/* Form now includes its own DialogFooter */}
            {/* We don't need a separate DialogFooter here */}
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Ticket</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this ticket? This action will mark the ticket as cancelled.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Confirm Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EditTicketForm({ ticket }: { ticket: RepairTicket }) {
  const [customerName, setCustomerName] = useState(ticket.customerName);
  const [device, setDevice] = useState(`${ticket.deviceBrand} ${ticket.deviceModel}`);
  const [issue, setIssue] = useState(ticket.issueDescription);
  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);
  const [estimatedCost, setEstimatedCost] = useState(ticket.estimatedCost?.toString() || '');
  const [finalCost, setFinalCost] = useState(ticket.finalCost?.toString() || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Split device input into brand and model
  const parseDevice = (deviceString: string) => {
    const parts = deviceString.trim().split(' ');
    if (parts.length < 2) {
      return { brand: deviceString, model: '' };
    }
    // Assume first part is brand, rest is model
    const brand = parts[0];
    const model = parts.slice(1).join(' ');
    return { brand, model };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Parse device into brand and model
      const { brand, model } = parseDevice(device);
      
      // Prepare data for update
      const ticketData = {
        id: ticket.id,
        customer_name: customerName,
        device_type: ticket.deviceType, // Keep original
        device_brand: brand || ticket.deviceBrand,
        device_model: model || ticket.deviceModel,
        issue_description: issue,
        status: status,
        priority: priority,
        ...(estimatedCost && { estimated_cost: parseFloat(estimatedCost) }),
        ...(finalCost && { final_cost: parseFloat(finalCost) })
      };

      const response = await fetch('/api/tickets', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update ticket');
      }

      const updatedTicket = await response.json();
      
      // Close the dialog and refresh the data
      window.location.reload(); // Simple way to refresh the data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="customerName" className="text-right">Customer</Label>
          <Input 
            id="customerName" 
            value={customerName} 
            onChange={(e) => setCustomerName(e.target.value)}
            className="col-span-3" 
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="device" className="text-right">Device</Label>
          <Input 
            id="device" 
            value={device} 
            onChange={(e) => setDevice(e.target.value)}
            className="col-span-3" 
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="issue" className="text-right">Issue</Label>
          <Textarea 
            id="issue" 
            value={issue} 
            onChange={(e) => setIssue(e.target.value)}
            className="col-span-3 min-h-[100px]" 
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">Status</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as any)}>
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
          <Select value={priority} onValueChange={(value) => setPriority(value as any)}>
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
            value={estimatedCost} 
            onChange={(e) => setEstimatedCost(e.target.value)}
            className="col-span-3" 
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="finalCost" className="text-right">Final Cost</Label>
          <Input 
            id="finalCost" 
            type="number" 
            value={finalCost} 
            onChange={(e) => setFinalCost(e.target.value)}
            className="col-span-3" 
          />
        </div>
        {error && <div className="text-sm text-destructive col-span-4 text-center">{error}</div>}
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => {
          // Reset form to original values
          setCustomerName(ticket.customerName);
          setDevice(`${ticket.deviceBrand} ${ticket.deviceModel}`);
          setIssue(ticket.issueDescription);
          setStatus(ticket.status);
          setPriority(ticket.priority);
          setEstimatedCost(ticket.estimatedCost?.toString() || '');
          setFinalCost(ticket.finalCost?.toString() || '');
        }}>
          Reset
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogFooter>
    </form>
  );
}

function CreateTicketForm() {
  const [customerName, setCustomerName] = useState('');
  const [device, setDevice] = useState('');
  const [issue, setIssue] = useState('');
  const [priority, setPriority] = useState('normal');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Split device input into brand and model
  const parseDevice = (deviceString: string) => {
    const parts = deviceString.trim().split(' ');
    if (parts.length < 2) {
      return { brand: deviceString, model: '' };
    }
    // Assume first part is brand, rest is model
    const brand = parts[0];
    const model = parts.slice(1).join(' ');
    return { brand, model };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Parse device into brand and model
      const { brand, model } = parseDevice(device);
      
      // Prepare data according to schema
      const ticketData = {
        customer_name: customerName,
        device_type: 'Phone', // Default value
        device_brand: brand || 'Unknown',
        device_model: model || 'Unknown',
        issue_description: issue,
        priority: priority,
        ...(estimatedCost && { estimated_cost: parseFloat(estimatedCost) })
      };

      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create ticket');
      }

      const newTicket = await response.json();
      
      // Close the dialog and reset form
      window.location.reload(); // Simple way to refresh the data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="new-customerName" className="text-right">Customer</Label>
          <Input 
            id="new-customerName" 
            placeholder="e.g., John Doe" 
            className="col-span-3" 
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="new-device" className="text-right">Device</Label>
          <Input 
            id="new-device" 
            placeholder="e.g., Apple iPhone 14 Pro" 
            className="col-span-3" 
            value={device}
            onChange={(e) => setDevice(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="new-issue" className="text-right">Issue</Label>
          <Textarea 
            id="new-issue" 
            placeholder="Describe the issue..." 
            className="col-span-3 min-h-[100px]" 
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="new-priority" className="text-right">Priority</Label>
          <Select value={priority} onValueChange={(value) => setPriority(value as any)}>
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
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
          />
        </div>
        {error && <div className="text-sm text-destructive col-span-4 text-center">{error}</div>}
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => {
          // Reset form
          setCustomerName('');
          setDevice('');
          setIssue('');
          setPriority('normal');
          setEstimatedCost('');
        }}>
          Reset
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Ticket'}
        </Button>
      </DialogFooter>
    </form>
  );
}
