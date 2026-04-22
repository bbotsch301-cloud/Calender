import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { calculateSunset, getNextDayBoundary, JERUSALEM_LAT, JERUSALEM_LON } from '../engine/sunset';

export type LocationMode = 'gps' | 'manual' | 'fallback';

interface SetLocationOptions {
  name?: string | null;
  mode?: LocationMode;
}

interface CalendarState {
  /** Latitude actually used for sunset math (may be Jerusalem fallback). */
  latitude: number;
  longitude: number;
  /** Friendly label, e.g. "Jerusalem, Israel". */
  locationName: string | null;
  locationMode: LocationMode;
  /** Derived — recomputed on every setLocation / refreshDates call. */
  sunsetToday: Date;
  nextDayBegins: Date;
  setLocation: (lat: number, lon: number, opts?: SetLocationOptions) => void;
  markUsingFallback: () => void;
  /** Called periodically to keep sunset/next-day-boundary fresh. */
  refreshDates: () => void;
  /** Hydrate from AsyncStorage — called once on app startup. */
  hydrate: () => Promise<void>;
}

const STORAGE_KEY = 'kingdom-calendar:location';

interface PersistedLocation {
  latitude: number;
  longitude: number;
  locationName: string | null;
  locationMode: LocationMode;
}

const now = new Date();

export const useCalendarStore = create<CalendarState>((set, get) => ({
  latitude: JERUSALEM_LAT,
  longitude: JERUSALEM_LON,
  locationName: 'Jerusalem, Israel',
  locationMode: 'fallback',
  sunsetToday: calculateSunset(now, JERUSALEM_LAT, JERUSALEM_LON),
  nextDayBegins: getNextDayBoundary(now, JERUSALEM_LAT, JERUSALEM_LON),

  setLocation: (lat, lon, opts = {}) => {
    const today = new Date();
    const next: PersistedLocation = {
      latitude: lat,
      longitude: lon,
      locationName: opts.name ?? null,
      locationMode: opts.mode ?? 'manual',
    };
    set({
      latitude: next.latitude,
      longitude: next.longitude,
      locationName: next.locationName,
      locationMode: next.locationMode,
      sunsetToday: calculateSunset(today, lat, lon),
      nextDayBegins: getNextDayBoundary(today, lat, lon),
    });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  },

  markUsingFallback: () => {
    const today = new Date();
    const next: PersistedLocation = {
      latitude: JERUSALEM_LAT,
      longitude: JERUSALEM_LON,
      locationName: 'Jerusalem, Israel',
      locationMode: 'fallback',
    };
    set({
      latitude: JERUSALEM_LAT,
      longitude: JERUSALEM_LON,
      locationName: 'Jerusalem, Israel',
      locationMode: 'fallback',
      sunsetToday: calculateSunset(today, JERUSALEM_LAT, JERUSALEM_LON),
      nextDayBegins: getNextDayBoundary(today, JERUSALEM_LAT, JERUSALEM_LON),
    });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  },

  refreshDates: () => {
    const { latitude, longitude } = get();
    const today = new Date();
    set({
      sunsetToday: calculateSunset(today, latitude, longitude),
      nextDayBegins: getNextDayBoundary(today, latitude, longitude),
    });
  },

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as PersistedLocation;
      if (
        typeof saved.latitude !== 'number' ||
        typeof saved.longitude !== 'number' ||
        !Number.isFinite(saved.latitude) ||
        !Number.isFinite(saved.longitude)
      ) {
        return;
      }
      const today = new Date();
      set({
        latitude: saved.latitude,
        longitude: saved.longitude,
        locationName: saved.locationName ?? null,
        locationMode: saved.locationMode ?? 'manual',
        sunsetToday: calculateSunset(today, saved.latitude, saved.longitude),
        nextDayBegins: getNextDayBoundary(today, saved.latitude, saved.longitude),
      });
    } catch {
      /* ignore corrupted state */
    }
  },
}));
