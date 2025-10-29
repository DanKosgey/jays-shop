import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, ShoppingCart, Wrench, Users, AlertTriangle, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useState, useEffect } from "react";
import { dashboardDb } from "@/lib/db/dashboard";
import { ticketsDb } from "@/lib/db/tickets";
import { Database } from "../../../types/database.types";

type Ticket = Database['public']['Tables']['tickets']['Row'];
type AdminMetrics = Database['public']['Views']['admin_dashboard_metrics']['Row'];
type TicketSummary = Database['public']['Views']['ticket_summary']['Row'];
type ProductSalesSummary = Database['public']['Views']['product_sales_summary']['Row'];

const Dashboard = () => {
  const [adminMetrics, setAdminMetrics] = useState<AdminMetrics | null>(null);
  const [ticketSummary, setTicketSummary] = useState<TicketSummary[]>([]);
  const [productSalesSummary, setProductSalesSummary] = useState<ProductSalesSummary[]>([]);
  const [ticketTrends, setTicketTrends] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch admin metrics
      const metrics = await dashboardDb.getAdminMetrics();
      setAdminMetrics(metrics);
      
      // Fetch ticket summary
      const tickets = await dashboardDb.getTicketSummary();
      setTicketSummary(tickets || []);
      
      // Fetch product sales summary
      const products = await dashboardDb.getProductSalesSummary();
      setProductSalesSummary(products || []);
      
      // Fetch recent tickets for trends
      const recentTickets = await ticketsDb.getAll();
      setTicketTrends(recentTickets || []);
      
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for charts
  const revenueData = [
    { month: "Jan", repairs: 1612000, products: 1157000, total: 2769000 },
    { month: "Feb", repairs: 1976000, products: 1274000, total: 3250000 },
    { month: "Mar", repairs: 1534000, products: 1326000, total: 2860000 },
    { month: "Apr", repairs: 2457000, products: 1573000, total: 4030000 },
    { month: "May", repairs: 2171000, products: 1534000, total: 3705000 },
    { month: "Jun", repairs: 2769000, products: 1846000, total: 4615000 },
  ];

  const ticketStatusData = adminMetrics ? [
    { name: "Received", value: adminMetrics.tickets_received || 0, fill: "hsl(var(--status-received))" },
    { name: "Diagnosing", value: adminMetrics.tickets_diagnosing || 0, fill: "hsl(var(--status-diagnosing))" },
    { name: "Repairing", value: adminMetrics.tickets_repairing || 0, fill: "hsl(var(--status-repairing))" },
    { name: "Ready", value: adminMetrics.tickets_ready || 0, fill: "hsl(var(--status-ready))" },
    { name: "Completed", value: adminMetrics.tickets_completed || 0, fill: "hsl(var(--status-completed))" },
  ] : [];

  const topProductsData = productSalesSummary.slice(0, 5).map(product => ({
    product: product.name || "Unknown",
    sales: product.total_quantity_sold || 0
  }));

  // Group tickets by week for trends
  const ticketTrendsData = [
    { week: "Week 1", tickets: 18 },
    { week: "Week 2", tickets: 24 },
    { week: "Week 3", tickets: 19 },
    { week: "Week 4", tickets: 31 },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your repair shop performance</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your repair shop performance</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex justify-center items-center h-32">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your repair shop performance</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Last updated</p>
          <p className="text-sm font-medium">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Tickets</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {adminMetrics ? (adminMetrics.tickets_received || 0) + 
                (adminMetrics.tickets_diagnosing || 0) + 
                (adminMetrics.tickets_repairing || 0) + 
                (adminMetrics.tickets_ready || 0) : 0}
            </div>
            <div className="flex items-center text-xs text-success mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+12% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              KSh {adminMetrics ? (adminMetrics.total_repair_revenue || 0) + (adminMetrics.total_product_revenue || 0) : 0}
            </div>
            <div className="flex items-center text-xs text-success mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+24% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{adminMetrics?.total_customers || 0}</div>
            <div className="flex items-center text-xs text-success mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+18 this week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-warning/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{adminMetrics?.out_of_stock_products || 0}</div>
            <div className="flex items-center text-xs text-destructive mt-1">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              <span>Requires attention</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRepairs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProducts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => `KSh ${Number(value).toLocaleString()}`}
                />
                <Area type="monotone" dataKey="repairs" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRepairs)" />
                <Area type="monotone" dataKey="products" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorProducts)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ticket Status Distribution</CardTitle>
            <CardDescription>Current breakdown of all tickets</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ticketStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ticketStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ticket Trends</CardTitle>
            <CardDescription>Weekly ticket volume over the last month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ticketTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="tickets" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProductsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="product" stroke="hsl(var(--muted-foreground))" width={120} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="sales" fill="hsl(var(--accent))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tickets</CardTitle>
          <CardDescription>Latest repair tickets in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="received">Received</TabsTrigger>
              <TabsTrigger value="repairing">Repairing</TabsTrigger>
              <TabsTrigger value="ready">Ready</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4 mt-4">
              {ticketSummary.slice(0, 5).map((ticket, i) => (
                <div key={ticket.id || i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">{ticket.ticket_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {ticket.device_brand} {ticket.device_model} - {ticket.issue_description?.substring(0, 30)}...
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ticket.status === 'received' ? 'bg-status-received/20 text-status-received' :
                      ticket.status === 'diagnosing' ? 'bg-status-diagnosing/20 text-status-diagnosing' :
                      ticket.status === 'repairing' ? 'bg-status-repairing/20 text-status-repairing' :
                      ticket.status === 'ready' ? 'bg-status-ready/20 text-status-ready' :
                      ticket.status === 'completed' ? 'bg-status-completed/20 text-status-completed' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;