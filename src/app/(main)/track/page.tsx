
"use client";

import React, { useState, useEffect, type FormEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Hourglass, CheckCircle, Wrench, Package, Microscope, ShieldQuestion, CircleDotDashed, XCircle, Loader2 } from "lucide-react";
import { mockTickets } from "@/lib/mock-data";
import type { RepairTicket } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const statusInfo = {
  received: { icon: <Hourglass className="h-5 w-5" />, text: "Received" },
  diagnosing: { icon: <Microscope className="h-5 w-5" />, text: "Diagnosing" },
  awaiting_parts: { icon: <Package className="h-5 w-5" />, text: "Awaiting Parts" },
  repairing: { icon: <Wrench className="h-5 w-5" />, text: "Repairing" },
  quality_check: { icon: <ShieldQuestion className="h-5 w-5" />, text: "Quality Check" },
  ready: { icon: <CircleDotDashed className="h-5 w-5" />, text: "Ready for Pickup" },
  completed: { icon: <CheckCircle className="h-5 w-5" />, text: "Completed" },
  cancelled: { icon: <XCircle className="h-5 w-5" />, text: "Cancelled" },
};

const statusOrder: RepairTicket['status'][] = ['received', 'diagnosing', 'awaiting_parts', 'repairing', 'quality_check', 'ready', 'completed'];

function TrackPageContent() {
  const searchParams = useSearchParams();
  const [ticketNumber, setTicketNumber] = useState(searchParams.get("ticketNumber") || "RPR-2025-0001");
  const [ticket, setTicket] = useState<RepairTicket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const performSearch = (searchTicketNumber: string) => {
    setError(null);
    setTicket(null);
    if (!searchTicketNumber.trim()) {
        setError("Please enter a ticket number.");
        return;
    }
    setLoading(true);
    setTimeout(() => {
        const foundTicket = mockTickets.find(
            (t) => t.ticketNumber.toLowerCase() === searchTicketNumber.toLowerCase().trim()
        );

        if (foundTicket) {
            setTicket(foundTicket);
        } else {
            setError("No repair ticket found with that number. Please check and try again.");
        }
        setLoading(false);
    }, 1000);
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
    performSearch(ticketNumber);
  };

  const currentStatusIndex = ticket ? statusOrder.indexOf(ticket.status) : -1;

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-headline font-bold">Track Your Repair</h1>
        <p className="text-muted-foreground mt-2">Enter your ticket number to see the real-time status of your repair.</p>
      </div>

      <Card className="mb-8 shadow-lg">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row w-full gap-4">
            <Input
              type="text"
              placeholder="Enter your ticket number (e.g., RPR-2025-0001)"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              className="flex-grow text-base"
              aria-label="Ticket Number"
            />
            <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={loading}>
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...</>
              ) : (
                <><Search className="mr-2 h-5 w-5" /> Track</>
              )}
            </Button>
          </form>
          {error && <p className="text-destructive mt-4 text-sm">{error}</p>}
        </CardContent>
      </Card>

      {ticket && (
        <Card className="shadow-lg animate-in fade-in-50">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Status for Ticket #{ticket.ticketNumber}</CardTitle>
            <CardDescription>
                Last updated: {new Date(ticket.updatedAt).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h3 className="font-semibold mb-4 text-lg">Repair Progress</h3>
              <div className="flex items-center justify-between">
                {statusOrder.map((status, index) => {
                   const isCompleted = index < currentStatusIndex;
                   const isCurrent = index === currentStatusIndex;
                   const isFuture = index > currentStatusIndex;
                   return (
                     <div key={status} className="flex-1 flex flex-col items-center text-center relative">
                        <div className={cn("absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2", isCompleted || isCurrent ? 'bg-accent' : 'bg-border')}/>
                        <div className="relative z-10">
                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", 
                                isCompleted ? 'bg-accent text-accent-foreground' : '',
                                isCurrent ? 'bg-accent ring-4 ring-accent/30 text-accent-foreground' : '',
                                isFuture ? 'bg-muted text-muted-foreground' : ''
                            )}>
                                {statusInfo[status].icon}
                            </div>
                        </div>
                       <p className={cn("text-xs mt-2 w-20", isCurrent ? "font-bold text-accent" : "text-muted-foreground")}>{statusInfo[status].text}</p>
                     </div>
                   )
                })}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Device Information</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                        <p><strong>Device:</strong> {ticket.deviceBrand} {ticket.deviceModel}</p>
                        <p><strong>Type:</strong> {ticket.deviceType}</p>
                        <p><strong>Priority:</strong> <span className="capitalize">{ticket.priority}</span></p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Cost & Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                         <p><strong>Estimated Cost:</strong> {ticket.estimatedCost ? `Ksh${ticket.estimatedCost.toFixed(2)}` : 'Pending'}</p>
                        <p><strong>Final Cost:</strong> {ticket.finalCost ? `Ksh${ticket.finalCost.toFixed(2)}` : 'Pending'}</p>
                        <p><strong>Estimated Completion:</strong> {ticket.estimatedCompletion ? new Date(ticket.estimatedCompletion).toLocaleDateString() : 'Pending'}</p>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Issue Description</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{ticket.issueDescription}</p>
                </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


export default function TrackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TrackPageContent />
        </Suspense>
    )
}
