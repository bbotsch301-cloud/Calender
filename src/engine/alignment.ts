/**
 * Alignment Score Engine.
 * Computes a 0-100 score reflecting how well the user's observance aligns with
 * the biblical calendar.
 *
 * Formula: (sabbathsKept * 40 + feastsEngaged * 40 + checkIns * 20) / maxPossible * 100
 *
 * Where maxPossible is the theoretical maximum given the date range.
 */

export type ActivityType =
  | 'sabbath'
  | 'feast'
  | 'checkin'
  | 'scripture'
  | 'fast'
  | 'omer_count';

export interface Activity {
  type: ActivityType;
  date: Date;
  metadata?: Record<string, unknown>;
}

export interface AlignmentResult {
  score: number;
  streakDays: number;
  sabbathsKept: number;
  feastsEngaged: number;
  checkIns: number;
  scripturesRead: number;
}

const WEIGHTS = {
  sabbath: 40,
  feast: 40,
  checkin: 20,
  scripture: 5,
  fast: 10,
} as const;

export function computeAlignmentScore(activities: Activity[]): AlignmentResult {
  // Count of unique days (dedup) per type — a user can only keep one sabbath
  // per Saturday, engage one feast day per date, check in once per date.
  const countUniqueDays = (type: ActivityType): number => {
    const set = new Set<string>();
    for (const a of activities) {
      if (a.type !== type) continue;
      set.add(a.date.toISOString().split('T')[0]);
    }
    return set.size;
  };

  const sabbathsKept = countUniqueDays('sabbath');
  const feastsEngaged = countUniqueDays('feast');
  const checkIns = countUniqueDays('checkin');
  const scripturesRead = countUniqueDays('scripture');

  // Compute date range (most recent 90-day window), deduped per calendar day.
  const now = Date.now();
  const ninetyDaysAgo = now - 90 * 86400000;
  const recent = activities.filter((a) => a.date.getTime() >= ninetyDaysAgo);

  const recentDayKey = (type: ActivityType): Set<string> => {
    const set = new Set<string>();
    for (const a of recent) {
      if (a.type !== type) continue;
      set.add(a.date.toISOString().split('T')[0]);
    }
    return set;
  };

  const recentSabbaths = recentDayKey('sabbath').size;
  const recentFeasts = recentDayKey('feast').size;
  const recentCheckIns = recentDayKey('checkin').size;

  // Dynamic max-possible over the 90-day window.
  //   ~12-13 Saturdays in any 90-day span, rounded down to be safe.
  //   Feasts: count feasts that actually occurred in the window.
  //   Check-ins: elapsed days since oldest activity, capped at 90.
  const oldestTs = activities.length > 0
    ? Math.min(...activities.map((a) => a.date.getTime()))
    : now;
  const elapsedDays = Math.max(
    1,
    Math.min(90, Math.ceil((now - Math.max(oldestTs, ninetyDaysAgo)) / 86400000))
  );

  const possibleSabbaths = Math.max(1, Math.floor(elapsedDays / 7));
  const possibleFeasts = 2; // There are typically 1-2 feasts per 90-day window.
  const possibleCheckIns = elapsedDays;

  const sabbathScore = clamp01(recentSabbaths / possibleSabbaths) * WEIGHTS.sabbath;
  const feastScore = clamp01(recentFeasts / possibleFeasts) * WEIGHTS.feast;
  const checkinScore = clamp01(recentCheckIns / possibleCheckIns) * WEIGHTS.checkin;

  const rawScore = sabbathScore + feastScore + checkinScore;
  const score = Number.isFinite(rawScore)
    ? Math.round(Math.min(100, Math.max(0, rawScore)))
    : 0;

  return {
    score,
    streakDays: computeStreak(activities),
    sabbathsKept,
    feastsEngaged,
    checkIns,
    scripturesRead,
  };
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function computeStreak(activities: Activity[]): number {
  if (activities.length === 0) return 0;
  const checkInDays = new Set<string>();
  for (const a of activities) {
    if (a.type === 'checkin' || a.type === 'scripture') {
      const key = a.date.toISOString().split('T')[0];
      checkInDays.add(key);
    }
  }
  if (checkInDays.size === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let cursor = new Date(today);

  while (true) {
    const key = cursor.toISOString().split('T')[0];
    if (checkInDays.has(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else if (streak === 0 && cursor.getTime() === today.getTime()) {
      // Allow grace: if no checkin today, start counting from yesterday
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
    if (streak > 365) break;
  }
  return streak;
}
