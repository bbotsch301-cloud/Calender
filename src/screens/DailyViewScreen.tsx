import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, type RouteProp } from '@react-navigation/native';
import { Colors, FeastColors } from '../constants/colors';
import { gregorianToHebrew, formatHebrewDate } from '../engine/hebrewCalendar';
import { isSabbath } from '../engine/sabbath';
import { computeFeastsForYear, getActiveFeast } from '../engine/feasts';
import { calculateSunset } from '../engine/sunset';
import { useCalendarStore } from '../store/useCalendarStore';
import { GoldText } from '../components/ui/GoldText';
import { DarkCard } from '../components/ui/DarkCard';
import { SabbathBadge } from '../components/shared/SabbathBadge';
import { useAlignment } from '../hooks/useAlignment';
import { getScriptureForDay } from '../constants/scriptures';
import type { RootStackParamList } from '../navigation/RootNavigator';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

function fmtTime(d: Date): string {
  const hours = d.getHours();
  const mins = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = ((hours + 11) % 12) + 1;
  return `${h}:${mins.toString().padStart(2, '0')} ${ampm}`;
}

export function DailyViewScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'DailyView'>>();
  const { dateISO } = route.params;
  const date = useMemo(() => new Date(dateISO), [dateISO]);
  const lat = useCalendarStore((s) => s.latitude);
  const lon = useCalendarStore((s) => s.longitude);
  const { logActivity } = useAlignment();

  const hebrew = gregorianToHebrew(date);
  const sabbath = isSabbath(date);
  const sunset = calculateSunset(date, lat, lon);
  const feast = useMemo(() => {
    const yearFeasts = computeFeastsForYear(date.getFullYear());
    return getActiveFeast(date, yearFeasts);
  }, [date]);

  const scripture = useMemo(() => {
    const dayOfYear = Math.floor(
      (date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / 86400000
    );
    return getScriptureForDay(hebrew.month, dayOfYear);
  }, [date, hebrew.month]);

  function onCheckin() {
    logActivity('checkin');
    Alert.alert('Check-in logged', 'Today is recorded in your alignment journey.');
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 18 }}>
          <Pressable onPress={() => navigation.goBack()} style={{ marginBottom: 12 }}>
            <Text style={{ color: Colors.gold, fontSize: 14 }}>‹ Back</Text>
          </Pressable>
          <Text
            style={{
              color: Colors.textMuted,
              fontSize: 11,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}>
            {DAYS[date.getDay()]}
          </Text>
          <Text
            style={{
              color: Colors.text,
              fontSize: 32,
              fontWeight: '800',
              letterSpacing: 0.3,
              marginTop: 4,
            }}>
            {date.getDate()} {MONTHS[date.getMonth()]} {date.getFullYear()}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 6, gap: 8 }}>
            <GoldText size="xl" weight="bold">
              {formatHebrewDate(hebrew)}
            </GoldText>
            <Text style={{ color: Colors.goldLight, fontSize: 18 }}>
              · {formatHebrewDate(hebrew, { hebrew: true })}
            </Text>
          </View>
          {sabbath && (
            <View style={{ marginTop: 14 }}>
              <SabbathBadge />
            </View>
          )}
        </View>

        {/* Active feast */}
        {feast && (
          <View style={{ paddingHorizontal: 16 }}>
            <DarkCard
              bordered
              borderColor={FeastColors[feast.key] ?? Colors.gold}
              glow
              glowColor={FeastColors[feast.key] ?? Colors.gold}>
              <Text
                style={{
                  color: FeastColors[feast.key] ?? Colors.gold,
                  fontSize: 10,
                  letterSpacing: 2,
                  fontWeight: '800',
                  textTransform: 'uppercase',
                }}>
                Today's Feast
              </Text>
              <Text style={{ color: Colors.text, fontSize: 22, fontWeight: '800', marginTop: 4 }}>
                {feast.name}
              </Text>
              <GoldText size="lg" weight="semibold" style={{ marginTop: 2 }}>
                {feast.hebrewName}
              </GoldText>
              <Text style={{ color: Colors.textMuted, fontSize: 12, marginTop: 8 }}>
                {feast.leviticusRef}
              </Text>
            </DarkCard>
          </View>
        )}

        {/* Sunset */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <DarkCard>
            <Text
              style={{
                color: Colors.textMuted,
                fontSize: 10,
                letterSpacing: 2,
                textTransform: 'uppercase',
                marginBottom: 6,
              }}>
              Sunset
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
              <GoldText size="2xl" weight="bold">
                {fmtTime(sunset)}
              </GoldText>
              <Text style={{ color: Colors.textMuted, fontSize: 12 }}>
                Day boundary
              </Text>
            </View>
          </DarkCard>
        </View>

        {/* Meaning of Today */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <GoldText
            size="sm"
            weight="bold"
            style={{ marginBottom: 8, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Meaning of Today
          </GoldText>
          <DarkCard>
            <Text style={{ color: Colors.text, fontSize: 14, lineHeight: 22 }}>
              We dwell in the {hebrew.monthName} season — month {hebrew.month} of the Hebrew year.{' '}
              {sabbath
                ? 'It is a Sabbath day; rest, remember the Creator, and dwell in His shalom.'
                : feast
                ? `The appointed time of ${feast.name} is upon us. Walk in its meaning.`
                : 'A day to walk uprightly and to remember the Lord in your steps.'}
            </Text>
          </DarkCard>
        </View>

        {/* Scripture */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <GoldText
            size="sm"
            weight="bold"
            style={{ marginBottom: 8, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Scripture for Today
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

        {/* Check-in */}
        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
          <Pressable
            onPress={onCheckin}
            style={({ pressed }) => ({
              backgroundColor: Colors.gold,
              paddingVertical: 16,
              borderRadius: 14,
              alignItems: 'center',
              opacity: pressed ? 0.85 : 1,
            })}>
            <Text
              style={{
                color: Colors.background,
                fontSize: 13,
                fontWeight: '800',
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}>
              ✦ Daily Check-In
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
