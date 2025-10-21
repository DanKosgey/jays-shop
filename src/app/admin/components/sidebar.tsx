"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Users, 
  Wrench, 
  Settings, 
  Ticket, 
  LogOut 
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getSupabaseBrowserClient } from "@/server/supabase/client";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Package },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/products", label: "Products", icon: Wrench },
  { href: "/admin/tickets", label: "Tickets", icon: Ticket },
];

const settingsItem = {
  href: "/admin/settings",
  label: "Settings",
  icon: Settings,
};

export function Sidebar() {
  const pathname = usePathname();
  
  // Try to get the Supabase client, but handle errors gracefully
  let supabase;
  try {
    supabase = getSupabaseBrowserClient();
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
    // If we can't initialize Supabase, don't render the logout button
    supabase = null;
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const handleLogout = async () => {
    if (!supabase) {
      toast({
        title: "Error",
        description: "Authentication system not available.",
        variant: "destructive",
      });
      return;
    }
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "You have been signed out.",
      });
    }
  };

  return (
    <div className="hidden border-r bg-muted/40 md:block w-64 fixed inset-y-0 left-0 z-10">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="">Jay's Phone Repair</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  isActive(item.href)
                    ? "bg-accent text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <div className="flex flex-col gap-2">
            <Link
              href={settingsItem.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                isActive(settingsItem.href)
                  ? "bg-accent text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <settingsItem.icon className="h-4 w-4" />
              {settingsItem.label}
            </Link>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full justify-start gap-3"
              disabled={!supabase}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}