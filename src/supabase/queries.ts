import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from './client';
import { computeFeastsForYear, type Feast } from '../engine/feasts';
import { gregorianToHebrew } from '../engine/hebrewCalendar';
import { isSabbath } from '../engine/sabbath';
import type { ActivityLog, AlignmentStats, UserProfile } from '../types/user.types';
import { computeAlignmentScore, type Activity, type ActivityType } from '../engine/alignment';

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

export async function logActivity(
  userId: string,
  type: ActivityType,
  date: Date,
  metadata?: { feastKey?: string; notes?: string }
): Promise<ActivityLog> {
  const log: ActivityLog = {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userId,
    type,
    date,
    feastKey: metadata?.feastKey,
    notes: metadata?.notes,
    createdAt: new Date(),
  };

  if (isSupabaseConfigured && !userId.startsWith('guest-')) {
    const { error } = await supabase.from('user_activity').insert({
      id: log.id,
      user_id: userId,
      type,
      activity_date: date.toISOString(),
      feast_key: metadata?.feastKey ?? null,
      notes: metadata?.notes ?? null,
    });
    if (error) throw error;
    return log;
  }

  // Guest / local fallback
  const existing = await getLocalActivity();
  existing.push(log);
  await AsyncStorage.setItem(ACTIVITY_KEY, JSON.stringify(existing));
  return log;
}

export async function getActivityHistory(userId: string, days = 90): Promise<ActivityLog[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  if (isSupabaseConfigured && !userId.startsWith('guest-')) {
    const { data, error } = await supabase
      .from('user_activity')
      .select('*')
      .eq('user_id', userId)
      .gte('activity_date', since.toISOString())
      .order('activity_date', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToActivity);
  }

  const local = await getLocalActivity();
  return local
    .filter((l) => new Date(l.date).getTime() >= since.getTime())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return rowToProfile(data);
  }
  const stored = await AsyncStorage.getItem(`${PROFILE_KEY}:${userId}`);
  if (stored) return JSON.parse(stored) as UserProfile;
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
  } else {
    await AsyncStorage.setItem(`${PROFILE_KEY}:${userId}`, JSON.stringify(merged));
  }
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
