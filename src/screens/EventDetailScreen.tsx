import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Animated, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { Colors, FeastColors, FeastGlows } from '../constants/colors';
import { computeFeastsForYear } from '../engine/feasts';
import { GoldText } from '../components/ui/GoldText';
import { DarkCard } from '../components/ui/DarkCard';
import { CountdownTimer } from '../components/shared/CountdownTimer';
import { useAlignment } from '../hooks/useAlignment';
import { gregorianToHebrew, formatHebrewDate } from '../engine/hebrewCalendar';
import type { RootStackParamList } from '../navigation/RootNavigator';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function EventDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'EventDetail'>>();
  const { feastKey, year } = route.params;
  const { logActivity } = useAlignment();
  const fade = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(translate, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const feast = useMemo(() => {
    const yearFeasts = computeFeastsForYear(year);
    return yearFeasts.find((f) => f.key === feastKey) || null;
  }, [feastKey, year]);

  if (!feast) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background, padding: 20 }}>
        <Text style={{ color: Colors.text }}>Feast not found.</Text>
      </SafeAreaView>
    );
  }

  const color = FeastColors[feast.key] ?? Colors.gold;
  const glow = FeastGlows[feast.key] ?? 'rgba(201,168,76,0.4)';
  const isUpcoming = feast.startDate.getTime() > Date.now();

  function fmtRange() {
    const s = feast!.startDate;
    const e = feast!.endDate;
    if (s.getTime() === e.getTime()) return `${MONTHS[s.getMonth()]} ${s.getDate()}, ${s.getFullYear()}`;
    if (s.getMonth() === e.getMonth()) {
      return `${MONTHS[s.getMonth()]} ${s.getDate()}–${e.getDate()}, ${s.getFullYear()}`;
    }
    return `${MONTHS[s.getMonth()]} ${s.getDate()} – ${MONTHS[e.getMonth()]} ${e.getDate()}, ${s.getFullYear()}`;
  }

  function onObserve() {
    logActivity('feast', { feastKey: feast!.key });
    Alert.alert('Marked as Observed', `${feast!.name} has been logged to your alignment.`);
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.background }}>
      <Animated.View style={{ flex: 1, opacity: fade, transform: [{ translateY: translate }] }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          {/* Header banner */}
          <View
            style={{
              backgroundColor: color,
              paddingTop: 12,
              paddingBottom: 24,
              paddingHorizontal: 20,
              shadowColor: color,
              shadowOpacity: 0.5,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 8 },
            }}>
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: glow,
              }}
            />
            <Pressable onPress={() => navigation.goBack()} style={{ alignSelf: 'flex-start', padding: 6 }}>
              <Text style={{ color: Colors.text, fontSize: 24, fontWeight: '700' }}>×</Text>
            </Pressable>
            <Text
              style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: 11,
                letterSpacing: 2,
                textTransform: 'uppercase',
                marginTop: 8,
              }}>
              {feast.leviticusRef}
            </Text>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 30,
                fontWeight: '800',
                letterSpacing: 0.3,
                marginTop: 6,
              }}>
              {feast.name}
            </Text>
            <Text
              style={{
                color: 'rgba(255,255,255,0.95)',
                fontSize: 22,
                fontWeight: '600',
                marginTop: 2,
              }}>
              {feast.hebrewName}
            </Text>
            <Text
              style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: 13,
                marginTop: 12,
                fontWeight: '600',
              }}>
              {fmtRange()} · {formatHebrewDate(gregorianToHebrew(feast.startDate))}
            </Text>
            <Text
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: 12,
                marginTop: 4,
              }}>
              {feast.durationDays} {feast.durationDays === 1 ? 'day' : 'days'}
            </Text>
          </View>

          {isUpcoming && (
            <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
              <DarkCard bordered borderColor={color} style={{ alignItems: 'center' }}>
                <Text
                  style={{
                    color: Colors.textMuted,
                    fontSize: 10,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    marginBottom: 4,
                  }}>
                  Begins in
                </Text>
                <CountdownTimer target={feast.startDate} compact={false} label=" " />
              </DarkCard>
            </View>
          )}

          {/* Description */}
          <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
            <SectionHeader>Description</SectionHeader>
            <DarkCard>
              <Text style={{ color: Colors.text, fontSize: 14, lineHeight: 22 }}>
                {feast.description}
              </Text>
            </DarkCard>
          </View>

          {/* Biblical Meaning */}
          <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
            <SectionHeader>Biblical Meaning</SectionHeader>
            <DarkCard>
              <Text style={{ color: Colors.text, fontSize: 14, lineHeight: 22, fontStyle: 'italic' }}>
                {feast.biblicalMeaning}
              </Text>
            </DarkCard>
          </View>

          {/* Instructions */}
          <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
            <SectionHeader>Instructions</SectionHeader>
            <DarkCard>
              {feast.instructions.map((inst, idx) => (
                <View
                  key={idx}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    paddingVertical: 8,
                    borderBottomWidth: idx === feast.instructions.length - 1 ? 0 : 1,
                    borderBottomColor: Colors.border,
                  }}>
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      borderWidth: 1.5,
                      borderColor: color,
                      marginRight: 12,
                      marginTop: 2,
                    }}
                  />
                  <Text style={{ color: Colors.text, fontSize: 13, flex: 1, lineHeight: 20 }}>
                    {inst}
                  </Text>
                </View>
              ))}
            </DarkCard>
          </View>

          {/* Scriptures */}
          <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
            <SectionHeader>Scriptures</SectionHeader>
            {feast.scriptures.map((s, idx) => (
              <DarkCard
                key={idx}
                bordered
                borderColor={`${color}66`}
                style={{ marginBottom: 8, paddingVertical: 10, paddingHorizontal: 14 }}>
                <Text style={{ color: Colors.gold, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 }}>
                  {s}
                </Text>
              </DarkCard>
            ))}
          </View>

          {/* Action */}
          <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
            <Pressable
              onPress={onObserve}
              style={({ pressed }) => ({
                backgroundColor: Colors.gold,
                paddingVertical: 16,
                borderRadius: 14,
                alignItems: 'center',
                opacity: pressed ? 0.85 : 1,
                shadowColor: Colors.gold,
                shadowOpacity: 0.4,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
              })}>
              <Text
                style={{
                  color: Colors.background,
                  fontSize: 14,
                  fontWeight: '800',
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                }}>
                ✦ Mark as Observed
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

function SectionHeader({ children }: { children: string }) {
  return (
    <GoldText size="sm" weight="bold" style={{ marginBottom: 8, letterSpacing: 1.5, textTransform: 'uppercase' }}>
      {children}
    </GoldText>
  );
}
