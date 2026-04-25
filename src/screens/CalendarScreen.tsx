import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import { MonthGrid } from '../components/calendar/MonthGrid';
import { DayDetailModal } from '../components/calendar/DayDetailModal';
import { LegendBar } from '../components/calendar/LegendBar';
import { gregorianToHebrew } from '../engine/hebrewCalendar';
import { useSettingsStore } from '../store/useSettingsStore';
import { useCalendarStore } from '../store/useCalendarStore';
import type { DayCellData } from '../components/calendar/DayCell';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Builds the "Nisan – Iyar 5786"-style Hebrew month range label for a
 * Gregorian month by peeking at the 1st and last civil day.
 */
function hebrewRangeLabel(year: number, month: number): string {
  const first = gregorianToHebrew(new Date(year, month, 1));
  const lastDay = new Date(year, month + 1, 0);
  const last = gregorianToHebrew(lastDay);
  if (first.monthName === last.monthName && first.year === last.year) {
    return `${first.monthName} ${first.year}`;
  }
  if (first.year === last.year) {
    return `${first.monthName} – ${last.monthName} ${first.year}`;
  }
  return `${first.monthName} ${first.year} – ${last.monthName} ${last.year}`;
}

interface NavHandle {
  navigate: (name: string, params?: unknown) => void;
}

export function CalendarScreen(): React.ReactElement {
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // Session-only: banner stays dismissed until the app is fully restarted.
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const weekStartSunday = useSettingsStore((s) => s.weekStartSunday);
  const locationMode = useCalendarStore((s) => s.locationMode);
  const navigation = useNavigation() as unknown as NavHandle;
  const showLocationBanner = locationMode === 'fallback' && !bannerDismissed;

  const hebrewLabel = useMemo(() => hebrewRangeLabel(year, month), [year, month]);
  const atCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  function prevMonth(): void {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  }
  function nextMonth(): void {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  }
  function goToToday(): void {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <NavButton label="‹" onPress={prevMonth} a11y="Previous month" />
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text
            style={{
              color: Colors.text,
              fontSize: 22,
              fontWeight: '700',
              letterSpacing: 0.3,
            }}>
            {MONTHS[month]} {year}
          </Text>
          <Text
            style={{
              color: Colors.goldLight,
              fontSize: 12,
              marginTop: 2,
              fontWeight: '600',
              letterSpacing: 0.8,
            }}>
            {hebrewLabel}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {!atCurrentMonth && (
            <Pressable
              onPress={goToToday}
              accessibilityRole="button"
              accessibilityLabel="Jump to today"
              style={({ pressed }) => ({
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: Colors.gold,
                backgroundColor: pressed ? 'rgba(201,168,76,0.2)' : 'transparent',
              })}>
              <Text
                style={{
                  color: Colors.gold,
                  fontSize: 11,
                  letterSpacing: 1.5,
                  fontWeight: '800',
                  textTransform: 'uppercase',
                }}>
                Today
              </Text>
            </Pressable>
          )}
          <NavButton label="›" onPress={nextMonth} a11y="Next month" />
        </View>
      </View>

      {/* Color legend — horizontally scrollable under the header. */}
      <LegendBar />

      {/* Location-missing banner (session-only dismiss) */}
      {showLocationBanner && (
        <View style={{ paddingHorizontal: 12, marginBottom: 6 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(201,168,76,0.10)',
              borderWidth: 1,
              borderColor: Colors.gold,
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 10,
              gap: 10,
            }}>
            <Pressable
              onPress={() => navigation.navigate('Settings')}
              accessibilityRole="button"
              accessibilityLabel="Open Settings to set your location"
              style={{ flex: 1 }}>
              <Text
                style={{
                  color: Colors.gold,
                  fontSize: 13,
                  fontWeight: '700',
                  letterSpacing: 0.3,
                }}>
                📍 Set your location for accurate sunset times
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setBannerDismissed(true)}
              accessibilityRole="button"
              accessibilityLabel="Dismiss location banner"
              hitSlop={10}
              style={({ pressed }) => ({
                paddingHorizontal: 6,
                paddingVertical: 2,
                opacity: pressed ? 0.6 : 1,
              })}>
              <Text style={{ color: Colors.textMuted, fontSize: 20, fontWeight: '600' }}>×</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Grid */}
      <View style={{ flex: 1, paddingHorizontal: 8 }}>
        <MonthGrid
          year={year}
          month={month}
          weekStartSunday={weekStartSunday}
          onDayPress={(d: DayCellData) => setSelectedDate(d.date)}
        />
      </View>

      {/* Day detail */}
      <DayDetailModal date={selectedDate} onClose={() => setSelectedDate(null)} />
    </SafeAreaView>
  );
}

interface NavButtonProps {
  label: string;
  onPress: () => void;
  a11y: string;
}

function NavButton({ label, onPress, a11y }: NavButtonProps): React.ReactElement {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={a11y}
      style={({ pressed }) => ({
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: pressed ? 'rgba(201,168,76,0.15)' : Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
      })}>
      <Text style={{ color: Colors.gold, fontSize: 20, fontWeight: '700' }}>{label}</Text>
    </Pressable>
  );
}
