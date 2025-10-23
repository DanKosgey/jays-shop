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
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { 
  Wrench, 
  Ticket, 
  DollarSign, 
  Package, 
  Users, 
  ShoppingCart, 
  AlertTriangle, 
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  Menu
} from "lucide-react";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { differenceInDays } from "date-fns";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { RepairTicket } from "@/lib/types";
import { fetchTickets } from "@/lib/data-fetching";
import { transformTicketsData } from "@/lib/data-transform";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileNav } from "../components/mobile-nav";
// Import logging utilities
import { logDashboardAccess, logDashboardExit } from "@/lib/admin-logging";
import { getSupabaseBrowserClient } from "@/server/supabase/client";

// Define the activity item type
type ActivityItem = {
  id: number;
  icon: React.ReactNode;
  description: string;
  time: Date;
};

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

export default function DashboardPage() {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [tickets, setTickets] = useState<RepairTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Add new state for dashboard metrics
  const [metrics, setMetrics] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  
  // State for real-time updates
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeRepairs, setActiveRepairs] = useState(0);
  const [newTickets, setNewTickets] = useState(0);
  const [productsSold, setProductsSold] = useState(0);

  // State for WebSocket connection
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  
  // Refs for managing real-time updates
  const websocketRef = useRef<WebSocket | null>(null);
  const supabaseRef = useRef<any>(null);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isComponentMounted = useRef(true);

  // Get user info and log dashboard access
  useEffect(() => {
    const fetchUserInfo = async () => {
      const supabase = getSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
        setUserEmail(user.email);
        // Log dashboard access
        logDashboardAccess(user.id, user.email || "Unknown");
      }
    };
    
    fetchUserInfo();
    
    // Log dashboard exit when component unmounts
    return () => {
      isComponentMounted.current = false;
      if (userId && userEmail) {
        logDashboardExit(userId, userEmail);
      }
      
      // Clean up WebSocket connection
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      
      // Clean up Supabase subscriptions
      if (supabaseRef.current) {
        try {
          supabaseRef.current.removeAllChannels();
        } catch (error) {
          console.log('[DASHBOARD] Error removing Supabase channels:', error);
        }
      }
      
      // Clean up update interval
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [userId, userEmail]);

  // Handle ticket viewed events
  useEffect(() => {
    const handleTicketViewed = (event: Event) => {
        const customEvent = event as CustomEvent;
        const { ticketNumber, customerName } = customEvent.detail as { ticketNumber: string; customerName: string };
        const newActivity = {
            id: Date.now(),
            icon: <Eye className="h-5 w-5 text-blue-500"/>,
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

  // Enhanced Supabase real-time subscriptions with better error handling
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabaseRef.current = supabase;
    
    // Check if we're in a browser environment and realtime is enabled
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      // Subscribe to tickets table changes
      const ticketsSubscription = supabase
        .channel('tickets-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'tickets',
          },
          (payload: any) => {
            if (!isComponentMounted.current) return;
            
            const newTicket = payload.new;
            const newActivity = {
              id: Date.now(),
              icon: <Ticket className="h-5 w-5 text-blue-500"/>,
              description: `New ticket #${newTicket.ticket_number} created for ${newTicket.customer_name}.`,
              time: new Date(newTicket.created_at),
            };
            setActivity(prev => [newActivity, ...prev].slice(0, 10));
            
            // Update metrics in real-time
            updateMetrics();
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'tickets',
          },
          (payload: any) => {
            if (!isComponentMounted.current) return;
            
            const updatedTicket = payload.new;
            let description = '';
            let icon = <Wrench className="h-5 w-5 text-purple-500"/>;
            
            if (updatedTicket.status === 'completed') {
              description = `Repair for #${updatedTicket.ticket_number} is now complete.`;
              icon = <CheckCircle className="h-5 w-5 text-green-500"/>;
            } else if (updatedTicket.status === 'ready') {
              description = `Ticket #${updatedTicket.ticket_number} is ready for pickup.`;
              icon = <CheckCircle className="h-5 w-5 text-green-500"/>;
            } else {
              description = `Ticket #${updatedTicket.ticket_number} status changed to ${updatedTicket.status.replace('_', ' ')}.`;
            }
            
            const newActivity = {
              id: Date.now(),
              icon,
              description,
              time: new Date(updatedTicket.updated_at),
            };
            setActivity(prev => [newActivity, ...prev].slice(0, 10));
            
            // Update metrics in real-time
            updateMetrics();
          }
        )
        .subscribe((status: any) => {
          if (!isComponentMounted.current) return;
          
          if (status === 'SUBSCRIBED') {
            console.log('[DASHBOARD] Successfully subscribed to tickets changes');
            setConnectionStatus('connected');
          } else if (status === 'CHANNEL_ERROR') {
            console.log('[DASHBOARD] Error subscribing to tickets changes');
            setConnectionStatus('error');
          } else if (status === 'CLOSED') {
            console.log('[DASHBOARD] Closed subscription to tickets changes');
            setConnectionStatus('disconnected');
          }
        });

      // Subscribe to orders table changes
      const ordersSubscription = supabase
        .channel('orders-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'orders',
          },
          (payload: any) => {
            if (!isComponentMounted.current) return;
            
            const newOrder = payload.new;
            const newActivity = {
              id: Date.now(),
              icon: <ShoppingCart className="h-5 w-5 text-green-500"/>,
              description: `New order #${newOrder.order_number} created for ${newOrder.customer_name}.`,
              time: new Date(newOrder.created_at),
            };
            setActivity(prev => [newActivity, ...prev].slice(0, 10));
            
            // Update metrics in real-time
            updateMetrics();
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
          },
          (payload: any) => {
            if (!isComponentMounted.current) return;
            
            const updatedOrder = payload.new;
            const newActivity = {
              id: Date.now(),
              icon: <ShoppingCart className="h-5 w-5 text-green-500"/>,
              description: `Order #${updatedOrder.order_number} status changed to ${updatedOrder.status.replace('_', ' ')}.`,
              time: new Date(updatedOrder.updated_at),
            };
            setActivity(prev => [newActivity, ...prev].slice(0, 10));
            
            // Update metrics in real-time
            updateMetrics();
          }
        )
        .subscribe((status: any) => {
          if (!isComponentMounted.current) return;
          
          if (status === 'SUBSCRIBED') {
            console.log('[DASHBOARD] Successfully subscribed to orders changes');
          } else if (status === 'CHANNEL_ERROR') {
            console.log('[DASHBOARD] Error subscribing to orders changes');
          } else if (status === 'CLOSED') {
            console.log('[DASHBOARD] Closed subscription to orders changes');
          }
        });

      // Subscribe to customers table changes
      const customersSubscription = supabase
        .channel('customers-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'customers',
          },
          (payload: any) => {
            if (!isComponentMounted.current) return;
            
            const newCustomer = payload.new;
            const newActivity = {
              id: Date.now(),
              icon: <Users className="h-5 w-5 text-orange-500"/>,
              description: `New customer '${newCustomer.name}' registered.`,
              time: new Date(newCustomer.created_at),
            };
            setActivity(prev => [newActivity, ...prev].slice(0, 10));
            
            // Update metrics in real-time
            updateMetrics();
          }
        )
        .subscribe((status: any) => {
          if (!isComponentMounted.current) return;
          
          if (status === 'SUBSCRIBED') {
            console.log('[DASHBOARD] Successfully subscribed to customers changes');
          } else if (status === 'CHANNEL_ERROR') {
            console.log('[DASHBOARD] Error subscribing to customers changes');
          } else if (status === 'CLOSED') {
            console.log('[DASHBOARD] Closed subscription to customers changes');
          }
        });

      // Subscribe to products table changes
      const productsSubscription = supabase
        .channel('products-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'products',
          },
          (payload: any) => {
            if (!isComponentMounted.current) return;
            
            const newProduct = payload.new;
            const newActivity = {
              id: Date.now(),
              icon: <Package className="h-5 w-5 text-red-500"/>,
              description: `New product '${newProduct.name}' was added.`,
              time: new Date(newProduct.created_at),
            };
            setActivity(prev => [newActivity, ...prev].slice(0, 10));
            
            // Update metrics in real-time
            updateMetrics();
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'products',
          },
          (payload: any) => {
            if (!isComponentMounted.current) return;
            
            const updatedProduct = payload.new;
            const newActivity = {
              id: Date.now(),
              icon: <Package className="h-5 w-5 text-red-500"/>,
              description: `Product '${updatedProduct.name}' was updated.`,
              time: new Date(updatedProduct.updated_at),
            };
            setActivity(prev => [newActivity, ...prev].slice(0, 10));
            
            // Update metrics in real-time
            updateMetrics();
          }
        )
        .subscribe((status: any) => {
          if (!isComponentMounted.current) return;
          
          if (status === 'SUBSCRIBED') {
            console.log('[DASHBOARD] Successfully subscribed to products changes');
          } else if (status === 'CHANNEL_ERROR') {
            console.log('[DASHBOARD] Error subscribing to products changes');
          } else if (status === 'CLOSED') {
            console.log('[DASHBOARD] Closed subscription to products changes');
          }
        });

      // Cleanup subscriptions on unmount
      return () => {
        try {
          supabase.removeChannel(ticketsSubscription);
          supabase.removeChannel(ordersSubscription);
          supabase.removeChannel(customersSubscription);
          supabase.removeChannel(productsSubscription);
        } catch (error) {
          console.log('[DASHBOARD] Error removing channels:', error);
        }
      };
    } catch (error) {
      console.log('[DASHBOARD] Error setting up subscriptions:', error);
      setConnectionStatus('error');
    }
  }, []);

  // Enhanced WebSocket connection with reconnection logic
  useEffect(() => {
    const connectWebSocket = () => {
      if (typeof window === 'undefined') return;
      
      setConnectionStatus('connecting');
      
      try {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${window.location.host}/api/admin/dashboard/ws`;
        
        const ws = new WebSocket(wsUrl);
        websocketRef.current = ws;
        setWebsocket(ws);
        
        ws.onopen = () => {
          if (!isComponentMounted.current) return;
          
          console.log('[DASHBOARD] WebSocket connection established');
          setIsConnected(true);
          setConnectionStatus('connected');
        };
        
        ws.onmessage = (event) => {
          if (!isComponentMounted.current) return;
          
          try {
            const data = JSON.parse(event.data);
            
            // Handle different types of real-time updates
            if (data.type === 'metrics_update') {
              setMetrics(data.metrics);
              
              // Update individual metric states
              if (data.metrics) {
                const revenue = data.metrics.total_repair_revenue + data.metrics.total_product_revenue;
                const active = data.metrics.tickets_received + data.metrics.tickets_diagnosing + 
                  data.metrics.tickets_repairing + data.metrics.tickets_ready;
                const sold = data.metrics.total_products - data.metrics.out_of_stock_products;
                
                setTotalRevenue(revenue);
                setActiveRepairs(active);
                setProductsSold(sold);
              }
            } else if (data.type === 'chart_update') {
              setChartData(data.chartData);
            } else if (data.type === 'tickets_update') {
              const transformedTickets: RepairTicket[] = transformTicketsData(data.tickets);
              setTickets(transformedTickets);
            } else if (data.type === 'activity_update') {
              const newActivity = {
                id: Date.now(),
                icon: data.icon,
                description: data.message,
                time: new Date(),
              };
              setActivity(prev => [newActivity, ...prev].slice(0, 10));
            }
          } catch (error) {
            console.error('[DASHBOARD] Error processing WebSocket message:', error);
          }
        };
        
        ws.onclose = () => {
          if (!isComponentMounted.current) return;
          
          console.log('[DASHBOARD] WebSocket connection closed');
          setIsConnected(false);
          setConnectionStatus('disconnected');
          
          // Attempt to reconnect after 5 seconds
          if (isComponentMounted.current) {
            setTimeout(connectWebSocket, 5000);
          }
        };
        
        ws.onerror = (error) => {
          if (!isComponentMounted.current) return;
          
          console.error('[DASHBOARD] WebSocket error:', error);
          setIsConnected(false);
          setConnectionStatus('error');
        };
      } catch (error) {
        console.error('[DASHBOARD] Error establishing WebSocket connection:', error);
        setConnectionStatus('error');
        
        // Attempt to reconnect after 5 seconds
        if (isComponentMounted.current) {
          setTimeout(connectWebSocket, 5000);
        }
      }
    };
    
    connectWebSocket();
    
    // Cleanup WebSocket connection
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  // Fetch initial dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        if (!response.ok) throw new Error('Failed to fetch dashboard data');
        const data = await response.json();
        
        if (!isComponentMounted.current) return;
        
        setMetrics(data.metrics);
        setChartData(data.chartData);
        
        // Update real-time state values
        if (data.metrics) {
          const revenue = data.metrics.total_repair_revenue + data.metrics.total_product_revenue;
          const active = data.metrics.tickets_received + data.metrics.tickets_diagnosing + 
            data.metrics.tickets_repairing + data.metrics.tickets_ready;
          const sold = data.metrics.total_products - data.metrics.out_of_stock_products;
          
          setTotalRevenue(revenue);
          setActiveRepairs(active);
          setProductsSold(sold);
        }
        
        // Update tickets state with recent tickets from dashboard data
        const transformedTickets: RepairTicket[] = transformTicketsData(data.recentTickets);
        setTickets(transformedTickets);
        
        // Initialize activity with some recent events
        const initialActivity: ActivityItem[] = [
          { id: 1, icon: <Ticket className="h-5 w-5 text-blue-500"/>, description: "Dashboard loaded with real-time updates enabled.", time: new Date() },
        ];
        setActivity(initialActivity);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        if (isComponentMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();
  }, []);

  // Enhanced updateMetrics function with loading states and fallback mechanisms
  const updateMetrics = async () => {
    try {
      // If WebSocket is connected, send a request through WebSocket
      if (isConnected && websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
        websocketRef.current.send(JSON.stringify({ type: 'request_metrics_update' }));
        return;
      }
      
      // Fallback to HTTP request if WebSocket is not available
      const response = await fetch('/api/admin/dashboard', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to fetch updated metrics');
      const data = await response.json();
      
      if (!isComponentMounted.current) return;
      
      if (data.metrics) {
        const revenue = data.metrics.total_repair_revenue + data.metrics.total_product_revenue;
        const active = data.metrics.tickets_received + data.metrics.tickets_diagnosing + 
          data.metrics.tickets_repairing + data.metrics.tickets_ready;
        const sold = data.metrics.total_products - data.metrics.out_of_stock_products;
        
        // Update individual states
        setTotalRevenue(revenue);
        setActiveRepairs(active);
        setProductsSold(sold);
        
        // Update metrics state
        setMetrics(data.metrics);
      }
      
      // Update new tickets count
      const recentTickets = tickets.filter(t => {
        const createdDate = new Date(t.createdAt);
        const now = new Date();
        const diffHours = Math.abs(now.getTime() - createdDate.getTime()) / 3600000;
        return diffHours <= 24;
      }).length;
      setNewTickets(recentTickets);
    } catch (error) {
      console.error('Error updating metrics:', error);
      // Set error state only if component is still mounted
      if (isComponentMounted.current) {
        setError('Failed to update dashboard metrics');
      }
    }
  };

  // Update new tickets count periodically as fallback
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isComponentMounted.current) return;
      
      const recentTickets = tickets.filter(t => {
        const createdDate = new Date(t.createdAt);
        const now = new Date();
        const diffHours = Math.abs(now.getTime() - createdDate.getTime()) / 3600000;
        return diffHours <= 24;
      }).length;
      setNewTickets(recentTickets);
    }, 60000); // Update every minute
    
    updateIntervalRef.current = interval;
    
    return () => clearInterval(interval);
  }, [tickets]);

  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const overdueTickets = tickets
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
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <Badge variant="secondary" className="hidden sm:flex">
            <Calendar className="mr-1 h-3 w-3" />
            Today
          </Badge>
          {/* Connection status indicator */}
          <Badge 
            variant={connectionStatus === 'connected' ? 'default' : connectionStatus === 'error' ? 'destructive' : 'secondary'}
            className="hidden sm:flex"
          >
            {connectionStatus === 'connected' ? 'Live' : 
             connectionStatus === 'connecting' ? 'Connecting...' : 
             connectionStatus === 'error' ? 'Connection Error' : 'Disconnected'}
          </Badge>
        </div>
      </header>

      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh {totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Repairs</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{activeRepairs}</div>
              <p className="text-xs text-muted-foreground">+5 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{newTickets}</div>
              <p className="text-xs text-muted-foreground">in the last 24 hours</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{productsSold}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Activity */}
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
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `Ksh${Number(value)/1000}k`} 
                  />
                  <Tooltip
                    cursor={{stroke: 'hsl(var(--chart-1))', strokeWidth: 2, fill: 'hsl(var(--muted))', fillOpacity: 0.5}}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    formatter={(value: number) => [`Ksh ${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--chart-1))" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
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
                  <div key={item.id} className="flex items-start gap-4">
                    <div className="bg-accent/10 text-accent p-2 rounded-full">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Recent Tickets and Notifications */}
        <Tabs defaultValue="recent_tickets">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="recent_tickets">Recent Tickets</TabsTrigger>
              <TabsTrigger value="notifications">Notifications & Alerts</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="recent_tickets">
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
                      <TableHead className="hidden sm:table-cell">Device</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right hidden sm:table-cell">Est. Cost</TableHead>
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
                        <TableCell className="hidden sm:table-cell">{ticket.deviceModel}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariant[ticket.status]} className="capitalize">
                            {ticket.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right hidden sm:table-cell">
                          {ticket.estimatedCost ? `Ksh${ticket.estimatedCost.toFixed(2)}` : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications & Alerts</CardTitle>
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
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                      <h3 className="text-lg font-medium">No overdue tickets</h3>
                      <p className="text-sm text-muted-foreground">Great job! All tickets are on schedule.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}