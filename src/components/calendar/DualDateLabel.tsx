import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../../constants/colors';
import { toHebrewNumeral } from '../../engine/hebrewCalendar';

interface Props {
  gregorian: number;
  hebrew: number;
  small?: boolean;
}

export function DualDateLabel({ gregorian, hebrew, small }: Props) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text
        style={{
          color: Colors.text,
          fontSize: small ? 13 : 16,
          fontWeight: '700',
        }}>
        {gregorian}
      </Text>
      <Text
        style={{
          color: Colors.gold,
          fontSize: small ? 9 : 11,
          fontWeight: '600',
          marginTop: 1,
        }}>
        {toHebrewNumeral(hebrew)}
      </Text>
    </View>
  );
}
