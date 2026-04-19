import { useEffect, useMemo, useState } from 'react';
import { gregorianToHebrew } from '../engine/hebrewCalendar';
import { isSabbath } from '../engine/sabbath';
import { useFeastStore } from '../store/useFeastStore';
import { useSunset } from './useSunset';

export function useCurrentDay() {
  const [now, setNow] = useState(new Date());
  const sunset = useSunset();
  const allFeasts = useFeastStore((s) => s.allFeasts);
  const checkFeastMode = useFeastStore((s) => s.checkFeastMode);
  const currentFeast = useFeastStore((s) => s.currentFeast);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    checkFeastMode(now);
  }, [now, allFeasts.length]);

  const data = useMemo(() => {
    return {
      gregorianDate: now,
      hebrewDate: gregorianToHebrew(now),
      isSabbath: isSabbath(now),
      activeFeast: currentFeast,
      sunsetToday: sunset.sunsetToday,
      nextDayBegins: sunset.nextDayBegins,
      countdownMs: sunset.countdownMs,
      countdownText: sunset.countdownText,
    };
  }, [now, currentFeast, sunset.sunsetToday, sunset.countdownMs]);

  return data;
}
