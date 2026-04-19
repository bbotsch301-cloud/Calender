import { create } from 'zustand';
import {
  continueAsGuest,
  getCurrentUser,
  signIn as supabaseSignIn,
  signOut as supabaseSignOut,
  signUp as supabaseSignUp,
  type AuthUser,
} from '../supabase/auth';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  initialized: boolean;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,
  initialize: async () => {
    set({ loading: true });
    const u = await getCurrentUser();
    set({ user: u, loading: false, initialized: true });
  },
  signIn: async (email, password) => {
    set({ loading: true });
    try {
      const u = await supabaseSignIn(email, password);
      set({ user: u, loading: false });
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },
  signUp: async (email, password, displayName) => {
    set({ loading: true });
    try {
      const u = await supabaseSignUp(email, password, displayName);
      set({ user: u, loading: false });
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },
  signInAsGuest: async () => {
    set({ loading: true });
    const u = await continueAsGuest();
    set({ user: u, loading: false });
  },
  signOut: async () => {
    set({ loading: true });
    await supabaseSignOut();
    set({ user: null, loading: false });
  },
}));
