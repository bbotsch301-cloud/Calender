import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../../constants/colors';
import { gregorianToHebrew, formatHebrewDate } from '../../engine/hebrewCalendar';
import { GoldText } from '../ui/GoldText';

interface Props {
  date?: Date;
  showDayOfWeek?: boolean;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_HEBREW = ['יוֹם רִאשׁוֹן', 'יוֹם שֵׁנִי', 'יוֹם שְׁלִישִׁי', 'יוֹם רְבִיעִי', 'יוֹם חֲמִישִׁי', 'יוֹם שִׁשִּׁי', 'שַׁבָּת'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

export function DualDateHeader({ date = new Date(), showDayOfWeek = true }: Props) {
  const hebrew = gregorianToHebrew(date);
  const dow = date.getDay();
  const dayOfWeek = DAYS[dow];
  const dayOfWeekHeb = DAYS_HEBREW[dow];

  return (
    <View style={{ paddingHorizontal: 20, paddingVertical: 14 }}>
      {showDayOfWeek && (
        <Text
          style={{
            color: Colors.textMuted,
            fontSize: 11,
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginBottom: 4,
          }}>
          {dayOfWeek} · {dayOfWeekHeb}
        </Text>
      )}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 12 }}>
        <Text style={{ color: Colors.text, fontSize: 26, fontWeight: '700', letterSpacing: 0.5 }}>
          {date.getDate()} {MONTHS[date.getMonth()]}
        </Text>
        <Text style={{ color: Colors.textMuted, fontSize: 14, marginBottom: 4 }}>
          {date.getFullYear()}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
        <GoldText size="lg" weight="semibold">
          {formatHebrewDate(hebrew)}
        </GoldText>
        <Text style={{ color: Colors.goldLight, fontSize: 16 }}>
          · {formatHebrewDate(hebrew, { hebrew: true })}
        </Text>
      </View>
    </View>
  );
}
