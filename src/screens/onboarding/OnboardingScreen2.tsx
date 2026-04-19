import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { GoldText } from '../../components/ui/GoldText';
import { PageDots } from './PageDots';
import type { OnboardingParamList } from './types';

const SUN_SIZE = 110;

export function OnboardingScreen2() {
  const nav = useNavigation<NativeStackNavigationProp<OnboardingParamList>>();
  const fade = useRef(new Animated.Value(0)).current;
  const sunY = useRef(new Animated.Value(0)).current;
  const sunOpacity = useRef(new Animated.Value(1)).current;
  const horizonGlow = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    const cycle = () => {
      sunY.setValue(0);
      sunOpacity.setValue(1);
      horizonGlow.setValue(0.3);
      Animated.parallel([
        Animated.timing(sunY, {
          toValue: 1,
          duration: 4200,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(2400),
          Animated.timing(sunOpacity, { toValue: 0.0, duration: 1800, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.delay(2200),
          Animated.timing(horizonGlow, { toValue: 1, duration: 1100, useNativeDriver: false }),
          Animated.delay(400),
          Animated.timing(horizonGlow, { toValue: 0.3, duration: 800, useNativeDriver: false }),
        ]),
      ]).start(() => setTimeout(cycle, 700));
    };
    cycle();
  }, []);

  const translateY = sunY.interpolate({ inputRange: [0, 1], outputRange: [0, 130] });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={{ flex: 1, paddingHorizontal: 28, justifyContent: 'space-between', paddingVertical: 30 }}>
        <View />
        <Animated.View style={{ opacity: fade, alignItems: 'center' }}>
          <GoldText size="3xl" weight="bold" glow style={{ textAlign: 'center' }}>
            Day Begins at Sunset
          </GoldText>

          {/* Sunset animation */}
          <View
            style={{
              width: '100%',
              height: 220,
              marginTop: 28,
              borderRadius: 20,
              overflow: 'hidden',
              backgroundColor: Colors.surface,
              borderWidth: 1,
              borderColor: Colors.border,
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingTop: 30,
            }}>
            <Animated.View
              style={{
                width: SUN_SIZE,
                height: SUN_SIZE,
                borderRadius: SUN_SIZE / 2,
                overflow: 'hidden',
                opacity: sunOpacity,
                transform: [{ translateY }],
                shadowColor: '#FF8C00',
                shadowOpacity: 0.9,
                shadowRadius: 30,
                shadowOffset: { width: 0, height: 0 },
              }}>
              <LinearGradient
                colors={['#FFD27A', '#E8C97A', '#C9A84C', '#7C2D12']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={{ width: '100%', height: '100%' }}
              />
            </Animated.View>
            {/* Horizon line + glow */}
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 50,
                height: 2,
                backgroundColor: Colors.border,
              }}
            />
            <Animated.View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: 80,
                opacity: horizonGlow,
              }}>
              <LinearGradient
                colors={['rgba(201,168,76,0.0)', 'rgba(201,168,76,0.6)', 'rgba(124,45,18,0.4)']}
                style={{ width: '100%', height: '100%' }}
              />
            </Animated.View>
          </View>

          <Text
            style={{
              color: Colors.textMuted,
              fontSize: 15,
              lineHeight: 22,
              textAlign: 'center',
              marginTop: 24,
              paddingHorizontal: 8,
            }}>
            In Scripture, each day begins when the sun sets — not at midnight. This app tracks time the biblical way.
          </Text>
        </Animated.View>

        <Animated.View style={{ opacity: fade, alignItems: 'center', gap: 18 }}>
          <PageDots total={3} current={1} />
          <Pressable
            onPress={() => nav.navigate('Onboard3')}
            style={({ pressed }) => ({
              backgroundColor: Colors.gold,
              paddingVertical: 16,
              borderRadius: 14,
              alignSelf: 'stretch',
              alignItems: 'center',
              opacity: pressed ? 0.85 : 1,
            })}>
            <Text
              style={{
                color: Colors.background,
                fontWeight: '800',
                fontSize: 14,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}>
              Next
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
