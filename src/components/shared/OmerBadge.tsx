import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Colors } from '../../constants/colors';
import { getOmerDay, isOmerSeason, getOmerWeekLabel } from '../../engine/omer';

interface Props {
  date?: Date;
  onPress?: () => void;
  compact?: boolean;
}

export function OmerBadge({ date = new Date(), onPress, compact }: Props) {
  if (!isOmerSeason(date)) return null;
  const day = getOmerDay(date);
  if (!day) return null;
  const weekLabel = getOmerWeekLabel(day);

  const Inner = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: compact ? 10 : 14,
        paddingVertical: compact ? 5 : 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: Colors.gold,
        backgroundColor: 'rgba(201,168,76,0.1)',
        alignSelf: 'flex-start',
      }}>
      <Text style={{ fontSize: compact ? 13 : 15 }}>🌾</Text>
      <View>
        <Text
          style={{
            color: Colors.gold,
            fontSize: compact ? 10 : 11,
            fontWeight: '800',
            letterSpacing: 1.5,
            textTransform: 'uppercase',
          }}>
          Day {day} of the Omer
        </Text>
        {!compact && (
          <Text style={{ color: Colors.textMuted, fontSize: 10, marginTop: 1 }}>{weekLabel}</Text>
        )}
      </View>
    </View>
  );

  return onPress ? (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
      {Inner}
    </Pressable>
  ) : (
    Inner
  );
}
