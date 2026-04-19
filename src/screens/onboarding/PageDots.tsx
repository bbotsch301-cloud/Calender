import React from 'react';
import { View } from 'react-native';
import { Colors } from '../../constants/colors';

interface Props {
  total: number;
  current: number; // 0-indexed
}

export function PageDots({ total, current }: Props) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      {Array.from({ length: total }).map((_, i) => {
        const active = i === current;
        return (
          <View
            key={i}
            style={{
              width: active ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: active ? Colors.gold : Colors.border,
            }}
          />
        );
      })}
    </View>
  );
}
