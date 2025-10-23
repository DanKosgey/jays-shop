import Link from "next/link";
import { Wrench, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container max-w-7xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
              <Wrench className="h-6 w-6 text-accent" />
              <span className="font-headline">Jay's Phone Repair</span>
            </Link>
            <p className="text-sm max-w-md">
              Your trusted partner for phone repairs and accessories. We provide high-quality services 
              and products to keep your devices running smoothly.
            </p>
            <div className="flex gap-4 mt-2">
              <Link href="#" aria-label="Facebook" className="p-2 rounded-full bg-accent/10 hover:bg-accent/20 transition-colors">
                <Facebook className="h-5 w-5 hover:text-accent" />
              </Link>
              <Link href="#" aria-label="Twitter" className="p-2 rounded-full bg-accent/10 hover:bg-accent/20 transition-colors">
                <Twitter className="h-5 w-5 hover:text-accent" />
              </Link>
              <Link href="#" aria-label="Instagram" className="p-2 rounded-full bg-accent/10 hover:bg-accent/20 transition-colors">
                <Instagram className="h-5 w-5 hover:text-accent" />
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/track" className="hover:text-accent transition-colors">Track Repair</Link></li>
              <li><Link href="/shop" className="hover:text-accent transition-colors">Shop Accessories</Link></li>
              <li><Link href="/marketplace" className="hover:text-accent transition-colors">Marketplace</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">FAQs</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Warranty Policy</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Return Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>123 Tech Street, Silicon Valley, CA 94000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                <span>support@jaysphonerepair.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                <span>(123) 456-7890</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Jay's Phone Repair. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}