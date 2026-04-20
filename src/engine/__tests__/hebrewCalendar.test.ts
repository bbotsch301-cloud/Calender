import {
  gregorianToHebrew,
  hebrewToGregorian,
  isLeapYear,
  getYearType,
  toHebrewNumeral,
} from '../hebrewCalendar';

describe('hebrewCalendar', () => {
  test('isLeapYear — 7 leap years per 19-year cycle at positions 3,6,8,11,14,17,19', () => {
    const positions = Array.from({ length: 19 }, (_, i) => i + 1).filter(isLeapYear);
    expect(positions).toEqual([3, 6, 8, 11, 14, 17, 19]);
  });

  test.each([
    [2024, 3, 22, 5784, 1, 14, 'Passover 5784'],
    [2025, 3, 12, 5785, 1, 14, 'Passover 5785'],
    [2026, 3, 1,  5786, 1, 14, 'Passover 5786'],
    [2024, 9, 3,  5785, 7, 1,  '1 Tishri 5785'],
    [2025, 8, 23, 5786, 7, 1,  '1 Tishri 5786'],
    [2026, 8, 12, 5787, 7, 1,  '1 Tishri 5787'],
    [2024, 9, 12, 5785, 7, 10, 'Yom Kippur 5785'],
    [2000, 0, 1,  5760, 10, 23,'Y2K'],
  ])('gregorian→hebrew: %i-%i-%i → %i-%i-%i (%s)', (gy, gm, gd, hy, hm, hday) => {
    const h = gregorianToHebrew(new Date(gy, gm, gd));
    expect(h.year).toBe(hy);
    expect(h.month).toBe(hm);
    expect(h.day).toBe(hday);
  });

  test('round-trip Gregorian → Hebrew → Gregorian is identity for arbitrary dates', () => {
    const samples = [
      new Date(1990, 5, 15),
      new Date(2000, 0, 1),
      new Date(2012, 11, 31),
      new Date(2023, 8, 16),
      new Date(2024, 3, 22),
      new Date(2025, 3, 12),
      new Date(2030, 6, 7),
    ];
    for (const d of samples) {
      const h = gregorianToHebrew(d);
      const back = hebrewToGregorian(h.year, h.month, h.day);
      expect(back.toDateString()).toBe(d.toDateString());
    }
  });

  test('getYearType classifies years correctly', () => {
    expect(getYearType(5784)).toBe('deficient');
    expect(getYearType(5785)).toBe('complete');
    expect(getYearType(5786)).toBe('regular');
    expect(getYearType(5787)).toBe('complete');
  });

  test('Hebrew year length is 353-355 (regular) or 383-385 (leap)', () => {
    for (let y = 5780; y < 5800; y++) {
      const len =
        (hebrewToGregorian(y + 1, 7, 1).getTime() - hebrewToGregorian(y, 7, 1).getTime()) /
        86_400_000;
      const valid = isLeapYear(y) ? [383, 384, 385].includes(len) : [353, 354, 355].includes(len);
      expect(valid).toBe(true);
    }
  });

  test('Hebrew numerals', () => {
    expect(toHebrewNumeral(1)).toBe('א׳');
    expect(toHebrewNumeral(15)).toBe('ט״ו');
    expect(toHebrewNumeral(16)).toBe('ט״ז');
    expect(toHebrewNumeral(5785)).toMatch(/^ה/);
  });
});
