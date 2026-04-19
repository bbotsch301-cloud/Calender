import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Colors } from '../../constants/colors';
import { GoldText } from '../ui/GoldText';
import { DarkCard } from '../ui/DarkCard';
import { getParashaForDate } from '../../constants/parasha';
import { gregorianToHebrew } from '../../engine/hebrewCalendar';
import { useAlignment } from '../../hooks/useAlignment';

interface Props {
  date?: Date;
  title?: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function ParashaCard({ date = new Date(), title = "This Week's Reading" }: Props) {
  const { logActivity } = useAlignment();
  const hebrew = gregorianToHebrew(date);
  const { parasha, pairedWith, sabbathDate } = getParashaForDate(date, hebrew.year);
  const [marked, setMarked] = useState(false);

  function onMark() {
    if (marked) return;
    logActivity('scripture', { notes: `Read parasha: ${parasha.name}` });
    setMarked(true);
  }

  const name = pairedWith ? `${parasha.name} – ${pairedWith.name}` : parasha.name;
  const heb = pairedWith ? `${parasha.hebrewName} – ${pairedWith.hebrewName}` : parasha.hebrewName;

  return (
    <DarkCard bordered borderColor={Colors.gold} style={{ marginBottom: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <Text style={{ fontSize: 26, marginRight: 10 }}>📜</Text>
        <View style={{ flex: 1 }}>
          <GoldText size="sm" weight="bold" style={{ letterSpacing: 1.5, textTransform: 'uppercase' }}>
            {title}
          </GoldText>
          <Text style={{ color: Colors.text, fontSize: 18, fontWeight: '700', marginTop: 4, letterSpacing: 0.3 }}>
            {name}
          </Text>
          <GoldText size="base" weight="semibold" style={{ marginTop: 2 }}>
            {heb}
          </GoldText>
          <Text style={{ color: Colors.textMuted, fontSize: 12, marginTop: 6, fontWeight: '600' }}>
            {parasha.books}
            {pairedWith ? ` · ${pairedWith.books}` : ''}
          </Text>
          <Text style={{ color: Colors.text, fontSize: 13, lineHeight: 20, marginTop: 8 }}>
            {parasha.summary}
          </Text>
          {pairedWith && (
            <Text style={{ color: Colors.text, fontSize: 13, lineHeight: 20, marginTop: 4, opacity: 0.85 }}>
              {pairedWith.summary}
            </Text>
          )}
          <Text style={{ color: Colors.textMuted, fontSize: 11, marginTop: 10 }}>
            Reading on Shabbat · {MONTHS[sabbathDate.getMonth()]} {sabbathDate.getDate()}
          </Text>

          <Pressable
            onPress={onMark}
            disabled={marked}
            style={({ pressed }) => ({
              marginTop: 12,
              alignSelf: 'flex-start',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: marked ? Colors.success : Colors.gold,
              backgroundColor: marked ? 'rgba(101,163,13,0.12)' : 'rgba(201,168,76,0.08)',
              opacity: pressed ? 0.85 : 1,
            })}>
            <Text
              style={{
                color: marked ? Colors.success : Colors.gold,
                fontSize: 11,
                fontWeight: '800',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}>
              {marked ? '✓ Marked Read' : 'Read This Week'}
            </Text>
          </Pressable>
        </View>
      </View>
    </DarkCard>
  );
}
