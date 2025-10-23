"use client";

import React, { useState, useEffect, type FormEvent, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Hourglass, CheckCircle, Wrench, Package, Microscope, ShieldQuestion, CircleDotDashed, XCircle, Loader2, AlertCircle, RotateCcw, Calendar, Clock, User, Smartphone } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState(searchParams.get("ticketNumber") || searchParams.get("customerName") || "");
  const [searchType, setSearchType] = useState<"ticketNumber" | "customerName">(
    searchParams.get("customerName") ? "customerName" : "ticketNumber"
  );
  const [ticket, setTicket] = useState<RepairTicket | null>(null);
  const [tickets, setTickets] = useState<RepairTicket[]>([]);
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

  const performSearch = useCallback(async (query: string) => {
    setError(null);
    setTicket(null);
    setTickets([]);
    setHasSearched(true);
    
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError("Please enter a ticket number or customer name.");
      return;
    }

    // Basic validation for search query length
    if (trimmedQuery.length < 2) {
      setError("Search query must be at least 2 characters long.");
      return;
    }

    setLoading(true);
    try {
      let json: { tickets: any[] };
      if (searchType === "ticketNumber") {
        json = await fetchTickets(trimmedQuery) as { tickets: any[] };
      } else {
        // For customer name search, we need to pass it as the search parameter
        json = await fetchTickets(undefined, 1, 10, trimmedQuery) as { tickets: any[] };
      }
      
      const list: any[] = json.tickets ?? [];
      
      if (list.length > 0) {
        const tickets = transformTicketsData(list);
        
        if (list.length === 1) {
          // Single ticket found, show details
          const normalized = tickets[0];
          setTicket(normalized);
          dispatchTicketViewedEvent(normalized);
        } else {
          // Multiple tickets found, show list
          setTickets(tickets);
        }
        
        // Update URL without triggering navigation
        const params = new URLSearchParams(searchParams.toString());
        if (searchType === "ticketNumber") {
          params.set('ticketNumber', trimmedQuery);
          params.delete('customerName');
        } else {
          params.set('customerName', trimmedQuery);
          params.delete('ticketNumber');
        }
        router.replace(`?${params.toString()}`, { scroll: false });
      } else {
        setError(`No repair ticket found with that ${searchType === "ticketNumber" ? "ticket number" : "customer name"}. Please check and try again.`);
      }
    } catch (e: any) {
      setError(e?.message || "An error occurred while fetching the ticket.");
    } finally {
      setLoading(false);
    }
  }, [searchParams, router, dispatchTicketViewedEvent, searchType]);

  useEffect(() => {
    const ticketFromUrl = searchParams.get("ticketNumber");
    const customerFromUrl = searchParams.get("customerName");
    
    if ((ticketFromUrl || customerFromUrl) && !hasSearched) {
      if (customerFromUrl) {
        setSearchQuery(customerFromUrl);
        setSearchType("customerName");
        performSearch(customerFromUrl);
      } else if (ticketFromUrl) {
        setSearchQuery(ticketFromUrl);
        setSearchType("ticketNumber");
        performSearch(ticketFromUrl);
      }
    }
  }, [searchParams, hasSearched, performSearch]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    void performSearch(searchQuery);
  };

  const handleTryAgain = () => {
    setError(null);
    setTicket(null);
    setTickets([]);
    setSearchQuery("");
    setHasSearched(false);
    // Clear URL params
    router.replace(window.location.pathname, { scroll: false });
  };

  const selectTicket = (selectedTicket: RepairTicket) => {
    setTicket(selectedTicket);
    setTickets([]);
    dispatchTicketViewedEvent(selectedTicket);
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
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-3 tracking-wide bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Repair Status Matrix
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Search for your repair using ticket number or customer name
        </p>
      </div>

      <Card className="mb-8 shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row w-full gap-4">
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <div className="flex items-center border rounded-md bg-background">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as "ticketNumber" | "customerName")}
                  className="h-12 px-3 bg-transparent border-r border-border rounded-l-md focus:outline-none focus:ring-2 focus:ring-accent"
                  disabled={loading}
                >
                  <option value="ticketNumber">Ticket Number</option>
                  <option value="customerName">Customer Name</option>
                </select>
                <Input
                  type="text"
                  placeholder={
                    searchType === "ticketNumber" 
                      ? "Enter service tag (e.g., RPR-2025-0001)" 
                      : "Enter your full name"
                  }
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    // Clear error when user starts typing again
                    if (error) setError(null);
                  }}
                  className="flex-grow text-base h-12 border-0 focus-visible:ring-0"
                  aria-label={searchType === "ticketNumber" ? "Ticket Number" : "Customer Name"}
                  disabled={loading}
                />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600" 
                disabled={loading || !searchQuery.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" /> 
                    Track
                  </>
                )}
              </Button>
            </div>
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
                Try Another Search
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Display multiple tickets if found */}
      {tickets.length > 0 && (
        <Card className="mb-8 shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-headline">Multiple Repair Tickets Found</CardTitle>
            <CardDescription>Select a ticket to view its details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tickets.map((t) => (
              <Card 
                key={t.id} 
                className="cursor-pointer hover:bg-accent/10 transition-colors border-border/50"
                onClick={() => selectTicket(t)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <Smartphone className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-headline font-semibold">{t.ticketNumber}</h3>
                        <p className="text-sm text-muted-foreground">{t.deviceBrand} {t.deviceModel}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "text-sm font-medium capitalize",
                        t.status === 'completed' && "text-green-600",
                        t.status === 'cancelled' && "text-destructive",
                        t.status === 'ready' && "text-blue-600"
                      )}>
                        {t.status.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(t.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {ticket && (
        <Card className="shadow-xl border-border/50 bg-card/80 backdrop-blur-sm animate-in fade-in-50 duration-500">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <CardTitle className="text-2xl font-headline flex items-center gap-3 flex-wrap">
                  <span className="text-accent">Service Tag:</span>
                  <span className="font-mono bg-accent/10 px-3 py-1 rounded-md">{ticket.ticketNumber}</span>
                </CardTitle>
                <CardDescription className="mt-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Data stream last updated: {formatDateTime(ticket.updatedAt)}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleTryAgain}
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                New Search
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 grid md:grid-cols-3 gap-8">
            {/* Left Column - Device Info */}
            <div className="md:col-span-1 space-y-6">
              <Card className="bg-background/40 border-border/30">
                <CardHeader>
                  <CardTitle className="text-lg font-headline flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Unit Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3 text-muted-foreground">
                  <div className="flex justify-between py-2 border-b border-border/20">
                    <span className="text-foreground font-medium">Device</span>
                    <span>{ticket.deviceBrand} {ticket.deviceModel}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/20">
                    <span className="text-foreground font-medium">Type</span>
                    <span>{ticket.deviceType}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/20">
                    <span className="text-foreground font-medium">Customer</span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {ticket.customerName}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-foreground font-medium">Priority</span>
                    <span className={cn("capitalize font-semibold", getPriorityColor(ticket.priority))}>
                      {ticket.priority}
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-background/40 border-border/30">
                <CardHeader>
                  <CardTitle className="text-lg font-headline flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-xs text-white">₵</span>
                    Financials & Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3 text-muted-foreground">
                  <div className="flex justify-between py-2 border-b border-border/20">
                    <span className="text-foreground font-medium">Est. Cost</span>
                    <span>{ticket.estimatedCost ? `Ksh${ticket.estimatedCost.toFixed(2)}` : 'Pending'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/20">
                    <span className="text-foreground font-medium">Final Cost</span>
                    <span>{ticket.finalCost ? `Ksh${ticket.finalCost.toFixed(2)}` : 'Pending'}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-foreground font-medium">Est. Completion</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {ticket.estimatedCompletion ? formatDate(ticket.estimatedCompletion) : 'Pending'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Timeline */}
            <div className="md:col-span-2">
              <h3 className="font-headline font-bold text-xl mb-6 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Repair Progress Timeline
              </h3>
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
                            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 border-2",
                            isCompleted && !isCancelled && 'bg-accent text-accent-foreground border-accent',
                            isCurrent && !isCancelled && 'bg-accent text-accent-foreground ring-4 ring-accent/30 scale-110 border-accent',
                            isFuture && 'bg-muted text-muted-foreground border-border',
                            isCancelled && 'bg-muted text-muted-foreground opacity-50 border-border'
                          )}
                        >
                          {STATUS_INFO[status].icon}
                        </div>
                        <div className="pt-1.5 flex-1">
                          <p 
                            className={cn(
                              "font-semibold font-headline transition-colors text-lg",
                              isCurrent && !isCancelled ? "text-accent" : "text-foreground",
                              isCancelled && "opacity-50"
                            )}
                          >
                            {STATUS_INFO[status].text}
                          </p>
                          <p 
                            className={cn(
                              "text-sm text-muted-foreground mt-1",
                              isCancelled && "opacity-50"
                            )}
                          >
                            {STATUS_INFO[status].description}
                          </p>
                          {isCurrent && !isCancelled && (
                            <div className="mt-2 inline-flex items-center gap-1 text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                              <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                              In Progress
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Cancelled Status (shown separately if applicable) */}
                  {ticket.status === 'cancelled' && (
                    <div className="flex items-start gap-4 relative">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10 bg-destructive text-destructive-foreground ring-4 ring-destructive/30 scale-110 border-2 border-destructive">
                        {STATUS_INFO.cancelled.icon}
                      </div>
                      <div className="pt-1.5 flex-1">
                        <p className="font-semibold font-headline text-destructive text-lg">
                          {STATUS_INFO.cancelled.text}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
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
                  <CardTitle className="text-lg font-headline flex items-center gap-2">
                    <Microscope className="h-5 w-5" />
                    Technician's Log: Issue Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground font-mono whitespace-pre-wrap leading-relaxed bg-muted/50 p-4 rounded-lg">
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