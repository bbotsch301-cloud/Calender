import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../constants/colors';
import { GoldText } from '../components/ui/GoldText';
import { YearTimeline, YearTimelineLegend } from '../components/timeline/YearTimeline';
import { gregorianToHebrew, toHebrewNumeral } from '../engine/hebrewCalendar';
import type { RootStackParamList } from '../navigation/RootNavigator';

export function YearScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const today = useMemo(() => new Date(), []);
  const currentHebrewYear = gregorianToHebrew(today).year;
  const [year, setYear] = useState<number>(currentHebrewYear);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 20, paddingTop: 6 }}>
          <Text
            style={{
              color: Colors.textMuted,
              fontSize: 11,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}>
            Year at a Glance
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
            <Text style={{ color: Colors.text, fontSize: 26, fontWeight: '800', letterSpacing: 0.3 }}>
              God's Year
            </Text>
            <GoldText size="2xl" weight="bold" glow>
              {year}
            </GoldText>
            <Text style={{ color: Colors.gold, fontSize: 16, fontWeight: '600' }}>
              · {toHebrewNumeral(year)}
            </Text>
          </View>
        </View>

        {/* Toggle */}
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 20,
            marginTop: 14,
            marginBottom: 8,
            backgroundColor: Colors.surface,
            borderRadius: 10,
            padding: 4,
            borderWidth: 1,
            borderColor: Colors.border,
          }}>
          <ToggleBtn
            label="This Year"
            active={year === currentHebrewYear}
            onPress={() => setYear(currentHebrewYear)}
          />
          <ToggleBtn
            label="Next Year"
            active={year === currentHebrewYear + 1}
            onPress={() => setYear(currentHebrewYear + 1)}
          />
        </View>

        <YearTimeline
          hebrewYear={year}
          onFeastPress={(f) =>
            navigation.navigate('EventDetail', {
              feastKey: f.key,
              year: f.startDate.getFullYear(),
            })
          }
        />

        <YearTimelineLegend />
      </ScrollView>
    </SafeAreaView>
  );
}

function ToggleBtn({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        paddingVertical: 8,
        borderRadius: 7,
        alignItems: 'center',
        backgroundColor: active ? Colors.gold : 'transparent',
      }}>
      <Text
        style={{
          color: active ? Colors.background : Colors.textMuted,
          fontSize: 12,
          fontWeight: '700',
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}>
        {label}
      </Text>
    </Pressable>
  );
}
