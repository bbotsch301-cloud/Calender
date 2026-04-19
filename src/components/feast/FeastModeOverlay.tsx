import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { Colors, FeastColors, FeastGlows } from '../../constants/colors';
import type { Feast } from '../../engine/feasts';

interface Props {
  feast: Feast;
}

export function FeastModeOverlay({ feast }: Props) {
  const color = FeastColors[feast.key] ?? Colors.gold;
  const glow = FeastGlows[feast.key] ?? 'rgba(201,168,76,0.4)';
  const opacity = useRef(new Animated.Value(0.6)).current;
  const slide = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slide, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.6, duration: 1500, useNativeDriver: true }),
        ])
      ),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 12,
        borderRadius: 14,
        overflow: 'hidden',
        transform: [{ translateY: slide }],
        backgroundColor: `${color}22`,
        borderWidth: 1.5,
        borderColor: color,
        shadowColor: color,
        shadowOpacity: 0.6,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 0 },
        elevation: 10,
      }}>
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: glow,
          opacity,
        }}
      />
      <View style={{ paddingHorizontal: 18, paddingVertical: 14 }}>
        <Text
          style={{
            color: color,
            fontSize: 10,
            fontWeight: '800',
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}>
          ✦ Feast Mode Active
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 6, gap: 10 }}>
          <Text
            style={{
              color: Colors.text,
              fontSize: 22,
              fontWeight: '800',
              letterSpacing: 0.3,
            }}>
            {feast.name}
          </Text>
          <Text
            style={{
              color: Colors.goldLight,
              fontSize: 18,
              fontWeight: '600',
            }}>
            {feast.hebrewName}
          </Text>
        </View>
        <Text style={{ color: Colors.textMuted, fontSize: 12, marginTop: 4 }}>
          {feast.leviticusRef} · {feast.durationDays}{' '}
          {feast.durationDays === 1 ? 'day' : 'days'}
        </Text>
      </View>
    </Animated.View>
  );
}
