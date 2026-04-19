import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Alert, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/colors';
import { useCalendarStore } from '../../store/useCalendarStore';
import { requestLocationPermission } from '../../hooks/useSunset';

const DISMISS_KEY = 'kingdom-calendar:location-banner-dismissed';

export function LocationBanner() {
  const usingFallback = useCalendarStore((s) => s.usingLocationFallback);
  const setLocation = useCalendarStore((s) => s.setLocation);
  const [dismissed, setDismissed] = useState(true);
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    AsyncStorage.getItem(DISMISS_KEY).then((v) => setDismissed(v === '1'));
  }, []);

  useEffect(() => {
    if (!dismissed && usingFallback) {
      Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: true }).start();
    }
  }, [dismissed, usingFallback]);

  if (dismissed || !usingFallback) return null;

  async function onPress() {
    try {
      const r = await requestLocationPermission();
      if (r.granted && r.latitude !== null && r.longitude !== null) {
        setLocation(r.latitude, r.longitude);
        await AsyncStorage.setItem(DISMISS_KEY, '1');
        setDismissed(true);
      } else {
        Alert.alert(
          'Permission denied',
          "We'll keep using Jerusalem time. You can grant permission later in your device settings."
        );
      }
    } catch {
      Alert.alert('Could not get location', 'Falling back to Jerusalem.');
    }
  }

  async function onDismiss() {
    await AsyncStorage.setItem(DISMISS_KEY, '1');
    Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => {
      setDismissed(true);
    });
  }

  return (
    <Animated.View
      style={{
        opacity,
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.gold,
        backgroundColor: 'rgba(201,168,76,0.10)',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Pressable onPress={onPress} style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 14 }}>
        <Text style={{ color: Colors.goldLight, fontSize: 13, fontWeight: '600' }}>
          📍 Using Jerusalem time — tap to set your location
        </Text>
      </Pressable>
      <Pressable
        onPress={onDismiss}
        hitSlop={12}
        style={{ paddingHorizontal: 14, paddingVertical: 12 }}>
        <Text style={{ color: Colors.textMuted, fontSize: 16, fontWeight: '700' }}>×</Text>
      </Pressable>
    </Animated.View>
  );
}
