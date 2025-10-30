'use client'

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import Products from "@/pages/Products"

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Products />
      </main>
      <Footer />
    </div>
  )
}