/**
 * Moon Phase Engine.
 *
 * Computes the current lunar phase using the synodic month period
 * (29.530588853 days) measured from a known new moon reference epoch.
 *
 * Reference epoch: 2000 January 6, 18:14 UTC — the new moon nearest J2000.
 */

const SYNODIC_MONTH = 29.530588853;
const REFERENCE_NEW_MOON_UTC = Date.UTC(2000, 0, 6, 18, 14, 0);

export type MoonPhaseName =
  | 'New Moon'
  | 'Waxing Crescent'
  | 'First Quarter'
  | 'Waxing Gibbous'
  | 'Full Moon'
  | 'Waning Gibbous'
  | 'Last Quarter'
  | 'Waning Crescent';

export interface MoonPhase {
  phase: number;          // age in days, 0 ≤ phase < 29.530588853
  name: MoonPhaseName;
  emoji: string;
  illumination: number;   // 0 (new) → 1 (full), fraction lit
}

/**
 * The eight named phases divide the cycle into segments of one-eighth.
 * The four primary phases (new, first quarter, full, last quarter) sit at
 * the centers of the segments at 0, 7.38, 14.77, and 22.15 days; we treat
 * each as occupying a narrow band around its peak, with the intermediate
 * phases filling the spaces between.
 */
const PHASE_SEGMENTS: Array<{
  max: number;
  name: MoonPhaseName;
  emoji: string;
}> = [
  { max: 1.84566,  name: 'New Moon',         emoji: '🌑' },
  { max: 5.53699,  name: 'Waxing Crescent',  emoji: '🌒' },
  { max: 9.22831,  name: 'First Quarter',    emoji: '🌓' },
  { max: 12.91963, name: 'Waxing Gibbous',   emoji: '🌔' },
  { max: 16.61096, name: 'Full Moon',        emoji: '🌕' },
  { max: 20.30228, name: 'Waning Gibbous',   emoji: '🌖' },
  { max: 23.99361, name: 'Last Quarter',     emoji: '🌗' },
  { max: 27.68493, name: 'Waning Crescent',  emoji: '🌘' },
  { max: SYNODIC_MONTH, name: 'New Moon',    emoji: '🌑' },
];

export function getMoonPhase(date: Date): MoonPhase {
  const elapsedDays = (date.getTime() - REFERENCE_NEW_MOON_UTC) / 86_400_000;
  let phase = elapsedDays % SYNODIC_MONTH;
  if (phase < 0) phase += SYNODIC_MONTH;

  const segment = PHASE_SEGMENTS.find((s) => phase < s.max) ?? PHASE_SEGMENTS[0];

  const illumination = (1 - Math.cos((2 * Math.PI * phase) / SYNODIC_MONTH)) / 2;

  return {
    phase,
    name: segment.name,
    emoji: segment.emoji,
    illumination,
  };
}

/**
 * Find the next occurrence of a target phase (one of the four primary phases:
 * new, first quarter, full, last quarter) on or after `from`.
 */
export function getNextPrimaryPhase(
  from: Date,
  target: 'New Moon' | 'First Quarter' | 'Full Moon' | 'Last Quarter'
): Date {
  const targetAge: Record<typeof target, number> = {
    'New Moon': 0,
    'First Quarter': SYNODIC_MONTH * 0.25,
    'Full Moon': SYNODIC_MONTH * 0.5,
    'Last Quarter': SYNODIC_MONTH * 0.75,
  };
  const goal = targetAge[target];
  const current = getMoonPhase(from).phase;
  let delta = goal - current;
  if (delta < 0) delta += SYNODIC_MONTH;
  return new Date(from.getTime() + delta * 86_400_000);
}
