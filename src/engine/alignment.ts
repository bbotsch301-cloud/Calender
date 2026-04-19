/**
 * Alignment Score Engine.
 * Computes a 0-100 score reflecting how well the user's observance aligns with
 * the biblical calendar.
 *
 * Formula: (sabbathsKept * 40 + feastsEngaged * 40 + checkIns * 20) / maxPossible * 100
 *
 * Where maxPossible is the theoretical maximum given the date range.
 */

export type ActivityType = 'sabbath' | 'feast' | 'checkin' | 'scripture' | 'fast';

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
  const sabbathsKept = activities.filter((a) => a.type === 'sabbath').length;
  const feastsEngaged = activities.filter((a) => a.type === 'feast').length;
  const checkIns = activities.filter((a) => a.type === 'checkin').length;
  const scripturesRead = activities.filter((a) => a.type === 'scripture').length;
  const fasts = activities.filter((a) => a.type === 'fast').length;

  // Compute date range (most recent 90-day window)
  const now = Date.now();
  const ninetyDaysAgo = now - 90 * 86400000;
  const recent = activities.filter((a) => a.date.getTime() >= ninetyDaysAgo);

  const recentSabbaths = recent.filter((a) => a.type === 'sabbath').length;
  const recentFeasts = recent.filter((a) => a.type === 'feast').length;
  const recentCheckIns = recent.filter((a) => a.type === 'checkin').length;

  // Max possible in 90 days: ~13 sabbaths, ~2 feasts, 90 checkins
  const possibleSabbaths = 13;
  const possibleFeasts = 2;
  const possibleCheckIns = 90;

  const sabbathScore = Math.min(recentSabbaths / possibleSabbaths, 1) * WEIGHTS.sabbath;
  const feastScore = Math.min(recentFeasts / Math.max(possibleFeasts, 1), 1) * WEIGHTS.feast;
  const checkinScore = Math.min(recentCheckIns / possibleCheckIns, 1) * WEIGHTS.checkin;

  const rawScore = sabbathScore + feastScore + checkinScore;
  const score = Math.round(Math.min(100, Math.max(0, rawScore)));

  return {
    score,
    streakDays: computeStreak(activities),
    sabbathsKept,
    feastsEngaged,
    checkIns,
    scripturesRead,
  };
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
