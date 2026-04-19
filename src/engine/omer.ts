/**
 * Counting of the Omer.
 *
 * Biblical pattern (Leviticus 23:15-16):
 *  - Day 1 = Firstfruits itself (the wave-sheaf day begins the count)
 *  - Day 49 = Firstfruits + 48 days (day before Pentecost)
 *  - Pentecost = "the morrow after the seventh sabbath" = day 50 = Firstfruits + 49 days
 *
 * Each of the 7 weeks has a Kabbalistic theme (one of the 7 lower sefirot),
 * and each day within a week pairs the week's sefira with the day's sefira,
 * e.g. day 1 = "Chesed within Chesed", day 8 = "Chesed within Gevurah", etc.
 */

import { addDays } from './hebrewCalendar';
import { computeFeastsForYear } from './feasts';

export const SEFIROT: Array<{ key: string; name: string; meaning: string }> = [
  { key: 'chesed',   name: 'Chesed',   meaning: 'Loving-kindness' },
  { key: 'gevurah',  name: 'Gevurah',  meaning: 'Strength / Discipline' },
  { key: 'tiferet',  name: 'Tiferet',  meaning: 'Beauty / Harmony' },
  { key: 'netzach',  name: 'Netzach',  meaning: 'Endurance / Victory' },
  { key: 'hod',      name: 'Hod',      meaning: 'Splendor / Humility' },
  { key: 'yesod',    name: 'Yesod',    meaning: 'Foundation / Bonding' },
  { key: 'malkhut',  name: 'Malkhut',  meaning: 'Sovereignty / Presence' },
];

interface OmerWindow {
  start: Date; // omer day 1
  end: Date;   // omer day 49
}

function getOmerWindowForYear(gregYear: number): OmerWindow {
  const feasts = computeFeastsForYear(gregYear);
  const ff = feasts.find((f) => f.key === 'firstfruits');
  if (!ff) {
    // Should not happen, but fallback gracefully.
    const today = new Date(gregYear, 0, 1);
    return { start: today, end: addDays(today, 48) };
  }
  // Day 1 = Firstfruits itself; day 49 = Firstfruits + 48; day 50 (Pentecost) excluded.
  const start = new Date(ff.startDate);
  const end = addDays(start, 48);
  return { start, end };
}

function dayKey(d: Date): number {
  const t = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return Math.floor(t / 86_400_000);
}

export function isOmerSeason(date: Date): boolean {
  const w = getOmerWindowForYear(date.getFullYear());
  const k = dayKey(date);
  return k >= dayKey(w.start) && k <= dayKey(w.end);
}

export function getOmerDay(date: Date): number | null {
  const w = getOmerWindowForYear(date.getFullYear());
  const k = dayKey(date);
  const startK = dayKey(w.start);
  const endK = dayKey(w.end);
  if (k < startK || k > endK) return null;
  return k - startK + 1;
}

export function getOmerWindow(gregYear: number): OmerWindow {
  return getOmerWindowForYear(gregYear);
}

/**
 * The traditional Hebrew formula text in English:
 * "Today is X days, which is Y weeks and Z days of the Omer"
 */
export function getOmerBlessing(day: number): string {
  if (day < 1 || day > 49) return '';
  const weeks = Math.floor(day / 7);
  const remainder = day % 7;

  const daysWord = day === 1 ? 'day' : 'days';
  const weeksWord = weeks === 1 ? 'week' : 'weeks';
  const remainderWord = remainder === 1 ? 'day' : 'days';

  if (day < 7) {
    return `Today is ${day} ${daysWord} of the Omer.`;
  }
  if (remainder === 0) {
    return `Today is ${day} ${daysWord}, which is ${weeks} ${weeksWord} of the Omer.`;
  }
  return `Today is ${day} ${daysWord}, which is ${weeks} ${weeksWord} and ${remainder} ${remainderWord} of the Omer.`;
}

/**
 * The Kabbalistic theme for the day: "<day-sefira> within <week-sefira>"
 * Week 1 = Chesed, Week 2 = Gevurah, ... Week 7 = Malkhut.
 * Within each week, day 1 = Chesed, day 2 = Gevurah, ...
 */
export function getOmerWeekTheme(day: number): string {
  if (day < 1 || day > 49) return '';
  const weekIdx = Math.floor((day - 1) / 7);
  const dayIdx = (day - 1) % 7;
  const week = SEFIROT[weekIdx];
  const within = SEFIROT[dayIdx];
  return `${within.name} within ${week.name}`;
}

export function getOmerWeekLabel(day: number): string {
  if (day < 1 || day > 49) return '';
  const weekIdx = Math.floor((day - 1) / 7);
  const week = SEFIROT[weekIdx];
  return `Week of ${week.name} — ${week.meaning}`;
}
