"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Ticket,
  Package,
  ShoppingCart,
  Users,
  LineChart,
  Settings,
} from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/tickets", icon: Ticket, label: "Tickets" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/customers", icon: Users, label: "Customers" },
  { href: "/admin/analytics", icon: LineChart, label: "Analytics" },
];

const settingsItem = {
  href: "/admin/settings",
  icon: Settings,
  label: "Settings",
};

export function AdminNav() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
      <div className="flex flex-col h-full">
        <SidebarMenu className="flex-1 p-2">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.href)}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>

        <SidebarMenu className="p-2 mt-auto">
             <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(settingsItem.href)}
                  tooltip={settingsItem.label}
                >
                  <Link href={settingsItem.href}>
                    <settingsItem.icon />
                    <span>{settingsItem.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
        </SidebarMenu>
      </div>
  );
}
