import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { Colors } from '../../constants/colors';

export function YouAreHere() {
  const pulse = useRef(new Animated.Value(0.4)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulse, { toValue: 0.9, duration: 1400, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 0.4, duration: 1400, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.4, duration: 1400, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 1400, useNativeDriver: true }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <View style={{ alignItems: 'center', width: 110 }}>
      <View
        style={{
          width: 28,
          height: 28,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Animated.View
          style={{
            position: 'absolute',
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: Colors.gold,
            opacity: pulse,
            transform: [{ scale }],
          }}
        />
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: Colors.goldLight,
            shadowColor: Colors.gold,
            shadowOpacity: 0.9,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 0 },
          }}
        />
      </View>
      <View
        style={{
          height: 36,
          width: 1,
          backgroundColor: Colors.gold,
          marginVertical: 4,
        }}
      />
      <Text
        style={{
          color: Colors.gold,
          fontSize: 9,
          letterSpacing: 2,
          fontWeight: '800',
          textTransform: 'uppercase',
        }}>
        You Are Here
      </Text>
    </View>
  );
}
