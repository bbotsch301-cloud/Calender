/**
 * Moon Phase Engine — pure math, no network.
 *
 * Reference epoch: 2000 January 6, 14:24 UTC — the new moon nearest
 * J2000 (Julian Date 2451550.1). Combined with the mean synodic month
 * of 29.53058770576 days (Meeus, "Astronomical Algorithms"), this gives
 * a model that stays within a few hours of real lunar phases for well
 * over a century in either direction of the reference — more than
 * accurate enough for a calendar UI that only needs the phase name.
 *
 * The cycle is divided into 8 equal wedges, each ≈ 3.69 days, centered
 * on the named phase so that — for example — Full Moon is the phase
 * returned for roughly ±1.85 days around the actual full moon.
 */

export type MoonPhaseIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface MoonPhaseInfo {
  /** 0 = new, 1 = waxing crescent, 2 = first quarter, 3 = waxing gibbous,
   *  4 = full, 5 = waning gibbous, 6 = last quarter, 7 = waning crescent. */
  phase: MoonPhaseIndex;
  name: string;
  emoji: string;
  /** Fraction of the visible disk that is lit: 0 at new, ~1 at full. */
  illumination: number;
  /** Age of the moon in days since the last new moon, in [0, SYNODIC_MONTH). */
  ageDays: number;
}

export const SYNODIC_MONTH_DAYS = 29.53058770576;
export const REFERENCE_NEW_MOON_UTC = Date.UTC(2000, 0, 6, 14, 24, 0);

export const PHASE_NAMES = [
  'New Moon',
  'Waxing Crescent',
  'First Quarter',
  'Waxing Gibbous',
  'Full Moon',
  'Waning Gibbous',
  'Last Quarter',
  'Waning Crescent',
] as const;

export const PHASE_EMOJIS = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'] as const;

export function getMoonPhase(date: Date): MoonPhaseInfo {
  const elapsedDays = (date.getTime() - REFERENCE_NEW_MOON_UTC) / 86_400_000;
  let ageDays = elapsedDays % SYNODIC_MONTH_DAYS;
  if (ageDays < 0) ageDays += SYNODIC_MONTH_DAYS;

  // Half-wedge offset so each named phase band is centered on its peak.
  const wedge = SYNODIC_MONTH_DAYS / 8;
  const phase = (Math.floor((ageDays + wedge / 2) / wedge) % 8) as MoonPhaseIndex;

  // Illumination follows a cosine curve: 0 at new, 1 at full.
  const illumination = (1 - Math.cos((2 * Math.PI * ageDays) / SYNODIC_MONTH_DAYS)) / 2;

  return {
    phase,
    name: PHASE_NAMES[phase],
    emoji: PHASE_EMOJIS[phase],
    illumination,
    ageDays,
  };
}

/**
 * Finds the next date on or after `from` where the moon is in the given
 * named phase band. Useful for "next full moon" countdowns.
 */
export function getNextPhase(from: Date, target: MoonPhaseIndex): Date {
  const current = getMoonPhase(from);
  if (current.phase === target) return new Date(from);
  const wedge = SYNODIC_MONTH_DAYS / 8;
  const targetCenter = target * wedge;
  let delta = targetCenter - current.ageDays;
  if (delta <= 0) delta += SYNODIC_MONTH_DAYS;
  return new Date(from.getTime() + delta * 86_400_000);
}
