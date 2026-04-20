import { computeAlignmentScore, type Activity } from '../alignment';

function act(type: Activity['type'], offsetDays: number): Activity {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return { type, date: d };
}

describe('alignment', () => {
  test('returns 0 (not NaN) on empty input', () => {
    const r = computeAlignmentScore([]);
    expect(r.score).toBe(0);
    expect(Number.isFinite(r.score)).toBe(true);
    expect(r.sabbathsKept).toBe(0);
    expect(r.streakDays).toBe(0);
  });

  test('score is always in [0, 100]', () => {
    const many: Activity[] = [];
    for (let i = 0; i < 1000; i++) many.push(act('checkin', i));
    const r = computeAlignmentScore(many);
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(100);
  });

  test('duplicate same-day activities do not double-count', () => {
    const dupes: Activity[] = [
      act('sabbath', 1),
      act('sabbath', 1),
      act('sabbath', 1),
    ];
    const r = computeAlignmentScore(dupes);
    expect(r.sabbathsKept).toBe(1);
  });

  test('streak counts consecutive days ending today', () => {
    const r = computeAlignmentScore([
      act('checkin', 0),
      act('checkin', 1),
      act('checkin', 2),
      act('checkin', 4), // gap
    ]);
    expect(r.streakDays).toBe(3);
  });
});
