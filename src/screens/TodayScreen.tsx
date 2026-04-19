import React from 'react';
import { View, ScrollView, Pressable, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../constants/colors';
import { DualDateHeader } from '../components/shared/DualDateHeader';
import { CountdownTimer } from '../components/shared/CountdownTimer';
import { SabbathBadge } from '../components/shared/SabbathBadge';
import { DarkCard } from '../components/ui/DarkCard';
import { GoldText } from '../components/ui/GoldText';
import { GlowPulse } from '../components/shared/GlowPulse';
import { useCurrentDay } from '../hooks/useCurrentDay';
import { useAlignment } from '../hooks/useAlignment';
import { getScriptureForDay } from '../constants/scriptures';
import { FeastModeOverlay } from '../components/feast/FeastModeOverlay';
import type { RootStackParamList } from '../navigation/RootNavigator';

function fmtTime(d: Date): string {
  const hours = d.getHours();
  const mins = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = ((hours + 11) % 12) + 1;
  return `${h}:${mins.toString().padStart(2, '0')} ${ampm}`;
}

export function TodayScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const day = useCurrentDay();
  const { logActivity, streak } = useAlignment();
  const dayOfYear = Math.floor(
    (day.gregorianDate.getTime() - new Date(day.gregorianDate.getFullYear(), 0, 1).getTime()) / 86400000
  );
  const scripture = getScriptureForDay(day.hebrewDate.month, dayOfYear);

  function onCheckIn() {
    logActivity('checkin');
    Alert.alert('Check-in', 'Today is recorded.');
  }
  function onScripture() {
    logActivity('scripture');
    Alert.alert('Scripture', 'Logged.');
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <DualDateHeader date={day.gregorianDate} />

        {day.activeFeast && <FeastModeOverlay feast={day.activeFeast} />}

        {day.isSabbath && (
          <View style={{ paddingHorizontal: 20, marginTop: 4 }}>
            <SabbathBadge />
          </View>
        )}

        {/* Countdown */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <DarkCard>
            <CountdownTimer target={day.nextDayBegins} label="Next biblical day in" />
            <View style={{ marginTop: 8, alignItems: 'center' }}>
              <Text style={{ color: Colors.textMuted, fontSize: 11 }}>
                Sunset today: {fmtTime(day.sunsetToday)}
              </Text>
            </View>
          </DarkCard>
        </View>

        {/* Streak */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <DarkCard>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <GlowPulse color={Colors.gold} size={48} active>
                <Text style={{ fontSize: 22 }}>🔥</Text>
              </GlowPulse>
              <View style={{ marginLeft: 16, flex: 1 }}>
                <Text style={{ color: Colors.textMuted, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>
                  Walking Streak
                </Text>
                <GoldText size="2xl" weight="bold" style={{ marginTop: 2 }}>
                  {streak} {streak === 1 ? 'day' : 'days'}
                </GoldText>
              </View>
            </View>
          </DarkCard>
        </View>

        {/* Scripture */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <GoldText size="sm" weight="bold" style={{ marginBottom: 8, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Today's Scripture
          </GoldText>
          <DarkCard>
            <Text style={{ color: Colors.text, fontSize: 15, lineHeight: 22, fontStyle: 'italic' }}>
              "{scripture.text}"
            </Text>
            <GoldText size="sm" weight="bold" style={{ marginTop: 10 }}>
              — {scripture.reference}
            </GoldText>
          </DarkCard>
        </View>

        {/* Actions */}
        <View style={{ paddingHorizontal: 16, marginTop: 18, gap: 10 }}>
          <ActionButton label="✦ Daily Check-In" primary onPress={onCheckIn} />
          <ActionButton label="📖 Mark Scripture Read" onPress={onScripture} />
          <ActionButton
            label="View Today's Detail"
            onPress={() =>
              navigation.navigate('DailyView', { dateISO: day.gregorianDate.toISOString() })
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ActionButton({
  label,
  onPress,
  primary,
}: {
  label: string;
  onPress: () => void;
  primary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: primary ? Colors.gold : Colors.surface,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: primary ? 0 : 1,
        borderColor: Colors.border,
        opacity: pressed ? 0.85 : 1,
      })}>
      <Text
        style={{
          color: primary ? Colors.background : Colors.text,
          fontSize: 13,
          fontWeight: '700',
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        }}>
        {label}
      </Text>
    </Pressable>
  );
}
