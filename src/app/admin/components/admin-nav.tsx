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
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

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
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={isActive(item.href)}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>

        <SidebarMenu className="p-2 mt-auto">
             <SidebarMenuItem>
                <Link href={settingsItem.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={isActive(settingsItem.href)}
                    tooltip={settingsItem.label}
                  >
                    <settingsItem.icon />
                    <span>{settingsItem.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
        </SidebarMenu>
      </div>
  );
}
