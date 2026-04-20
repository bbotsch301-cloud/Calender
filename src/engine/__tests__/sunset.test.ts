import { calculateSunset, getNextDayBoundary } from '../sunset';

const JLEM_LAT = 31.7683;
const JLEM_LON = 35.2137;

function localMinutes(d: Date, offsetHours: number): number {
  return d.getUTCHours() * 60 + d.getUTCMinutes() + offsetHours * 60;
}

describe('sunset', () => {
  test('Jerusalem Apr 12 2025 sunset ≈ 19:01 local (IDT +3)', () => {
    const s = calculateSunset(new Date(2025, 3, 12), JLEM_LAT, JLEM_LON);
    const localMin = localMinutes(s, 3);
    expect(Math.abs(localMin - (19 * 60 + 1))).toBeLessThanOrEqual(5);
  });

  test('Jerusalem Jun 21 2025 sunset ≈ 19:49 local (IDT +3)', () => {
    const s = calculateSunset(new Date(2025, 5, 21), JLEM_LAT, JLEM_LON);
    const localMin = localMinutes(s, 3);
    expect(Math.abs(localMin - (19 * 60 + 49))).toBeLessThanOrEqual(5);
  });

  test('Jerusalem Dec 21 2025 sunset ≈ 16:39 local (IST +2)', () => {
    const s = calculateSunset(new Date(2025, 11, 21), JLEM_LAT, JLEM_LON);
    const localMin = localMinutes(s, 2);
    expect(Math.abs(localMin - (16 * 60 + 39))).toBeLessThanOrEqual(5);
  });

  test('Arctic summer (no sunset) falls back to 18:00 local', () => {
    const s = calculateSunset(new Date(2025, 5, 21), 89.5, 0);
    // Fallback is 18:00 at local longitude, which at lon=0 is 18:00 UTC.
    expect(s.getUTCHours()).toBe(18);
    expect(s.getUTCMinutes()).toBe(0);
  });

  test('getNextDayBoundary: 2am → same-day sunset, not tomorrow', () => {
    const earlyMorning = new Date(Date.UTC(2025, 5, 21, 2, 0));
    const boundary = getNextDayBoundary(earlyMorning, JLEM_LAT, JLEM_LON);
    // Same UTC calendar day
    expect(boundary.getUTCDate()).toBe(21);
  });

  test('getNextDayBoundary: after sunset → tomorrow', () => {
    const evening = new Date(Date.UTC(2025, 5, 21, 22, 0));
    const boundary = getNextDayBoundary(evening, JLEM_LAT, JLEM_LON);
    expect(boundary.getUTCDate()).toBe(22);
  });
});
