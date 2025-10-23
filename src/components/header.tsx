import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Wrench, ShoppingCart, Search } from "lucide-react";
import { Logo } from "./icons";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/track", label: "Track Repair" },
  { href: "/shop", label: "Shop" },
  { href: "/marketplace", label: "Marketplace" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Wrench className="h-6 w-6 text-accent" />
          <span className="font-headline">Jay's Phone Repair</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground/60 transition-colors hover:text-foreground/80 hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="hidden md:flex">
            <Link href="/track">
              <Search className="h-5 w-5" />
              <span className="sr-only">Track Repair</span>
            </Link>
          </Button>
          
          <Button asChild variant="ghost" size="icon" className="hidden md:flex">
            <Link href="/shop">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>

          <Button asChild variant="ghost" className="hidden md:flex">
            <Link href="/admin/login">Admin</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>Menu for navigating the website</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between border-b pb-4">
                  <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                    <Wrench className="h-6 w-6 text-accent" />
                    <span className="font-headline">Jay's Phone Repair</span>
                  </Link>
                </div>
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium py-2 px-4 rounded-lg hover:bg-accent/10 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto pt-4 border-t">
                  <div className="flex flex-col gap-2">
                    <Button asChild variant="outline">
                      <Link href="/track">
                        <Search className="h-4 w-4 mr-2" />
                        Track Repair
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/shop">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Shop
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href="/admin/login">Admin Login</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}