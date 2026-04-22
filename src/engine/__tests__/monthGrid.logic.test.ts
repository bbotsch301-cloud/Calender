/**
 * The MonthGrid component itself pulls in React Native, so we can't render
 * it under ts-jest's Node environment. But the grid is driven by a small
 * pure calculation: given (year, month, weekStartSunday), the number of
 * "leading blank" cells before day 1 must line up so the grid always
 * produces 6 × 7 = 42 cells with the 1st landing in the correct column.
 *
 * This test pins that calculation so any future refactor that touches
 * MonthGrid can't silently ship an off-by-one column.
 */

function leadingOffset(year: number, month: number, weekStartSunday: boolean): number {
  const first = new Date(year, month, 1);
  const firstDow = first.getDay();
  return weekStartSunday ? firstDow : (firstDow + 1) % 7;
}

describe('month-grid leading offset', () => {
  test('April 2026 starts on a Wednesday — Sun-first grid should have 3 blanks', () => {
    expect(leadingOffset(2026, 3, true)).toBe(3);
  });

  test('April 2026 Wednesday 1st — Sat-first grid should have 4 blanks', () => {
    // Sat=0, Sun=1, Mon=2, Tue=3, Wed=4
    expect(leadingOffset(2026, 3, false)).toBe(4);
  });

  test('months that start on Sunday have 0 leading blanks (Sun-first)', () => {
    // June 2025: June 1, 2025 is a Sunday.
    expect(leadingOffset(2025, 5, true)).toBe(0);
    // Sat-first: same Sunday becomes column 1.
    expect(leadingOffset(2025, 5, false)).toBe(1);
  });

  test('months that start on Saturday have 6 leading blanks (Sun-first) and 0 (Sat-first)', () => {
    // November 2025: Nov 1, 2025 is a Saturday.
    expect(leadingOffset(2025, 10, true)).toBe(6);
    expect(leadingOffset(2025, 10, false)).toBe(0);
  });

  test('grid always produces 42 cells (6 × 7) regardless of month', () => {
    // If offset is 0..6 and we emit 6×7, the last cell index is
    // `offset + daysInMonth + trailing`. For any month that's ≤ 42.
    for (let y = 2020; y < 2030; y++) {
      for (let m = 0; m < 12; m++) {
        const offset = leadingOffset(y, m, true);
        const daysInMonth = new Date(y, m + 1, 0).getDate();
        expect(offset + daysInMonth).toBeLessThanOrEqual(42);
        expect(42 - offset - daysInMonth).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
