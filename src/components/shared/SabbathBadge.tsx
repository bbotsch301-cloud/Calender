import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../../constants/colors';

interface Props {
  small?: boolean;
}

export function SabbathBadge({ small = false }: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: small ? 10 : 14,
        paddingVertical: small ? 4 : 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: Colors.gold,
        backgroundColor: 'rgba(201, 168, 76, 0.08)',
      }}>
      <Text
        style={{
          color: Colors.gold,
          fontSize: small ? 10 : 12,
          fontWeight: '700',
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        }}>
        ✦ Shabbat Shalom
      </Text>
    </View>
  );
}
