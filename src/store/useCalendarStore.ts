import { create } from 'zustand';
import { gregorianToHebrew, type HebrewDate } from '../engine/hebrewCalendar';
import { calculateSunset, getNextDayBoundary, JERUSALEM_LAT, JERUSALEM_LON } from '../engine/sunset';
import { getMoonPhase, type MoonPhase } from '../engine/moonPhase';

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
  moonPhase: MoonPhase;
  setSelectedDate: (date: Date) => void;
  setLocation: (lat: number, lon: number) => void;
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
  moonPhase: getMoonPhase(now),
  setSelectedDate: (date) =>
    set({ selectedDate: date, selectedHebrewDate: gregorianToHebrew(date) }),
  setLocation: (lat, lon) => {
    const today = new Date();
    set({
      latitude: lat,
      longitude: lon,
      userLatitude: lat,
      userLongitude: lon,
      usingLocationFallback: false,
      sunsetToday: calculateSunset(today, lat, lon),
      nextDayBegins: getNextDayBoundary(today, lat, lon),
      moonPhase: getMoonPhase(today),
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
