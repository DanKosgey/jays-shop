'use client'

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import TrackTicket from "@/pages/TrackTicket"

export default function TrackTicketPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <TrackTicket />
      </main>
      <Footer />
    </div>
  )
}