import { create } from 'zustand';
import { gregorianToHebrew, type HebrewDate } from '../engine/hebrewCalendar';
import { calculateSunset, getNextDayBoundary, JERUSALEM_LAT, JERUSALEM_LON } from '../engine/sunset';
import { getMoonPhase, type MoonPhase } from '../engine/moonPhase';

export type LocationMode = 'gps' | 'manual' | 'fallback';

interface SetLocationOptions {
  /** Human-readable label, e.g. "Jerusalem, Israel". */
  name?: string | null;
  /** How this location was resolved. Defaults to 'manual'. */
  mode?: LocationMode;
}

interface CalendarState {
  currentGregorianDate: Date;
  currentHebrewDate: HebrewDate;
  selectedDate: Date;
  selectedHebrewDate: HebrewDate;
  sunsetToday: Date;
  nextDayBegins: Date;
  latitude: number;
  longitude: number;
  userLatitude: number | null;
  userLongitude: number | null;
  usingLocationFallback: boolean;
  locationName: string | null;
  locationMode: LocationMode;
  moonPhase: MoonPhase;
  setSelectedDate: (date: Date) => void;
  setLocation: (lat: number, lon: number, opts?: SetLocationOptions) => void;
  markUsingFallback: () => void;
  refreshDates: () => void;
}

const now = new Date();

export const useCalendarStore = create<CalendarState>((set, get) => ({
  currentGregorianDate: now,
  currentHebrewDate: gregorianToHebrew(now),
  selectedDate: now,
  selectedHebrewDate: gregorianToHebrew(now),
  sunsetToday: calculateSunset(now, JERUSALEM_LAT, JERUSALEM_LON),
  nextDayBegins: getNextDayBoundary(now, JERUSALEM_LAT, JERUSALEM_LON),
  latitude: JERUSALEM_LAT,
  longitude: JERUSALEM_LON,
  userLatitude: null,
  userLongitude: null,
  usingLocationFallback: true,
  locationName: 'Jerusalem, Israel',
  locationMode: 'fallback',
  moonPhase: getMoonPhase(now),
  setSelectedDate: (date) =>
    set({ selectedDate: date, selectedHebrewDate: gregorianToHebrew(date) }),
  setLocation: (lat, lon, opts = {}) => {
    const today = new Date();
    set({
      latitude: lat,
      longitude: lon,
      userLatitude: lat,
      userLongitude: lon,
      usingLocationFallback: false,
      locationName: opts.name ?? null,
      locationMode: opts.mode ?? 'manual',
      sunsetToday: calculateSunset(today, lat, lon),
      nextDayBegins: getNextDayBoundary(today, lat, lon),
      moonPhase: getMoonPhase(today),
    });
  },
  markUsingFallback: () => {
    const today = new Date();
    set({
      latitude: JERUSALEM_LAT,
      longitude: JERUSALEM_LON,
      userLatitude: null,
      userLongitude: null,
      usingLocationFallback: true,
      locationName: 'Jerusalem, Israel',
      locationMode: 'fallback',
      sunsetToday: calculateSunset(today, JERUSALEM_LAT, JERUSALEM_LON),
      nextDayBegins: getNextDayBoundary(today, JERUSALEM_LAT, JERUSALEM_LON),
    });
  },
  refreshDates: () => {
    const { latitude, longitude } = get();
    const today = new Date();
    set({
      currentGregorianDate: today,
      currentHebrewDate: gregorianToHebrew(today),
      sunsetToday: calculateSunset(today, latitude, longitude),
      nextDayBegins: getNextDayBoundary(today, latitude, longitude),
      moonPhase: getMoonPhase(today),
    });
  },
}));
