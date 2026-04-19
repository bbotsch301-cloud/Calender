import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from './client';
import type { Session, User } from '@supabase/supabase-js';

const GUEST_KEY = 'kingdom-calendar:guest-user';

export interface AuthUser {
  id: string;
  email: string | null;
  isGuest: boolean;
  displayName?: string | null;
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Use guest mode or configure .env');
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error('Sign in failed');
  return mapUser(data.user, false);
}

export async function signUp(
  email: string,
  password: string,
  displayName: string
): Promise<AuthUser> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Use guest mode or configure .env');
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });
  if (error) throw error;
  if (!data.user) throw new Error('Sign up failed');
  return mapUser(data.user, false);
}

export async function signOut(): Promise<void> {
  await AsyncStorage.removeItem(GUEST_KEY);
  if (isSupabaseConfigured) {
    await supabase.auth.signOut();
  }
}

export async function continueAsGuest(): Promise<AuthUser> {
  const guestUser: AuthUser = {
    id: `guest-${Date.now()}`,
    email: null,
    isGuest: true,
    displayName: 'Guest',
  };
  await AsyncStorage.setItem(GUEST_KEY, JSON.stringify(guestUser));
  return guestUser;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  // Check guest first
  const guest = await AsyncStorage.getItem(GUEST_KEY);
  if (guest) {
    try {
      return JSON.parse(guest) as AuthUser;
    } catch {
      await AsyncStorage.removeItem(GUEST_KEY);
    }
  }
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  return mapUser(data.user, false);
}

export function onAuthStateChange(
  callback: (user: AuthUser | null) => void
): { unsubscribe: () => void } {
  if (!isSupabaseConfigured) {
    return { unsubscribe: () => {} };
  }
  const { data } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
    if (session?.user) {
      callback(mapUser(session.user, false));
    } else {
      callback(null);
    }
  });
  return { unsubscribe: () => data.subscription.unsubscribe() };
}

function mapUser(u: User, isGuest: boolean): AuthUser {
  return {
    id: u.id,
    email: u.email ?? null,
    isGuest,
    displayName: (u.user_metadata?.display_name as string) ?? null,
  };
}
