import * as Notifications from 'expo-notifications';
import { calculateSunset, JERUSALEM_LAT, JERUSALEM_LON } from '../engine/sunset';
import { isErevShabbat, getNextSabbath } from '../engine/sabbath';
import type { Feast } from '../engine/feasts';
import type { UserPreferences } from '../types/user.types';

export interface NotificationContext {
  latitude?: number;
  longitude?: number;
  preferences: UserPreferences;
}

Notifications.setNotificationHandler({
  handleNotification: async () =>
    ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }) as Notifications.NotificationBehavior,
});

export async function ensurePermissions(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.granted;
}

function fmtTime(d: Date): string {
  const hours = d.getHours();
  const mins = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = ((hours + 11) % 12) + 1;
  return `${h}:${mins.toString().padStart(2, '0')} ${ampm}`;
}

export async function scheduleAllNotifications(
  feasts: Feast[],
  ctx: NotificationContext
): Promise<{ scheduled: number }> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!ctx.preferences.notificationsEnabled) return { scheduled: 0 };

  const lat = ctx.latitude ?? JERUSALEM_LAT;
  const lon = ctx.longitude ?? JERUSALEM_LON;
  let count = 0;

  // === Sabbath warnings: every Friday at 4pm for the next 8 weeks ===
  if (ctx.preferences.sabbathRemindersEnabled) {
    const now = new Date();
    let cursor = new Date(now);
    for (let i = 0; i < 8; i++) {
      // Find next Friday
      while (!isErevShabbat(cursor)) {
        cursor.setDate(cursor.getDate() + 1);
      }
      const triggerDate = new Date(
        cursor.getFullYear(),
        cursor.getMonth(),
        cursor.getDate(),
        16,
        0,
        0
      );
      if (triggerDate.getTime() > now.getTime()) {
        const sat = getNextSabbath(cursor);
        const sunset = calculateSunset(cursor, lat, lon);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Prepare for Shabbat',
            body: `Shabbat begins at sunset (${fmtTime(sunset)}). Prepare your heart and home.`,
            data: { type: 'sabbath_warning', sabbathDate: sat.toISOString() },
          },
          trigger: triggerDate as unknown as Notifications.NotificationTriggerInput,
        });
        count++;
      }
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  // === Feast warnings ===
  if (ctx.preferences.feastRemindersEnabled) {
    const now = new Date();
    for (const f of feasts) {
      const start = f.startDate;
      if (start.getTime() < now.getTime()) continue;

      // Compute sunset on the day BEFORE startDate (since startDate is the day-of, biblical day begins at sunset prev evening per spec)
      const startSunset = calculateSunset(start, lat, lon);

      // 1-hour warning
      const oneHourBefore = new Date(startSunset.getTime() - 60 * 60 * 1000);
      if (oneHourBefore.getTime() > now.getTime()) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `${f.name} approaches`,
            body: `${f.name} begins at sunset in 1 hour. Prepare your heart.`,
            data: { type: 'feast_warning', feastKey: f.key },
          },
          trigger: oneHourBefore as unknown as Notifications.NotificationTriggerInput,
        });
        count++;
      }

      // Feast start at sunset
      if (startSunset.getTime() > now.getTime()) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Feast Mode',
            body: `${f.name} has begun. ${f.hebrewName} — Chag Sameach!`,
            data: { type: 'feast_start', feastKey: f.key },
          },
          trigger: startSunset as unknown as Notifications.NotificationTriggerInput,
        });
        count++;
      }
    }
  }

  // === Daily morning check-in at 7am ===
  if (ctx.preferences.dailyCheckinEnabled) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Good morning, pilgrim',
        body: 'Begin your day in the Word. Tap to check in.',
        data: { type: 'daily_checkin' },
      },
      trigger: {
        hour: 7,
        minute: 0,
        repeats: true,
      } as unknown as Notifications.NotificationTriggerInput,
    });
    count++;
  }

  return { scheduled: count };
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
