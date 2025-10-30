"use client"

import { LayoutDashboard, Wrench, Package, ShoppingCart, Users, Settings, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { title: "Tickets", icon: Wrench, path: "/admin/tickets" },
  { title: "Products", icon: Package, path: "/admin/products" },
  { title: "Orders", icon: ShoppingCart, path: "/admin/orders" },
  { title: "Customers", icon: Users, path: "/admin/customers" },
  { title: "Settings", icon: Settings, path: "/admin/settings" },
];

const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/login");
    onItemClick?.();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Admin Portal
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Repair Shop Manager</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || (item.path === "/admin" && pathname === "/admin");
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={onItemClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-accent/50"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export const AdminSidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-50">
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <SidebarContent onItemClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 border-r bg-card/50 backdrop-blur">
        <SidebarContent />
      </aside>
    </>
  );
};
