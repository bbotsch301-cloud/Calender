import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { LEARN_FEASTS, type LearnFeast } from '../../content/feasts-content';

interface Props {
  onPressFeast: (key: string) => void;
}

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
        <FeastRow feast={item} onPress={() => onPressFeast(item.key)} />
      )}
    />
  );
}

function FeastRow({
  feast,
  onPress,
}: {
  feast: LearnFeast;
  onPress: () => void;
}): React.ReactElement {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Learn about ${feast.englishName}`}
      style={({ pressed }) => ({
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 14,
        overflow: 'hidden',
        opacity: pressed ? 0.88 : 1,
      })}>
      <View style={{ flexDirection: 'row' }}>
        {/* Color band matching the feast */}
        <View style={{ width: 6, backgroundColor: feast.color }} />

        <View style={{ flex: 1, padding: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: 10,
            }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: Colors.text,
                  fontSize: 18,
                  fontWeight: '700',
                  letterSpacing: 0.3,
                }}
                numberOfLines={1}>
                {feast.englishName}
              </Text>
              <Text
                style={{
                  color: Colors.textMuted,
                  fontSize: 12,
                  marginTop: 2,
                  letterSpacing: 0.3,
                }}
                numberOfLines={1}>
                {feast.transliteration} · {feast.hebrewDate}
              </Text>
            </View>
            <Text
              style={{
                color: Colors.goldLight,
                fontSize: 22,
                fontWeight: '700',
                letterSpacing: 0.5,
              }}>
              {feast.hebrewName}
            </Text>
          </View>

          <Text
            style={{
              color: Colors.textMuted,
              fontSize: 11,
              marginTop: 10,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              fontWeight: '700',
            }}>
            {feast.torahRef}
          </Text>
          <Text
            style={{
              color: Colors.text,
              fontSize: 13,
              lineHeight: 20,
              marginTop: 6,
            }}
            numberOfLines={3}>
            {feast.meaning}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
            <Text
              style={{
                color: Colors.gold,
                fontSize: 11,
                letterSpacing: 1.5,
                fontWeight: '800',
                textTransform: 'uppercase',
              }}>
              Read more →
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
