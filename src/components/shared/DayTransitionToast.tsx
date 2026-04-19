import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FeastColors } from '../../constants/colors';
import { GoldText } from '../ui/GoldText';
import { gregorianToHebrew, formatHebrewDate } from '../../engine/hebrewCalendar';
import { computeFeastsForYear, getActiveFeast, type Feast } from '../../engine/feasts';

let externalShow: ((d: Date) => void) | null = null;

/** Imperative API: call from anywhere to surface the toast. */
export function showDayTransition(date: Date = new Date()): void {
  externalShow?.(date);
}

const DURATION_MS = 4000;

export function DayTransitionToast() {
  const [date, setDate] = useState<Date | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(-40)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    externalShow = (d: Date) => {
      setDate(d);
      opacity.setValue(0);
      translate.setValue(-40);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 320, useNativeDriver: true }),
        Animated.timing(translate, { toValue: 0, duration: 380, useNativeDriver: true }),
      ]).start();
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 480, useNativeDriver: true }),
          Animated.timing(translate, { toValue: -40, duration: 480, useNativeDriver: true }),
        ]).start(() => setDate(null));
      }, DURATION_MS);
    };
    return () => {
      externalShow = null;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  if (!date) return null;

  const hebrew = gregorianToHebrew(date);
  const feasts = computeFeastsForYear(date.getFullYear());
  const activeFeast: Feast | null = getActiveFeast(date, feasts);
  const accent = activeFeast ? FeastColors[activeFeast.key] ?? Colors.gold : Colors.gold;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
      }}>
      <SafeAreaView edges={['top']}>
        <Animated.View
          style={{
            opacity,
            transform: [{ translateY: translate }],
            marginHorizontal: 14,
            marginTop: 6,
          }}>
          <Pressable
            onPress={() => {
              if (timer.current) clearTimeout(timer.current);
              Animated.parallel([
                Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }),
                Animated.timing(translate, { toValue: -40, duration: 220, useNativeDriver: true }),
              ]).start(() => setDate(null));
            }}
            style={{
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: accent,
              backgroundColor: 'rgba(18,18,26,0.96)',
              paddingHorizontal: 16,
              paddingVertical: 14,
              shadowColor: accent,
              shadowOpacity: 0.6,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 4 },
              elevation: 12,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 22 }}>🌅</Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: accent,
                    fontSize: 10,
                    fontWeight: '800',
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                  }}>
                  New Day Begins
                </Text>
                <GoldText size="lg" weight="bold" style={{ marginTop: 2 }}>
                  {formatHebrewDate(hebrew)}
                </GoldText>
                {activeFeast && (
                  <Text style={{ color: Colors.text, fontSize: 12, marginTop: 2, fontWeight: '600' }}>
                    {activeFeast.name} · {activeFeast.hebrewName}
                  </Text>
                )}
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
