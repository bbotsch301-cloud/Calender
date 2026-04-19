/**
 * Computes the 8 Leviticus 23 feasts for any Gregorian year.
 * Day boundaries are sunset-based; the listed startDate is the Gregorian date
 * whose evening (sunset) begins the feast.
 */

import { hebrewToGregorian, gregorianToHebrew, addDays, dayOfWeek } from './hebrewCalendar';
import { FEAST_METADATA } from '../constants/feasts';

export type FeastKey =
  | 'passover'
  | 'unleavenedBread'
  | 'firstfruits'
  | 'pentecost'
  | 'trumpets'
  | 'atonement'
  | 'tabernacles'
  | 'eighthDay';

export interface Feast {
  key: FeastKey;
  name: string;
  hebrewName: string;
  leviticusRef: string;
  startDate: Date; // Sunset of previous evening begins the feast; this is the Gregorian date the feast begins at sunset
  endDate: Date;
  durationDays: number;
  description: string;
  biblicalMeaning: string;
  instructions: string[];
  scriptures: string[];
  colorAccent: string;
  icon: string;
  hebrewMonth: number;
  hebrewDay: number;
}

/**
 * Hebrew calendar year overlapping a Gregorian year:
 * Spring feasts (Passover etc.) fall in Nisan (month 1) of the Hebrew year that began
 * the previous Tishri. Fall feasts fall in Tishri/Cheshvan (month 7-8).
 *
 * To find the spring feasts in Gregorian year Y, we need the Hebrew year whose
 * 1 Nisan falls in March/April of Y. To find fall feasts, we use the Hebrew year
 * whose 1 Tishri falls in Sept/Oct of Y.
 */

function findHebrewYearForSpring(gregYear: number): number {
  // Try several Hebrew years; pick one where 15 Nisan falls in gregYear
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
 * Compute the Sunday after Passover (15 Nisan) for Firstfruits / Wave Sheaf Offering.
 * Following the Pharisaic / traditional rabbinic dating used by many: 16 Nisan.
 * However the user spec says "Sunday after Passover week" — so we honor the spec
 * (this is the position of the wave sheaf in the Sadducean / many Christian readings).
 */
function findFirstfruits(hebrewYear: number): Date {
  const passover = hebrewToGregorian(hebrewYear, 1, 15);
  // Find first Sunday strictly after passover (15 Nisan)
  let d = addDays(passover, 1);
  while (dayOfWeek(d) !== 0) {
    d = addDays(d, 1);
  }
  return d;
}

export function computeFeastsForYear(gregYear: number): Feast[] {
  const springYear = findHebrewYearForSpring(gregYear);
  const fallYear = findHebrewYearForFall(gregYear);

  // Passover: 14 Nisan at sunset (begins the 15th)
  const passoverStart = hebrewToGregorian(springYear, 1, 14);
  const passoverEnd = hebrewToGregorian(springYear, 1, 14);

  // Unleavened Bread: 15-21 Nisan (7 days)
  const unleavenedStart = hebrewToGregorian(springYear, 1, 15);
  const unleavenedEnd = hebrewToGregorian(springYear, 1, 21);

  // Firstfruits: Sunday after Passover week (wave sheaf)
  const firstfruitsDate = findFirstfruits(springYear);

  // Pentecost: 50 days after Firstfruits (Omer days 1-49, Pentecost = day 50)
  const pentecostDate = addDays(firstfruitsDate, 50);

  // Trumpets: 1 Tishri
  const trumpetsDate = hebrewToGregorian(fallYear, 7, 1);
  const trumpetsEnd = hebrewToGregorian(fallYear, 7, 2); // 2-day observance traditionally

  // Atonement (Yom Kippur): 10 Tishri
  const atonementDate = hebrewToGregorian(fallYear, 7, 10);

  // Tabernacles (Sukkot): 15-21 Tishri (7 days)
  const tabernaclesStart = hebrewToGregorian(fallYear, 7, 15);
  const tabernaclesEnd = hebrewToGregorian(fallYear, 7, 21);

  // Eighth Day (Shemini Atzeret): 22 Tishri
  const eighthDay = hebrewToGregorian(fallYear, 7, 22);

  const feasts: Feast[] = [
    {
      ...FEAST_METADATA.passover,
      startDate: passoverStart,
      endDate: passoverEnd,
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
      startDate: firstfruitsDate,
      endDate: firstfruitsDate,
      durationDays: 1,
      hebrewMonth: gregorianToHebrew(firstfruitsDate).month,
      hebrewDay: gregorianToHebrew(firstfruitsDate).day,
    },
    {
      ...FEAST_METADATA.pentecost,
      startDate: pentecostDate,
      endDate: pentecostDate,
      durationDays: 1,
      hebrewMonth: gregorianToHebrew(pentecostDate).month,
      hebrewDay: gregorianToHebrew(pentecostDate).day,
    },
    {
      ...FEAST_METADATA.trumpets,
      startDate: trumpetsDate,
      endDate: trumpetsEnd,
      durationDays: 2,
      hebrewMonth: 7,
      hebrewDay: 1,
    },
    {
      ...FEAST_METADATA.atonement,
      startDate: atonementDate,
      endDate: atonementDate,
      durationDays: 1,
      hebrewMonth: 7,
      hebrewDay: 10,
    },
    {
      ...FEAST_METADATA.tabernacles,
      startDate: tabernaclesStart,
      endDate: tabernaclesEnd,
      durationDays: 7,
      hebrewMonth: 7,
      hebrewDay: 15,
    },
    {
      ...FEAST_METADATA.eighthDay,
      startDate: eighthDay,
      endDate: eighthDay,
      durationDays: 1,
      hebrewMonth: 7,
      hebrewDay: 22,
    },
  ];

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

export function getNextFeast(now: Date, feasts: Feast[]): Feast | null {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const upcoming = feasts
    .filter((f) => f.startDate.getTime() > today.getTime())
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  return upcoming[0] || null;
}

export function getPreviousFeast(now: Date, feasts: Feast[]): Feast | null {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const past = feasts
    .filter((f) => f.endDate.getTime() < today.getTime())
    .sort((a, b) => b.endDate.getTime() - a.endDate.getTime());
  return past[0] || null;
}
