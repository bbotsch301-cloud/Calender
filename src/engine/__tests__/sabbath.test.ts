import {
  isSabbath,
  isErevShabbat,
  isRoshChodesh,
  getNextSabbath,
  getPreviousSabbath,
  getSabbathsInRange,
} from '../sabbath';

describe('sabbath', () => {
  test('Saturday is Sabbath; other days are not', () => {
    expect(isSabbath(new Date(2025, 3, 12))).toBe(true); // Sat
    expect(isSabbath(new Date(2025, 3, 11))).toBe(false); // Fri
    expect(isSabbath(new Date(2025, 3, 13))).toBe(false); // Sun
  });

  test('Friday is Erev Shabbat', () => {
    expect(isErevShabbat(new Date(2025, 3, 11))).toBe(true);
    expect(isErevShabbat(new Date(2025, 3, 12))).toBe(false);
  });

  test('Rosh Chodesh: Sep 23 2025 = 1 Tishri 5786 is Rosh Chodesh', () => {
    expect(isRoshChodesh(new Date(2025, 8, 23))).toBe(true);
    expect(isRoshChodesh(new Date(2025, 8, 24))).toBe(false);
  });

  test('getNextSabbath returns next Saturday', () => {
    const next = getNextSabbath(new Date(2025, 3, 9)); // Wed
    expect(next.toDateString()).toBe('Sat Apr 12 2025');
  });

  test('getNextSabbath skips a full week when called on Saturday', () => {
    const next = getNextSabbath(new Date(2025, 3, 12)); // Sat
    expect(next.toDateString()).toBe('Sat Apr 19 2025');
  });

  test('getPreviousSabbath returns previous Saturday', () => {
    const prev = getPreviousSabbath(new Date(2025, 3, 9));
    expect(prev.toDateString()).toBe('Sat Apr 05 2025');
  });

  test('getSabbathsInRange counts correctly', () => {
    const list = getSabbathsInRange(new Date(2025, 3, 1), new Date(2025, 3, 30));
    expect(list.length).toBe(4);
  });
});
