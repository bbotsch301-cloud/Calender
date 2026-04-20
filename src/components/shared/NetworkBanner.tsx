import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { useNetworkStore } from '../../store/useNetworkStore';

const SHOW_THRESHOLD = 2; // surface after 2 consecutive failures
const STALE_MS = 60_000;  // auto-hide after 1 min of no new failures

export function NetworkBanner(): React.ReactElement | null {
  const { consecutiveFailures, lastErrorAt, lastErrorMessage, clearError } = useNetworkStore();
  const opacity = useRef(new Animated.Value(0)).current;
  const shouldShow =
    consecutiveFailures >= SHOW_THRESHOLD &&
    lastErrorAt !== null &&
    Date.now() - lastErrorAt < STALE_MS;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: shouldShow ? 1 : 0,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [shouldShow]);

  // Also self-clear once the banner has been visible and nothing new happened.
  useEffect(() => {
    if (!shouldShow || !lastErrorAt) return;
    const t = setTimeout(() => clearError(), STALE_MS);
    return () => clearTimeout(t);
  }, [shouldShow, lastErrorAt]);

  if (!shouldShow) return null;

  return (
    <View
      pointerEvents="box-none"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 9998 }}>
      <SafeAreaView edges={['top']}>
        <Animated.View style={{ opacity, paddingHorizontal: 14, marginTop: 6 }}>
          <Pressable
            accessibilityLabel="Dismiss connection issue banner"
            onPress={clearError}
            style={{
              borderRadius: 12,
              borderWidth: 1,
              borderColor: Colors.warning,
              backgroundColor: 'rgba(30,18,4,0.95)',
              paddingHorizontal: 14,
              paddingVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}>
            <Text style={{ fontSize: 16 }}>⚠</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: Colors.warning, fontSize: 11, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                Connection issue
              </Text>
              <Text style={{ color: Colors.text, fontSize: 12, marginTop: 2 }} numberOfLines={2}>
                {lastErrorMessage ?? 'Having trouble reaching the server. Your data will sync when you reconnect.'}
              </Text>
            </View>
            <Text style={{ color: Colors.textMuted, fontSize: 14 }}>×</Text>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
