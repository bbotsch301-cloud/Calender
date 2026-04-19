import React from 'react';
import { View, Text } from 'react-native';
import { FeastColors } from '../../constants/colors';
import type { FeastKey } from '../../engine/feasts';

interface Props {
  feastKey: FeastKey;
  name: string;
  small?: boolean;
}

export function FeastBadge({ feastKey, name, small }: Props) {
  const color = FeastColors[feastKey] ?? '#C9A84C';
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        paddingHorizontal: small ? 6 : 10,
        paddingVertical: small ? 2 : 4,
        borderRadius: 6,
        backgroundColor: `${color}33`,
        borderWidth: 1,
        borderColor: color,
      }}>
      <Text
        numberOfLines={1}
        style={{
          color: '#F0EDE6',
          fontSize: small ? 9 : 11,
          fontWeight: '600',
          letterSpacing: 0.5,
        }}>
        {name}
      </Text>
    </View>
  );
}
