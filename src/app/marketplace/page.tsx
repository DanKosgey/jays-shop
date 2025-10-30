'use client'

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import Marketplace from "@/pages/Marketplace"

export default function MarketplacePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Marketplace />
      </main>
      <Footer />
    </div>
  )
}