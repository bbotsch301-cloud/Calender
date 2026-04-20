import { getMoonPhase, getNextPrimaryPhase } from '../moonPhase';

describe('moonPhase', () => {
  test('Apr 13 2025 is a Full Moon (>95% illumination)', () => {
    const m = getMoonPhase(new Date(Date.UTC(2025, 3, 13, 12)));
    expect(m.name).toBe('Full Moon');
    expect(m.illumination).toBeGreaterThan(0.95);
  });

  test('Apr 27 2025 is a New Moon (<5% illumination)', () => {
    const m = getMoonPhase(new Date(Date.UTC(2025, 3, 27, 12)));
    expect(m.name).toBe('New Moon');
    expect(m.illumination).toBeLessThan(0.05);
  });

  test('Rosh Hashanah eve Sep 22 2025 is a New Moon', () => {
    const m = getMoonPhase(new Date(Date.UTC(2025, 8, 22, 12)));
    expect(m.name).toBe('New Moon');
    expect(m.illumination).toBeLessThan(0.05);
  });

  test('phase wraps cleanly across 29.5-day boundary', () => {
    const a = getMoonPhase(new Date(Date.UTC(2025, 3, 13, 12)));
    const b = getMoonPhase(new Date(Date.UTC(2025, 3, 13 + 29, 12)));
    // Roughly one synodic period later → similar illumination.
    expect(Math.abs(a.illumination - b.illumination)).toBeLessThan(0.1);
  });

  test('getNextPrimaryPhase lands on target phase name', () => {
    const next = getNextPrimaryPhase(new Date(2026, 0, 1), 'Full Moon');
    const at = getMoonPhase(next);
    // Should be within the Full Moon band (≥~95% illumination).
    expect(at.illumination).toBeGreaterThan(0.95);
  });
});
