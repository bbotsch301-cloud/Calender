import React from 'react';
import { Text, View } from 'react-native';
import { Colors } from '../../constants/colors';

/** Uppercase small-caps section header with a thin gold separator line. */
export function LearnSectionHeader({ children }: { children: string }): React.ReactElement {
  return (
    <View style={{ marginTop: 28, marginBottom: 12 }}>
      <Text
        style={{
          color: Colors.gold,
          fontSize: 11,
          letterSpacing: 2.5,
          textTransform: 'uppercase',
          fontWeight: '800',
        }}>
        {children}
      </Text>
      <View style={{ height: 1, backgroundColor: Colors.goldDark, marginTop: 6, opacity: 0.5 }} />
    </View>
  );
}

/** Scripture quote block: italic gold text, reference below in muted caps. */
export function ScriptureQuote({
  reference,
  text,
}: {
  reference: string;
  text: string;
}): React.ReactElement {
  return (
    <View style={{ marginTop: 4, marginBottom: 14 }}>
      <Text
        style={{
          color: Colors.goldLight,
          fontSize: 15,
          lineHeight: 24,
          fontStyle: 'italic',
          letterSpacing: 0.2,
        }}>
        "{text}"
      </Text>
      <Text
        style={{
          color: Colors.gold,
          fontSize: 11,
          letterSpacing: 2,
          textTransform: 'uppercase',
          fontWeight: '700',
          marginTop: 6,
        }}>
        — {reference}
      </Text>
    </View>
  );
}

/** Body paragraph with generous leading for the Learn screens. */
export function LearnParagraph({ children }: { children: string }): React.ReactElement {
  return (
    <Text
      style={{
        color: Colors.text,
        fontSize: 15,
        lineHeight: 25,
        marginBottom: 6,
      }}>
      {children}
    </Text>
  );
}
