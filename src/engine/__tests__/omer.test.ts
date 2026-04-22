import {
  getOmerBlessing,
  getOmerDay,
  getOmerWeekLabel,
  getOmerWeekTheme,
  getOmerWindow,
  isOmerSeason,
} from '../omer';
import { computeFeastsForYear } from '../feasts';

describe('omer', () => {
  test('Day 1 equals Firstfruits; day 49 is one day before Pentecost', () => {
    for (const y of [2024, 2025, 2026]) {
      const f = computeFeastsForYear(y);
      const ff = f.find((x) => x.key === 'firstfruits')!;
      const pent = f.find((x) => x.key === 'shavuot')!;
      const w = getOmerWindow(y);
      expect(w.start.toDateString()).toBe(ff.startDate.toDateString());
      expect(pent.startDate.getTime() - w.end.getTime()).toBe(86_400_000);
    }
  });

  test('getOmerDay returns null outside the counting period', () => {
    expect(getOmerDay(new Date(2025, 0, 1))).toBeNull();
    expect(getOmerDay(new Date(2025, 5, 30))).toBeNull();
  });

  test('getOmerDay returns 1 on Firstfruits and 49 on day-before-Pentecost', () => {
    const w = getOmerWindow(2025);
    expect(getOmerDay(w.start)).toBe(1);
    expect(getOmerDay(w.end)).toBe(49);
  });

  test('isOmerSeason is true only between day 1 and day 49 inclusive', () => {
    const w = getOmerWindow(2025);
    const before = new Date(w.start.getTime() - 86_400_000);
    const after = new Date(w.end.getTime() + 86_400_000);
    expect(isOmerSeason(before)).toBe(false);
    expect(isOmerSeason(w.start)).toBe(true);
    expect(isOmerSeason(w.end)).toBe(true);
    expect(isOmerSeason(after)).toBe(false);
  });

  test('getOmerBlessing formatting', () => {
    expect(getOmerBlessing(1)).toBe('Today is 1 day of the Omer.');
    expect(getOmerBlessing(7)).toMatch(/1 week of the Omer/);
    expect(getOmerBlessing(8)).toMatch(/1 week and 1 day/);
    expect(getOmerBlessing(33)).toMatch(/4 weeks and 5 days/);
    expect(getOmerBlessing(49)).toMatch(/7 weeks of the Omer/);
    expect(getOmerBlessing(0)).toBe('');
    expect(getOmerBlessing(50)).toBe('');
  });

  test('Sefirot pairing: day 33 (Lag BaOmer) = Hod within Hod', () => {
    expect(getOmerWeekTheme(33)).toBe('Hod within Hod');
    expect(getOmerWeekTheme(1)).toBe('Chesed within Chesed');
    expect(getOmerWeekTheme(49)).toBe('Malkhut within Malkhut');
  });

  test('Week labels name each week by its primary sefira', () => {
    expect(getOmerWeekLabel(1)).toMatch(/Chesed/);
    expect(getOmerWeekLabel(14)).toMatch(/Gevurah/);
    expect(getOmerWeekLabel(49)).toMatch(/Malkhut/);
  });
});
