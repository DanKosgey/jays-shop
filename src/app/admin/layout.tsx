import { Sidebar } from './components/sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ CRITICAL: Don't apply auth check to login page
  // The children will render the login page directly without auth
  
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* Render the sidebar in the main admin layout - hidden on mobile, visible on md and up */}
      <Sidebar />
      {/* Content area - no margin on mobile, left margin on md and up to account for sidebar */}
      <div className="flex flex-col flex-1 md:ml-64">
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}