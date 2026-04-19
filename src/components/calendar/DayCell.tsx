import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Colors, FeastColors } from '../../constants/colors';
import { toHebrewNumeral } from '../../engine/hebrewCalendar';
import type { CalendarDay } from '../../types/calendar.types';

interface Props {
  day: CalendarDay;
  onPress?: (day: CalendarDay) => void;
  showHebrew?: boolean;
}

export function DayCell({ day, onPress, showHebrew = true }: Props) {
  const feastColor = day.feastKey ? FeastColors[day.feastKey] : null;
  const isCurrent = day.isCurrentMonth;
  const isToday = day.isToday;
  const isSabbath = day.isSabbath;

  return (
    <Pressable
      onPress={() => onPress?.(day)}
      style={({ pressed }) => ({
        flex: 1,
        aspectRatio: 0.85,
        margin: 2,
        borderRadius: 8,
        padding: 4,
        backgroundColor: isToday ? 'rgba(201,168,76,0.12)' : Colors.surface,
        borderWidth: isSabbath ? 1.5 : isToday ? 1 : 1,
        borderColor: isToday
          ? Colors.gold
          : isSabbath
          ? Colors.gold
          : Colors.border,
        opacity: isCurrent ? 1 : 0.35,
        transform: [{ scale: pressed ? 0.96 : 1 }],
      })}>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <Text
          style={{
            color: Colors.text,
            fontSize: 13,
            fontWeight: isToday ? '800' : '600',
            textAlign: 'left',
          }}>
          {day.gregorianDay}
        </Text>
        {showHebrew && (
          <Text
            style={{
              color: Colors.gold,
              fontSize: 9,
              fontWeight: '600',
              textAlign: 'right',
              marginTop: 'auto',
            }}>
            {toHebrewNumeral(day.hebrewDate.day)}
          </Text>
        )}
        {feastColor && (
          <View
            style={{
              position: 'absolute',
              bottom: 2,
              left: 2,
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: feastColor,
              shadowColor: feastColor,
              shadowOpacity: 0.8,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 0 },
            }}
          />
        )}
      </View>
    </Pressable>
  );
}
