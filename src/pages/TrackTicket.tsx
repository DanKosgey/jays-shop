import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Package } from "lucide-react";
import { ticketsDb } from "@/lib/db/tickets";
import { Database } from "../../types/database.types";

type Ticket = Database['public']['Tables']['tickets']['Row'];

const TrackTicket = () => {
  const [ticketNumber, setTicketNumber] = useState("");
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!ticketNumber) {
      setError("Please enter a ticket number");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const data = await ticketsDb.getByTicketNumber(ticketNumber);
      setTicket(data || null);
      
      if (!data) {
        setError("Ticket not found. Please check the ticket number and try again.");
      }
    } catch (err) {
      console.error("Error fetching ticket:", err);
      setError("Failed to fetch ticket information");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-priority-urgent text-white';
      case 'high': return 'bg-priority-high text-white';
      case 'normal': return 'bg-priority-normal text-white';
      case 'low': return 'bg-priority-low text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-status-received text-white';
      case 'diagnosing': return 'bg-status-diagnosing text-white';
      case 'awaiting_parts': return 'bg-status-awaiting text-white';
      case 'repairing': return 'bg-status-repairing text-white';
      case 'quality_check': return 'bg-status-quality text-white';
      case 'ready': return 'bg-status-ready text-white';
      case 'completed': return 'bg-status-completed text-white';
      case 'cancelled': return 'bg-status-cancelled text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Track Your Repair</h1>
          <p className="text-muted-foreground">
            Enter your ticket number to see the current status of your repair
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ticket Number</CardTitle>
            <CardDescription>Format: TKT-YYYYMMDD-XXXX</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., TKT-20240115-0001"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                {loading ? "Searching..." : "Track"}
              </Button>
            </div>
            {error && !ticket && (
              <div className="mt-4 text-destructive text-center">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {ticket && (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{ticket.ticket_number}</CardTitle>
                  <CardDescription>
                    {ticket.device_brand} {ticket.device_model} - {ticket.issue_description}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress Timeline */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-3 w-3 rounded-full ${ticket.status !== 'received' ? 'bg-success' : 'bg-border'}`} />
                    {ticket.status !== 'received' && (
                      <div className="h-16 w-0.5 bg-success" />
                    )}
                  </div>
                  <div className="flex-1 pt-0">
                    <p className={`font-semibold ${ticket.status !== 'received' ? '' : 'text-muted-foreground'}`}>
                      Received
                    </p>
                    {ticket.created_at && (
                      <p className="text-sm text-muted-foreground">
                        {formatDate(ticket.created_at)} {formatTime(ticket.created_at)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-3 w-3 rounded-full ${
                      ['diagnosing', 'awaiting_parts', 'repairing', 'quality_check', 'ready', 'completed'].includes(ticket.status) 
                        ? 'bg-success' 
                        : 'bg-border'
                    }`} />
                    {['diagnosing', 'awaiting_parts', 'repairing', 'quality_check', 'ready', 'completed'].includes(ticket.status) && (
                      <div className="h-16 w-0.5 bg-success" />
                    )}
                  </div>
                  <div className="flex-1 pt-0">
                    <p className={`font-semibold ${
                      ['diagnosing', 'awaiting_parts', 'repairing', 'quality_check', 'ready', 'completed'].includes(ticket.status) 
                        ? '' 
                        : 'text-muted-foreground'
                    }`}>
                      Diagnosing
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {['diagnosing', 'awaiting_parts', 'repairing', 'quality_check', 'ready', 'completed'].includes(ticket.status) 
                        ? 'Completed' 
                        : 'Pending'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-3 w-3 rounded-full ${
                      ['repairing', 'quality_check', 'ready', 'completed'].includes(ticket.status) 
                        ? 'bg-success' 
                        : ticket.status === 'awaiting_parts' 
                          ? 'bg-status-awaiting border-4 border-status-awaiting/20' 
                          : 'bg-border'
                    }`} />
                    {['repairing', 'quality_check', 'ready', 'completed'].includes(ticket.status) && (
                      <div className="h-16 w-0.5 bg-success" />
                    )}
                  </div>
                  <div className="flex-1 pt-0">
                    <p className={`font-semibold ${
                      ['repairing', 'quality_check', 'ready', 'completed'].includes(ticket.status) 
                        ? '' 
                        : ticket.status === 'awaiting_parts' 
                          ? 'text-status-awaiting' 
                          : 'text-muted-foreground'
                    }`}>
                      {ticket.status === 'awaiting_parts' ? 'Awaiting Parts' : 'Repairing'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {['repairing', 'quality_check', 'ready', 'completed'].includes(ticket.status) 
                        ? 'Completed' 
                        : ticket.status === 'awaiting_parts' 
                          ? 'Waiting for parts' 
                          : 'Pending'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-3 w-3 rounded-full ${
                      ['quality_check', 'ready', 'completed'].includes(ticket.status) 
                        ? 'bg-success' 
                        : 'bg-border'
                    }`} />
                    {['quality_check', 'ready', 'completed'].includes(ticket.status) && (
                      <div className="h-16 w-0.5 bg-success" />
                    )}
                  </div>
                  <div className="flex-1 pt-0">
                    <p className={`font-semibold ${
                      ['quality_check', 'ready', 'completed'].includes(ticket.status) 
                        ? '' 
                        : 'text-muted-foreground'
                    }`}>
                      Quality Check
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {['quality_check', 'ready', 'completed'].includes(ticket.status) 
                        ? 'Completed' 
                        : 'Pending'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-3 w-3 rounded-full ${
                      ['ready', 'completed'].includes(ticket.status) 
                        ? 'bg-success' 
                        : 'bg-border'
                    }`} />
                    {['ready', 'completed'].includes(ticket.status) && (
                      <div className="h-16 w-0.5 bg-success" />
                    )}
                  </div>
                  <div className="flex-1 pt-0">
                    <p className={`font-semibold ${
                      ['ready', 'completed'].includes(ticket.status) 
                        ? '' 
                        : 'text-muted-foreground'
                    }`}>
                      Ready for Pickup
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {['ready', 'completed'].includes(ticket.status) 
                        ? 'Completed' 
                        : 'Pending'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-3 w-3 rounded-full ${
                      ticket.status === 'completed' 
                        ? 'bg-success' 
                        : 'bg-border'
                    }`} />
                  </div>
                  <div className="flex-1 pt-0">
                    <p className={`font-semibold ${
                      ticket.status === 'completed' 
                        ? '' 
                        : 'text-muted-foreground'
                    }`}>
                      Completed
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {ticket.status === 'completed' 
                        ? 'Completed' 
                        : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ticket Details */}
              <div className="border-t pt-6 space-y-3">
                {ticket.estimated_completion && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Completion</span>
                    <span className="font-semibold">{formatDate(ticket.estimated_completion)}</span>
                  </div>
                )}
                
                {ticket.estimated_cost && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Cost</span>
                    <span className="font-semibold">KSh {ticket.estimated_cost.toLocaleString()}</span>
                  </div>
                )}
                
                {ticket.final_cost && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Final Cost</span>
                    <span className="font-semibold">KSh {ticket.final_cost.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Priority</span>
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                </div>
              </div>

              {/* Customer Note */}
              {ticket.customer_notes && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-semibold mb-1">Customer Notes</p>
                  <p className="text-sm text-muted-foreground">
                    {ticket.customer_notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {!ticket && !loading && (
          <div className="mt-12 text-center text-muted-foreground">
            <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Enter your ticket number above to track your repair</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackTicket;