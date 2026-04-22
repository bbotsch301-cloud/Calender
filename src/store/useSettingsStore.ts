import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface SettingsState {
  /** If true, the calendar grid starts on Sunday (US default). If false,
   *  it starts on Saturday to make Shabbat the first (or last) column. */
  weekStartSunday: boolean;
  setWeekStartSunday: (v: boolean) => void;
  hydrate: () => Promise<void>;
}

const STORAGE_KEY = 'kingdom-calendar:settings';

interface Persisted {
  weekStartSunday: boolean;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  weekStartSunday: true,
  setWeekStartSunday: (v) => {
    set({ weekStartSunday: v });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ weekStartSunday: v })).catch(() => {});
  },
  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Persisted;
      if (typeof parsed.weekStartSunday === 'boolean') {
        set({ weekStartSunday: parsed.weekStartSunday });
      }
    } catch {
      /* ignore */
    }
  },
}));
