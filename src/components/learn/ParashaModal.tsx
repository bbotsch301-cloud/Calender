import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import {
  getLearnParashaByKey,
  learnParashaKeyFor,
  LEARN_PARASHOT,
  type LearnParasha,
} from '../../content/parasha-content';

interface Props {
  /** The transliterated parasha name coming from the date-based calc. */
  parashaName: string | null;
  /** Optional paired parasha name in non-leap weeks. */
  pairedName?: string | null;
  /** Formatted Shabbat date, e.g. "Sat Apr 25, 2026". */
  sabbathDateLabel?: string;
  visible: boolean;
  onClose: () => void;
}

function resolveParasha(name: string): LearnParasha | undefined {
  return (
    getLearnParashaByKey(learnParashaKeyFor(name)) ??
    LEARN_PARASHOT.find((p) => p.transliteration.toLowerCase() === name.toLowerCase())
  );
}

export function ParashaModal({
  parashaName,
  pairedName,
  sabbathDateLabel,
  visible,
  onClose,
}: Props): React.ReactElement {
  const primary = parashaName ? resolveParasha(parashaName) : undefined;
  const paired = pairedName ? resolveParasha(pairedName) : undefined;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close parasha detail"
        style={{
          flex: 1,
          backgroundColor: Colors.modalBackdrop,
          justifyContent: 'flex-end',
        }}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          accessible={false}
          style={{
            backgroundColor: Colors.surface,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderTopWidth: 1,
            borderColor: Colors.border,
            paddingBottom: 32,
            maxHeight: '88%',
          }}>
          <View style={{ alignItems: 'center', paddingVertical: 10 }}>
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: Colors.border,
              }}
            />
          </View>

          <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Close"
                hitSlop={12}
                style={{ padding: 4 }}>
                <Text style={{ color: Colors.textMuted, fontSize: 22, fontWeight: '600' }}>
                  ×
                </Text>
              </Pressable>
            </View>

            {primary ? (
              <>
                <Text
                  style={{
                    color: Colors.textMuted,
                    fontSize: 11,
                    letterSpacing: 2.5,
                    textTransform: 'uppercase',
                    fontWeight: '800',
                  }}>
                  This Week's Torah Portion
                </Text>

                <Text
                  style={{
                    color: Colors.goldLight,
                    fontSize: 30,
                    fontWeight: '700',
                    marginTop: 6,
                    letterSpacing: 0.3,
                  }}>
                  {primary.hebrewName}
                  {paired ? ` · ${paired.hebrewName}` : ''}
                </Text>
                <Text
                  style={{
                    color: Colors.text,
                    fontSize: 20,
                    fontWeight: '700',
                    marginTop: 4,
                  }}>
                  {primary.transliteration}
                  {paired ? ` · ${paired.transliteration}` : ''}
                </Text>
                <Text style={{ color: Colors.textMuted, fontSize: 13, marginTop: 4 }}>
                  {primary.meaning}
                  {paired ? ` / ${paired.meaning}` : ''}
                </Text>

                <Section label="Torah reading">
                  <Text style={{ color: Colors.text, fontSize: 14, lineHeight: 22 }}>
                    {primary.torahReading}
                    {paired ? `  ·  ${paired.torahReading}` : ''}
                  </Text>
                </Section>

                <Section label="Haftarah">
                  <Text style={{ color: Colors.text, fontSize: 14, lineHeight: 22 }}>
                    {primary.haftarah}
                    {paired ? `  ·  ${paired.haftarah}` : ''}
                  </Text>
                </Section>

                <Section label="Summary">
                  <Text style={{ color: Colors.text, fontSize: 14, lineHeight: 22 }}>
                    {primary.summary}
                  </Text>
                  {paired && (
                    <Text
                      style={{
                        color: Colors.text,
                        fontSize: 14,
                        lineHeight: 22,
                        marginTop: 10,
                        opacity: 0.9,
                      }}>
                      {paired.summary}
                    </Text>
                  )}
                </Section>

                {sabbathDateLabel && (
                  <Text
                    style={{
                      color: Colors.textMuted,
                      fontSize: 12,
                      marginTop: 18,
                      fontStyle: 'italic',
                    }}>
                    Reading on {sabbathDateLabel}
                  </Text>
                )}
              </>
            ) : (
              <Text style={{ color: Colors.textMuted, fontSize: 14, marginTop: 20 }}>
                Parasha details unavailable for "{parashaName ?? ''}".
              </Text>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <View style={{ marginTop: 18 }}>
      <Text
        style={{
          color: Colors.gold,
          fontSize: 10,
          letterSpacing: 2,
          textTransform: 'uppercase',
          fontWeight: '800',
          marginBottom: 6,
        }}>
        {label}
      </Text>
      {children}
    </View>
  );
}
