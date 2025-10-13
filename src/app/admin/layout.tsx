import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Wrench } from "lucide-react";
import Link from "next/link";
import { AdminNav } from "./components/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <div className="flex h-16 items-center justify-center border-b shrink-0">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            <Wrench className="h-6 w-6 text-accent" />
            <span className="font-headline">Jay's phone repair shop</span>
          </Link>
           <Link href="/" className="hidden items-center gap-2 font-bold text-lg text-sidebar-foreground group-data-[collapsible=icon]:flex">
            <Wrench className="h-6 w-6 text-accent" />
          </Link>
        </div>
        <AdminNav />
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
