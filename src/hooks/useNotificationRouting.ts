import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { navigate } from '../navigation/navigationRef';

/**
 * Listens for notification taps and routes to the right screen.
 * Safe to mount once at the root of the authenticated navigator.
 */
export function useNotificationRouting(): void {
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = (response.notification.request.content.data ?? {}) as {
        type?: string;
        feastKey?: string;
      };
      if (!data.type) return;
      try {
        if (data.type === 'feast_warning' || data.type === 'feast_start') {
          if (data.feastKey) {
            navigate('EventDetail', {
              feastKey: data.feastKey,
              year: new Date().getFullYear(),
            });
          }
        } else if (data.type === 'daily_checkin') {
          navigate('DailyView', { dateISO: new Date().toISOString() });
        } else if (data.type === 'sabbath_warning') {
          navigate('DailyView', { dateISO: new Date().toISOString() });
        } else if (data.type === 'omer_reminder') {
          navigate('Omer');
        }
      } catch {
        /* swallow — failed routing should never crash the app */
      }
    });

    // If the app was cold-started by tapping a notification, handle that too.
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response) return;
      const data = (response.notification.request.content.data ?? {}) as {
        type?: string;
        feastKey?: string;
      };
      if (!data.type) return;
      // Small delay so the root navigator has mounted.
      setTimeout(() => {
        if (data.type === 'feast_warning' || data.type === 'feast_start') {
          if (data.feastKey) {
            navigate('EventDetail', {
              feastKey: data.feastKey,
              year: new Date().getFullYear(),
            });
          }
        } else if (data.type === 'daily_checkin' || data.type === 'sabbath_warning') {
          navigate('DailyView', { dateISO: new Date().toISOString() });
        } else if (data.type === 'omer_reminder') {
          navigate('Omer');
        }
      }, 400);
    });

    return () => sub.remove();
  }, []);
}
