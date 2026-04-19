import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, Easing } from 'react-native';
import { Colors } from '../../constants/colors';
import { GoldText } from '../ui/GoldText';
import { DarkCard } from '../ui/DarkCard';
import type { Feast } from '../../engine/feasts';
import type { HebrewDate } from '../../engine/hebrewCalendar';
import { generateMeaningOfToday } from '../../engine/meaningOfToday';
import { generateMeaningOfTodayWithAI, isAIConfigured } from '../../services/aiMeaning';
import { useAlignment } from '../../hooks/useAlignment';

interface Props {
  hebrewDate: HebrewDate;
  activeFeast?: Feast | null;
  isOmerSeason?: boolean;
  omerDay?: number | null;
  dayOfWeek?: number;
  collapsible?: boolean; // Used on HomeScreen
}

export function MeaningOfToday({
  hebrewDate,
  activeFeast,
  isOmerSeason,
  omerDay,
  dayOfWeek,
  collapsible = false,
}: Props) {
  const { logActivity } = useAlignment();
  const [text, setText] = useState<string>(() =>
    generateMeaningOfToday({ hebrewDate, activeFeast, isOmerSeason, omerDay, dayOfWeek })
  );
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(collapsible);
  const [reflected, setReflected] = useState(false);
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    if (isAIConfigured) {
      setLoading(true);
      Animated.loop(
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      generateMeaningOfTodayWithAI({
        hebrewDate,
        activeFeast,
        isOmerSeason,
        omerDay,
        dayOfWeek,
        signal: controller.signal,
      })
        .then((t) => {
          if (cancelled) return;
          setText(t);
        })
        .finally(() => {
          if (!cancelled) {
            setLoading(false);
            shimmer.stopAnimation();
          }
        });
    }

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [hebrewDate.year, hebrewDate.month, hebrewDate.day, activeFeast?.key, omerDay, dayOfWeek]);

  function onReflect() {
    if (reflected) return;
    logActivity('scripture');
    setReflected(true);
  }

  const shimmerOpacity = shimmer.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.15, 0.45, 0.15] });

  return (
    <DarkCard>
      <Pressable
        onPress={() => collapsible && setCollapsed((c) => !c)}
        disabled={!collapsible}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <GoldText size="sm" weight="bold" style={{ letterSpacing: 1.5, textTransform: 'uppercase' }}>
          ✦ Meaning of Today
        </GoldText>
        {collapsible && (
          <Text style={{ color: Colors.textMuted, fontSize: 18 }}>{collapsed ? '+' : '−'}</Text>
        )}
      </Pressable>

      {!collapsed && (
        <View style={{ marginTop: 10 }}>
          {loading ? (
            <Animated.View style={{ opacity: shimmerOpacity }}>
              <View style={{ height: 14, backgroundColor: Colors.border, borderRadius: 4, marginBottom: 8 }} />
              <View style={{ height: 14, backgroundColor: Colors.border, borderRadius: 4, marginBottom: 8, width: '92%' }} />
              <View style={{ height: 14, backgroundColor: Colors.border, borderRadius: 4, width: '78%' }} />
            </Animated.View>
          ) : (
            <Text style={{ color: Colors.text, fontSize: 14, lineHeight: 22 }}>{text}</Text>
          )}

          <Pressable
            onPress={onReflect}
            disabled={reflected}
            style={({ pressed }) => ({
              marginTop: 14,
              alignSelf: 'flex-start',
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: reflected ? Colors.success : Colors.gold,
              backgroundColor: reflected ? 'rgba(101,163,13,0.12)' : 'rgba(201,168,76,0.08)',
              opacity: pressed ? 0.85 : 1,
            })}>
            <Text
              style={{
                color: reflected ? Colors.success : Colors.gold,
                fontSize: 11,
                fontWeight: '800',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}>
              {reflected ? '✓ Reflected' : 'Reflect'}
            </Text>
          </Pressable>
        </View>
      )}
    </DarkCard>
  );
}
