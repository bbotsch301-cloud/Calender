import { useEffect, useState } from 'react';

/**
 * Single source of truth for the "current moment" across the app.
 * Default re-tick: every 60 seconds. Consumers that need sub-second
 * precision (e.g. the sunset countdown) can pass a smaller interval.
 */
export function useNow(intervalMs = 60_000): Date {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
