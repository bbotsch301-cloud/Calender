import { computeFeastsForYear } from '../feasts';

function dateStr(d: Date): string {
  return d.toDateString();
}

describe('feasts', () => {
  test('all 8 feasts are returned in canonical order', () => {
    const f = computeFeastsForYear(2025);
    expect(f.map((x) => x.key)).toEqual([
      'passover',
      'unleavenedBread',
      'firstfruits',
      'pentecost',
      'trumpets',
      'atonement',
      'tabernacles',
      'eighthDay',
    ]);
  });

  test('2025 feast dates match published calendar', () => {
    const f = computeFeastsForYear(2025);
    const by = Object.fromEntries(f.map((x) => [x.key, x]));
    expect(dateStr(by.passover.startDate)).toBe('Sat Apr 12 2025');
    expect(dateStr(by.unleavenedBread.startDate)).toBe('Sun Apr 13 2025');
    expect(dateStr(by.unleavenedBread.endDate)).toBe('Sat Apr 19 2025');
    expect(dateStr(by.firstfruits.startDate)).toBe('Sun Apr 20 2025');
    expect(dateStr(by.pentecost.startDate)).toBe('Sun Jun 08 2025');
    expect(dateStr(by.trumpets.startDate)).toBe('Tue Sep 23 2025');
    expect(dateStr(by.atonement.startDate)).toBe('Thu Oct 02 2025');
    expect(dateStr(by.tabernacles.startDate)).toBe('Tue Oct 07 2025');
    expect(dateStr(by.tabernacles.endDate)).toBe('Mon Oct 13 2025');
    expect(dateStr(by.eighthDay.startDate)).toBe('Tue Oct 14 2025');
  });

  test('Pentecost is exactly 49 days after Firstfruits for 2024-2026 (day 1 = Firstfruits, day 50 = Pentecost)', () => {
    for (const y of [2024, 2025, 2026]) {
      const f = computeFeastsForYear(y);
      const ff = f.find((x) => x.key === 'firstfruits')!;
      const pent = f.find((x) => x.key === 'pentecost')!;
      const diff = (pent.startDate.getTime() - ff.startDate.getTime()) / 86_400_000;
      expect(diff).toBe(49);
    }
  });

  test('Firstfruits always falls on a Sunday', () => {
    for (const y of [2023, 2024, 2025, 2026, 2027]) {
      const f = computeFeastsForYear(y);
      const ff = f.find((x) => x.key === 'firstfruits')!;
      expect(ff.startDate.getDay()).toBe(0);
    }
  });

  test('Unleavened Bread is exactly 7 days', () => {
    for (const y of [2024, 2025, 2026]) {
      const f = computeFeastsForYear(y);
      const ub = f.find((x) => x.key === 'unleavenedBread')!;
      const days =
        (ub.endDate.getTime() - ub.startDate.getTime()) / 86_400_000 + 1;
      expect(days).toBe(7);
    }
  });
});
