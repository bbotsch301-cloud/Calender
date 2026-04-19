import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FeastColors } from '../../constants/colors';
import {
  HEBREW_MONTH_NAMES,
  HEBREW_MONTH_NAMES_HEBREW,
  hebrewToGregorian,
  isLeapYear,
} from '../../engine/hebrewCalendar';
import { computeFeastsForYear, type Feast } from '../../engine/feasts';
import { isSabbath } from '../../engine/sabbath';
import { getOmerWindow } from '../../engine/omer';

interface Props {
  hebrewYear: number;
  onFeastPress?: (feast: Feast) => void;
}

const MONTHS_GREG = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const ROW_HEIGHT = 90;

interface MonthInfo {
  hebrewMonthIdx: number;
  hebrewMonthName: string;
  hebrewMonthNameHeb: string;
  startGreg: Date;
  endGreg: Date;
  daysInMonth: number;
}

function buildHebrewMonths(hebrewYear: number): MonthInfo[] {
  const monthsInYear = isLeapYear(hebrewYear) ? 13 : 12;
  // Hebrew civil year starts at Tishri (month 7). Order: 7,8,9,10,11,12,(13?),1,2,3,4,5,6
  const order: number[] = [];
  for (let m = 7; m <= monthsInYear; m++) order.push(m);
  for (let m = 1; m <= 6; m++) order.push(m);

  const result: MonthInfo[] = [];
  for (let i = 0; i < order.length; i++) {
    const m = order[i];
    const start = hebrewToGregorian(hebrewYear, m, 1);
    let endStart: Date;
    if (i + 1 >= order.length) {
      endStart = hebrewToGregorian(hebrewYear + 1, 7, 1);
    } else {
      const nm = order[i + 1];
      endStart = hebrewToGregorian(hebrewYear, nm, 1);
    }
    const end = new Date(endStart);
    end.setDate(end.getDate() - 1);
    const daysInMonth = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;

    result.push({
      hebrewMonthIdx: m,
      hebrewMonthName: HEBREW_MONTH_NAMES[m],
      hebrewMonthNameHeb: HEBREW_MONTH_NAMES_HEBREW[m],
      startGreg: start,
      endGreg: end,
      daysInMonth,
    });
  }
  return result;
}

export function YearTimeline({ hebrewYear, onFeastPress }: Props) {
  const months = useMemo(() => buildHebrewMonths(hebrewYear), [hebrewYear]);

  // Combine feasts from both Gregorian years that overlap the Hebrew year
  const allFeasts = useMemo(() => {
    const seen = new Set<string>();
    const result: Feast[] = [];
    const startGreg = months[0].startGreg.getFullYear();
    const endGreg = months[months.length - 1].endGreg.getFullYear();
    for (let y = startGreg; y <= endGreg; y++) {
      for (const f of computeFeastsForYear(y)) {
        const key = `${f.key}-${f.startDate.toISOString()}`;
        if (!seen.has(key)) {
          seen.add(key);
          result.push(f);
        }
      }
    }
    return result;
  }, [hebrewYear, months]);

  const today = new Date();

  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
      {months.map((m, idx) => (
        <MonthRow
          key={`${m.hebrewMonthIdx}-${idx}`}
          month={m}
          delay={idx * 60}
          feasts={allFeasts}
          today={today}
          onFeastPress={onFeastPress}
        />
      ))}
    </View>
  );
}

interface MonthRowProps {
  month: MonthInfo;
  delay: number;
  feasts: Feast[];
  today: Date;
  onFeastPress?: (feast: Feast) => void;
}

