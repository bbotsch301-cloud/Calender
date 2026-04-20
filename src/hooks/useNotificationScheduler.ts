import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useAuthStore } from '../store/useAuthStore';
import { useCalendarStore } from '../store/useCalendarStore';
import { useFeastStore } from '../store/useFeastStore';
import { getUserProfile } from '../supabase/queries';
import { ensurePermissions, scheduleAllNotifications } from '../notifications/scheduler';
import type { UserPreferences } from '../types/user.types';

const DEFAULT_PREFS: UserPreferences = {
  notificationsEnabled: true,
  sabbathRemindersEnabled: true,
  feastRemindersEnabled: true,
  dailyCheckinEnabled: true,
  preferredView: 'biblical',
  hebrewNumerals: false,
};

/**
 * Mounted once at the root of the authenticated app: ensures notification
 * permissions and (re)schedules all sabbath/feast/daily reminders whenever
 * the user, location, feasts, or preferences change. Also re-runs on
 * foreground to pick up any OS-level permission changes.
 */
export function useNotificationScheduler(): void {
  const user = useAuthStore((s) => s.user);
  const latitude = useCalendarStore((s) => s.latitude);
  const longitude = useCalendarStore((s) => s.longitude);
  const allFeasts = useFeastStore((s) => s.allFeasts);
  const lastKeyRef = useRef<string>('');

  async function reschedule(): Promise<void> {
    if (!user) return;
    let prefs: UserPreferences = DEFAULT_PREFS;
    try {
      const profile = await getUserProfile(user.id);
      if (profile) {
        prefs = {
          notificationsEnabled: profile.notificationsEnabled,
          sabbathRemindersEnabled: profile.sabbathRemindersEnabled,
          feastRemindersEnabled: profile.feastRemindersEnabled,
          dailyCheckinEnabled: profile.dailyCheckinEnabled,
          preferredView: 'biblical',
          hebrewNumerals: false,
        };
      }
    } catch {
      /* use defaults; never let a profile-fetch error crash scheduling */
    }
    if (!prefs.notificationsEnabled) {
      await Notifications.cancelAllScheduledNotificationsAsync();
      return;
    }
    const granted = await ensurePermissions();
    if (!granted) return;
    await scheduleAllNotifications(allFeasts, {
      latitude,
      longitude,
      preferences: prefs,
    });
  }

  useEffect(() => {
    if (!user || allFeasts.length === 0) return;
    // Fingerprint so we don't re-schedule on every re-render.
    const key = [user.id, latitude, longitude, allFeasts.length].join('|');
    if (key === lastKeyRef.current) return;
    lastKeyRef.current = key;
    reschedule().catch(() => {});
  }, [user?.id, latitude, longitude, allFeasts.length]);

  // Re-check on foreground in case permissions changed at the OS level.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (next === 'active' && user) {
        reschedule().catch(() => {});
      }
    });
    return () => sub.remove();
  }, [user?.id]);
}
