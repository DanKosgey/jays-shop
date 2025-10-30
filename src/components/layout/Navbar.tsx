"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Smartphone, User, LogOut } from "lucide-react";
import { CartSheet } from "@/components/cart/CartSheet";
import { useAuthStore } from "@/stores/auth-store";
import { useEffect } from "react";

export const Navbar = () => {
  const { isAuthenticated, user, logout, initializeAuth } = useAuthStore();
  const router = useRouter();

  // Initialize auth state on component mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Smartphone className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">RepairHub</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
              Products
            </Link>
            <Link href="/marketplace" className="text-sm font-medium hover:text-primary transition-colors">
              Marketplace
            </Link>
            <Link href="/track" className="text-sm font-medium hover:text-primary transition-colors">
              Track Repair
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <CartSheet />
            {isAuthenticated ? (
              <>
                <span className="text-sm font-medium hidden md:inline">
                  {user?.name}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};