import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/server/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    
    // Fetch dashboard metrics from the admin_dashboard_metrics view
    const { data: metrics, error: metricsError } = await supabase
      .from('admin_dashboard_metrics')
      .select('*')
      .single();

    if (metricsError) {
      console.error('Error fetching dashboard metrics:', metricsError);
      return NextResponse.json({ error: 'Failed to fetch dashboard metrics' }, { status: 500 });
    }

    // Fetch recent tickets (last 5)
    const { data: recentTickets, error: ticketsError } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (ticketsError) {
      console.error('Error fetching recent tickets:', ticketsError);
      return NextResponse.json({ error: 'Failed to fetch recent tickets' }, { status: 500 });
    }

    // Fetch revenue data for chart (grouped by month)
    const { data: revenueData, error: revenueError } = await supabase
      .from('tickets')
      .select('created_at, final_cost')
      .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString())
      .order('created_at', { ascending: true });

    if (revenueError) {
      console.error('Error fetching revenue data:', revenueError);
      return NextResponse.json({ error: 'Failed to fetch revenue data' }, { status: 500 });
    }

    // Process revenue data to group by month
    const chartData = processRevenueData(revenueData);

    // Return all dashboard data
    return NextResponse.json({
      metrics,
      recentTickets,
      chartData
    });
  } catch (error) {
    console.error('Unexpected error in dashboard GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to process revenue data for the chart
function processRevenueData(tickets: any[]) {
  // Group tickets by month and sum the revenue
  const monthlyRevenue: { [key: string]: number } = {};
  
  tickets.forEach(ticket => {
    if (ticket.final_cost && ticket.created_at) {
      const date = new Date(ticket.created_at);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      if (!monthlyRevenue[monthYear]) {
        monthlyRevenue[monthYear] = 0;
      }
      
      monthlyRevenue[monthYear] += ticket.final_cost;
    }
  });

  // Convert to array format for the chart
  return Object.entries(monthlyRevenue).map(([name, revenue]) => ({
    name,
    revenue: Math.round(revenue)
  }));
}