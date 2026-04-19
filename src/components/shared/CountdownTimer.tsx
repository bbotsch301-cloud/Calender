import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../../constants/colors';
import { GoldText } from '../ui/GoldText';

interface Props {
  target: Date;
  label?: string;
  compact?: boolean;
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export function CountdownTimer({ target, label = 'Next biblical day begins in', compact }: Props) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const ms = Math.max(0, target.getTime() - now.getTime());
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  const text = days > 0
    ? `${days}d ${pad(hours)}:${pad(mins)}:${pad(secs)}`
    : `${pad(hours)}:${pad(mins)}:${pad(secs)}`;

  if (compact) {
    return (
      <GoldText size="sm" weight="semibold">
        {text}
      </GoldText>
    );
  }

  return (
    <View style={{ alignItems: 'center', paddingVertical: 8 }}>
      <Text
        style={{
          color: Colors.textMuted,
          fontSize: 11,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          marginBottom: 6,
        }}>
        {label}
      </Text>
      <GoldText size="2xl" weight="bold" glow>
        {text}
      </GoldText>
    </View>
  );
}
