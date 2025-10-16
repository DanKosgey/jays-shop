
"use client";

import React, { useState, useEffect, type FormEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Hourglass, CheckCircle, Wrench, Package, Microscope, ShieldQuestion, CircleDotDashed, XCircle, Loader2 } from "lucide-react";
import type { RepairTicket } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const statusInfo: { [key in RepairTicket['status']]: { icon: React.ReactNode; text: string; description: string } } = {
  received: { icon: <Hourglass className="h-5 w-5" />, text: "Ticket Received", description: "Your device has been logged into our system." },
  diagnosing: { icon: <Microscope className="h-5 w-5" />, text: "Diagnosis in Progress", description: "Our technicians are identifying the issue." },
  awaiting_parts: { icon: <Package className="h-5 w-5" />, text: "Awaiting Parts", description: "Waiting for necessary components to arrive." },
  repairing: { icon: <Wrench className="h-5 w-5" />, text: "Repair in Progress", description: "Your device is actively being repaired." },
  quality_check: { icon: <ShieldQuestion className="h-5 w-5" />, text: "Quality Check", description: "Ensuring the repair meets our standards." },
  ready: { icon: <CircleDotDashed className="h-5 w-5" />, text: "Ready for Pickup", description: "Your device is repaired and ready for collection." },
  completed: { icon: <CheckCircle className="h-5 w-5" />, text: "Completed", description: "Your device has been picked up." },
  cancelled: { icon: <XCircle className="h-5 w-5" />, text: "Cancelled", description: "The repair ticket has been cancelled." },
};


const statusOrder: RepairTicket['status'][] = ['received', 'diagnosing', 'awaiting_parts', 'repairing', 'quality_check', 'ready', 'completed'];

