import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">About Us</h1>
        <div className="prose max-w-none">
          <p>
            RepairHub is a leading provider of phone repair services and quality products. 
            We've been serving our community for over 5 years with a commitment to excellence 
            and customer satisfaction.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-4">Our Mission</h2>
          <p>
            Our mission is to provide fast, reliable, and affordable phone repair services 
            while offering high-quality products to extend the life of your devices.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-4">Why Choose Us</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Expert technicians with years of experience</li>
            <li>90-day warranty on all repairs</li>
            <li>Fast turnaround times</li>
            <li>Competitive pricing</li>
            <li>Genuine parts and accessories</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  )
}