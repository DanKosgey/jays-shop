import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import TrackTicket from "./pages/TrackTicket";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Marketplace from "./pages/Marketplace";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Settings from "./pages/admin/Settings";
import Tickets from "./pages/admin/Tickets";
import TicketForm from "./pages/admin/TicketForm";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminCustomers from "./pages/admin/Customers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes with Navbar/Footer */}
          <Route path="/" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Home />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/products" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Products />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/track" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <TrackTicket />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/marketplace" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Marketplace />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes with Sidebar */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="tickets/new" element={<TicketForm />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