function TrackPageContent() {
  const searchParams = useSearchParams();
  const [ticketNumber, setTicketNumber] = useState(searchParams.get("ticketNumber") || "RPR-2025-0001");
  const [ticket, setTicket] = useState<RepairTicket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const dispatchTicketViewedEvent = (ticket: RepairTicket) => {
    const event = new CustomEvent('ticketViewed', {
      detail: {
        ticketNumber: ticket.ticketNumber,
        customerName: ticket.customerName,
      }
    });
    window.dispatchEvent(event);
  };

  const performSearch = async (searchTicketNumber: string) => {
    setError(null);
    setTicket(null);
    if (!searchTicketNumber.trim()) {
        setError("Please enter a ticket number.");
        return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/tickets?ticketNumber=${encodeURIComponent(searchTicketNumber)}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed to fetch ticket: ${res.status}`);
      const json = await res.json();
      const list: any[] = json.tickets ?? [];
      if (list.length > 0) {
        const t = list[0];
        const normalized: RepairTicket = {
          id: t.id,
          ticketNumber: t.ticket_number,
          customerId: t.user_id,
          customerName: t.customer_name,
          deviceType: t.device_type,
          deviceBrand: t.device_brand,
          deviceModel: t.device_model,
          issueDescription: t.issue_description,
          status: t.status,
          priority: t.priority,
          estimatedCost: t.estimated_cost,
          finalCost: t.final_cost,
          createdAt: t.created_at,
          updatedAt: t.updated_at,
          estimatedCompletion: t.estimated_completion,
        };
        setTicket(normalized);
        dispatchTicketViewedEvent(normalized);
      } else {
        setError("No repair ticket found with that number. Please check and try again.");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const ticketFromUrl = searchParams.get("ticketNumber");
    if (ticketFromUrl) {
      setTicketNumber(ticketFromUrl);
      performSearch(ticketFromUrl);
    }
  }, [searchParams]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    void performSearch(ticketNumber);
  };

  const currentStatusIndex = ticket ? statusOrder.indexOf(ticket.status) : -1;

  return (
    <div className="container max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-3 tracking-wide">Repair Status Matrix</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">Input your service tag to access real-time repair diagnostics.</p>
      </div>

      <Card className="mb-8 shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row w-full gap-4">
            <Input
              type="text"
              placeholder="Enter service tag (e.g., RPR-2025-0001)"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              className="flex-grow text-base h-12"
              aria-label="Ticket Number"
            />
            <Button type="submit" size="lg" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Querying...</>
              ) : (
                <><Search className="mr-2 h-5 w-5" /> Track</>
              )}
            </Button>
          </form>
          {error && <p className="text-destructive mt-4 text-sm font-code">{`ERROR: ${error}`}</p>}
        </CardContent>
      </Card>

      {ticket && (
        <Card className="shadow-xl border-border/50 bg-card/80 backdrop-blur-sm animate-in fade-in-50">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="text-2xl font-headline flex items-center gap-3">
                <span className="text-accent">Service Tag:</span>
                <span>{ticket.ticketNumber}</span>
            </CardTitle>
            <CardDescription>
                Data stream last updated: {new Date(ticket.updatedAt).toISOString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
                 <Card className="bg-background/40">
                    <CardHeader>
                        <CardTitle className="text-lg font-headline">Unit Information</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2 text-muted-foreground">
                        <p><strong className="text-foreground font-medium">Device:</strong> {ticket.deviceBrand} {ticket.deviceModel}</p>
                        <p><strong className="text-foreground font-medium">Type:</strong> {ticket.deviceType}</p>
                        <p><strong className="text-foreground font-medium">Priority:</strong> <span className={cn("capitalize font-semibold", ticket.priority === 'high' || ticket.priority === 'urgent' ? 'text-destructive' : 'text-accent' )}>{ticket.priority}</span></p>
                    </CardContent>
                </Card>
                 <Card className="bg-background/40">
                    <CardHeader>
                        <CardTitle className="text-lg font-headline">Financials & Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2 text-muted-foreground">
                         <p><strong className="text-foreground font-medium">Est. Cost:</strong> {ticket.estimatedCost ? `Ksh${ticket.estimatedCost.toFixed(2)}` : 'Pending'}</p>
                        <p><strong className="text-foreground font-medium">Final Cost:</strong> {ticket.finalCost ? `Ksh${ticket.finalCost.toFixed(2)}` : 'Pending'}</p>
                        <p><strong className="text-foreground font-medium">Est. Completion:</strong> {ticket.estimatedCompletion ? new Date(ticket.estimatedCompletion).toLocaleDateString() : 'Pending'}</p>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
                <h3 className="font-headline font-bold text-xl mb-6">Repair Progress Timeline</h3>
                <div className="relative">
                     <div className="absolute left-5 top-0 h-full w-0.5 bg-border -z-10" />
                     <div className="space-y-8">
                        {statusOrder.map((status, index) => {
                            const isCompleted = index < currentStatusIndex;
                            const isCurrent = index === currentStatusIndex;
                            const isFuture = index > currentStatusIndex;
                            
                            return (
                                <div key={status} className="flex items-start gap-4 relative">
                                    <div className={cn("flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors duration-300", 
                                        isCompleted ? 'bg-accent text-accent-foreground' : '',
                                        isCurrent ? 'bg-accent text-accent-foreground ring-4 ring-accent/30' : '',
                                        isFuture ? 'bg-muted text-muted-foreground' : ''
                                    )}>
                                        {statusInfo[status].icon}
                                    </div>
                                    <div className="pt-1.5">
                                        <p className={cn("font-semibold font-headline", isCurrent ? "text-accent" : "text-foreground")}>
                                            {statusInfo[status].text}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {statusInfo[status].description}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                     </div>
                </div>
            </div>

            <div className="md:col-span-3">
                 <Card className="bg-background/40">
                    <CardHeader>
                        <CardTitle className="text-lg font-headline">Technician's Log: Issue Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground font-mono whitespace-pre-wrap">{ticket.issueDescription}</p>
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
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading repair data...</div>}>
            <TrackPageContent />
        </Suspense>
    )
}
