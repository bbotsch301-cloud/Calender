import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewProps } from 'react-native';
import { Colors } from '../../constants/colors';

interface Props extends ViewProps {
  color?: string;
  borderRadius?: number;
  active?: boolean;
  intensity?: number;
}

export function AnimatedBorder({
  color = Colors.gold,
  borderRadius = 16,
  active = true,
  intensity = 1,
  style,
  children,
  ...rest
}: Props) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (!active) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [active]);

  return (
    <View {...rest} style={[{ position: 'relative' }, style]}>
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: -2,
          left: -2,
          right: -2,
          bottom: -2,
          borderRadius: borderRadius + 2,
          borderWidth: 2,
          borderColor: color,
          opacity,
          shadowColor: color,
          shadowOpacity: 0.6 * intensity,
          shadowRadius: 12 * intensity,
          shadowOffset: { width: 0, height: 0 },
        }}
      />
      {children}
    </View>
  );
}
