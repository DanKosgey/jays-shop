
"use client";

import { AdminHeader } from "../components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
} from "recharts";
import { Wrench, ShoppingCart, DollarSign, Users } from "lucide-react";
import { mockTickets } from "@/lib/mock-data";
import { ChartTooltipContent, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip } from "@/components/ui/chart";
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
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={revenueData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                   <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `Ksh${Number(value) / 1000}k`}
                    />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="revenue"
                    type="natural"
                    fill="var(--color-revenue, hsl(var(--chart-1)))"
                    fillOpacity={0.4}
                    stroke="var(--color-revenue, hsl(var(--chart-1)))"
                  />
                </AreaChart>
              </ChartContainer>
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
                className="mx-auto aspect-square max-h-[300px]"
              >
                <PieChart>
                  <ChartTooltip
                    content={<ChartTooltipContent nameKey="name" hideLabel />}
                  />
                  <Pie
                    data={ticketStatusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="30%"
                    strokeWidth={5}
                  >
                     {ticketStatusData.map((entry) => (
                      <Cell key={entry.name} fill={chartConfig[entry.name as keyof typeof chartConfig]?.color} />
                    ))}
                  </Pie>
                   <ChartLegend
                    content={<ChartLegendContent nameKey="name" className="flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center" />}
                  />
                </PieChart>
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
