import { create } from 'zustand';
import {
  computeFeastsForYear,
  getActiveFeast,
  getNextFeast,
  type Feast,
  type FeastKey,
} from '../engine/feasts';

interface FeastState {
  allFeasts: Feast[];
  currentFeast: Feast | null;
  nextFeast: Feast | null;
  isFeastMode: boolean;
  activeFeastKey: FeastKey | null;
  loadFeasts: (year?: number) => void;
  checkFeastMode: (now?: Date) => void;
}

export const useFeastStore = create<FeastState>((set, get) => ({
  allFeasts: [],
  currentFeast: null,
  nextFeast: null,
  isFeastMode: false,
  activeFeastKey: null,
  loadFeasts: (year) => {
    const now = new Date();
    const targetYear = year ?? now.getFullYear();
    // Combine current year, prev, and next so timeline always has context
    const all = [
      ...computeFeastsForYear(targetYear - 1),
      ...computeFeastsForYear(targetYear),
      ...computeFeastsForYear(targetYear + 1),
    ];
    set({ allFeasts: all });
    get().checkFeastMode(now);
  },
  checkFeastMode: (when) => {
    const now = when ?? new Date();
    const feasts = get().allFeasts;
    const active = getActiveFeast(now, feasts);
    const next = getNextFeast(now, feasts);
    set({
      currentFeast: active,
      nextFeast: next,
      isFeastMode: !!active,
      activeFeastKey: active?.key ?? null,
    });
  },
}));
