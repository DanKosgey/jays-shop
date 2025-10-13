"use client";

import { AdminHeader } from "../components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Wrench, ShoppingCart, DollarSign, Users } from "lucide-react";
import { mockTickets } from "@/lib/mock-data";
import { ChartTooltipContent, ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { useMemo } from "react";
import type { ChartConfig } from "@/components/ui/chart";

const revenueData = [
  { name: "Jan", revenue: 400000 },
  { name: "Feb", revenue: 300000 },
  { name: "Mar", revenue: 500000 },
  { name: "Apr", revenue: 450000 },
  { name: "May", revenue: 600000 },
  { name: "Jun", revenue: 550000 },
  { name: "Jul", revenue: 700000 },
];

const ticketStatusData = mockTickets.reduce((acc, ticket) => {
    const status = ticket.status.replace("_", " ");
    const existing = acc.find(item => item.name === status);
    if(existing) {
        existing.value += 1;
    } else {
        acc.push({ name: status, value: 1 });
    }
    return acc;
}, [] as { name: string, value: number }[]);


const chartConfig = {
  tickets: {
    label: "Tickets",
  },
  repairing: {
    label: "Repairing",
    color: "hsl(var(--chart-1))",
  },
  diagnosing: {
    label: "Diagnosing",
    color: "hsl(var(--chart-2))",
  },
  "awaiting parts": {
    label: "Awaiting Parts",
    color: "hsl(var(--chart-3))",
  },
  received: {
    label: "Received",
    color: "hsl(var(--chart-4))",
  },
  ready: {
    label: "Ready",
    color: "hsl(var(--chart-5))",
  },
  "quality check": {
    label: "Quality Check",
    color: "hsl(var(--chart-2))",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--muted))",
  },
  cancelled: {
    label: "Cancelled",
    color: "hsl(var(--destructive))",
  }
} satisfies ChartConfig;


export default function AnalyticsPage() {

  const totalTickets = useMemo(() => {
    return ticketStatusData.reduce((acc, curr) => acc + curr.value, 0)
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AdminHeader title="Analytics" />
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
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+1250</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+89</div>
              <p className="text-xs text-muted-foreground">in the last 30 days</p>
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
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>A visual breakdown of monthly revenue performance.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={revenueData}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Ksh${Number(value) / 1000}k`} />
                    <Tooltip
                        cursor={{stroke: 'hsl(var(--chart-1))', strokeWidth: 1, fill: 'hsl(var(--muted))', fillOpacity: 0.5}}
                        content={<ChartTooltipContent formatter={(value: number) => [`Ksh ${value.toLocaleString()}`, "Revenue"]} />}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3 flex flex-col">
            <CardHeader>
              <CardTitle>Ticket Status Distribution</CardTitle>
               <CardDescription>A snapshot of the current status across all repair tickets.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
               <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square h-full"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Tooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={ticketStatusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      strokeWidth={5}
                    >
                       {ticketStatusData.map((entry) => (
                        <Cell key={entry.name} fill={chartConfig[entry.name as keyof typeof chartConfig]?.color} />
                      ))}
                    </Pie>
                     <ChartLegend
                      content={<ChartLegendContent nameKey="name" />}
                      className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
             <CardFooter className="flex-col gap-2 text-sm mt-4">
              <div className="flex items-center gap-2 font-medium leading-none">
                Total tickets: {totalTickets}
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