function MonthRow({ month, delay, feasts, today, onFeastPress }: MonthRowProps) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(slide, { toValue: 0, duration: 350, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  // Map a Gregorian date within the month to a 0-1 position
  const fracFor = (d: Date) => {
    const ms = d.getTime() - month.startGreg.getTime();
    return Math.max(0, Math.min(1, ms / ((month.daysInMonth - 1) * 86_400_000)));
  };

  // Feast blocks falling in this Hebrew month
  const monthFeasts = feasts.filter((f) => {
    const sk = new Date(f.startDate.getFullYear(), f.startDate.getMonth(), f.startDate.getDate()).getTime();
    const ms = month.startGreg.getTime();
    const me = month.endGreg.getTime();
    return sk >= ms && sk <= me;
  });

  // Sabbaths in this month
  const sabbaths: number[] = [];
  for (let d = new Date(month.startGreg); d.getTime() <= month.endGreg.getTime(); d.setDate(d.getDate() + 1)) {
    if (isSabbath(d)) sabbaths.push(fracFor(new Date(d)));
  }

  // Today marker
  const todayInMonth =
    today.getTime() >= month.startGreg.getTime() && today.getTime() <= month.endGreg.getTime();

  // Omer band
  const omerWindow = getOmerWindow(month.startGreg.getFullYear());
  const omerWindow2 = getOmerWindow(month.endGreg.getFullYear());
  const omerBand = (() => {
    for (const w of [omerWindow, omerWindow2]) {
      if (w.end.getTime() < month.startGreg.getTime()) continue;
      if (w.start.getTime() > month.endGreg.getTime()) continue;
      const startD = w.start.getTime() < month.startGreg.getTime() ? month.startGreg : w.start;
      const endD = w.end.getTime() > month.endGreg.getTime() ? month.endGreg : w.end;
      return { start: fracFor(startD), end: fracFor(endD) };
    }
    return null;
  })();

  return (
    <Animated.View
      style={{
        opacity: fade,
        transform: [{ translateY: slide }],
        marginBottom: 14,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
          <Text style={{ color: Colors.text, fontSize: 15, fontWeight: '700', letterSpacing: 0.3 }}>
            {month.hebrewMonthName}
          </Text>
          <Text style={{ color: Colors.gold, fontSize: 14 }}>{month.hebrewMonthNameHeb}</Text>
        </View>
        <Text style={{ color: Colors.textMuted, fontSize: 11 }}>
          {MONTHS_GREG[month.startGreg.getMonth()]} {month.startGreg.getDate()} –{' '}
          {MONTHS_GREG[month.endGreg.getMonth()]} {month.endGreg.getDate()}
        </Text>
      </View>

      <View
        style={{
          marginTop: 6,
          height: ROW_HEIGHT,
          borderRadius: 12,
          backgroundColor: Colors.surface,
          borderWidth: 1,
          borderColor: Colors.border,
          overflow: 'hidden',
          position: 'relative',
          paddingHorizontal: 10,
          justifyContent: 'center',
        }}>
        {/* Omer gradient band */}
        {omerBand && (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${omerBand.start * 100}%`,
              right: `${(1 - omerBand.end) * 100}%`,
            }}>
            <LinearGradient
              colors={['rgba(101,163,13,0.28)', 'rgba(14,165,233,0.28)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          </View>
        )}

        {/* Base line */}
        <View
          style={{
            position: 'absolute',
            left: 10,
            right: 10,
            top: ROW_HEIGHT / 2 - 1,
            height: 2,
            backgroundColor: Colors.border,
          }}
        />

        {/* Sabbath ticks */}
        {sabbaths.map((frac, i) => (
          <View
            key={`sab-${i}`}
            style={{
              position: 'absolute',
              top: ROW_HEIGHT / 2 - 6,
              left: `${frac * 100}%`,
              width: 2,
              height: 12,
              backgroundColor: Colors.gold,
              opacity: 0.85,
            }}
          />
        ))}

        {/* Rosh Chodesh marker (start of Hebrew month, day 1) */}
        <View
          style={{
            position: 'absolute',
            top: 4,
            left: 4,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          }}>
          <Text style={{ fontSize: 14 }}>🌑</Text>
          <Text style={{ color: Colors.textMuted, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: '700' }}>
            Rosh Chodesh
          </Text>
        </View>

        {/* Feast blocks */}
        {monthFeasts.map((f) => {
          const frac = fracFor(f.startDate);
          const widthPct = Math.max(4, (f.durationDays / month.daysInMonth) * 100);
          return (
            <Pressable
              key={`f-${f.key}-${f.startDate.toISOString()}`}
              onPress={() => onFeastPress?.(f)}
              style={({ pressed }) => ({
                position: 'absolute',
                top: ROW_HEIGHT / 2 - 22,
                left: `${frac * 100}%`,
                width: `${widthPct}%`,
                height: 44,
                borderRadius: 6,
                backgroundColor: FeastColors[f.key],
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.25)',
                paddingHorizontal: 6,
                paddingVertical: 4,
                opacity: pressed ? 0.85 : 1,
                shadowColor: FeastColors[f.key],
                shadowOpacity: 0.5,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 0 },
              })}>
              <Text numberOfLines={1} style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 }}>
                {f.name}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 9 }}>
                {MONTHS_GREG[f.startDate.getMonth()].slice(0, 3)} {f.startDate.getDate()}
              </Text>
            </Pressable>
          );
        })}

        {/* Today ring */}
        {todayInMonth && (
          <View
            style={{
              position: 'absolute',
              top: ROW_HEIGHT / 2 - 12,
              left: `${fracFor(today) * 100}%`,
              marginLeft: -12,
              width: 24,
              height: 24,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: Colors.goldLight,
              backgroundColor: 'rgba(232,201,122,0.25)',
              shadowColor: Colors.gold,
              shadowOpacity: 0.9,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 0 },
            }}
          />
        )}
      </View>
    </Animated.View>
  );
}

export function YearTimelineLegend() {
  const items: Array<[string, string]> = [
    ['Passover', FeastColors.passover],
    ['Unleavened Bread', FeastColors.unleavenedBread],
    ['Firstfruits', FeastColors.firstfruits],
    ['Pentecost', FeastColors.pentecost],
    ['Trumpets', FeastColors.trumpets],
    ['Atonement', FeastColors.atonement],
    ['Tabernacles', FeastColors.tabernacles],
    ['Eighth Day', FeastColors.eighthDay],
  ];
  return (
    <View
      style={{
        marginHorizontal: 16,
        marginTop: 12,
        padding: 12,
        backgroundColor: Colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
      }}>
      <Text
        style={{
          color: Colors.textMuted,
          fontSize: 10,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          marginBottom: 8,
          fontWeight: '700',
        }}>
        Legend
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {items.map(([label, color]) => (
          <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: color }} />
            <Text style={{ color: Colors.text, fontSize: 11 }}>{label}</Text>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 14, marginTop: 10, flexWrap: 'wrap' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 2, height: 12, backgroundColor: Colors.gold }} />
          <Text style={{ color: Colors.text, fontSize: 11 }}>Sabbath</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 12 }}>🌑</Text>
          <Text style={{ color: Colors.text, fontSize: 11 }}>Rosh Chodesh</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View
            style={{ width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: Colors.goldLight }}
          />
          <Text style={{ color: Colors.text, fontSize: 11 }}>Today</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 14, height: 8, backgroundColor: 'rgba(101,163,13,0.5)' }} />
          <Text style={{ color: Colors.text, fontSize: 11 }}>Omer counting</Text>
        </View>
      </View>
    </View>
  );
}
