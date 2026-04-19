import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { Colors } from '../../constants/colors';

interface Props extends TextProps {
  glow?: boolean;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'normal' | 'semibold' | 'bold';
  light?: boolean;
}

const SIZE_MAP: Record<NonNullable<Props['size']>, number> = {
  xs: 11,
  sm: 13,
  base: 15,
  lg: 18,
  xl: 22,
  '2xl': 28,
  '3xl': 36,
};

const WEIGHT_MAP: Record<NonNullable<Props['weight']>, TextStyle['fontWeight']> = {
  normal: '400',
  semibold: '600',
  bold: '700',
};

export function GoldText({
  glow = false,
  size = 'base',
  weight = 'normal',
  light = false,
  style,
  children,
  ...rest
}: Props) {
  const baseStyle: TextStyle = {
    color: light ? Colors.goldLight : Colors.gold,
    fontSize: SIZE_MAP[size],
    fontWeight: WEIGHT_MAP[weight],
    letterSpacing: 0.5,
  };
  const glowStyle: TextStyle = glow
    ? {
        textShadowColor: 'rgba(201, 168, 76, 0.6)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
      }
    : {};
  return (
    <Text {...rest} style={[baseStyle, glowStyle, style]}>
      {children}
    </Text>
  );
}
