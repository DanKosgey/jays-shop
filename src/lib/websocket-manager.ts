// WebSocket manager for handling real-time dashboard updates
import { getSupabaseServerClient } from '@/server/supabase/server';

// Type definitions
type WebSocketMessage = {
  type: string;
  [key: string]: any;
};

type Connection = {
  id: string;
  ws: WebSocket;
  userId: string;
  connectedAt: Date;
};

// In-memory store for WebSocket connections
const connections = new Map<string, Connection>();

// Broadcast message to all connected clients
export function broadcastMessage(message: WebSocketMessage) {
  connections.forEach((connection) => {
    if (connection.ws.readyState === WebSocket.OPEN) {
      connection.ws.send(JSON.stringify(message));
    }
  });
}

// Send message to specific client
export function sendMessageToClient(connectionId: string, message: WebSocketMessage) {
  const connection = connections.get(connectionId);
  if (connection && connection.ws.readyState === WebSocket.OPEN) {
    connection.ws.send(JSON.stringify(message));
  }
}

// Add new connection
export function addConnection(connectionId: string, ws: WebSocket, userId: string) {
  connections.set(connectionId, {
    id: connectionId,
    ws,
    userId,
    connectedAt: new Date()
  });
}

// Remove connection
export function removeConnection(connectionId: string) {
  connections.delete(connectionId);
}

// Get connection count
export function getConnectionCount(): number {
  return connections.size;
}

// Get active users
export function getActiveUsers(): string[] {
  const userIds = new Set<string>();
  connections.forEach(connection => userIds.add(connection.userId));
  return Array.from(userIds);
}

// Handle incoming messages
export async function handleMessage(connectionId: string, message: WebSocketMessage) {
  try {
    switch (message.type) {
      case 'request_metrics_update':
        // Fetch updated metrics and send back
        const supabase = await getSupabaseServerClient();
        
        const { data: metrics, error: metricsError } = await supabase
          .from('admin_dashboard_metrics')
          .select('*')
          .single();

        if (!metricsError && metrics) {
          sendMessageToClient(connectionId, {
            type: 'metrics_update',
            metrics
          });
        }
        break;
        
      case 'request_chart_update':
        // Fetch updated chart data and send back
        const supabaseChart = await getSupabaseServerClient();
        
        const { data: revenueData, error: revenueError } = await supabaseChart
          .from('tickets')
          .select('created_at, final_cost')
          .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString())
          .order('created_at', { ascending: true });

        if (!revenueError && revenueData) {
          // Process revenue data
          const chartData = processRevenueData(revenueData);
          
          sendMessageToClient(connectionId, {
            type: 'chart_update',
            chartData
          });
        }
        break;
        
      case 'ping':
        // Respond with pong
        sendMessageToClient(connectionId, {
          type: 'pong'
        });
        break;
        
      default:
        console.log(`[WEBSOCKET] Unknown message type: ${message.type}`);
    }
  } catch (error) {
    console.error('[WEBSOCKET] Error handling message:', error);
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

// Cleanup inactive connections
export function cleanupInactiveConnections() {
  const now = new Date();
  const timeout = 30 * 60 * 1000; // 30 minutes
  
  connections.forEach((connection, id) => {
    // Remove connections that have been inactive for more than 30 minutes
    if (now.getTime() - connection.connectedAt.getTime() > timeout) {
      removeConnection(id);
      console.log(`[WEBSOCKET] Removed inactive connection: ${id}`);
    }
  });
}

// Periodically clean up inactive connections
setInterval(cleanupInactiveConnections, 10 * 60 * 1000); // Every 10 minutes