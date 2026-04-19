import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/colors';
import { GoldText } from '../../components/ui/GoldText';
import { PageDots } from './PageDots';
import { requestLocationPermission } from '../../hooks/useSunset';
import { useCalendarStore } from '../../store/useCalendarStore';

export const ONBOARDING_KEY = 'kingdom-calendar:hasSeenOnboarding';

interface Props {
  onComplete: () => void;
}

export function OnboardingScreen3({ onComplete }: Props) {
  const setLocation = useCalendarStore((s) => s.setLocation);
  const fade = useRef(new Animated.Value(0)).current;
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  async function finish() {
    await AsyncStorage.setItem(ONBOARDING_KEY, '1');
    onComplete();
  }

  async function onAllow() {
    if (busy) return;
    setBusy(true);
    try {
      const r = await requestLocationPermission();
      if (r.granted && r.latitude !== null && r.longitude !== null) {
        setLocation(r.latitude, r.longitude);
      } else {
        Alert.alert('Permission denied', 'No problem — using Jerusalem time.');
      }
    } catch {
      Alert.alert('Could not get location', 'Falling back to Jerusalem.');
    } finally {
      setBusy(false);
      await finish();
    }
  }

  async function onSkip() {
    await finish();
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={{ flex: 1, paddingHorizontal: 28, justifyContent: 'space-between', paddingVertical: 30 }}>
        <View />
        <Animated.View style={{ opacity: fade, alignItems: 'center' }}>
          <Text style={{ fontSize: 60 }}>📍</Text>
          <GoldText size="3xl" weight="bold" glow style={{ textAlign: 'center', marginTop: 8 }}>
            Set Your Location
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
            We use your location only to calculate the exact moment sunset begins at your home.
          </Text>

          <View
            style={{
              marginTop: 28,
              backgroundColor: Colors.surface,
              padding: 16,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: Colors.border,
              alignItems: 'center',
              gap: 6,
            }}>
            <Text
              style={{
                color: Colors.textMuted,
                fontSize: 11,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}>
              Default fallback
            </Text>
            <GoldText size="lg" weight="semibold">
              Jerusalem · 31.7683° N, 35.2137° E
            </GoldText>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: fade, alignItems: 'center', gap: 12 }}>
          <PageDots total={3} current={2} />
          <Pressable
            onPress={onAllow}
            disabled={busy}
            style={({ pressed }) => ({
              backgroundColor: Colors.gold,
              paddingVertical: 16,
              borderRadius: 14,
              alignSelf: 'stretch',
              alignItems: 'center',
              opacity: pressed || busy ? 0.7 : 1,
              marginTop: 8,
            })}>
            <Text
              style={{
                color: Colors.background,
                fontWeight: '800',
                fontSize: 14,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}>
              {busy ? 'Requesting…' : 'Allow Location'}
            </Text>
          </Pressable>
          <Pressable
            onPress={onSkip}
            style={({ pressed }) => ({
              paddingVertical: 14,
              alignItems: 'center',
              opacity: pressed ? 0.7 : 1,
            })}>
            <Text style={{ color: Colors.textMuted, fontSize: 13, letterSpacing: 1 }}>
              Skip (use Jerusalem)
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
