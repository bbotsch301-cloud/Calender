import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from './client';
import { computeFeastsForYear, type Feast } from '../engine/feasts';
import { gregorianToHebrew } from '../engine/hebrewCalendar';
import { isSabbath } from '../engine/sabbath';
import type { ActivityLog, AlignmentStats, UserProfile } from '../types/user.types';
import { computeAlignmentScore, type Activity, type ActivityType } from '../engine/alignment';
import { useNetworkStore, isNetworkError } from '../store/useNetworkStore';
import { clampNotes } from '../security/validators';

function reportSupabaseError(e: unknown): void {
  if (isNetworkError(e)) {
    useNetworkStore
      .getState()
      .recordError(e instanceof Error ? e.message : String(e));
  }
}

function recordSuccess(): void {
  const s = useNetworkStore.getState();
  if (s.consecutiveFailures > 0) s.clearError();
}

const ACTIVITY_KEY = 'kingdom-calendar:activity';
const PROFILE_KEY = 'kingdom-calendar:profile';

export async function getFeastsForYear(year: number): Promise<Feast[]> {
  return computeFeastsForYear(year);
}

export async function getCalendarDay(date: Date): Promise<{
  date: Date;
  hebrewDate: ReturnType<typeof gregorianToHebrew>;
  isSabbath: boolean;
  feast: Feast | null;
}> {
  const hebrewDate = gregorianToHebrew(date);
  const sabbath = isSabbath(date);
  const feasts = computeFeastsForYear(date.getFullYear());
  const feast =
    feasts.find((f) => {
      const start = new Date(f.startDate.getFullYear(), f.startDate.getMonth(), f.startDate.getDate());
      const end = new Date(f.endDate.getFullYear(), f.endDate.getMonth(), f.endDate.getDate());
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      return d.getTime() >= start.getTime() && d.getTime() <= end.getTime();
    }) || null;

  return { date, hebrewDate, isSabbath: sabbath, feast };
}

/**
 * Duplicate-activity key: `sabbath`, `feast`, `checkin`, `scripture`, and
 * `fast` are deduplicated per calendar day. `omer_count` is deduplicated
 * per (date + notes) since the notes encode the day number. `feast` is
 * additionally deduplicated by feast key so two feasts on the same day
 * each count once.
 */
function dedupeKey(
  type: ActivityType,
  date: Date,
  metadata?: { feastKey?: string; notes?: string }
): string {
  const dayKey = date.toISOString().split('T')[0];
  if (type === 'feast') return `feast:${dayKey}:${metadata?.feastKey ?? ''}`;
  if (type === 'omer_count') return `omer_count:${dayKey}:${metadata?.notes ?? ''}`;
  return `${type}:${dayKey}`;
}

export async function logActivity(
  userId: string,
  type: ActivityType,
  date: Date,
  metadata?: { feastKey?: string; notes?: string }
): Promise<ActivityLog> {
  // Sanitize free-text notes so untrusted content can't be oversized or
  // contain control characters that would break queries / UI rendering.
  const safeNotes = metadata?.notes ? clampNotes(metadata.notes) : undefined;
  const safeFeastKey = metadata?.feastKey ? metadata.feastKey.slice(0, 40) : undefined;
  const sanitized = { feastKey: safeFeastKey, notes: safeNotes };
  const log: ActivityLog = {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userId,
    type,
    date,
    feastKey: safeFeastKey,
    notes: safeNotes,
    createdAt: new Date(),
  };
  const key = dedupeKey(type, date, sanitized);

  if (isSupabaseConfigured && !userId.startsWith('guest-')) {
    try {
      // Check for existing record for this dedupe key in the last 48h window.
      const since = new Date(Date.now() - 2 * 86400000).toISOString();
      const { data: existing, error: selErr } = await supabase
        .from('user_activity')
        .select('id, type, activity_date, feast_key, notes, created_at, user_id')
        .eq('user_id', userId)
        .eq('type', type)
        .gte('activity_date', since);
      if (selErr) throw selErr;
      const match = (existing ?? []).find(
        (r) =>
          dedupeKey(r.type as ActivityType, new Date(r.activity_date as string), {
            feastKey: (r.feast_key as string) ?? undefined,
            notes: (r.notes as string) ?? undefined,
          }) === key
      );
      if (match) {
        recordSuccess();
        return rowToActivity(match as Record<string, unknown>);
      }

      const { error } = await supabase.from('user_activity').insert({
        id: log.id,
        user_id: userId,
        type,
        activity_date: date.toISOString(),
        feast_key: safeFeastKey ?? null,
        notes: safeNotes ?? null,
      });
      if (error) throw error;
      recordSuccess();
      return log;
    } catch (e) {
      reportSupabaseError(e);
      // Fall through to local cache so the user's action isn't lost.
    }
  }

  // Guest / local fallback — also deduped.
  const existing = await getLocalActivity();
  const dupe = existing.find(
    (e) => dedupeKey(e.type, new Date(e.date), { feastKey: e.feastKey, notes: e.notes }) === key
  );
  if (dupe) return dupe;
  existing.push(log);
  await AsyncStorage.setItem(ACTIVITY_KEY, JSON.stringify(existing));
  return log;
}

