/**
 * Sabbath (Shabbat) utilities.
 * Shabbat begins at sunset Friday and ends at sunset Saturday.
 * For purposes of "is this date a sabbath day": we treat Saturday as the sabbath day.
 */

import { addDays, dayOfWeek } from './hebrewCalendar';

export function isSabbath(date: Date): boolean {
  return dayOfWeek(date) === 6; // Saturday
}

export function isErevShabbat(date: Date): boolean {
  return dayOfWeek(date) === 5; // Friday
}

export function getNextSabbath(from: Date): Date {
  let d = new Date(from);
  // If it's already Saturday, next sabbath is 7 days later.
  if (isSabbath(d)) {
    return addDays(d, 7);
  }
  while (!isSabbath(d)) {
    d = addDays(d, 1);
  }
  return d;
}

export function getPreviousSabbath(from: Date): Date {
  let d = new Date(from);
  if (isSabbath(d)) {
    return addDays(d, -7);
  }
  d = addDays(d, -1);
  while (!isSabbath(d)) {
    d = addDays(d, -1);
  }
  return d;
}

export function getSabbathsInRange(start: Date, end: Date): Date[] {
  const result: Date[] = [];
  let d = new Date(start);
  while (d.getTime() <= end.getTime()) {
    if (isSabbath(d)) result.push(new Date(d));
    d = addDays(d, 1);
  }
  return result;
}

export function countSabbathsInYear(year: number): number {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  return getSabbathsInRange(start, end).length;
}
