import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  color?: string;
  duration?: number;
  size?: number;
  active?: boolean;
}

export function GlowPulse({
  color = '#C9A84C',
  duration = 2000,
  size = 80,
  active = true,
  style,
  children,
  ...rest
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (!active) return;
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.3,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.1,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.6,
            duration,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [active, duration]);

  return (
    <View {...rest} style={[{ alignItems: 'center', justifyContent: 'center' }, style]}>
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity,
          transform: [{ scale }],
        }}
      />
      {children}
    </View>
  );
}
