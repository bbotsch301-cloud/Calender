/**
 * Computes the biblical feasts for a given Gregorian year.
 *
 * The seven Leviticus-23 moedim:
 *   passover, unleavenedBread, firstfruits, shavuot,
 *   yomTeruah, yomKippur, sukkot, sheminiAtzeret
 *
 * Plus two later festivals:
 *   hanukkah, purim
 *
 * Day boundaries are sunset-based; `startDate` is the Gregorian date
 * whose evening (sunset of the prior civil day) begins the feast.
 */

import { hebrewToGregorian, addDays, dayOfWeek, isLeapYear } from './hebrewCalendar';
import { FEAST_METADATA } from '../constants/feasts';

export type FeastKey =
  | 'passover'
  | 'unleavenedBread'
  | 'firstfruits'
  | 'shavuot'
  | 'yomTeruah'
  | 'yomKippur'
  | 'sukkot'
  | 'sheminiAtzeret'
  | 'hanukkah'
  | 'purim';

export interface Feast {
  key: FeastKey;
  name: string;
  hebrewName: string;
  description: string;
  startDate: Date;
  endDate: Date;
  durationDays: number;
  hebrewMonth: number;
  hebrewDay: number;
}

function findHebrewYearForSpring(gregYear: number): number {
  const approxHebrewYear = gregYear + 3760;
  for (const candidate of [approxHebrewYear, approxHebrewYear + 1, approxHebrewYear - 1]) {
    const passover = hebrewToGregorian(candidate, 1, 15);
    if (passover.getFullYear() === gregYear) return candidate;
  }
  return approxHebrewYear;
}

function findHebrewYearForFall(gregYear: number): number {
  const approxHebrewYear = gregYear + 3761;
  for (const candidate of [approxHebrewYear, approxHebrewYear + 1, approxHebrewYear - 1]) {
    const trumpets = hebrewToGregorian(candidate, 7, 1);
    if (trumpets.getFullYear() === gregYear) return candidate;
  }
  return approxHebrewYear;
}

/**
 * Hanukkah: 25 Kislev → + 7 days (8-day festival).
 * We scan the Hebrew years whose Kislev touches the given Gregorian year.
 */
function findHanukkahForGregYear(gregYear: number): { start: Date; end: Date; hebrewYear: number } | null {
  for (const hy of [gregYear + 3761, gregYear + 3760, gregYear + 3762]) {
    const start = hebrewToGregorian(hy, 9, 25);
    if (start.getFullYear() === gregYear) {
      const end = addDays(start, 7);
      return { start, end, hebrewYear: hy };
    }
  }
  return null;
}

/**
 * Purim: 14 Adar (month 12) in a regular year, 14 Adar II (month 13) in a
 * leap year. In leap years, 14 Adar I is "Purim Katan" — we use the main
 * Purim date (Adar II) for the feast marker.
 */
function findPurimForGregYear(gregYear: number): { date: Date; hebrewYear: number } | null {
  for (const hy of [gregYear + 3760, gregYear + 3761, gregYear + 3759]) {
    const month = isLeapYear(hy) ? 13 : 12;
    const date = hebrewToGregorian(hy, month, 14);
    if (date.getFullYear() === gregYear) {
      return { date, hebrewYear: hy };
    }
  }
  return null;
}

function findFirstfruits(hebrewYear: number): Date {
  const passover = hebrewToGregorian(hebrewYear, 1, 15);
  let d = addDays(passover, 1);
  while (dayOfWeek(d) !== 0) d = addDays(d, 1);
  return d;
}

const FEAST_CACHE = new Map<number, Feast[]>();
const FEAST_CACHE_MAX = 25;

export function computeFeastsForYear(gregYear: number): Feast[] {
  const cached = FEAST_CACHE.get(gregYear);
  if (cached) return cached;
  const result = computeFeastsForYearUncached(gregYear);
  if (FEAST_CACHE.size >= FEAST_CACHE_MAX) {
    const firstKey = FEAST_CACHE.keys().next().value;
    if (firstKey !== undefined) FEAST_CACHE.delete(firstKey);
  }
  FEAST_CACHE.set(gregYear, result);
  return result;
}

