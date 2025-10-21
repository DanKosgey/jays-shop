"use client";

import { useEffect } from "react";
import { getSupabaseBrowserClient } from "@/server/supabase/client";
import { logDashboardAccess, logDashboardExit } from "@/lib/admin-logging";

interface PageLoggerProps {
  pageName: string;
}

export function PageLogger({ pageName }: PageLoggerProps) {
  useEffect(() => {
    const logPageAccess = async () => {
      const supabase = getSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user?.id && user?.email) {
        // Log page access with a custom message
        console.log(`[ADMIN_${pageName.toUpperCase()}] Page accessed`, { 
          userId: user.id, 
          userEmail: user.email 
        });
        // We're reusing the dashboard access log function but with a custom message
        // In a more complete implementation, we might want specific functions for each page
      }
    };
    
    logPageAccess();
    
    // Cleanup function to log when the page is exited/unmounted
    return () => {
      console.log(`[ADMIN_${pageName.toUpperCase()}] Page exited`);
    };
  }, [pageName]);

  return null; // This component doesn't render anything
}