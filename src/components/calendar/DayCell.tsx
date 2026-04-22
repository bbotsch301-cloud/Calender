import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Colors, FeastPillColors } from '../../constants/colors';
import type { Feast } from '../../engine/feasts';

export interface DayCellData {
  date: Date;
  gregorianDay: number;
  hebrewDay: number;
  hebrewMonthName: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSaturday: boolean;
  isRoshChodesh: boolean;
  feast: Feast | null;
  feastDayNumber: number | null;
  omerDay: number | null;
}

interface Props {
  data: DayCellData;
  onPress: (d: DayCellData) => void;
  minHeight?: number;
}

export function DayCell({ data, onPress, minHeight = 92 }: Props): React.ReactElement {
  const {
    gregorianDay,
    hebrewDay,
    hebrewMonthName,
    isCurrentMonth,
    isToday,
    isSaturday,
    isRoshChodesh,
    feast,
    omerDay,
  } = data;

  const pill = feast ? FeastPillColors[feast.key] : null;
  const dim = !isCurrentMonth;

  return (
    <Pressable
      onPress={() => onPress(data)}
      accessibilityRole="button"
      accessibilityLabel={`${data.date.toDateString()}, ${hebrewDay} ${hebrewMonthName}${
        feast ? `, ${feast.name}` : ''
      }${isRoshChodesh ? ', Rosh Chodesh' : ''}${omerDay ? `, Omer day ${omerDay}` : ''}`}
      style={({ pressed }) => ({
        flex: 1,
        minHeight,
        paddingVertical: 6,
        paddingHorizontal: 6,
        // Today gets a bright gold border and tinted background.
        borderWidth: isToday ? 2 : 0,
        borderColor: isToday ? Colors.gold : 'transparent',
        borderRadius: 10,
        backgroundColor: isToday
          ? 'rgba(201,168,76,0.10)'
          : pressed
          ? 'rgba(255,255,255,0.03)'
          : 'transparent',
        opacity: dim ? 0.35 : 1,
        justifyContent: 'flex-start',
      })}>
      {/* Top row: Gregorian (left) + Hebrew (right) */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Text
          style={{
            color: Colors.text,
            fontSize: 16,
            fontWeight: isToday ? '800' : '600',
            letterSpacing: 0.2,
          }}>
          {gregorianDay}
        </Text>
        <Text
          style={{
            color: Colors.gold,
            fontSize: 10,
            fontWeight: '600',
            letterSpacing: 0.3,
          }}
          numberOfLines={1}>
          {hebrewDay} {hebrewMonthName.slice(0, 4)}
        </Text>
      </View>

      {/* Body: feast pill, Rosh Chodesh, Omer */}
      <View style={{ marginTop: 4, gap: 3 }}>
        {pill && (
          <View
            style={{
              alignSelf: 'flex-start',
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4,
              backgroundColor: pill.bg,
              maxWidth: '100%',
            }}>
            <Text
              numberOfLines={1}
              style={{
                color: pill.text,
                fontSize: 9,
                fontWeight: '800',
                letterSpacing: 0.4,
              }}>
              {pill.shortName}
              {isSaturday && feast ? ' · Shabbat' : ''}
            </Text>
          </View>
        )}
        {isRoshChodesh && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Text style={{ fontSize: 9 }}>🌒</Text>
            <Text
              numberOfLines={1}
              style={{
                color: Colors.goldLight,
                fontSize: 9,
                fontWeight: '700',
                letterSpacing: 0.4,
              }}>
              Rosh Chodesh
            </Text>
          </View>
        )}
        {omerDay !== null && omerDay >= 1 && omerDay <= 49 && (
          <Text
            style={{
              color: Colors.textMuted,
              fontSize: 9,
              fontWeight: '600',
              letterSpacing: 0.3,
            }}>
            Omer {omerDay}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
