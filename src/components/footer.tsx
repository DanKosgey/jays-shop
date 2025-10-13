import Link from "next/link";
import { Wrench, Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container max-w-7xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
              <Wrench className="h-6 w-6 text-accent" />
              <span className="font-headline">Jay's phone repair shop</span>
            </Link>
            <p className="text-sm">Your trusted partner for phone repairs and accessories.</p>
            <div className="flex gap-4 mt-2">
              <Link href="#" aria-label="Facebook"><Facebook className="h-5 w-5 hover:text-accent" /></Link>
              <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5 hover:text-accent" /></Link>
              <Link href="#" aria-label="Instagram"><Instagram className="h-5 w-5 hover:text-accent" /></Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/track" className="hover:text-accent">Track Repair</Link></li>
              <li><Link href="/shop" className="hover:text-accent">Shop Accessories</Link></li>
              <li><Link href="#" className="hover:text-accent">FAQs</Link></li>
              <li><Link href="#" className="hover:text-accent">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-accent">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-accent">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-accent">Warranty Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <p>123 Tech Street, Silicon Valley, CA 94000</p>
            <p>Email: support@jaysphonerepair.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Jay's phone repair shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
