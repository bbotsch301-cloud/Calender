import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FeastPillColors } from '../../constants/colors';
import { getLearnMonthByNumber } from '../../content/months-content';
import { getLearnFeastByKey } from '../../content/feasts-content';
import { LearnSectionHeader, LearnParagraph } from './SharedLearnBits';

interface Props {
  monthNumber: number;
  onBack: () => void;
}

export function MonthDetail({ monthNumber, onBack }: Props): React.ReactElement {
  const month = getLearnMonthByNumber(monthNumber);

  if (!month) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.background }}>
        <View style={{ padding: 20 }}>
          <BackButton onPress={onBack} />
          <Text style={{ color: Colors.textMuted, marginTop: 20 }}>Month not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 22, paddingTop: 12, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}>
        <BackButton onPress={onBack} />

        <Text
          style={{
            color: Colors.textMuted,
            fontSize: 11,
            letterSpacing: 2.5,
            textTransform: 'uppercase',
            fontWeight: '800',
            marginTop: 14,
          }}>
          Month {month.number}
        </Text>
        <Text
          style={{
            color: Colors.goldLight,
            fontSize: 44,
            fontWeight: '700',
            letterSpacing: 0.3,
            marginTop: 6,
          }}>
          {month.hebrewName}
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
        <Text style={{ color: Colors.textMuted, fontSize: 13, marginTop: 6 }}>
          {month.gregorianApprox} · {month.days} days
        </Text>

        <LearnSectionHeader>Meaning</LearnSectionHeader>
        <LearnParagraph>{month.meaning}</LearnParagraph>

        {month.feasts.length > 0 && (
          <>
            <LearnSectionHeader>Feasts this month</LearnSectionHeader>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {month.feasts.map((key) => {
                const learnFeast = getLearnFeastByKey(key);
                const pill = FeastPillColors[key];
                const bg = pill?.bg ?? Colors.gold;
                const fg = pill?.text ?? Colors.background;
                const label = learnFeast?.englishName ?? key;
                return (
                  <View
                    key={key}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 999,
                      backgroundColor: bg,
                    }}>
                    <Text
                      style={{
                        color: fg,
                        fontSize: 12,
                        fontWeight: '800',
                        letterSpacing: 0.5,
                      }}>
                      {label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        <LearnSectionHeader>Biblical events</LearnSectionHeader>
        {month.biblicalEvents.map((ev, i) => (
          <View
            key={i}
            style={{ flexDirection: 'row', marginTop: i === 0 ? 4 : 10, gap: 10 }}>
            <Text
              style={{
                color: Colors.gold,
                fontSize: 14,
                fontWeight: '800',
                lineHeight: 22,
              }}>
              ·
            </Text>
            <Text
              style={{
                color: Colors.text,
                fontSize: 14,
                lineHeight: 22,
                flex: 1,
              }}>
              {ev}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function BackButton({ onPress }: { onPress: () => void }): React.ReactElement {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Back"
      hitSlop={12}
      style={({ pressed }) => ({
        alignSelf: 'flex-start',
        paddingVertical: 4,
        opacity: pressed ? 0.7 : 1,
      })}>
      <Text
        style={{
          color: Colors.gold,
          fontSize: 14,
          fontWeight: '700',
          letterSpacing: 0.5,
        }}>
        ← Back
      </Text>
    </Pressable>
  );
}
