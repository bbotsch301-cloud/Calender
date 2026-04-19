import React from 'react';
import { View, ViewProps } from 'react-native';
import { Colors } from '../../constants/colors';

interface Props extends ViewProps {
  elevated?: boolean;
  bordered?: boolean;
  borderColor?: string;
  glow?: boolean;
  glowColor?: string;
}

export function DarkCard({
  elevated = false,
  bordered = true,
  borderColor,
  glow = false,
  glowColor,
  style,
  children,
  ...rest
}: Props) {
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: elevated ? Colors.surfaceElev : Colors.surface,
          borderRadius: 16,
          padding: 16,
          borderWidth: bordered ? 1 : 0,
          borderColor: borderColor ?? Colors.border,
        },
        glow
          ? {
              shadowColor: glowColor ?? Colors.gold,
              shadowOpacity: 0.5,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 0 },
              elevation: 8,
            }
          : null,
        style,
      ]}>
      {children}
    </View>
  );
}
