/**
 * Parasha date logic.
 *
 * The rich per-parasha fields (meaning, haftarah, summary) live in
 * `src/content/parasha-content.ts`; this file derives the compact
 * `Parasha` shape used by date computation and keeps the existing
 * public API (`PARASHOT`, `getParashaForDate`) stable.
 *
 * Cycle starts on Simchat Torah (Tishrei 23) with Bereshit and ends
 * the following year on Simchat Torah with V'Zot HaBerakhah. In
 * regular (non-leap) Hebrew years seven pairs of portions are read
 * together; in leap years all 54 are read individually.
 */

import { hebrewToGregorian, addDays, dayOfWeek, isLeapYear } from '../engine/hebrewCalendar';
import { LEARN_PARASHOT, type LearnParasha } from '../content/parasha-content';

export interface Parasha {
  index: number;
  name: string;
  hebrewName: string;
  books: string;
  summary: string;
}

export const PARASHOT: Parasha[] = LEARN_PARASHOT.map((p: LearnParasha, idx: number) => ({
  index: idx + 1,
  name: p.transliteration,
  hebrewName: p.hebrewName,
  books: p.torahReading,
  summary: p.summary,
}));

// Paired portions — read together in non-leap years by 1-based index.
const DOUBLED_PAIRS: Array<[number, number]> = [
  [22, 23], // Vayakhel / Pekudei
  [27, 28], // Tazria / Metzora
  [29, 30], // Acharei Mot / Kedoshim
  [32, 33], // Behar / Bechukotai
  [39, 40], // Chukat / Balak
  [42, 43], // Mattot / Massei
  [51, 52], // Nitzavim / Vayelech
];

function buildReadingSequence(hebrewYear: number): Parasha[][] {
  const leap = isLeapYear(hebrewYear);
  const seq: Parasha[][] = [];
  let i = 1;
  while (i <= 54) {
    const pair = DOUBLED_PAIRS.find(([a]) => a === i);
    if (pair && !leap) {
      seq.push([PARASHOT[pair[0] - 1], PARASHOT[pair[1] - 1]]);
      i = pair[1] + 1;
    } else {
      seq.push([PARASHOT[i - 1]]);
      i++;
    }
  }
  return seq;
}

function getCycleStartSabbath(hebrewYear: number): Date {
  const simchatTorah = hebrewToGregorian(hebrewYear, 7, 23);
  // First Shabbat strictly after Simchat Torah.
  let d = addDays(simchatTorah, 1);
  while (dayOfWeek(d) !== 6) d = addDays(d, 1);
  return d;
}

export function getParashaForDate(
  date: Date,
  hebrewYear: number
): { parasha: Parasha; pairedWith?: Parasha; sabbathDate: Date } {
  let cycleYear = hebrewYear;
  let cycleStart = getCycleStartSabbath(cycleYear);
  if (date.getTime() < cycleStart.getTime()) {
    cycleYear = hebrewYear - 1;
    cycleStart = getCycleStartSabbath(cycleYear);
  }

  // Next Saturday on or after `date`.
  let sabbath = new Date(date);
  while (dayOfWeek(sabbath) !== 6) sabbath = addDays(sabbath, 1);

  const weeksFromStart = Math.floor(
    (sabbath.getTime() - cycleStart.getTime()) / (7 * 86_400_000)
  );
  const sequence = buildReadingSequence(cycleYear);
  const reading = sequence[Math.min(weeksFromStart, sequence.length - 1)] ?? sequence[0];

  return {
    parasha: reading[0],
    pairedWith: reading[1],
    sabbathDate: sabbath,
  };
}
