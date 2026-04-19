import { useEffect, useMemo, useRef, useState } from 'react';
import { gregorianToHebrew } from '../engine/hebrewCalendar';
import { isSabbath } from '../engine/sabbath';
import { useFeastStore } from '../store/useFeastStore';
import { useCalendarStore } from '../store/useCalendarStore';
import { useSunset } from './useSunset';
import { showDayTransition } from '../components/shared/DayTransitionToast';

export function useCurrentDay() {
  const [now, setNow] = useState(new Date());
  const sunset = useSunset();
  const allFeasts = useFeastStore((s) => s.allFeasts);
  const checkFeastMode = useFeastStore((s) => s.checkFeastMode);
  const currentFeast = useFeastStore((s) => s.currentFeast);
  const refreshDates = useCalendarStore((s) => s.refreshDates);

  // Track the previous "biblical day key" so we can detect a crossover.
  const lastBiblicalKey = useRef<string>('');

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    checkFeastMode(now);

    // Compute the current biblical day key. After sunset, the biblical day
    // is the next civil day; before sunset, it's the same civil day.
    const beyondSunset = now.getTime() >= sunset.sunsetToday.getTime();
    const biblicalCivilDate = new Date(now);
    if (beyondSunset) biblicalCivilDate.setDate(biblicalCivilDate.getDate() + 1);
    const key = `${biblicalCivilDate.getFullYear()}-${biblicalCivilDate.getMonth()}-${biblicalCivilDate.getDate()}`;

    if (lastBiblicalKey.current && lastBiblicalKey.current !== key) {
      // Crossover happened
      refreshDates();
      checkFeastMode(now);
      showDayTransition(biblicalCivilDate);
    }
    lastBiblicalKey.current = key;
  }, [now, sunset.sunsetToday.getTime(), allFeasts.length]);

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
