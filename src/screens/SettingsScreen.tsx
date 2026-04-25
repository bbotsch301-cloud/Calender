import React from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { LocationEditor } from '../components/shared/LocationEditor';
import { useSettingsStore } from '../store/useSettingsStore';

export function SettingsScreen(): React.ReactElement {
  const weekStartSunday = useSettingsStore((s) => s.weekStartSunday);
  const setWeekStartSunday = useSettingsStore((s) => s.setWeekStartSunday);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 60 }}>
        <Text
          style={{
            color: Colors.textMuted,
            fontSize: 11,
            letterSpacing: 2.5,
            textTransform: 'uppercase',
            fontWeight: '800',
          }}>
          Settings
        </Text>

        {/* Location */}
        <Section title="Location for Sunset Times">
          <Text
            style={{
              color: Colors.textMuted,
              fontSize: 11,
              fontStyle: 'italic',
              lineHeight: 17,
              marginBottom: 12,
            }}>
            Your location is used to calculate the exact local sunset time, which determines
            when each biblical day begins.
          </Text>
          <LocationEditor />
        </Section>

        {/* Display */}
        <Section title="Display">
          <Row
            label="Week starts on Sunday"
            sublabel={
              weekStartSunday
                ? 'Sunday → Saturday (standard)'
                : 'Saturday → Friday (Shabbat in first column)'
            }
            right={
              <Switch
                value={weekStartSunday}
                onValueChange={setWeekStartSunday}
                trackColor={{ false: Colors.border, true: Colors.goldDark }}
                thumbColor={weekStartSunday ? Colors.gold : Colors.textMuted}
                accessibilityLabel="Toggle week start day"
              />
            }
          />
        </Section>

        {/* About */}
        <Section title="About">
          <Text style={{ color: Colors.text, fontSize: 15, fontWeight: '700' }}>
            Kingdom Calendar
          </Text>
          <Text style={{ color: Colors.textMuted, fontSize: 12, marginTop: 2 }}>Version 1.0.0</Text>
          <Text style={{ color: Colors.textMuted, fontSize: 12, marginTop: 12, lineHeight: 18 }}>
            Biblical dates calculated using the Hebrew calendar. Day begins at sunset.
          </Text>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <View style={{ marginTop: 24 }}>
      <Text
        style={{
          color: Colors.textMuted,
          fontSize: 11,
          letterSpacing: 2,
          textTransform: 'uppercase',
          fontWeight: '700',
          marginBottom: 10,
        }}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function Row({
  label,
  sublabel,
  right,
}: {
  label: string;
  sublabel?: string;
  right: React.ReactNode;
}): React.ReactElement {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 14,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
      }}>
      <View style={{ flex: 1, paddingRight: 10 }}>
        <Text style={{ color: Colors.text, fontSize: 14, fontWeight: '600' }}>{label}</Text>
        {sublabel && (
          <Text style={{ color: Colors.textMuted, fontSize: 11, marginTop: 2 }}>{sublabel}</Text>
        )}
      </View>
      {right}
    </View>
  );
}
