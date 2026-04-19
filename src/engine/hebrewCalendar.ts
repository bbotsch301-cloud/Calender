/**
 * Hebrew Calendar Engine — Dershowitz-Reingold Algorithm
 * Reference: "Calendrical Calculations" by Nachum Dershowitz & Edward M. Reingold
 *
 * Implements bidirectional conversion between Gregorian and Hebrew (rabbinical) calendars.
 * Uses the Rata Die / Fixed Date system as the intermediate representation.
 */

export interface HebrewDate {
  year: number;
  month: number; // 1=Nisan, 2=Iyar, ... 7=Tishri (start of civil year), ..., 12=Adar / 13=Adar II
  day: number;
  monthName: string;
  monthNameHebrew: string;
}

export const HEBREW_MONTH_NAMES = [
  '', // 0 placeholder
  'Nisan',
  'Iyar',
  'Sivan',
  'Tammuz',
  'Av',
  'Elul',
  'Tishri',
  'Cheshvan',
  'Kislev',
  'Tevet',
  'Shevat',
  'Adar',
  'Adar II',
];

export const HEBREW_MONTH_NAMES_HEBREW = [
  '',
  'נִיסָן',
  'אִיָּר',
  'סִיוָן',
  'תַּמּוּז',
  'אָב',
  'אֱלוּל',
  'תִּשְׁרֵי',
  'חֶשְׁוָן',
  'כִּסְלֵו',
  'טֵבֵת',
  'שְׁבָט',
  'אֲדָר',
  'אֲדָר ב׳',
];

const HEBREW_EPOCH = -1373427; // Rata die for 1 Tishri AM 1 (per Reingold)

function mod(a: number, b: number): number {
  return a - b * Math.floor(a / b);
}

function quotient(a: number, b: number): number {
  return Math.floor(a / b);
}

// === Gregorian ↔ Fixed Date (RD) ===
const GREGORIAN_EPOCH = 1;

function isGregorianLeap(year: number): boolean {
  return mod(year, 4) === 0 && mod(year, 100) !== 0 || mod(year, 400) === 0;
}

export function gregorianToFixed(year: number, month: number, day: number): number {
  const y = year - 1;
  return (
    GREGORIAN_EPOCH - 1 +
    365 * y +
    quotient(y, 4) -
    quotient(y, 100) +
    quotient(y, 400) +
    quotient(367 * month - 362, 12) +
    (month <= 2 ? 0 : isGregorianLeap(year) ? -1 : -2) +
    day
  );
}

function gregorianYearFromFixed(date: number): number {
  const d0 = date - GREGORIAN_EPOCH;
  const n400 = quotient(d0, 146097);
  const d1 = mod(d0, 146097);
  const n100 = quotient(d1, 36524);
  const d2 = mod(d1, 36524);
  const n4 = quotient(d2, 1461);
  const d3 = mod(d2, 1461);
  const n1 = quotient(d3, 365);
  const year = 400 * n400 + 100 * n100 + 4 * n4 + n1;
  return n100 === 4 || n1 === 4 ? year : year + 1;
}

export function fixedToGregorian(date: number): { year: number; month: number; day: number } {
  const year = gregorianYearFromFixed(date);
  const priorDays = date - gregorianToFixed(year, 1, 1);
  const correction =
    date < gregorianToFixed(year, 3, 1) ? 0 : isGregorianLeap(year) ? 1 : 2;
  const month = quotient(12 * (priorDays + correction) + 373, 367);
  const day = date - gregorianToFixed(year, month, 1) + 1;
  return { year, month, day };
}

// === Hebrew calendar core ===

export function isLeapYear(year: number): boolean {
  return mod(7 * year + 1, 19) < 7;
}

function lastMonthOfHebrewYear(year: number): number {
  return isLeapYear(year) ? 13 : 12;
}

function lastDayOfHebrewMonth(year: number, month: number): number {
  if (
    [2, 4, 6, 10, 13].includes(month) ||
    (month === 12 && !isLeapYear(year)) ||
    (month === 8 && !isLongCheshvan(year)) ||
    (month === 9 && isShortKislev(year))
  ) {
    return 29;
  }
  return 30;
}

function molad(year: number, month: number): number {
  const y = month < 7 ? year + 1 : year;
  const monthsElapsed = month - 7 + Math.floor((235 * y - 234) / 19);
  return (
    HEBREW_EPOCH -
    876 / 25920 +
    monthsElapsed * (29 + 12 / 24 + 793 / 25920)
  );
}

function hebrewCalendarElapsedDays(year: number): number {
  const monthsElapsed = Math.floor((235 * year - 234) / 19);
  const partsElapsed = 12084 + 13753 * monthsElapsed;
  let day = 29 * monthsElapsed + Math.floor(partsElapsed / 25920);
  if (mod(3 * (day + 1), 7) < 3) {
    day += 1;
  }
  return day;
}

