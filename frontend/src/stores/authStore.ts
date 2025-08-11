import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface User {
    id: number;
    username: string;
    email: string;
    role: 'user' | 'admin';
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

interface AuthActions {
    setUser: (user: User) => void;
    setToken: (token: string) => void;
    login: (user: User, token: any) => void;
    logout: () => void;
    clearAuth: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}
type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
  
        setUser: (user: User) => set({ user, isAuthenticated: true }),
        setToken: (token: string) => set({ token }),
        
        login: (user: User, token: string) => 
          set({ user, token, isAuthenticated: true, error: null }),
        
        logout: () => 
          set({ user: null, token: null, isAuthenticated: false }),
        
        clearAuth: () => 
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false,
            loading: false,
            error: null
          }),
  
        setLoading: (loading: boolean) => set({ loading }),
        setError: (error: string | null) => set({ error }),
      }),
      {
        name: 'auth-storage',
      }
    )
  );