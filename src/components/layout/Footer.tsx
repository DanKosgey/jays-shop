"use client"

import { Smartphone } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Smartphone className="h-5 w-5 text-primary" />
              <span className="font-bold">RepairHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Professional phone repair services and quality products.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/track" className="hover:text-primary">Track Repair</Link></li>
              <li><Link href="/products" className="hover:text-primary">Shop Products</Link></li>
              <li><Link href="/marketplace" className="hover:text-primary">Marketplace</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Phone: (555) 123-4567</li>
              <li>Email: support@repairhub.com</li>
              <li>Hours: Mon-Sat 9AM-6PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 RepairHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
