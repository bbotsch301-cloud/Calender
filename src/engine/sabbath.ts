/**
 * Sabbath (Shabbat) utilities.
 * Shabbat begins at sunset Friday and ends at sunset Saturday.
 * For purposes of "is this date a sabbath day": we treat Saturday as the sabbath day.
 */

import { addDays, dayOfWeek, gregorianToHebrew } from './hebrewCalendar';

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

/**
 * Rosh Chodesh — the head of the (Hebrew) month.
 * True when the Hebrew calendar day === 1.
 * Some Hebrew months are also observed on day 30 of the previous month
 * (when that month has 30 days), but per the spec we test day === 1 strictly.
 */
export function isRoshChodesh(date: Date): boolean {
  return gregorianToHebrew(date).day === 1;
}

export function countSabbathsInYear(year: number): number {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  return getSabbathsInRange(start, end).length;
}
