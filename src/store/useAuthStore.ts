import { create } from 'zustand';
import {
  continueAsGuest,
  getCurrentUser,
  onAuthStateChange,
  signIn as supabaseSignIn,
  signOut as supabaseSignOut,
  signUp as supabaseSignUp,
  type AuthUser,
} from '../supabase/auth';
import { migrateGuestDataToAccount, clearGuestCaches } from '../supabase/migration';
import {
  clearFailures,
  recordFailure,
  remainingLockoutMs,
} from '../security/rateLimit';
import { validateEmail, validatePassword, validateDisplayName } from '../security/validators';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  initialized: boolean;
  authListenerUnsubscribe: (() => void) | null;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  teardown: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  initialized: false,
  authListenerUnsubscribe: null,

  initialize: async () => {
    set({ loading: true });
    const u = await getCurrentUser();

    // Subscribe to Supabase auth-state changes so token refreshes, remote
    // sign-outs, or password changes are reflected in the store.
    const existing = get().authListenerUnsubscribe;
    if (existing) existing();
    const sub = onAuthStateChange((next) => {
      const current = get().user;
      // Guest sessions aren't managed by Supabase — ignore listener ticks
      // that null-out the user while a guest is active.
      if (!next && current?.isGuest) return;
      set({ user: next });
      if (next && !next.isGuest) {
        // Fire-and-forget migration; safe if already done.
        migrateGuestDataToAccount(next.id).catch(() => {});
      }
    });
    set({ user: u, loading: false, initialized: true, authListenerUnsubscribe: sub.unsubscribe });
  },

  signIn: async (email, password) => {
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) throw new Error(emailCheck.reason);
    if (!password) throw new Error('Password is required.');

    const lockMs = await remainingLockoutMs();
    if (lockMs > 0) {
      const sec = Math.ceil(lockMs / 1000);
      throw new Error(`Too many attempts. Please wait ${sec}s and try again.`);
    }

    set({ loading: true });
    try {
      const u = await supabaseSignIn(email.trim(), password);
      await clearFailures();
      set({ user: u, loading: false });
      migrateGuestDataToAccount(u.id).catch(() => {});
    } catch (e) {
      set({ loading: false });
      await recordFailure();
      throw e;
    }
  },

  signUp: async (email, password, displayName) => {
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) throw new Error(emailCheck.reason);
    const pwCheck = validatePassword(password);
    if (!pwCheck.valid) throw new Error(pwCheck.reason);
    const nameCheck = validateDisplayName(displayName);
    if (!nameCheck.valid) throw new Error(nameCheck.reason);

    set({ loading: true });
    try {
      const u = await supabaseSignUp(email.trim(), password, displayName.trim());
      set({ user: u, loading: false });
      migrateGuestDataToAccount(u.id).catch(() => {});
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
    try {
      await supabaseSignOut();
      // Wipe any guest-mode caches so the next guest session starts fresh.
      await clearGuestCaches();
    } finally {
      set({ user: null, loading: false });
    }
  },

  teardown: () => {
    const un = get().authListenerUnsubscribe;
    if (un) un();
    set({ authListenerUnsubscribe: null });
  },
}));
