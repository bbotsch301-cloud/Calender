import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { LEARN_MONTHS, type LearnMonth } from '../../content/months-content';

/**
 * The month-content file uses camelCase keys (`unleavenedBread`,
 * `omerCount`, …). The summary card renders them as a comma list, so
 * we map to human-readable names. Lookup is lowercase-keyed because
 * `key.toLowerCase()` is what callers compare against.
 */
const FEAST_DISPLAY_NAME: Record<string, string> = {
  passover: 'Passover',
  unleavenedbread: 'Unleavened Bread',
  firstfruits: 'Firstfruits',
  omercount: 'Counting of the Omer',
  shavuot: 'Shavuot',
  yomteruah: 'Yom Teruah',
  yomkippur: 'Yom Kippur',
  sukkot: 'Sukkot',
  sheminiatzeret: 'Shemini Atzeret',
  roshchodesh: 'Rosh Chodesh',
  hanukkah: 'Hanukkah',
  purim: 'Purim',
  shabbat: 'Shabbat',
};

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
            fontSize: 12,
            letterSpacing: 0.3,
            fontWeight: '600',
            marginTop: 10,
          }}
          numberOfLines={1}>
          Feasts:{' '}
          {month.feasts
            .map((k) => FEAST_DISPLAY_NAME[k.toLowerCase()] ?? k)
            .join(', ')}
        </Text>
      )}
    </Pressable>
  );
}
