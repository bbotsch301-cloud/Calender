import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { getLearnFeastByKey } from '../../content/feasts-content';
import { LearnSectionHeader, ScriptureQuote, LearnParagraph } from './SharedLearnBits';

interface Props {
  feastKey: string;
  onBack: () => void;
}

export function FeastDetail({ feastKey, onBack }: Props): React.ReactElement {
  const feast = getLearnFeastByKey(feastKey);

  if (!feast) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.background }}>
        <View style={{ padding: 20 }}>
          <BackButton onPress={onBack} />
          <Text style={{ color: Colors.textMuted, marginTop: 20 }}>Feast not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}>
        {/* Colored header */}
        <View
          style={{
            backgroundColor: feast.color,
            paddingHorizontal: 22,
            paddingTop: 12,
            paddingBottom: 26,
          }}>
          <BackButton onPress={onBack} light />
          <Text
            style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: 11,
              letterSpacing: 2,
              textTransform: 'uppercase',
              fontWeight: '800',
              marginTop: 14,
            }}>
            {feast.transliteration}
          </Text>
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 38,
              fontWeight: '800',
              marginTop: 2,
              letterSpacing: 0.3,
            }}>
            {feast.hebrewName}
          </Text>
          <Text
            style={{
              color: 'rgba(255,255,255,0.95)',
              fontSize: 18,
              fontWeight: '600',
              marginTop: 6,
              letterSpacing: 0.2,
            }}>
            {feast.englishName}
          </Text>
          <Text
            style={{
              color: 'rgba(255,255,255,0.78)',
              fontSize: 13,
              marginTop: 8,
            }}>
            {feast.hebrewDate} · {feast.gregorianApprox}
          </Text>
        </View>

        <View style={{ paddingHorizontal: 22 }}>
          <LearnSectionHeader>Scripture</LearnSectionHeader>
          <ScriptureQuote reference={feast.torahRef} text={feast.commandmentQuote} />

          <LearnSectionHeader>What it means</LearnSectionHeader>
          <LearnParagraph>{feast.meaning}</LearnParagraph>

          <LearnSectionHeader>Prophetic fulfillment</LearnSectionHeader>
          <LearnParagraph>{feast.propheticFulfillment}</LearnParagraph>

          <LearnSectionHeader>How it is observed</LearnSectionHeader>
          <LearnParagraph>{feast.howObserved}</LearnParagraph>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function BackButton({
  onPress,
  light,
}: {
  onPress: () => void;
  light?: boolean;
}): React.ReactElement {
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
          color: light ? 'rgba(255,255,255,0.95)' : Colors.gold,
          fontSize: 14,
          fontWeight: '700',
          letterSpacing: 0.5,
        }}>
        ← Back
      </Text>
    </Pressable>
  );
}
