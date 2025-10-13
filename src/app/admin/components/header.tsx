import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "./user-nav";

type AdminHeaderProps = {
  title: string;
};

export function AdminHeader({ title }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      <h1 className="flex-1 text-2xl font-bold font-headline">{title}</h1>
      <div className="ml-auto flex items-center gap-4">
        <UserNav />
      </div>
    </header>
  );
}
