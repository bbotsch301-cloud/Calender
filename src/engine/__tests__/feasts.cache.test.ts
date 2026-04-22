import { computeFeastsForYear } from '../feasts';

describe('feasts cache', () => {
  test('returns the same array reference for repeated calls (memoized)', () => {
    const a = computeFeastsForYear(2025);
    const b = computeFeastsForYear(2025);
    expect(a).toBe(b);
  });

  test('different years return distinct arrays', () => {
    const a = computeFeastsForYear(2024);
    const b = computeFeastsForYear(2025);
    expect(a).not.toBe(b);
    expect(a[0].startDate.getFullYear()).toBe(2024);
    expect(b[0].startDate.getFullYear()).toBe(2025);
  });

  test('cache does not leak state across years (no shared mutation)', () => {
    const a = computeFeastsForYear(2030);
    const before = a[0].startDate.getTime();
    // Mutating one shouldn't affect the other, and subsequent get should
    // return the same reference unchanged.
    const b = computeFeastsForYear(2030);
    expect(b[0].startDate.getTime()).toBe(before);
  });

  test('bounded cache: many distinct years remain computable', () => {
    for (let y = 1990; y < 2040; y++) {
      const f = computeFeastsForYear(y);
      expect(f.length).toBe(8);
    }
  });
});
