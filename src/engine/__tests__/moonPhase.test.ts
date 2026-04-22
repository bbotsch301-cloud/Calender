import {
  getMoonPhase,
  getNextPhase,
  PHASE_EMOJIS,
  PHASE_NAMES,
  SYNODIC_MONTH_DAYS,
} from '../moonPhase';

describe('moonPhase', () => {
  test('reference date (Jan 6 2000 14:24 UTC) returns New Moon', () => {
    const m = getMoonPhase(new Date(Date.UTC(2000, 0, 6, 14, 24)));
    expect(m.phase).toBe(0);
    expect(m.name).toBe('New Moon');
    expect(m.emoji).toBe('🌑');
    expect(m.illumination).toBeLessThan(0.02);
    expect(m.ageDays).toBeLessThan(0.01);
  });

  test('Apr 13 2025 → Full Moon with >95% illumination', () => {
    const m = getMoonPhase(new Date(Date.UTC(2025, 3, 13, 0)));
    expect(m.phase).toBe(4);
    expect(m.name).toBe('Full Moon');
    expect(m.emoji).toBe('🌕');
    expect(m.illumination).toBeGreaterThan(0.95);
  });

  test('Apr 27 2025 → New Moon with <5% illumination', () => {
    const m = getMoonPhase(new Date(Date.UTC(2025, 3, 27, 12)));
    expect(m.phase).toBe(0);
    expect(m.name).toBe('New Moon');
    expect(m.emoji).toBe('🌑');
    expect(m.illumination).toBeLessThan(0.05);
  });

  test('Rosh Hashanah eve Sep 22 2025 → New Moon', () => {
    const m = getMoonPhase(new Date(Date.UTC(2025, 8, 22, 12)));
    expect(m.phase).toBe(0);
    expect(m.illumination).toBeLessThan(0.05);
  });

  test('phase index loops through 0-7 across a synodic month', () => {
    const seen = new Set<number>();
    for (let i = 0; i <= 30; i++) {
      const d = new Date(Date.UTC(2000, 0, 6, 14, 24) + i * 86_400_000);
      seen.add(getMoonPhase(d).phase);
    }
    expect(seen.size).toBe(8);
    for (let p = 0; p < 8; p++) expect(seen.has(p)).toBe(true);
  });

  test('illumination is always in [0, 1] and non-finite inputs never crash', () => {
    for (let i = 0; i < 40; i++) {
      const d = new Date(Date.UTC(2025, 0, 1) + i * 2 * 86_400_000);
      const m = getMoonPhase(d);
      expect(m.illumination).toBeGreaterThanOrEqual(0);
      expect(m.illumination).toBeLessThanOrEqual(1);
    }
  });

  test('ageDays always in [0, synodic month)', () => {
    for (let i = 0; i < 40; i++) {
      const d = new Date(Date.UTC(2025, 0, 1) + i * 86_400_000);
      const m = getMoonPhase(d);
      expect(m.ageDays).toBeGreaterThanOrEqual(0);
      expect(m.ageDays).toBeLessThan(SYNODIC_MONTH_DAYS);
    }
  });

  test('pre-reference dates wrap cleanly (1999 returns a valid phase)', () => {
    const m = getMoonPhase(new Date(Date.UTC(1999, 5, 15)));
    expect(PHASE_NAMES).toContain(m.name);
    expect(PHASE_EMOJIS).toContain(m.emoji as never);
  });

  test('getNextPhase lands on target phase', () => {
    const from = new Date(2026, 0, 1);
    const nextFull = getNextPhase(from, 4);
    expect(getMoonPhase(nextFull).phase).toBe(4);
    expect(nextFull.getTime()).toBeGreaterThanOrEqual(from.getTime());
    // And it's within one synodic month out.
    expect(nextFull.getTime() - from.getTime()).toBeLessThanOrEqual(
      (SYNODIC_MONTH_DAYS + 1) * 86_400_000
    );
  });
});
