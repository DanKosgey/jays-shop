"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Ticket,
  Package,
  Users,
  Settings,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/tickets", icon: Ticket, label: "Tickets" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/customers", icon: Users, label: "Customers" },
];

const settingsItem = {
  href: "/admin/settings",
  icon: Settings,
  label: "Settings",
};

export function MobileNav() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-64 flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <span className="">Jay's Phone Repair</span>
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${
                isActive(item.href)
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
          <Link
            href={settingsItem.href}
            className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${
              isActive(settingsItem.href)
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <settingsItem.icon className="h-5 w-5" />
            {settingsItem.label}
          </Link>
        </nav>
        <div className="mt-auto">
          <div className="p-4 text-sm text-muted-foreground">
            <p>© 2025 Jay's Phone Repair</p>
            <p className="mt-1">All rights reserved</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}