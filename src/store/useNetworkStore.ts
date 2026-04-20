import { create } from 'zustand';

interface NetworkState {
  lastErrorAt: number | null;
  lastErrorMessage: string | null;
  consecutiveFailures: number;
  recordError: (message: string) => void;
  clearError: () => void;
}

export const useNetworkStore = create<NetworkState>((set, get) => ({
  lastErrorAt: null,
  lastErrorMessage: null,
  consecutiveFailures: 0,
  recordError: (message) =>
    set({
      lastErrorAt: Date.now(),
      lastErrorMessage: message,
      consecutiveFailures: get().consecutiveFailures + 1,
    }),
  clearError: () =>
    set({
      lastErrorAt: null,
      lastErrorMessage: null,
      consecutiveFailures: 0,
    }),
}));

/**
 * Best-effort heuristic for identifying a network-layer failure from an
 * arbitrary thrown error or Supabase error envelope.
 */
export function isNetworkError(e: unknown): boolean {
  if (!e) return false;
  const msg = (e instanceof Error ? e.message : String(e)).toLowerCase();
  return (
    msg.includes('network') ||
    msg.includes('fetch') ||
    msg.includes('failed to fetch') ||
    msg.includes('timeout') ||
    msg.includes('econnrefused') ||
    msg.includes('offline')
  );
}
