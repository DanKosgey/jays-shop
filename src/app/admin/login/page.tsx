"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getSupabaseBrowserClient } from "@/server/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
// Import logging utilities
import { 
  logAuthAttempt, 
  logAuthSuccess, 
  logAuthFailure 
} from "@/lib/admin-logging";
// Import the new server action
import { checkUserRole } from "../actions/auth-actions";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Log the login attempt
      logAuthAttempt(email.trim());

      // Get Supabase client only when needed
      const supabase = getSupabaseBrowserClient();

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) throw signInError;

      if (!data.user) {
        throw new Error("Authentication failed. Please try again.");
      }

      // Check if user is admin by calling a server action instead of direct DB query
      const { isAdmin, error: roleCheckError } = await checkUserRole(data.user.id);
      
      if (roleCheckError) {
        await supabase.auth.signOut();
        throw new Error("Failed to verify user permissions.");
      }

      if (!isAdmin) {
        await supabase.auth.signOut();
        throw new Error("Access denied. Admin privileges required.");
      }

      // Log successful authentication
      logAuthSuccess(data.user.id, data.user.email || email.trim());

      toast({
        title: "Welcome back!",
        description: "Successfully logged into admin dashboard.",
      });

      // Use a more robust approach for redirecting
      // First refresh the router to ensure auth state is updated
      router.refresh();
      
      // Then navigate to the dashboard after a short delay to ensure state is properly set
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 100);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to login. Please try again.";
      setError(errorMessage);
      
      // Log authentication failure
      logAuthFailure(email.trim(), errorMessage);
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-slate-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-8 text-center rounded-t-lg">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-blue-50/80 text-sm">Secure Administration Dashboard</p>
        </div>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6 p-8">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium text-sm">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@jaysphonerepair.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    autoComplete="email"
                    className="pl-10 h-11 transition-all focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    autoComplete="current-password"
                    className="pl-10 pr-10 h-11 transition-all focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 px-8 pb-8">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-11 text-base font-medium shadow-lg transition-all"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            <p className="text-center text-xs text-slate-500">
              Only authorized administrators can access this portal
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}