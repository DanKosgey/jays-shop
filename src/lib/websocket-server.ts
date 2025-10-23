// WebSocket server for real-time dashboard updates
import { WebSocketServer, WebSocket } from 'ws';
import { getSupabaseServerClient } from '@/server/supabase/server';
import { broadcastMessage, sendMessageToClient, addConnection, removeConnection, handleMessage } from './websocket-manager';

// Type definitions
type ExtendedWebSocket = WebSocket & { id?: string; userId?: string; };

// Create WebSocket server
let wss: WebSocketServer | null = null;

export function initializeWebSocketServer(server: any) {
  if (wss) {
    console.log('[WEBSOCKET] WebSocket server already initialized');
    return;
  }
  
  try {
    // Create WebSocket server
    wss = new WebSocketServer({ server, path: '/api/admin/dashboard/ws' });
    
    console.log('[WEBSOCKET] WebSocket server initialized');
    
    // Handle new connections
    wss.on('connection', (ws: ExtendedWebSocket, request) => {
      // Generate unique ID for connection
      const connectionId = Math.random().toString(36).substring(2, 15) + 
                          Math.random().toString(36).substring(2, 15);
      ws.id = connectionId;
      
      // Extract user ID from request (this would come from auth in a real implementation)
      const userId = (request.headers as any)['user-id'] as string || 'anonymous';
      ws.userId = userId;
      
      // Add connection to manager
      addConnection(connectionId, ws as any, userId);
      
      console.log(`[WEBSOCKET] New connection established: ${connectionId} (User: ${userId})`);
      
      // Send welcome message
      ws.send(JSON.stringify({
        type: 'welcome',
        message: 'Connected to dashboard real-time updates',
        connectionId
      }));
      
      // Handle incoming messages
      ws.on('message', (data: WebSocket.Data) => {
        try {
          const message = JSON.parse(data.toString());
          handleMessage(connectionId, message);
        } catch (error) {
          console.error('[WEBSOCKET] Error parsing message:', error);
        }
      });
      
      // Handle connection close
      ws.on('close', () => {
        console.log(`[WEBSOCKET] Connection closed: ${connectionId}`);
        removeConnection(connectionId);
      });
      
      // Handle errors
      ws.on('error', (error: Error) => {
        console.error(`[WEBSOCKET] Connection error for ${connectionId}:`, error);
        removeConnection(connectionId);
      });
    });
    
    // Handle server errors
    wss.on('error', (error: Error) => {
      console.error('[WEBSOCKET] WebSocket server error:', error);
    });
    
    console.log('[WEBSOCKET] WebSocket server is ready to accept connections');
  } catch (error) {
    console.error('[WEBSOCKET] Failed to initialize WebSocket server:', error);
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

// Broadcast dashboard updates to all connected clients
export async function broadcastDashboardUpdate() {
  try {
    const supabase = await getSupabaseServerClient();
    
    // Fetch updated dashboard metrics
    const { data: metrics, error: metricsError } = await supabase
      .from('admin_dashboard_metrics')
      .select('*')
      .single();

    if (!metricsError && metrics) {
      broadcastMessage({
        type: 'metrics_update',
        metrics
      });
    }
    
    // Fetch recent tickets
    const { data: recentTickets, error: ticketsError } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!ticketsError && recentTickets) {
      broadcastMessage({
        type: 'tickets_update',
        tickets: recentTickets
      });
    }
    
    // Fetch revenue data for chart updates
    const { data: revenueData, error: revenueError } = await supabase
      .from('tickets')
      .select('created_at, final_cost')
      .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString())
      .order('created_at', { ascending: true });

    if (!revenueError && revenueData) {
      // Process revenue data
      const chartData = processRevenueData(revenueData);
      
      broadcastMessage({
        type: 'chart_update',
        chartData
      });
    }
  } catch (error) {
    console.error('[WEBSOCKET] Error broadcasting dashboard update:', error);
  }
}

// Gracefully shutdown WebSocket server
export function shutdownWebSocketServer() {
  if (wss) {
    console.log('[WEBSOCKET] Shutting down WebSocket server');
    wss.close(() => {
      console.log('[WEBSOCKET] WebSocket server closed');
    });
    wss = null;
  }
}