export async function getActivityHistory(userId: string, days = 90): Promise<ActivityLog[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  if (isSupabaseConfigured && !userId.startsWith('guest-')) {
    try {
      const { data, error } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', userId)
        .gte('activity_date', since.toISOString())
        .order('activity_date', { ascending: false });
      if (error) throw error;
      recordSuccess();
      return (data ?? []).map(rowToActivity);
    } catch (e) {
      reportSupabaseError(e);
      // Fall through to local cache.
    }
  }

  const local = await getLocalActivity();
  return local
    .filter((l) => new Date(l.date).getTime() >= since.getTime())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Deletes all activity for a user (for "Reset my alignment" flows).
 * On guest accounts wipes AsyncStorage; on Supabase accounts deletes rows.
 */
export async function resetAlignment(userId: string): Promise<void> {
  if (isSupabaseConfigured && !userId.startsWith('guest-')) {
    try {
      const { error } = await supabase.from('user_activity').delete().eq('user_id', userId);
      if (error) throw error;
      recordSuccess();
      return;
    } catch (e) {
      reportSupabaseError(e);
      throw e;
    }
  }
  await AsyncStorage.removeItem(ACTIVITY_KEY);
}

export async function getAlignmentScore(userId: string): Promise<AlignmentStats> {
  const history = await getActivityHistory(userId, 90);
  const activities: Activity[] = history.map((h) => ({
    type: h.type,
    date: new Date(h.date),
  }));
  const result = computeAlignmentScore(activities);
  return { ...result, lastUpdated: new Date() };
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (isSupabaseConfigured && !userId.startsWith('guest-')) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (error) throw error;
      recordSuccess();
      if (!data) return null;
      return rowToProfile(data);
    } catch (e) {
      reportSupabaseError(e);
      // Fall through to local cache if present.
    }
  }
  const stored = await AsyncStorage.getItem(`${PROFILE_KEY}:${userId}`);
  if (stored) {
    try {
      return JSON.parse(stored) as UserProfile;
    } catch {
      return null;
    }
  }
  return null;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile> {
  const existing = (await getUserProfile(userId)) ?? makeDefaultProfile(userId);
  const merged: UserProfile = {
    ...existing,
    ...updates,
    id: userId,
    updatedAt: new Date(),
  };

  if (isSupabaseConfigured && !userId.startsWith('guest-')) {
    try {
      const { error } = await supabase.from('users').upsert({
        id: userId,
        email: merged.email,
        display_name: merged.displayName,
        latitude: merged.latitude,
        longitude: merged.longitude,
        timezone: merged.timezone,
        notifications_enabled: merged.notificationsEnabled,
        sabbath_reminders_enabled: merged.sabbathRemindersEnabled,
        feast_reminders_enabled: merged.feastRemindersEnabled,
        daily_checkin_enabled: merged.dailyCheckinEnabled,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      recordSuccess();
      // Also cache locally so the profile is available offline.
      await AsyncStorage.setItem(`${PROFILE_KEY}:${userId}`, JSON.stringify(merged));
      return merged;
    } catch (e) {
      reportSupabaseError(e);
      // Persist locally as a best-effort fallback; will resync on next success.
    }
  }
  await AsyncStorage.setItem(`${PROFILE_KEY}:${userId}`, JSON.stringify(merged));
  return merged;
}

// === Helpers ===

async function getLocalActivity(): Promise<ActivityLog[]> {
  const raw = await AsyncStorage.getItem(ACTIVITY_KEY);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw) as ActivityLog[];
    return arr.map((a) => ({ ...a, date: new Date(a.date), createdAt: new Date(a.createdAt) }));
  } catch {
    return [];
  }
}

function rowToActivity(row: Record<string, unknown>): ActivityLog {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    type: row.type as ActivityType,
    date: new Date(row.activity_date as string),
    feastKey: (row.feast_key as string) ?? undefined,
    notes: (row.notes as string) ?? undefined,
    createdAt: new Date(row.created_at as string),
  };
}

function rowToProfile(row: Record<string, unknown>): UserProfile {
  return {
    id: row.id as string,
    email: (row.email as string) ?? null,
    displayName: (row.display_name as string) ?? null,
    isGuest: false,
    latitude: (row.latitude as number) ?? null,
    longitude: (row.longitude as number) ?? null,
    timezone: (row.timezone as string) ?? null,
    notificationsEnabled: (row.notifications_enabled as boolean) ?? true,
    sabbathRemindersEnabled: (row.sabbath_reminders_enabled as boolean) ?? true,
    feastRemindersEnabled: (row.feast_reminders_enabled as boolean) ?? true,
    dailyCheckinEnabled: (row.daily_checkin_enabled as boolean) ?? true,
    createdAt: new Date((row.created_at as string) ?? Date.now()),
    updatedAt: new Date((row.updated_at as string) ?? Date.now()),
  };
}

function makeDefaultProfile(userId: string): UserProfile {
  return {
    id: userId,
    email: null,
    displayName: null,
    isGuest: userId.startsWith('guest-'),
    latitude: null,
    longitude: null,
    timezone: null,
    notificationsEnabled: true,
    sabbathRemindersEnabled: true,
    feastRemindersEnabled: true,
    dailyCheckinEnabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
