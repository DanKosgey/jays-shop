import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: (email: string, password: string) => {
        // Dummy authentication
        if (email === "admin@repairhub.com" && password === "admin123") {
          set({
            user: { email, name: "Admin User", role: "admin" },
            isAuthenticated: true,
          });
          return true;
        } else if (email === "user@repairhub.com" && password === "user123") {
          set({
            user: { email, name: "John Doe", role: "user" },
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },
      
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
