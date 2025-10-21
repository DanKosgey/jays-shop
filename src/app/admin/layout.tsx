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
      {/* No sidebar in the main admin layout - it will be rendered in protected layouts */}
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
