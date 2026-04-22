import { computeFeastsForYear } from '../feasts';

function dateStr(d: Date): string {
  return d.toDateString();
}

describe('feasts', () => {
  test('8 moedim come through every year, plus Hanukkah and/or Purim when in range', () => {
    const f = computeFeastsForYear(2025);
    const keys = f.map((x) => x.key);
    for (const k of [
      'passover',
      'unleavenedBread',
      'firstfruits',
      'shavuot',
      'yomTeruah',
      'yomKippur',
      'sukkot',
      'sheminiAtzeret',
    ]) {
      expect(keys).toContain(k);
    }
  });

  test('2025 moedim dates match published calendar', () => {
    const f = computeFeastsForYear(2025);
    const by = Object.fromEntries(f.map((x) => [x.key, x]));
    expect(dateStr(by.passover.startDate)).toBe('Sat Apr 12 2025');
    expect(dateStr(by.unleavenedBread.startDate)).toBe('Sun Apr 13 2025');
    expect(dateStr(by.unleavenedBread.endDate)).toBe('Sat Apr 19 2025');
    expect(dateStr(by.firstfruits.startDate)).toBe('Sun Apr 20 2025');
    expect(dateStr(by.shavuot.startDate)).toBe('Sun Jun 08 2025');
    expect(dateStr(by.yomTeruah.startDate)).toBe('Tue Sep 23 2025');
    expect(dateStr(by.yomKippur.startDate)).toBe('Thu Oct 02 2025');
    expect(dateStr(by.sukkot.startDate)).toBe('Tue Oct 07 2025');
    expect(dateStr(by.sukkot.endDate)).toBe('Mon Oct 13 2025');
    expect(dateStr(by.sheminiAtzeret.startDate)).toBe('Tue Oct 14 2025');
  });

  test('Shavuot is exactly 49 days after Firstfruits for 2024-2026', () => {
    for (const y of [2024, 2025, 2026]) {
      const f = computeFeastsForYear(y);
      const ff = f.find((x) => x.key === 'firstfruits')!;
      const sh = f.find((x) => x.key === 'shavuot')!;
      const diff = (sh.startDate.getTime() - ff.startDate.getTime()) / 86_400_000;
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
      const days = (ub.endDate.getTime() - ub.startDate.getTime()) / 86_400_000 + 1;
      expect(days).toBe(7);
    }
  });

  test('Hanukkah appears and spans 8 days when it falls in the Gregorian year', () => {
    // Hanukkah 2025: starts sunset Dec 14 → the 25 Kislev civil date is Dec 15 2025.
    const f = computeFeastsForYear(2025);
    const hk = f.find((x) => x.key === 'hanukkah');
    expect(hk).toBeDefined();
    if (hk) {
      const days = (hk.endDate.getTime() - hk.startDate.getTime()) / 86_400_000 + 1;
      expect(days).toBe(8);
    }
  });

  test('Purim falls on 14 Adar (leap-year uses Adar II)', () => {
    // 5784 is a leap year → Purim 2024 = 14 Adar II
    // 5785 is a regular year → Purim 2025 = 14 Adar
    for (const y of [2024, 2025, 2026]) {
      const f = computeFeastsForYear(y);
      const p = f.find((x) => x.key === 'purim');
      expect(p).toBeDefined();
      if (p) expect(p.hebrewDay).toBe(14);
    }
  });
});
