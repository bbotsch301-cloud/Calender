import React, { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { LEARN_FEASTS, type LearnFeast } from '../../content/feasts-content';
import { ScriptureQuote } from './SharedLearnBits';

interface Props {
  onPressFeast: (key: string) => void;
}

/**
 * Each row is collapsed by default; tapping it expands to reveal the
 * commandment quote, meaning, prophetic fulfillment, and how it's
 * observed. A subtle "Full detail →" link at the bottom of the
 * expanded section navigates to the dedicated FeastDetail screen for
 * users who prefer the full-screen reading experience.
 */
export function FeastsList({ onPressFeast }: Props): React.ReactElement {
  return (
    <FlatList
      data={LEARN_FEASTS}
      keyExtractor={(f) => f.key}
      contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 10, paddingBottom: 40 }}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      initialNumToRender={6}
      maxToRenderPerBatch={4}
      windowSize={5}
      renderItem={({ item }) => (
        <FeastRow feast={item} onOpenFullDetail={() => onPressFeast(item.key)} />
      )}
    />
  );
}

function FeastRow({
  feast,
  onOpenFullDetail,
}: {
  feast: LearnFeast;
  onOpenFullDetail: () => void;
}): React.ReactElement {
  const [expanded, setExpanded] = useState(false);

  return (
    <View
      style={{
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 14,
        overflow: 'hidden',
      }}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ width: 3, backgroundColor: feast.color }} />
        <Pressable
          onPress={() => setExpanded((v) => !v)}
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          accessibilityLabel={`${feast.englishName}${expanded ? ' · collapse' : ' · expand'}`}
          style={({ pressed }) => ({
            flex: 1,
            padding: 14,
            opacity: pressed ? 0.9 : 1,
          })}>
          {/* Summary header */}
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                style={{
                  color: Colors.text,
                  fontSize: 16,
                  fontWeight: '700',
                  letterSpacing: 0.3,
                }}>
                {feast.englishName}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  color: Colors.textMuted,
                  fontSize: 12,
                  marginTop: 2,
                }}>
                {feast.hebrewDate}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  color: Colors.textMuted,
                  fontSize: 11,
                  marginTop: 2,
                  letterSpacing: 0.5,
                }}>
                {feast.torahRef}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text
                numberOfLines={1}
                style={{
                  color: Colors.gold,
                  fontSize: 14,
                  fontWeight: '700',
                  letterSpacing: 0.3,
                }}>
                {feast.hebrewName}
              </Text>
              <Text
                style={{
                  color: Colors.gold,
                  fontSize: 11,
                  fontWeight: '700',
                  marginTop: 8,
                  letterSpacing: 0.5,
                }}>
                {expanded ? '▲ Close' : '▼ Read more'}
              </Text>
            </View>
          </View>

          {/* Expanded content */}
          {expanded && (
            <View style={{ marginTop: 14, gap: 14 }}>
              <ScriptureQuote reference={feast.torahRef} text={feast.commandmentQuote} />

              <Section label="What it means" body={feast.meaning} />
              <Section label="Prophetic fulfillment" body={feast.propheticFulfillment} />
              <Section label="How it is observed" body={feast.howObserved} />

              <Pressable
                onPress={onOpenFullDetail}
                accessibilityRole="button"
                accessibilityLabel={`Open full detail for ${feast.englishName}`}
                style={({ pressed }) => ({
                  alignSelf: 'flex-end',
                  paddingVertical: 6,
                  opacity: pressed ? 0.7 : 1,
                })}>
                <Text
                  style={{
                    color: Colors.gold,
                    fontSize: 11,
                    fontWeight: '800',
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                  }}>
                  Full detail →
                </Text>
              </Pressable>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

function Section({ label, body }: { label: string; body: string }): React.ReactElement {
  return (
    <View>
      <Text
        style={{
          color: Colors.gold,
          fontSize: 10,
          letterSpacing: 2,
          textTransform: 'uppercase',
          fontWeight: '800',
          marginBottom: 4,
        }}>
        {label}
      </Text>
      <Text style={{ color: Colors.text, fontSize: 13, lineHeight: 21 }}>{body}</Text>
    </View>
  );
}
