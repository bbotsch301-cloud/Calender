import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Colors, FeastPillColors } from '../../constants/colors';

interface LegendChip {
  label: string;
  color: string;
}

/**
 * Legend chip colors match the stripes painted in DayCell. Rosh Chodesh
 * and Shabbat — which aren't "feasts" per the engine — get their own
 * tokens from the Colors palette.
 */
const LEGEND_CHIPS: LegendChip[] = [
  { label: 'Shabbat', color: Colors.shabbatStripe },
  { label: 'Rosh Chodesh', color: Colors.roshChodeshStripe },
  { label: 'Passover', color: FeastPillColors.passover.bg },
  { label: 'Unleavened', color: FeastPillColors.unleavenedBread.bg },
  { label: 'Firstfruits', color: FeastPillColors.firstfruits.bg },
  { label: 'Shavuot', color: FeastPillColors.shavuot.bg },
  { label: 'Yom Teruah', color: FeastPillColors.yomTeruah.bg },
  { label: 'Yom Kippur', color: FeastPillColors.yomKippur.bg },
  { label: 'Sukkot', color: FeastPillColors.sukkot.bg },
  { label: '8th Day', color: FeastPillColors.sheminiAtzeret.bg },
  { label: 'Hanukkah', color: FeastPillColors.hanukkah.bg },
  { label: 'Purim', color: FeastPillColors.purim.bg },
];

export function LegendBar(): React.ReactElement {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 8,
        paddingVertical: 4,
        gap: 10,
        alignItems: 'center',
      }}
      style={{ backgroundColor: 'transparent' }}>
      {LEGEND_CHIPS.map((chip) => (
        <View
          key={chip.label}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 3,
              backgroundColor: chip.color,
            }}
          />
          <Text
            numberOfLines={1}
            style={{
              color: Colors.textMuted,
              fontSize: 9,
              fontWeight: '600',
              letterSpacing: 0.3,
            }}>
            {chip.label}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}
