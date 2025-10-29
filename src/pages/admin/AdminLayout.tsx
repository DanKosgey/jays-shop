import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-7xl mx-auto p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
