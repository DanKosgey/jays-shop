"use client";
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Wrench, Ticket, DollarSign, Package, Users, ShoppingCart, AlertTriangle, Eye } from "lucide-react";
import { AdminHeader } from "../components/header";
import { mockTickets } from "@/lib/mock-data";
import { RepairTicket } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { differenceInDays, formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const chartData = [
  { name: "Jan", revenue: 400000 },
  { name: "Feb", revenue: 300000 },
  { name: "Mar", revenue: 500000 },
  { name: "Apr", revenue: 450000 },
  { name: "May", revenue: 600000 },
  { name: "Jun", revenue: 550000 },
  { name: "Jul", revenue: 700000 },
];

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

const initialActivity = [
    { id: 1, icon: <Ticket className="h-5 w-5 text-accent"/>, description: "New ticket #RPR-2025-0004 created for Diana Prince.", time: new Date(Date.now() - 5 * 60 * 1000) },
    { id: 2, icon: <ShoppingCart className="h-5 w-5 text-accent"/>, description: "Order #ORD-003 status changed to Shipped.", time: new Date(Date.now() - 30 * 60 * 1000) },
    { id: 3, icon: <Wrench className="h-5 w-5 text-accent"/>, description: "Repair for #RPR-2025-0001 is now complete.", time: new Date(Date.now() - 60 * 60 * 1000) },
    { id: 4, icon: <Users className="h-5 w-5 text-accent"/>, description: "New customer 'Charlie Brown' registered.", time: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: 5, icon: <Package className="h-5 w-5 text-accent"/>, description: "New product 'Volta-Charge 100W PD Station' was added.", time: new Date(Date.now() - 24 * 60 * 60 * 1000) },
];


export default function DashboardPage() {
  const [activity, setActivity] = useState(initialActivity);

  useEffect(() => {
    const handleTicketViewed = (event: Event) => {
        const customEvent = event as CustomEvent;
        const { ticketNumber, customerName } = customEvent.detail;
        const newActivity = {
            id: Date.now(),
            icon: <Eye className="h-5 w-5 text-accent"/>,
            description: `Customer ${customerName} viewed ticket #${ticketNumber}.`,
            time: new Date(),
        };
        setActivity(prev => [newActivity, ...prev].slice(0, 10)); // Keep last 10 activities
    };

    window.addEventListener('ticketViewed', handleTicketViewed);

    return () => {
        window.removeEventListener('ticketViewed', handleTicketViewed);
    };
  }, []);

  const recentTickets = [...mockTickets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const overdueTickets = mockTickets
    .filter(ticket => ticket.status !== 'completed' && ticket.status !== 'cancelled')
    .filter(ticket => differenceInDays(new Date(), new Date(ticket.createdAt)) > 7)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AdminHeader title="Dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh 4,523,189</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Repairs</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+23</div>
              <p className="text-xs text-muted-foreground">+5 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12</div>
              <p className="text-xs text-muted-foreground">in the last 24 hours</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
               <CardDescription>Monthly revenue performance.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                 <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Ksh${Number(value)/1000}k`} />
                  <Tooltip
                     cursor={{stroke: 'hsl(var(--chart-1))', strokeWidth: 2, fill: 'hsl(var(--muted))', fillOpacity: 0.5}}
                     contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    formatter={(value: number) => [`Ksh ${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Live Activity Feed</CardTitle>
              <CardDescription>Real-time shop updates and customer interactions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activity.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 animate-in fade-in-0 duration-500">
                    <div className="bg-accent/10 text-accent p-2 rounded-full">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(item.time, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
           <Card>
            <CardHeader>
              <CardTitle>Recent Tickets</CardTitle>
              <CardDescription>An overview of the latest repair tickets.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Est. Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                           <Avatar className="hidden h-9 w-9 sm:flex">
                                <AvatarImage src={`https://i.pravatar.cc/150?u=${ticket.customerName}`} alt={ticket.customerName} />
                                <AvatarFallback>{getInitials(ticket.customerName)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium">{ticket.customerName}</div>
                                <div className="text-sm text-muted-foreground">{ticket.ticketNumber}</div>
                            </div>
                        </div>
                      </TableCell>
                      <TableCell>{ticket.deviceModel}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[ticket.status]} className="capitalize">
                          {ticket.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                       <TableCell className="text-right">
                        {ticket.estimatedCost ? `Ksh${ticket.estimatedCost.toFixed(2)}` : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Notifications &amp; Alerts</CardTitle>
              <CardDescription>Actionable insights and reminders.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overdueTickets.length > 0 ? (
                  overdueTickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-start gap-4">
                      <div className="bg-destructive/10 text-destructive p-2 rounded-full">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Overdue Ticket: {ticket.ticketNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          For {ticket.customerName} has been open for {differenceInDays(new Date(), new Date(ticket.createdAt))} days.
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No overdue tickets. Great job!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
