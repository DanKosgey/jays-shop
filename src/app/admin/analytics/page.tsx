

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
import { useEffect, useState } from 'react';
import { ChartTooltipContent, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip } from "@/components/ui/chart";
import { useMemo } from "react";
import type { ChartConfig } from "@/components/ui/chart";

const revenueData = [
  { month: "Jan", repair: 250000, order: 150000 },
  { month: "Feb", repair: 180000, order: 120000 },
  { month: "Mar", repair: 320000, order: 180000 },
  { month: "Apr", repair: 280000, order: 170000 },
  { month: "May", repair: 380000, order: 220000 },
  { month: "Jun", repair: 330000, order: 220000 },
  { month: "Jul", repair: 450000, order: 250000 },
];

function useTicketStatusData() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch('/api/tickets', { cache: 'no-store' });
        if (!res.ok) return;
        const json = await res.json();
        const counts = new Map<string, number>();
        for (const t of json.tickets as any[]) {
          const name = String(t.status).replace('_', ' ');
          counts.set(name, (counts.get(name) ?? 0) + 1);
        }
        const arr = Array.from(counts.entries()).map(([name, value]) => ({ name, value }))
          .filter((d) => d.name !== 'completed' && d.name !== 'cancelled');
        setData(arr);
      } catch {}
    };
    fetchTickets();
  }, []);
  return data;
}


const chartConfig = {
  repair: {
    label: "Repair Revenue",
    color: "hsl(var(--chart-1))",
  },
  order: {
    label: "Order Revenue",
    color: "hsl(var(--chart-2))",
  },
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
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;


export default function AnalyticsPage() {
  const ticketStatusData = useTicketStatusData();

  const totalTickets = useMemo(() => {
    return ticketStatusData.reduce((acc, curr) => acc + curr.value, 0)
  }, []);

  const totalRevenue = useMemo(() => {
    return revenueData.reduce((acc, curr) => acc + curr.repair + curr.order, 0);
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
              <div className="text-2xl font-bold">Ksh{totalRevenue.toLocaleString()}</div>
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
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>A visual breakdown of monthly revenue from repairs and orders.</CardDescription>
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
                    dataKey="month"
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
                    dataKey="order"
                    type="natural"
                    fill="var(--color-order)"
                    fillOpacity={0.4}
                    stroke="var(--color-order)"
                    stackId="a"
                  />
                   <Area
                    dataKey="repair"
                    type="natural"
                    fill="var(--color-repair)"
                    fillOpacity={0.4}
                    stroke="var(--color-repair)"
                    stackId="a"
                  />
                   <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3 flex flex-col">
            <CardHeader>
              <CardTitle>Ticket Status Distribution</CardTitle>
               <CardDescription>A snapshot of the current status across all active repair tickets.</CardDescription>
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
                    innerRadius="40%"
                    strokeWidth={5}
                    outerRadius="100%"
                  >
                     {ticketStatusData.map((entry) => (
                      <Cell key={entry.name} fill={chartConfig[entry.name as keyof typeof chartConfig]?.color} className="outline-none" />
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
                Total active tickets: {totalTickets}
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
