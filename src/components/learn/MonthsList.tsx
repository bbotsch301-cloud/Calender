import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { LEARN_MONTHS, type LearnMonth } from '../../content/months-content';

interface Props {
  onPressMonth: (monthNumber: number) => void;
}

export function MonthsList({ onPressMonth }: Props): React.ReactElement {
  return (
    <FlatList
      data={LEARN_MONTHS}
      keyExtractor={(m) => String(m.number)}
      contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 10, paddingBottom: 40 }}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      initialNumToRender={6}
      maxToRenderPerBatch={4}
      windowSize={5}
      renderItem={({ item }) => (
        <MonthRow month={item} onPress={() => onPressMonth(item.number)} />
      )}
    />
  );
}

function MonthRow({
  month,
  onPress,
}: {
  month: LearnMonth;
  onPress: () => void;
}): React.ReactElement {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Learn about ${month.transliteration}`}
      style={({ pressed }) => ({
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 14,
        padding: 16,
        opacity: pressed ? 0.88 : 1,
      })}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: Colors.textMuted,
              fontSize: 10,
              letterSpacing: 2,
              textTransform: 'uppercase',
              fontWeight: '700',
            }}>
            Month {month.number}
          </Text>
          <Text
            style={{
              color: Colors.text,
              fontSize: 22,
              fontWeight: '800',
              marginTop: 2,
              letterSpacing: 0.3,
            }}>
            {month.transliteration}
          </Text>
          <Text
            style={{
              color: Colors.textMuted,
              fontSize: 12,
              marginTop: 4,
            }}>
            {month.gregorianApprox} · {month.days} days
          </Text>
        </View>
        <Text
          style={{
            color: Colors.goldLight,
            fontSize: 28,
            fontWeight: '700',
          }}>
          {month.hebrewName}
        </Text>
      </View>
      {month.feasts.length > 0 && (
        <Text
          style={{
            color: Colors.gold,
            fontSize: 11,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            fontWeight: '700',
            marginTop: 10,
          }}
          numberOfLines={1}>
          Feasts: {month.feasts.join(', ')}
        </Text>
      )}
    </Pressable>
  );
}
