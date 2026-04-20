/**
 * Local, best-effort rate limiting for auth actions.
 *
 * This doesn't replace server-side protection (Supabase already enforces
 * its own per-IP limits) — it's a UX nicety that slows down a user hitting
 * sign-in repeatedly with a wrong password, and prevents obvious automation
 * from a single device.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

interface Attempt {
  count: number;
  firstAt: number;
  lockUntil?: number;
}

const KEY = 'kingdom-calendar:auth-rate-limit';
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_BEFORE_BACKOFF = 3;

async function load(): Promise<Attempt> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return { count: 0, firstAt: Date.now() };
    return JSON.parse(raw) as Attempt;
  } catch {
    return { count: 0, firstAt: Date.now() };
  }
}

async function save(a: Attempt): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(a));
}

/**
 * Returns ms to wait before sign-in is allowed, or 0 if ready.
 */
export async function remainingLockoutMs(): Promise<number> {
  const a = await load();
  if (a.lockUntil && a.lockUntil > Date.now()) return a.lockUntil - Date.now();
  // Old attempts fall off after the window.
  if (Date.now() - a.firstAt > WINDOW_MS) {
    await save({ count: 0, firstAt: Date.now() });
    return 0;
  }
  return 0;
}

export async function recordFailure(): Promise<number> {
  const a = await load();
  const now = Date.now();
  // Reset the window if it's been a while.
  if (now - a.firstAt > WINDOW_MS) {
    const fresh: Attempt = { count: 1, firstAt: now };
    await save(fresh);
    return 0;
  }
  a.count += 1;
  if (a.count >= MAX_BEFORE_BACKOFF) {
    // Exponential backoff capped at 2 minutes: 2^(count-3) seconds.
    const extraSec = Math.min(120, 2 ** (a.count - MAX_BEFORE_BACKOFF));
    a.lockUntil = now + extraSec * 1000;
  }
  await save(a);
  return a.lockUntil && a.lockUntil > now ? a.lockUntil - now : 0;
}

export async function clearFailures(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