function computeFeastsForYearUncached(gregYear: number): Feast[] {
  const springYear = findHebrewYearForSpring(gregYear);
  const fallYear = findHebrewYearForFall(gregYear);

  // Spring festivals — anchored to Nisan
  const passover = hebrewToGregorian(springYear, 1, 14);
  const unleavenedStart = hebrewToGregorian(springYear, 1, 15);
  const unleavenedEnd = hebrewToGregorian(springYear, 1, 21);
  const firstfruits = findFirstfruits(springYear);
  const shavuot = addDays(firstfruits, 49);

  // Fall festivals — anchored to Tishri
  const yomTeruah = hebrewToGregorian(fallYear, 7, 1);
  const yomTeruahEnd = hebrewToGregorian(fallYear, 7, 2);
  const yomKippur = hebrewToGregorian(fallYear, 7, 10);
  const sukkotStart = hebrewToGregorian(fallYear, 7, 15);
  const sukkotEnd = hebrewToGregorian(fallYear, 7, 21);
  const sheminiAtzeret = hebrewToGregorian(fallYear, 7, 22);

  // Hanukkah + Purim if they fall in this Gregorian year
  const hanukkah = findHanukkahForGregYear(gregYear);
  const purim = findPurimForGregYear(gregYear);

  const feasts: Feast[] = [
    {
      ...FEAST_METADATA.passover,
      startDate: passover,
      endDate: passover,
      durationDays: 1,
      hebrewMonth: 1,
      hebrewDay: 14,
    },
    {
      ...FEAST_METADATA.unleavenedBread,
      startDate: unleavenedStart,
      endDate: unleavenedEnd,
      durationDays: 7,
      hebrewMonth: 1,
      hebrewDay: 15,
    },
    {
      ...FEAST_METADATA.firstfruits,
      startDate: firstfruits,
      endDate: firstfruits,
      durationDays: 1,
      hebrewMonth: 1,
      hebrewDay: 16,
    },
    {
      ...FEAST_METADATA.shavuot,
      startDate: shavuot,
      endDate: shavuot,
      durationDays: 1,
      hebrewMonth: 3,
      hebrewDay: 6,
    },
    {
      ...FEAST_METADATA.yomTeruah,
      startDate: yomTeruah,
      endDate: yomTeruahEnd,
      durationDays: 2,
      hebrewMonth: 7,
      hebrewDay: 1,
    },
    {
      ...FEAST_METADATA.yomKippur,
      startDate: yomKippur,
      endDate: yomKippur,
      durationDays: 1,
      hebrewMonth: 7,
      hebrewDay: 10,
    },
    {
      ...FEAST_METADATA.sukkot,
      startDate: sukkotStart,
      endDate: sukkotEnd,
      durationDays: 7,
      hebrewMonth: 7,
      hebrewDay: 15,
    },
    {
      ...FEAST_METADATA.sheminiAtzeret,
      startDate: sheminiAtzeret,
      endDate: sheminiAtzeret,
      durationDays: 1,
      hebrewMonth: 7,
      hebrewDay: 22,
    },
  ];

  if (hanukkah) {
    feasts.push({
      ...FEAST_METADATA.hanukkah,
      startDate: hanukkah.start,
      endDate: hanukkah.end,
      durationDays: 8,
      hebrewMonth: 9,
      hebrewDay: 25,
    });
  }
  if (purim) {
    feasts.push({
      ...FEAST_METADATA.purim,
      startDate: purim.date,
      endDate: purim.date,
      durationDays: 1,
      hebrewMonth: isLeapYear(purim.hebrewYear) ? 13 : 12,
      hebrewDay: 14,
    });
  }

  feasts.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  return feasts;
}

export function getActiveFeast(now: Date, feasts: Feast[]): Feast | null {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  for (const f of feasts) {
    const start = new Date(f.startDate.getFullYear(), f.startDate.getMonth(), f.startDate.getDate());
    const end = new Date(f.endDate.getFullYear(), f.endDate.getMonth(), f.endDate.getDate());
    if (today.getTime() >= start.getTime() && today.getTime() <= end.getTime()) {
      return f;
    }
  }
  return null;
}

/**
 * Returns the day number within a multi-day feast (1-based).
 * Null if the date is outside the feast's range.
 */
export function getFeastDayNumber(date: Date, feast: Feast): number | null {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const s = new Date(
    feast.startDate.getFullYear(),
    feast.startDate.getMonth(),
    feast.startDate.getDate()
  ).getTime();
  const e = new Date(
    feast.endDate.getFullYear(),
    feast.endDate.getMonth(),
    feast.endDate.getDate()
  ).getTime();
  if (d < s || d > e) return null;
  return Math.round((d - s) / 86_400_000) + 1;
}

export function getNextFeast(now: Date, feasts: Feast[]): Feast | null {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const upcoming = feasts
    .filter((f) => f.startDate.getTime() > today.getTime())
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  return upcoming[0] || null;
}

/**
 * Collects feasts that can be visible on a monthly grid for the given
 * Gregorian year/month — includes adjacent-year spillovers so December
 * / January grids render Hanukkah correctly.
 */
export function getFeastsForMonthRange(gregYear: number): Feast[] {
  const seen = new Set<string>();
  const out: Feast[] = [];
  for (const y of [gregYear - 1, gregYear, gregYear + 1]) {
    for (const f of computeFeastsForYear(y)) {
      const key = `${f.key}-${f.startDate.toISOString()}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push(f);
      }
    }
  }
  return out;
}
