import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../../constants/colors';
import { getMoonPhase } from '../../engine/moonPhase';

interface Props {
  date?: Date;
  compact?: boolean;
  showIllumination?: boolean;
}

export function MoonPhaseDisplay({
  date = new Date(),
  compact = false,
  showIllumination = true,
}: Props) {
  const moon = getMoonPhase(date);
  const pct = Math.round(moon.illumination * 100);

  if (compact) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Text style={{ fontSize: 16 }}>{moon.emoji}</Text>
        <Text
          style={{
            color: Colors.textMuted,
            fontSize: 11,
            letterSpacing: 1,
            fontWeight: '600',
          }}>
          {moon.name}
          {showIllumination ? ` · ${pct}%` : ''}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(201,168,76,0.06)',
        borderWidth: 1,
        borderColor: Colors.border,
        alignSelf: 'flex-start',
        gap: 10,
      }}>
      <Text style={{ fontSize: 28 }}>{moon.emoji}</Text>
      <View>
        <Text
          style={{
            color: Colors.textMuted,
            fontSize: 10,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
          }}>
          Moon Phase
        </Text>
        <Text
          style={{
            color: Colors.text,
            fontSize: 14,
            fontWeight: '700',
            marginTop: 2,
          }}>
          {moon.name}
        </Text>
        {showIllumination && (
          <Text style={{ color: Colors.gold, fontSize: 11, marginTop: 1 }}>
            {pct}% illuminated · day {moon.phase.toFixed(1)} of 29.5
          </Text>
        )}
      </View>
    </View>
  );
}
