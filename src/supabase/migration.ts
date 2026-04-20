/**
 * One-time migration of guest-mode data (AsyncStorage) into the Supabase
 * account after the user signs up or signs in.
 *
 * Called from useAuthStore after a successful authenticated session. Safely
 * no-ops if there is no guest data, Supabase is not configured, or the
 * migration has already completed for this userId.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from './client';
import type { ActivityLog } from '../types/user.types';

const ACTIVITY_KEY = 'kingdom-calendar:activity';
const PROFILE_KEY_PREFIX = 'kingdom-calendar:profile:';
const MIGRATED_KEY_PREFIX = 'kingdom-calendar:migrated:';

export async function migrateGuestDataToAccount(userId: string): Promise<{
  migratedActivities: number;
  migratedProfile: boolean;
}> {
  if (!isSupabaseConfigured || !userId || userId.startsWith('guest-')) {
    return { migratedActivities: 0, migratedProfile: false };
  }
  const migratedKey = `${MIGRATED_KEY_PREFIX}${userId}`;
  const already = await AsyncStorage.getItem(migratedKey);
  if (already === '1') return { migratedActivities: 0, migratedProfile: false };

  let migratedActivities = 0;
  let migratedProfile = false;

  // Migrate activity log.
  const raw = await AsyncStorage.getItem(ACTIVITY_KEY);
  if (raw) {
    try {
      const arr = JSON.parse(raw) as ActivityLog[];
      if (Array.isArray(arr) && arr.length > 0) {
        const rows = arr.map((a) => ({
          // Generate new ids server-side so we don't collide with existing.
          id: `mig-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
          user_id: userId,
          type: a.type,
          activity_date: new Date(a.date).toISOString(),
          feast_key: a.feastKey ?? null,
          notes: a.notes ?? null,
        }));
        // Chunk inserts to avoid payload limits.
        for (let i = 0; i < rows.length; i += 100) {
          const chunk = rows.slice(i, i + 100);
          const { error } = await supabase.from('user_activity').insert(chunk);
          if (!error) migratedActivities += chunk.length;
        }
        // Only clear local after successful push.
        if (migratedActivities > 0) await AsyncStorage.removeItem(ACTIVITY_KEY);
      }
    } catch {
      // Corrupted local data — skip silently rather than block login.
    }
  }

  // Migrate any guest-profile prefs that should persist to the new account.
  const keys = await AsyncStorage.getAllKeys();
  const profileKeys = keys.filter((k) => k.startsWith(PROFILE_KEY_PREFIX) && k.includes('guest-'));
  for (const k of profileKeys) {
    const pRaw = await AsyncStorage.getItem(k);
    if (!pRaw) continue;
    try {
      const p = JSON.parse(pRaw) as {
        latitude?: number | null;
        longitude?: number | null;
        notificationsEnabled?: boolean;
        sabbathRemindersEnabled?: boolean;
        feastRemindersEnabled?: boolean;
        dailyCheckinEnabled?: boolean;
      };
      const { error } = await supabase.from('users').upsert({
        id: userId,
        latitude: p.latitude ?? null,
        longitude: p.longitude ?? null,
        notifications_enabled: p.notificationsEnabled ?? true,
        sabbath_reminders_enabled: p.sabbathRemindersEnabled ?? true,
        feast_reminders_enabled: p.feastRemindersEnabled ?? true,
        daily_checkin_enabled: p.dailyCheckinEnabled ?? true,
        updated_at: new Date().toISOString(),
      });
      if (!error) {
        migratedProfile = true;
        await AsyncStorage.removeItem(k);
      }
    } catch {
      /* skip corrupted entries */
    }
  }

  await AsyncStorage.setItem(migratedKey, '1');
  return { migratedActivities, migratedProfile };
}

/**
 * Called from signOut to wipe any lingering guest-mode caches. Does not
 * touch authenticated-user caches (which are keyed by uuid).
 */
export async function clearGuestCaches(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const guestKeys = keys.filter(
    (k) =>
      k === 'kingdom-calendar:guest-user' ||
      k === ACTIVITY_KEY ||
      k.startsWith(`${PROFILE_KEY_PREFIX}guest-`)
  );
  if (guestKeys.length > 0) await AsyncStorage.multiRemove(guestKeys);
}
