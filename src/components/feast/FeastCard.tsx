import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Colors, FeastColors } from '../../constants/colors';
import { GoldText } from '../ui/GoldText';
import { DarkCard } from '../ui/DarkCard';
import type { Feast } from '../../engine/feasts';

interface Props {
  feast: Feast;
  onPress?: () => void;
  highlighted?: boolean;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function fmtDate(d: Date): string {
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

function fmtRange(start: Date, end: Date): string {
  if (start.getTime() === end.getTime()) return fmtDate(start);
  if (start.getMonth() === end.getMonth()) {
    return `${MONTHS[start.getMonth()]} ${start.getDate()}–${end.getDate()}`;
  }
  return `${fmtDate(start)} – ${fmtDate(end)}`;
}

export function FeastCard({ feast, onPress, highlighted }: Props) {
  const color = FeastColors[feast.key] ?? Colors.gold;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
      <DarkCard
        bordered
        borderColor={highlighted ? color : Colors.border}
        glow={highlighted}
        glowColor={color}
        style={{ marginBottom: 12 }}>
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            backgroundColor: color,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
          }}
        />
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, paddingLeft: 8 }}>
            <Text
              style={{
                color: Colors.textMuted,
                fontSize: 10,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                marginBottom: 4,
              }}>
              {feast.leviticusRef}
            </Text>
            <Text
              numberOfLines={1}
              style={{ color: Colors.text, fontSize: 18, fontWeight: '700', letterSpacing: 0.3 }}>
              {feast.name}
            </Text>
            <GoldText size="base" weight="semibold" style={{ marginTop: 2 }} numberOfLines={1}>
              {feast.hebrewName}
            </GoldText>
            <Text
              numberOfLines={2}
              style={{ color: Colors.textMuted, fontSize: 13, marginTop: 8, lineHeight: 18 }}>
              {feast.description}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: color, fontSize: 13, fontWeight: '700' }}>
              {fmtRange(feast.startDate, feast.endDate)}
            </Text>
            <Text style={{ color: Colors.textMuted, fontSize: 11, marginTop: 2 }}>
              {feast.durationDays}d
            </Text>
          </View>
        </View>
      </DarkCard>
    </Pressable>
  );
}
