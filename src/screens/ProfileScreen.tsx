import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { GoldText } from '../components/ui/GoldText';
import { DarkCard } from '../components/ui/DarkCard';
import { AlignmentScore } from '../components/shared/AlignmentScore';
import { useAlignment } from '../hooks/useAlignment';
import { useAuthStore } from '../store/useAuthStore';
import { getUserProfile, resetAlignment, updateUserProfile } from '../supabase/queries';
import { useAlignmentStore } from '../store/useAlignmentStore';
import { requestLocationPermission } from '../hooks/useSunset';
import { useCalendarStore } from '../store/useCalendarStore';
import type { UserProfile } from '../types/user.types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ACT_LABEL: Record<string, string> = {
  sabbath: 'Sabbath kept',
  feast: 'Feast observed',
  checkin: 'Daily check-in',
  scripture: 'Scripture read',
  fast: 'Fast observed',
};

export function ProfileScreen() {
  const { user, signOut } = useAuthStore();
  const { score, streak, sabbathsKept, feastsEngaged, checkIns, scripturesRead, recentActivity } =
    useAlignment();
  const setLocation = useCalendarStore((s) => s.setLocation);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (user?.id) {
      getUserProfile(user.id)
        .then((p) => {
          if (!cancelled) setProfile(p);
        })
        .catch(() => {
          // Profile is best-effort; a transient failure shouldn't block the screen.
          if (!cancelled) setProfile(null);
        });
    }
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  async function togglePref(key: keyof UserProfile, value: boolean): Promise<void> {
    if (!user?.id) return;
    try {
      const next = await updateUserProfile(user.id, { [key]: value } as Partial<UserProfile>);
      setProfile(next);
    } catch {
      Alert.alert('Could not save', 'Your change will be retried when you are back online.');
    }
  }

  function onResetAlignment(): void {
    if (!user?.id) return;
    Alert.alert(
      'Reset alignment?',
      'This deletes every check-in, sabbath, feast, and Omer record on this account. You can start fresh, but this cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetAlignment(user.id);
              useAlignmentStore.getState().fetchStats();
              Alert.alert('Reset complete', 'Your alignment has been cleared.');
            } catch {
              Alert.alert('Could not reset', 'Try again when you are online.');
            }
          },
        },
      ]
    );
  }

  async function onLocation() {
    const r = await requestLocationPermission();
    if (!r.granted || r.latitude === null || r.longitude === null) {
      Alert.alert(
        'Permission denied',
        'Location is needed for accurate sunset times. Falling back to Jerusalem.'
      );
      return;
    }
    setLocation(r.latitude, r.longitude);
    if (user?.id) {
      const next = await updateUserProfile(user.id, {
        latitude: r.latitude,
        longitude: r.longitude,
      });
      setProfile(next);
    }
    Alert.alert('Location set', 'Sunset times will now use your location.');
  }

  function onSignOut() {
    Alert.alert('Sign out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => signOut() },
    ]);
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
          <Text style={{ color: Colors.textMuted, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>
            Profile
          </Text>
          <Text
            style={{
              color: Colors.text,
              fontSize: 26,
              fontWeight: '800',
              marginTop: 4,
            }}>
            {user?.displayName ?? user?.email ?? 'Pilgrim'}
          </Text>
          {user?.isGuest && (
            <Text style={{ color: Colors.textMuted, fontSize: 12, marginTop: 2 }}>Guest mode</Text>
          )}
        </View>

        {/* Alignment */}
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <AlignmentScore score={score} />
        </View>

        {/* Streak */}
        <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
          <DarkCard>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 26 }}>🔥</Text>
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ color: Colors.textMuted, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                    Current Streak
                  </Text>
                  <GoldText size="xl" weight="bold">
                    {streak} {streak === 1 ? 'day' : 'days'}
                  </GoldText>
                </View>
              </View>
            </View>
          </DarkCard>
        </View>

        {/* Stats Grid */}
        <View style={{ paddingHorizontal: 16, marginTop: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <StatTile label="Sabbaths Kept" value={sabbathsKept} />
          <StatTile label="Feasts Engaged" value={feastsEngaged} />
          <StatTile label="Check-ins" value={checkIns} />
          <StatTile label="Scriptures" value={scripturesRead} />
        </View>

        {/* Recent activity */}
        <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
          <GoldText size="sm" weight="bold" style={{ marginBottom: 8, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Recent Activity
          </GoldText>
          <DarkCard>
            {recentActivity.length === 0 ? (
              <Text style={{ color: Colors.textMuted, fontSize: 13 }}>
                No activity yet. Begin your walk by checking in today.
              </Text>
            ) : (
              recentActivity.slice(0, 8).map((a, idx) => (
                <View
                  key={a.id}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 8,
                    borderBottomWidth: idx === Math.min(7, recentActivity.length - 1) ? 0 : 1,
                    borderBottomColor: Colors.border,
                  }}>
                  <Text style={{ color: Colors.text, fontSize: 13 }}>
                    {ACT_LABEL[a.type] ?? a.type}
                  </Text>
                  <Text style={{ color: Colors.textMuted, fontSize: 12 }}>
                    {MONTHS[new Date(a.date).getMonth()]} {new Date(a.date).getDate()}
                  </Text>
                </View>
              ))
            )}
          </DarkCard>
        </View>

        {/* Settings */}
        <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
          <GoldText size="sm" weight="bold" style={{ marginBottom: 8, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Settings
          </GoldText>
          <DarkCard>
            <SettingRow
              label="Notifications"
              value={profile?.notificationsEnabled ?? true}
              onChange={(v) => togglePref('notificationsEnabled', v)}
            />
            <SettingRow
              label="Sabbath reminders"
              value={profile?.sabbathRemindersEnabled ?? true}
              onChange={(v) => togglePref('sabbathRemindersEnabled', v)}
            />
            <SettingRow
              label="Feast reminders"
              value={profile?.feastRemindersEnabled ?? true}
              onChange={(v) => togglePref('feastRemindersEnabled', v)}
            />
            <SettingRow
              label="Daily check-in"
              value={profile?.dailyCheckinEnabled ?? true}
              onChange={(v) => togglePref('dailyCheckinEnabled', v)}
              last
            />
          </DarkCard>
        </View>

        {/* Location & Sign out */}
        <View style={{ paddingHorizontal: 16, marginTop: 14, gap: 10 }}>
          <Pressable
            onPress={onLocation}
            accessibilityRole="button"
            accessibilityLabel="Set location for sunset calculations"
            style={({ pressed }) => ({
              padding: 14,
              borderRadius: 12,
              backgroundColor: Colors.surface,
              borderWidth: 1,
              borderColor: Colors.border,
              alignItems: 'center',
              opacity: pressed ? 0.85 : 1,
            })}>
            <Text style={{ color: Colors.gold, fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>
              Set Location for Sunset
            </Text>
          </Pressable>

          <Pressable
            onPress={onResetAlignment}
            accessibilityRole="button"
            accessibilityLabel="Reset my alignment data"
            style={({ pressed }) => ({
              padding: 14,
              borderRadius: 12,
              backgroundColor: 'transparent',
              borderWidth: 1,
              borderColor: Colors.border,
              alignItems: 'center',
              opacity: pressed ? 0.85 : 1,
            })}>
            <Text style={{ color: Colors.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>
              Reset My Alignment
            </Text>
          </Pressable>

          <Pressable
            onPress={onSignOut}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
            style={({ pressed }) => ({
              padding: 14,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: Colors.error,
              alignItems: 'center',
              opacity: pressed ? 0.85 : 1,
            })}>
            <Text style={{ color: Colors.error, fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>
              Sign Out
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <View
      style={{
        flex: 1,
        minWidth: '46%',
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: Colors.border,
      }}>
      <GoldText size="2xl" weight="bold">
        {value}
      </GoldText>
      <Text style={{ color: Colors.textMuted, fontSize: 11, letterSpacing: 1, marginTop: 4, textTransform: 'uppercase' }}>
        {label}
      </Text>
    </View>
  );
}

function SettingRow({
  label,
  value,
  onChange,
  last,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  last?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: Colors.border,
      }}>
      <Text style={{ color: Colors.text, fontSize: 14 }}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: Colors.border, true: Colors.goldDark }}
        thumbColor={value ? Colors.gold : Colors.textMuted}
      />
    </View>
  );
}