function hebrewYearLengthCorrection(year: number): number {
  const ny0 = hebrewCalendarElapsedDays(year - 1);
  const ny1 = hebrewCalendarElapsedDays(year);
  const ny2 = hebrewCalendarElapsedDays(year + 1);
  if (ny2 - ny1 === 356) return 2;
  if (ny1 - ny0 === 382) return 1;
  return 0;
}

function hebrewNewYear(year: number): number {
  return HEBREW_EPOCH + hebrewCalendarElapsedDays(year) + hebrewYearLengthCorrection(year);
}

function daysInHebrewYear(year: number): number {
  return hebrewNewYear(year + 1) - hebrewNewYear(year);
}

function isLongCheshvan(year: number): boolean {
  return mod(daysInHebrewYear(year), 10) === 5;
}

function isShortKislev(year: number): boolean {
  return mod(daysInHebrewYear(year), 10) === 3;
}

/**
 * Hebrew years come in three lengths. Cheshvan (usually 29) can have 30 days
 * in a "complete" year; Kislev (usually 30) can have 29 in a "deficient" year.
 *  - deficient (חסרה): Cheshvan 29, Kislev 29 → 353 / 383 days
 *  - regular (כסדרה):  Cheshvan 29, Kislev 30 → 354 / 384 days
 *  - complete (שלמה):  Cheshvan 30, Kislev 30 → 355 / 385 days
 */
export type HebrewYearType = 'deficient' | 'regular' | 'complete';

export function getYearType(year: number): HebrewYearType {
  if (isShortKislev(year)) return 'deficient';
  if (isLongCheshvan(year)) return 'complete';
  return 'regular';
}

export function hebrewToFixed(year: number, month: number, day: number): number {
  let date = hebrewNewYear(year) + day - 1;
  if (month < 7) {
    for (let m = 7; m <= lastMonthOfHebrewYear(year); m++) {
      date += lastDayOfHebrewMonth(year, m);
    }
    for (let m = 1; m < month; m++) {
      date += lastDayOfHebrewMonth(year, m);
    }
  } else {
    for (let m = 7; m < month; m++) {
      date += lastDayOfHebrewMonth(year, m);
    }
  }
  return date;
}

export function fixedToHebrew(date: number): HebrewDate {
  const approx = Math.floor((date - HEBREW_EPOCH) / 365.2468);
  let year = approx;
  while (hebrewNewYear(year + 1) <= date) year++;
  while (hebrewNewYear(year) > date) year--;

  const startMonth = date < hebrewToFixed(year, 1, 1) ? 7 : 1;
  let month = startMonth;
  while (date > hebrewToFixed(year, month, lastDayOfHebrewMonth(year, month))) {
    month++;
  }
  const day = date - hebrewToFixed(year, month, 1) + 1;

  return {
    year,
    month,
    day,
    monthName: HEBREW_MONTH_NAMES[month],
    monthNameHebrew: HEBREW_MONTH_NAMES_HEBREW[month],
  };
}

// === Public API ===

export function gregorianToHebrew(date: Date): HebrewDate {
  const fixed = gregorianToFixed(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  return fixedToHebrew(fixed);
}

export function hebrewToGregorian(year: number, month: number, day: number): Date {
  const fixed = hebrewToFixed(year, month, day);
  const g = fixedToGregorian(fixed);
  return new Date(g.year, g.month - 1, g.day);
}

const HEBREW_NUMERALS: Array<[number, string]> = [
  [400, 'ת'], [300, 'ש'], [200, 'ר'], [100, 'ק'],
  [90, 'צ'], [80, 'פ'], [70, 'ע'], [60, 'ס'], [50, 'נ'],
  [40, 'מ'], [30, 'ל'], [20, 'כ'], [19, 'יט'], [18, 'יח'],
  [17, 'יז'], [16, 'טז'], [15, 'טו'], [10, 'י'],
  [9, 'ט'], [8, 'ח'], [7, 'ז'], [6, 'ו'], [5, 'ה'],
  [4, 'ד'], [3, 'ג'], [2, 'ב'], [1, 'א'],
];

export function toHebrewNumeral(n: number): string {
  if (n <= 0) return '';
  let result = '';
  let remaining = n;
  for (const [value, symbol] of HEBREW_NUMERALS) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }
  if (result.length === 1) return result + '׳';
  return result.slice(0, -1) + '״' + result.slice(-1);
}

export function formatHebrewDate(h: HebrewDate, opts?: { hebrew?: boolean }): string {
  if (opts?.hebrew) {
    return `${toHebrewNumeral(h.day)} ${h.monthNameHebrew} ${toHebrewNumeral(h.year)}`;
  }
  return `${h.day} ${h.monthName} ${h.year}`;
}

export function dayOfWeek(date: Date): number {
  // 0 = Sunday, 6 = Saturday
  return date.getDay();
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function diffDays(a: Date, b: Date): number {
  const ms = a.setHours(0, 0, 0, 0) - new Date(b).setHours(0, 0, 0, 0);
  return Math.round(ms / 86400000);
}
