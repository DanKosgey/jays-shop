import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getSupabaseBrowserClient } from '@/server/supabase/client';

interface User {
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        try {
          const supabase = getSupabaseBrowserClient();
          
          // Sign in with Supabase
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) {
            console.error('Login error:', error);
            return false;
          }
          
          if (data.user) {
            // Get user role from profiles table instead of users table
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', data.user.id)
              .single();
            
            const role = profileData?.role === 'admin' ? 'admin' : 'user';
            
            set({
              user: { 
                email: data.user.email || '', 
                name: data.user.user_metadata?.name || email,
                role
              },
              isAuthenticated: true,
            });
            
            return true;
          }
          
          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },
      
      logout: async () => {
        const supabase = getSupabaseBrowserClient();
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
      },
      
      initializeAuth: async () => {
        try {
          const supabase = getSupabaseBrowserClient();
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            // Get user role from profiles table instead of users table
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();
            
            // If profile doesn't exist, default to user role
            const role = profileData?.role === 'admin' ? 'admin' : 'user';
            
            set({
              user: { 
                email: session.user.email || '', 
                name: session.user.user_metadata?.name || session.user.email || '',
                role
              },
              isAuthenticated: true,
            });
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);