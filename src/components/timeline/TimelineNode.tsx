import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Colors, FeastColors } from '../../constants/colors';
import type { Feast } from '../../engine/feasts';

interface Props {
  feast: Feast;
  state: 'past' | 'active' | 'upcoming';
  onPress?: () => void;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ICON_MAP: Record<string, string> = {
  lamb: '🐑',
  wheat: '🌾',
  sheaf: '🌾',
  flame: '🔥',
  trumpet: '📯',
  incense: '✦',
  palm: '🌴',
  star: '✶',
};

export function TimelineNode({ feast, state, onPress }: Props) {
  const baseColor = FeastColors[feast.key] ?? Colors.gold;
  const dim = state === 'past';
  const isActive = state === 'active';
  const opacity = dim ? 0.45 : 1;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
      <View style={{ width: 130, alignItems: 'center', opacity }}>
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isActive ? baseColor : `${baseColor}33`,
            borderWidth: 2,
            borderColor: isActive ? Colors.goldLight : baseColor,
            shadowColor: baseColor,
            shadowOpacity: isActive ? 0.9 : 0.3,
            shadowRadius: isActive ? 18 : 6,
            shadowOffset: { width: 0, height: 0 },
            elevation: isActive ? 12 : 4,
          }}>
          <Text style={{ fontSize: 22 }}>{ICON_MAP[feast.icon] ?? '✦'}</Text>
        </View>
        <View
          style={{
            height: 28,
            width: 1,
            backgroundColor: dim ? Colors.border : Colors.textMuted,
            marginVertical: 6,
          }}
        />
        <Text
          numberOfLines={2}
          style={{
            color: Colors.text,
            fontSize: 12,
            fontWeight: '700',
            textAlign: 'center',
            letterSpacing: 0.3,
            paddingHorizontal: 4,
          }}>
          {feast.name}
        </Text>
        <Text style={{ color: Colors.textMuted, fontSize: 11, marginTop: 2 }}>
          {MONTHS[feast.startDate.getMonth()]} {feast.startDate.getDate()}
        </Text>
        {isActive && (
          <Text
            style={{
              color: Colors.goldLight,
              fontSize: 9,
              letterSpacing: 1.5,
              fontWeight: '800',
              marginTop: 4,
              textTransform: 'uppercase',
            }}>
            Active
          </Text>
        )}
      </View>
    </Pressable>
  );
}
