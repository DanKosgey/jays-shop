import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ticketsDb } from "@/lib/db/tickets";
import { Database } from "../../../types/database.types";

type Ticket = Database['public']['Tables']['tickets']['Row'];

const statusColors = {
  received: "bg-status-received/20 text-status-received border-status-received/30",
  diagnosing: "bg-status-diagnosing/20 text-status-diagnosing border-status-diagnosing/30",
  awaiting_parts: "bg-status-awaiting/20 text-status-awaiting border-status-awaiting/30",
  repairing: "bg-status-repairing/20 text-status-repairing border-status-repairing/30",
  quality_check: "bg-status-quality/20 text-status-quality border-status-quality/30",
  ready: "bg-status-ready/20 text-status-ready border-status-ready/30",
  completed: "bg-status-completed/20 text-status-completed border-status-completed/30",
  cancelled: "bg-status-cancelled/20 text-status-cancelled border-status-cancelled/30",
};

const priorityColors = {
  low: "bg-priority-low/20 text-priority-low border-priority-low/30",
  normal: "bg-priority-normal/20 text-priority-normal border-priority-normal/30",
  high: "bg-priority-high/20 text-priority-high border-priority-high/30",
  urgent: "bg-priority-urgent/20 text-priority-urgent border-priority-urgent/30",
};

const Tickets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketsDb.getAll();
      setTickets(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      fetchTickets();
      return;
    }
    
    try {
      setLoading(true);
      const data = await ticketsDb.search(term);
      setTickets(data || []);
      setError(null);
    } catch (err) {
      console.error("Error searching tickets:", err);
      setError("Failed to search tickets");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tickets</h1>
            <p className="text-muted-foreground">Manage repair tickets</p>
          </div>
          <Button size="lg" onClick={() => navigate("/admin/tickets/new")}>
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        </div>
        <Card>
          <CardContent className="flex justify-center items-center h-32">
            <p>Loading tickets...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tickets</h1>
            <p className="text-muted-foreground">Manage repair tickets</p>
          </div>
          <Button size="lg" onClick={() => navigate("/admin/tickets/new")}>
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
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
          <h1 className="text-3xl font-bold">Tickets</h1>
          <p className="text-muted-foreground">Manage repair tickets</p>
        </div>
        <Button size="lg" onClick={() => navigate("/admin/tickets/new")}>
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full md:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets && tickets.length > 0 ? (
              tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">{ticket.ticket_number}</p>
                      <Badge variant="outline" className={statusColors[ticket.status]}>
                        {ticket.status}
                      </Badge>
                      <Badge variant="outline" className={priorityColors[ticket.priority]}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {ticket.customer_name} • {ticket.device_brand} {ticket.device_model}
                    </p>
                    <p className="text-sm">{ticket.issue_description}</p>
                  </div>
                  <div className="text-right mt-4 md:mt-0 w-full md:w-auto">
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="text-sm font-medium">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No tickets found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tickets;