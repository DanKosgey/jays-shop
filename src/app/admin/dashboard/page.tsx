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
import { Wrench, Ticket, DollarSign, Package, Users, ShoppingCart } from "lucide-react";
import { AdminHeader } from "../components/header";
import { mockTickets } from "@/lib/mock-data";
import { RepairTicket } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

const recentActivity = [
    { icon: <Ticket className="h-5 w-5 text-accent"/>, description: "New ticket #RPR-2025-0004 created for Diana Prince.", time: "5m ago" },
    { icon: <ShoppingCart className="h-5 w-5 text-accent"/>, description: "Order #ORD-003 status changed to Shipped.", time: "30m ago" },
    { icon: <Wrench className="h-5 w-5 text-accent"/>, description: "Repair for #RPR-2025-0001 is now complete.", time: "1h ago" },
    { icon: <Users className="h-5 w-5 text-accent"/>, description: "New customer 'Charlie Brown' registered.", time: "2h ago" },
    { icon: <Package className="h-5 w-5 text-accent"/>, description: "New product 'Volta-Charge 100W PD Station' was added.", time: "1d ago" },
];


export default function DashboardPage() {
  const recentTickets = mockTickets.slice(0, 5);

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
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>A log of the most recent activities in the store.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4">
                       <div className="bg-muted p-2 rounded-full">{activity.icon}</div>
                        <div className="flex-1">
                            <p className="text-sm">{activity.description}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                    </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
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
      </main>
    </div>
  );
}
