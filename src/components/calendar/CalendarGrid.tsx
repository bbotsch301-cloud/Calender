import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { DayCell } from './DayCell';
import { Colors } from '../../constants/colors';
import { gregorianToHebrew } from '../../engine/hebrewCalendar';
import { isSabbath } from '../../engine/sabbath';
import type { CalendarDay } from '../../types/calendar.types';
import type { Feast } from '../../engine/feasts';

interface Props {
  year: number;
  month: number; // 0-indexed
  events?: Feast[];
  onDayPress?: (day: CalendarDay) => void;
  showHebrew?: boolean;
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function CalendarGrid({ year, month, events = [], onDayPress, showHebrew = true }: Props) {
  const days: CalendarDay[] = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstOfMonth = new Date(year, month, 1);
    const startWeekday = firstOfMonth.getDay();
    // Calendar starts on Sunday before the 1st
    const start = new Date(year, month, 1 - startWeekday);

    const result: CalendarDay[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const hebrew = gregorianToHebrew(d);
      const cellTime = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

      let feastKey: string | undefined;
      let feastName: string | undefined;
      let feastColor: string | undefined;
      for (const f of events) {
        const fs = new Date(f.startDate.getFullYear(), f.startDate.getMonth(), f.startDate.getDate()).getTime();
        const fe = new Date(f.endDate.getFullYear(), f.endDate.getMonth(), f.endDate.getDate()).getTime();
        if (cellTime >= fs && cellTime <= fe) {
          feastKey = f.key;
          feastName = f.name;
          feastColor = f.colorAccent;
          break;
        }
      }

      result.push({
        date: d,
        gregorianDay: d.getDate(),
        gregorianMonth: d.getMonth(),
        gregorianYear: d.getFullYear(),
        hebrewDate: hebrew,
        isSabbath: isSabbath(d),
        isToday: cellTime === today.getTime(),
        isCurrentMonth: d.getMonth() === month,
        feastKey,
        feastName,
        feastColor,
      });
    }
    return result;
  }, [year, month, events]);

  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < 6; i++) weeks.push(days.slice(i * 7, i * 7 + 7));

  return (
    <View style={{ paddingHorizontal: 8 }}>
      <View style={{ flexDirection: 'row', marginBottom: 6 }}>
        {WEEKDAYS.map((d, idx) => (
          <View key={`wd-${idx}`} style={{ flex: 1, alignItems: 'center', paddingVertical: 6 }}>
            <Text
              style={{
                color: idx === 6 ? Colors.gold : Colors.textMuted,
                fontSize: 11,
                letterSpacing: 1.5,
                fontWeight: '700',
              }}>
              {d}
            </Text>
          </View>
        ))}
      </View>
      {weeks.map((week, wi) => (
        <View key={`w-${wi}`} style={{ flexDirection: 'row' }}>
          {week.map((day) => (
            <DayCell
              key={day.date.toISOString()}
              day={day}
              onPress={onDayPress}
              showHebrew={showHebrew}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
