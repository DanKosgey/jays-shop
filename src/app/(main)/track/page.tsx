"use client";

import React, { useState, useEffect, type FormEvent, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Hourglass, CheckCircle, Wrench, Package, Microscope, ShieldQuestion, CircleDotDashed, XCircle, Loader2, AlertCircle, RotateCcw } from "lucide-react";
import type { RepairTicket } from "@/lib/types";
import { cn } from "@/lib/utils";
import { fetchTickets } from "@/lib/data-fetching";
import { transformTicketsData } from "@/lib/data-transform";

type StatusKey = RepairTicket['status'];

interface StatusInfo {
  icon: React.ReactNode;
  text: string;
  description: string;
}

const STATUS_INFO: Record<StatusKey, StatusInfo> = {
  received: { 
    icon: <Hourglass className="h-5 w-5" />, 
    text: "Ticket Received", 
    description: "Your device has been logged into our system." 
  },
  diagnosing: { 
    icon: <Microscope className="h-5 w-5" />, 
    text: "Diagnosis in Progress", 
    description: "Our technicians are identifying the issue." 
  },
  awaiting_parts: { 
    icon: <Package className="h-5 w-5" />, 
    text: "Awaiting Parts", 
    description: "Waiting for necessary components to arrive." 
  },
  repairing: { 
    icon: <Wrench className="h-5 w-5" />, 
    text: "Repair in Progress", 
    description: "Your device is actively being repaired." 
  },
  quality_check: { 
    icon: <ShieldQuestion className="h-5 w-5" />, 
    text: "Quality Check", 
    description: "Ensuring the repair meets our standards." 
  },
  ready: { 
    icon: <CircleDotDashed className="h-5 w-5" />, 
    text: "Ready for Pickup", 
    description: "Your device is repaired and ready for collection." 
  },
  completed: { 
    icon: <CheckCircle className="h-5 w-5" />, 
    text: "Completed", 
    description: "Your device has been picked up." 
  },
  cancelled: { 
    icon: <XCircle className="h-5 w-5" />, 
    text: "Cancelled", 
    description: "The repair ticket has been cancelled." 
  },
};

const STATUS_ORDER: StatusKey[] = [
  'received', 
  'diagnosing', 
  'awaiting_parts', 
  'repairing', 
  'quality_check', 
  'ready', 
  'completed'
];

function TrackPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ticketNumber, setTicketNumber] = useState(searchParams.get("ticketNumber") || "");
  const [ticket, setTicket] = useState<RepairTicket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const dispatchTicketViewedEvent = useCallback((ticket: RepairTicket) => {
    const event = new CustomEvent('ticketViewed', {
      detail: {
        ticketNumber: ticket.ticketNumber,
        customerName: ticket.customerName,
      }
    });
    window.dispatchEvent(event);
  }, []);

  const performSearch = useCallback(async (searchTicketNumber: string) => {
    setError(null);
    setTicket(null);
    setHasSearched(true);
    
    const trimmedTicket = searchTicketNumber.trim();
    if (!trimmedTicket) {
      setError("Please enter a ticket number.");
      return;
    }

    setLoading(true);
    try {
      const json = await fetchTickets(trimmedTicket);
      const list: any[] = json.tickets ?? [];
      
      if (list.length > 0) {
        const tickets = transformTicketsData(list);
        const normalized = tickets[0];
        setTicket(normalized);
        dispatchTicketViewedEvent(normalized);
        
        // Update URL without triggering navigation
        const params = new URLSearchParams(searchParams.toString());
        params.set('ticketNumber', trimmedTicket);
        router.replace(`?${params.toString()}`, { scroll: false });
      } else {
        setError("No repair ticket found with that number. Please check and try again.");
      }
    } catch (e: any) {
      setError(e?.message || "An error occurred while fetching the ticket.");
    } finally {
      setLoading(false);
    }
  }, [searchParams, router, dispatchTicketViewedEvent]);

  useEffect(() => {
    const ticketFromUrl = searchParams.get("ticketNumber");
    if (ticketFromUrl && !hasSearched) {
      setTicketNumber(ticketFromUrl);
      performSearch(ticketFromUrl);
    }
  }, [searchParams, hasSearched, performSearch]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    void performSearch(ticketNumber);
  };

  const handleTryAgain = () => {
    setError(null);
    setTicket(null);
    setTicketNumber("");
    setHasSearched(false);
    // Clear URL params
    router.replace(window.location.pathname, { scroll: false });
  };

  const currentStatusIndex = ticket 
    ? STATUS_ORDER.indexOf(ticket.status)
    : -1;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
      case 'high':
        return 'text-destructive';
      case 'medium':
        return 'text-amber-500';
      case 'low':
        return 'text-accent';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-3 tracking-wide">
          Repair Status Matrix
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Input your service tag to access real-time repair diagnostics.
        </p>
      </div>

      <Card className="mb-8 shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row w-full gap-4">
            <Input
              type="text"
              placeholder="Enter service tag (e.g., RPR-2025-0001)"
              value={ticketNumber}
              onChange={(e) => {
                setTicketNumber(e.target.value);
                // Clear error when user starts typing again
                if (error) setError(null);
              }}
              className="flex-grow text-base h-12"
              aria-label="Ticket Number"
              disabled={loading}
            />
            <Button 
              type="submit" 
              size="lg" 
              className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90" 
              disabled={loading || !ticketNumber.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Querying...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" /> 
                  Track
                </>
              )}
            </Button>
          </form>
          
          {error && (
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-2 text-destructive text-sm font-medium">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleTryAgain}
                className="w-full sm:w-auto"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Another Ticket
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {ticket && (
        <Card className="shadow-xl border-border/50 bg-card/80 backdrop-blur-sm animate-in fade-in-50 duration-500">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <CardTitle className="text-2xl font-headline flex items-center gap-3 flex-wrap">
                  <span className="text-accent">Service Tag:</span>
                  <span className="font-mono">{ticket.ticketNumber}</span>
                </CardTitle>
                <CardDescription className="mt-2">
                  Data stream last updated: {formatDateTime(ticket.updatedAt)}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleTryAgain}
              >
                <Search className="mr-2 h-4 w-4" />
                Track Another
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 grid md:grid-cols-3 gap-8">
            {/* Left Column - Device Info */}
            <div className="md:col-span-1 space-y-6">
              <Card className="bg-background/40 border-border/30">
                <CardHeader>
                  <CardTitle className="text-lg font-headline">Unit Information</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2 text-muted-foreground">
                  <p>
                    <strong className="text-foreground font-medium">Device:</strong>{" "}
                    {ticket.deviceBrand} {ticket.deviceModel}
                  </p>
                  <p>
                    <strong className="text-foreground font-medium">Type:</strong>{" "}
                    {ticket.deviceType}
                  </p>
                  <p>
                    <strong className="text-foreground font-medium">Priority:</strong>{" "}
                    <span className={cn("capitalize font-semibold", getPriorityColor(ticket.priority))}>
                      {ticket.priority}
                    </span>
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-background/40 border-border/30">
                <CardHeader>
                  <CardTitle className="text-lg font-headline">Financials & Timeline</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2 text-muted-foreground">
                  <p>
                    <strong className="text-foreground font-medium">Est. Cost:</strong>{" "}
                    {ticket.estimatedCost ? `Ksh${ticket.estimatedCost.toFixed(2)}` : 'Pending'}
                  </p>
                  <p>
                    <strong className="text-foreground font-medium">Final Cost:</strong>{" "}
                    {ticket.finalCost ? `Ksh${ticket.finalCost.toFixed(2)}` : 'Pending'}
                  </p>
                  <p>
                    <strong className="text-foreground font-medium">Est. Completion:</strong>{" "}
                    {ticket.estimatedCompletion ? formatDate(ticket.estimatedCompletion) : 'Pending'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Timeline */}
            <div className="md:col-span-2">
              <h3 className="font-headline font-bold text-xl mb-6">Repair Progress Timeline</h3>
              <div className="relative">
                <div className="absolute left-5 top-0 h-full w-0.5 bg-border -z-10" />
                <div className="space-y-8">
                  {STATUS_ORDER.map((status, index) => {
                    const isCompleted = index < currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    const isFuture = index > currentStatusIndex;
                    const isCancelled = ticket.status === 'cancelled';
                    
                    return (
                      <div key={status} className="flex items-start gap-4 relative">
                        <div 
                          className={cn(
                            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300",
                            isCompleted && !isCancelled && 'bg-accent text-accent-foreground',
                            isCurrent && !isCancelled && 'bg-accent text-accent-foreground ring-4 ring-accent/30 scale-110',
                            isFuture && 'bg-muted text-muted-foreground',
                            isCancelled && 'bg-muted text-muted-foreground opacity-50'
                          )}
                        >
                          {STATUS_INFO[status].icon}
                        </div>
                        <div className="pt-1.5 flex-1">
                          <p 
                            className={cn(
                              "font-semibold font-headline transition-colors",
                              isCurrent && !isCancelled ? "text-accent" : "text-foreground",
                              isCancelled && "opacity-50"
                            )}
                          >
                            {STATUS_INFO[status].text}
                          </p>
                          <p 
                            className={cn(
                              "text-sm text-muted-foreground",
                              isCancelled && "opacity-50"
                            )}
                          >
                            {STATUS_INFO[status].description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Cancelled Status (shown separately if applicable) */}
                  {ticket.status === 'cancelled' && (
                    <div className="flex items-start gap-4 relative">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10 bg-destructive text-destructive-foreground ring-4 ring-destructive/30 scale-110">
                        {STATUS_INFO.cancelled.icon}
                      </div>
                      <div className="pt-1.5 flex-1">
                        <p className="font-semibold font-headline text-destructive">
                          {STATUS_INFO.cancelled.text}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {STATUS_INFO.cancelled.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Issue Description - Full Width */}
            <div className="md:col-span-3">
              <Card className="bg-background/40 border-border/30">
                <CardHeader>
                  <CardTitle className="text-lg font-headline">Technician's Log: Issue Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground font-mono whitespace-pre-wrap leading-relaxed">
                    {ticket.issueDescription || 'No description available.'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-muted-foreground">Loading repair data...</p>
        </div>
      </div>
    }>
      <TrackPageContent />
    </Suspense>
  );
}