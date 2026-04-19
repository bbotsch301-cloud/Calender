import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../constants/colors';
import { CalendarGrid } from '../components/calendar/CalendarGrid';
import { useFeastStore } from '../store/useFeastStore';
import { GoldText } from '../components/ui/GoldText';
import { gregorianToHebrew, formatHebrewDate } from '../engine/hebrewCalendar';
import type { ViewMode } from '../types/calendar.types';
import type { RootStackParamList } from '../navigation/RootNavigator';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function CalendarScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { allFeasts } = useFeastStore();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [view, setView] = useState<ViewMode>('standard');

  const headerHebrew = useMemo(() => {
    const mid = new Date(year, month, 15);
    return gregorianToHebrew(mid);
  }, [year, month]);

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  }
  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  }

  const yearFeasts = useMemo(
    () => allFeasts.filter((f) => f.startDate.getFullYear() === year || f.endDate.getFullYear() === year),
    [allFeasts, year]
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 14,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <NavBtn label="‹" onPress={prevMonth} />
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text
              style={{
                color: Colors.text,
                fontSize: 22,
                fontWeight: '700',
                letterSpacing: 0.5,
              }}>
              {MONTHS[month]} {year}
            </Text>
            <GoldText size="sm" weight="semibold" style={{ marginTop: 2 }}>
              ≈ {headerHebrew.monthName} {headerHebrew.year}
            </GoldText>
          </View>
          <NavBtn label="›" onPress={nextMonth} />
        </View>

        {/* Toggle */}
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 20,
            marginBottom: 16,
            backgroundColor: Colors.surface,
            borderRadius: 10,
            padding: 4,
            borderWidth: 1,
            borderColor: Colors.border,
          }}>
          <ToggleBtn label="Standard" active={view === 'standard'} onPress={() => setView('standard')} />
          <ToggleBtn label="Biblical" active={view === 'biblical'} onPress={() => setView('biblical')} />
        </View>

        <CalendarGrid
          year={year}
          month={month}
          events={yearFeasts}
          showHebrew={view === 'biblical'}
          onDayPress={(day) => navigation.navigate('DailyView', { dateISO: day.date.toISOString() })}
        />

        {/* Feasts this month */}
        <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
          <GoldText size="lg" weight="bold" style={{ marginBottom: 8 }}>
            This Month's Appointments
          </GoldText>
          {yearFeasts
            .filter(
              (f) => f.startDate.getMonth() === month || f.endDate.getMonth() === month
            )
            .map((f) => (
              <Pressable
                key={`${f.key}-${f.startDate.toISOString()}`}
                onPress={() =>
                  navigation.navigate('EventDetail', {
                    feastKey: f.key,
                    year: f.startDate.getFullYear(),
                  })
                }
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.border,
                }}>
                <View
                  style={{
                    width: 6,
                    height: 24,
                    borderRadius: 3,
                    backgroundColor: f.colorAccent,
                    marginRight: 12,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: Colors.text, fontWeight: '700', fontSize: 14 }}>
                    {f.name}
                  </Text>
                  <Text style={{ color: Colors.textMuted, fontSize: 11, marginTop: 2 }}>
                    {f.leviticusRef} · {formatHebrewDate(gregorianToHebrew(f.startDate))}
                  </Text>
                </View>
                <Text style={{ color: Colors.gold, fontSize: 12, fontWeight: '700' }}>
                  {MONTHS[f.startDate.getMonth()].slice(0, 3)} {f.startDate.getDate()}
                </Text>
              </Pressable>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function NavBtn({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
      }}>
      <Text style={{ color: Colors.gold, fontSize: 20, fontWeight: '700' }}>{label}</Text>
    </Pressable>
  );
}

function ToggleBtn({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        paddingVertical: 8,
        borderRadius: 7,
        alignItems: 'center',
        backgroundColor: active ? Colors.gold : 'transparent',
      }}>
      <Text
        style={{
          color: active ? Colors.background : Colors.textMuted,
          fontSize: 12,
          fontWeight: '700',
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}>
        {label}
      </Text>
    </Pressable>
  );
}
