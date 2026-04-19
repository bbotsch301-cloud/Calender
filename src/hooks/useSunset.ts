import { useEffect, useMemo, useState } from 'react';
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
  const latitude = useCalendarStore((s) => s.latitude);
  const longitude = useCalendarStore((s) => s.longitude);
  const [hasPermission, setHasPermission] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status === 'granted') {
          setHasPermission(true);
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          if (!cancelled) {
            setLocation(loc.coords.latitude, loc.coords.longitude);
          }
        }
      } catch {
        // fallback handled
      }
    })();
    return () => {
      cancelled = true;
    };
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
}
