import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../../constants/colors';

interface Props {
  score: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function AlignmentScore({
  score,
  size = 180,
  strokeWidth = 12,
  label = 'Alignment',
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safe = Number.isFinite(score) ? score : 0;
  const clamped = Math.max(0, Math.min(100, safe));
  const offset = circumference * (1 - clamped / 100);

  const color =
    clamped >= 80
      ? Colors.gold
      : clamped >= 50
      ? Colors.goldLight
      : Colors.textMuted;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.border}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text
          style={{
            color: Colors.text,
            fontSize: 44,
            fontWeight: '800',
            letterSpacing: -1,
          }}>
          {clamped}
        </Text>
        <Text
          style={{
            color: Colors.textMuted,
            fontSize: 11,
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginTop: 2,
          }}>
          {label}
        </Text>
      </View>
    </View>
  );
}
