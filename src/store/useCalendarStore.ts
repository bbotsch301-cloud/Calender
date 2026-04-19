import { create } from 'zustand';
import { gregorianToHebrew, type HebrewDate } from '../engine/hebrewCalendar';
import { calculateSunset, getNextDayBoundary, JERUSALEM_LAT, JERUSALEM_LON } from '../engine/sunset';

interface CalendarState {
  currentGregorianDate: Date;
  currentHebrewDate: HebrewDate;
  selectedDate: Date;
  selectedHebrewDate: HebrewDate;
  sunsetToday: Date;
  nextDayBegins: Date;
  latitude: number;
  longitude: number;
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
  setSelectedDate: (date) =>
    set({ selectedDate: date, selectedHebrewDate: gregorianToHebrew(date) }),
  setLocation: (lat, lon) => {
    const today = new Date();
    set({
      latitude: lat,
      longitude: lon,
      sunsetToday: calculateSunset(today, lat, lon),
      nextDayBegins: getNextDayBoundary(today, lat, lon),
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
    });
  },
}));
