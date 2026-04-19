import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { GoldText } from '../../components/ui/GoldText';
import { PageDots } from './PageDots';
import type { OnboardingParamList } from './types';

export function OnboardingScreen1() {
  const nav = useNavigation<NativeStackNavigationProp<OnboardingParamList>>();
  const fade = useRef(new Animated.Value(0)).current;
  const sweep = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }).start();
    Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        duration: 3500,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      })
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.95, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const sweepX = sweep.interpolate({ inputRange: [0, 1], outputRange: [-180, 180] });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={{ flex: 1, paddingHorizontal: 28, justifyContent: 'space-between', paddingVertical: 30 }}>
        <View />
        <Animated.View style={{ alignItems: 'center', opacity: fade }}>
          <Text style={{ fontSize: 60 }}>✦</Text>
          <GoldText size="3xl" weight="bold" glow style={{ textAlign: 'center', marginTop: 8 }}>
            Walk in God's Time
          </GoldText>
          <Text
            style={{
              color: Colors.textMuted,
              fontSize: 15,
              lineHeight: 22,
              textAlign: 'center',
              marginTop: 16,
              paddingHorizontal: 12,
            }}>
            Kingdom Calendar aligns your life with the ancient biblical rhythm of creation.
          </Text>

          {/* Animated timeline preview */}
          <View
            style={{
              width: '100%',
              height: 130,
              marginTop: 36,
              borderRadius: 16,
              backgroundColor: Colors.surface,
              borderWidth: 1,
              borderColor: Colors.border,
              overflow: 'hidden',
              justifyContent: 'center',
            }}>
            {/* Base line */}
            <View
              style={{
                height: 2,
                backgroundColor: Colors.border,
                marginHorizontal: 24,
              }}
            />
            {/* Timeline dots */}
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                paddingHorizontal: 24,
              }}>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <View
                  key={i}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: Colors.gold,
                    opacity: 0.5,
                  }}
                />
              ))}
            </View>
            {/* Sweeping highlight */}
            <Animated.View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: 120,
                left: '50%',
                marginLeft: -60,
                transform: [{ translateX: sweepX }],
                opacity: pulse,
                backgroundColor: 'rgba(201,168,76,0.18)',
                shadowColor: Colors.gold,
                shadowOpacity: 0.6,
                shadowRadius: 24,
                shadowOffset: { width: 0, height: 0 },
              }}
            />
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: fade, alignItems: 'center', gap: 18 }}>
          <PageDots total={3} current={0} />
          <Pressable
            onPress={() => nav.navigate('Onboard2')}
            style={({ pressed }) => ({
              backgroundColor: Colors.gold,
              paddingVertical: 16,
              paddingHorizontal: 64,
              borderRadius: 14,
              alignSelf: 'stretch',
              alignItems: 'center',
              opacity: pressed ? 0.85 : 1,
              shadowColor: Colors.gold,
              shadowOpacity: 0.4,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
            })}>
            <Text
              style={{
                color: Colors.background,
                fontWeight: '800',
                fontSize: 14,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}>
              Begin
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
