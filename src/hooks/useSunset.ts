import { useEffect, useMemo, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import * as Location from 'expo-location';
import {
  calculateSunset,
  getNextDayBoundary,
  JERUSALEM_LAT,
  JERUSALEM_LON,
} from '../engine/sunset';
import { useCalendarStore } from '../store/useCalendarStore';

export interface SunsetData {
  sunsetToday: Date;
  nextDayBegins: Date;
  countdownMs: number;
  countdownText: string;
  latitude: number;
  longitude: number;
  hasLocationPermission: boolean;
}

export function useSunset(): SunsetData {
  const setLocation = useCalendarStore((s) => s.setLocation);
  const markUsingFallback = useCalendarStore((s) => s.markUsingFallback);
  const latitude = useCalendarStore((s) => s.latitude);
  const longitude = useCalendarStore((s) => s.longitude);
  const [hasPermission, setHasPermission] = useState(false);
  const [now, setNow] = useState<Date>(() => new Date());
  const mountedRef = useRef(true);

  // Core check: never throw; always end in a sensible state.
  async function checkLocation(): Promise<void> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (mountedRef.current) setHasPermission(false);
        markUsingFallback();
        return;
      }
      if (mountedRef.current) setHasPermission(true);
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      if (!mountedRef.current) return;
      setLocation(loc.coords.latitude, loc.coords.longitude);
    } catch {
      // Any failure (airplane mode, location off, timeout) → keep the
      // existing Jerusalem fallback. Never crash.
      if (mountedRef.current) setHasPermission(false);
      markUsingFallback();
    }
  }

  useEffect(() => {
    mountedRef.current = true;
    checkLocation();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Re-check on foreground to catch OS-level permission revocation.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (next === 'active') checkLocation();
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return useMemo(() => {
    const lat = latitude ?? JERUSALEM_LAT;
    const lon = longitude ?? JERUSALEM_LON;
    const sunsetToday = calculateSunset(now, lat, lon);
    const nextDayBegins = getNextDayBoundary(now, lat, lon);
    const countdownMs = Math.max(0, nextDayBegins.getTime() - now.getTime());
    return {
      sunsetToday,
      nextDayBegins,
      countdownMs,
      countdownText: formatCountdown(countdownMs),
      latitude: lat,
      longitude: lon,
      hasLocationPermission: hasPermission,
    };
  }, [now, latitude, longitude, hasPermission]);
}

function formatCountdown(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}
function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export async function requestLocationPermission(): Promise<{
  granted: boolean;
  latitude: number | null;
  longitude: number | null;
}> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return { granted: false, latitude: null, longitude: null };
    }
    const loc = await Location.getCurrentPositionAsync({});
    return {
      granted: true,
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };
  } catch {
    // Never crash on permission flows — gracefully fall back.
    return { granted: false, latitude: null, longitude: null };
  }
}
