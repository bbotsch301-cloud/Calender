import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../constants/colors';
import { GoldText } from '../components/ui/GoldText';
import { DarkCard } from '../components/ui/DarkCard';
import {
  getOmerBlessing,
  getOmerDay,
  getOmerWeekLabel,
  getOmerWeekTheme,
  getOmerWindow,
  isOmerSeason,
} from '../engine/omer';
import { useAlignment } from '../hooks/useAlignment';
import { addDays } from '../engine/hebrewCalendar';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function OmerScreen() {
  const navigation = useNavigation();
  const { logActivity, recentActivity, refresh } = useAlignment();
  const [today] = useState(new Date());
  const inSeason = isOmerSeason(today);
  const day = getOmerDay(today);
  const window = getOmerWindow(today.getFullYear());

  // Build set of counted Omer days from recent activity
  const counted = useMemo(() => {
    const set = new Set<number>();
    for (const a of recentActivity) {
      if (a.type === 'omer_count' && a.notes?.startsWith('Omer day ')) {
        const n = parseInt(a.notes.replace('Omer day ', ''), 10);
        if (!isNaN(n)) set.add(n);
      }
    }
    return set;
  }, [recentActivity]);

  useEffect(() => {
    refresh();
  }, []);

  if (!inSeason || !day) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.background }}>
        <View style={{ padding: 20 }}>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={{ color: Colors.gold, fontSize: 14 }}>‹ Back</Text>
          </Pressable>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 }}>
          <Text style={{ fontSize: 60 }}>🌾</Text>
          <GoldText size="2xl" weight="bold" style={{ marginTop: 12, textAlign: 'center' }}>
            Outside the Omer
          </GoldText>
          <Text
            style={{
              color: Colors.textMuted,
              fontSize: 14,
              textAlign: 'center',
              marginTop: 12,
              lineHeight: 22,
            }}>
            The counting of the Omer happens between Firstfruits and Pentecost.{' '}
            This year it begins on {MONTHS[window.start.getMonth()]} {window.start.getDate()} and ends on{' '}
            {MONTHS[window.end.getMonth()]} {window.end.getDate()}.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  function onCount() {
    if (counted.has(day!)) return;
    logActivity('omer_count', { notes: `Omer day ${day}` });
    Alert.alert('Counted', `${getOmerBlessing(day!)}\n\n${getOmerWeekTheme(day!)}`);
  }

  // Streak: consecutive counted days ending at today (inclusive).
  let streak = 0;
  for (let d = day; d >= 1; d--) {
    if (counted.has(d)) streak++;
    else break;
  }

  const dateForOmerDay = (n: number): Date => addDays(window.start, n - 1);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 6 }}>
          <Pressable onPress={() => navigation.goBack()} style={{ marginBottom: 8 }}>
            <Text style={{ color: Colors.gold, fontSize: 14 }}>‹ Back</Text>
          </Pressable>
          <Text
            style={{
              color: Colors.textMuted,
              fontSize: 11,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}>
            Counting the Omer
          </Text>
          <GoldText size="3xl" weight="bold" glow style={{ marginTop: 4 }}>
            Day {day} of 49
          </GoldText>
        </View>

        {/* Circular ring */}
        <View style={{ alignItems: 'center', marginTop: 22 }}>
          <OmerProgressRing day={day} />
        </View>

        {/* Blessing */}
        <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
          <DarkCard bordered borderColor={Colors.gold}>
            <GoldText size="sm" weight="bold" style={{ letterSpacing: 1.5, textTransform: 'uppercase' }}>
              The Blessing
            </GoldText>
            <Text
              style={{
                color: Colors.text,
                fontSize: 17,
                lineHeight: 26,
                marginTop: 8,
                fontWeight: '500',
                fontStyle: 'italic',
                letterSpacing: 0.3,
              }}>
              "{getOmerBlessing(day)}"
            </Text>
            <GoldText size="base" weight="semibold" style={{ marginTop: 12 }}>
              {getOmerWeekLabel(day)}
            </GoldText>
            <Text style={{ color: Colors.textMuted, fontSize: 12, marginTop: 4 }}>
              Today's attribute: {getOmerWeekTheme(day)}
            </Text>
          </DarkCard>
        </View>

        {/* Streak */}
        <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
          <DarkCard>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 26 }}>🔥</Text>
              <View style={{ marginLeft: 12 }}>
                <Text
                  style={{
                    color: Colors.textMuted,
                    fontSize: 11,
                    letterSpacing: 1.5,
                    textTransform: 'uppercase',
                  }}>
                  Counting Streak
                </Text>
                <GoldText size="xl" weight="bold">
                  {streak} {streak === 1 ? 'day' : 'days'}
                </GoldText>
              </View>
            </View>
          </DarkCard>
        </View>

        {/* Action */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <Pressable
            onPress={onCount}
            disabled={counted.has(day)}
            style={({ pressed }) => ({
              backgroundColor: counted.has(day) ? Colors.surface : Colors.gold,
              borderWidth: counted.has(day) ? 1 : 0,
              borderColor: Colors.success,
              paddingVertical: 16,
              borderRadius: 14,
              alignItems: 'center',
              opacity: pressed ? 0.85 : 1,
            })}>
            <Text
              style={{
                color: counted.has(day) ? Colors.success : Colors.background,
                fontSize: 13,
                fontWeight: '800',
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}>
              {counted.has(day) ? '✓ Counted Today' : 'Count Today'}
            </Text>
          </Pressable>
        </View>

        {/* Grid of 49 days */}
        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
          <GoldText size="sm" weight="bold" style={{ marginBottom: 8, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            All 49 Days
          </GoldText>
          <DarkCard>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {Array.from({ length: 49 }).map((_, idx) => {
                const n = idx + 1;
                const isCounted = counted.has(n);
                const isToday = n === day;
                const isPast = n < day;
                const d = dateForOmerDay(n);
                return (
                  <View
                    key={n}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 8,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isCounted ? Colors.gold : isToday ? 'rgba(201,168,76,0.18)' : Colors.surface,
                      borderWidth: isToday ? 1.5 : 1,
                      borderColor: isToday ? Colors.gold : isCounted ? Colors.gold : Colors.border,
                      opacity: isPast || isCounted || isToday ? 1 : 0.55,
                    }}>
                    <Text
                      style={{
                        color: isCounted ? Colors.background : Colors.text,
                        fontSize: 12,
                        fontWeight: '700',
                      }}>
                      {n}
                    </Text>
                    <Text style={{ color: isCounted ? Colors.background : Colors.textMuted, fontSize: 8, opacity: 0.85 }}>
                      {MONTHS[d.getMonth()].slice(0, 3)} {d.getDate()}
                    </Text>
                  </View>
                );
              })}
            </View>
          </DarkCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function OmerProgressRing({ day }: { day: number }) {
  const size = 200;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = day / 49;
  const offset = circumference * (1 - pct);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={Colors.border} strokeWidth={strokeWidth} fill="transparent" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.gold}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text style={{ color: Colors.text, fontSize: 56, fontWeight: '800', letterSpacing: -2 }}>
          {day}
        </Text>
        <Text
          style={{
            color: Colors.textMuted,
            fontSize: 11,
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginTop: 2,
          }}>
          of 49
        </Text>
      </View>
    </View>
  );
}
