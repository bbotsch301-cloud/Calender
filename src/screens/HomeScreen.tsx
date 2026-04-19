import React, { useEffect } from 'react';
import { ScrollView, View, Text, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFeastStore } from '../store/useFeastStore';
import { useCurrentDay } from '../hooks/useCurrentDay';
import { useThemeStore } from '../store/useThemeStore';
import { Colors } from '../constants/colors';
import { DualDateHeader } from '../components/shared/DualDateHeader';
import { CountdownTimer } from '../components/shared/CountdownTimer';
import { MoonPhaseDisplay } from '../components/shared/MoonPhaseDisplay';
import { LocationBanner } from '../components/shared/LocationBanner';
import { MeaningOfToday } from '../components/shared/MeaningOfToday';
import { ParashaCard } from '../components/shared/ParashaCard';
import { OmerBadge } from '../components/shared/OmerBadge';
import { isOmerSeason, getOmerDay } from '../engine/omer';
import { TimelineScroll } from '../components/timeline/TimelineScroll';
import { FeastModeOverlay } from '../components/feast/FeastModeOverlay';
import { FeastCard } from '../components/feast/FeastCard';
import { GoldText } from '../components/ui/GoldText';
import type { RootStackParamList } from '../navigation/RootNavigator';

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { allFeasts, currentFeast, nextFeast, loadFeasts } = useFeastStore();
  const day = useCurrentDay();
  const applyFeastTheme = useThemeStore((s) => s.applyFeastTheme);
  const resetTheme = useThemeStore((s) => s.resetTheme);

  useEffect(() => {
    if (currentFeast) applyFeastTheme(currentFeast.key);
    else resetTheme();
  }, [currentFeast?.key]);

  const onRefresh = () => loadFeasts();

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} tintColor={Colors.gold} />}
        showsVerticalScrollIndicator={false}>
        <DualDateHeader date={day.gregorianDate} />

        <View
          style={{
            paddingHorizontal: 20,
            marginTop: -4,
            marginBottom: 8,
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 10,
          }}>
          <MoonPhaseDisplay date={day.gregorianDate} compact />
          <OmerBadge
            date={day.gregorianDate}
            compact
            onPress={() => navigation.navigate('Omer')}
          />
        </View>

        <LocationBanner />

        {currentFeast && <FeastModeOverlay feast={currentFeast} />}

        <View style={{ marginTop: 6, paddingHorizontal: 16 }}>
          <CountdownTimer
            target={day.nextDayBegins}
            label="Next biblical day begins in"
          />
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
          <MeaningOfToday
            hebrewDate={day.hebrewDate}
            activeFeast={currentFeast}
            isOmerSeason={isOmerSeason(day.gregorianDate)}
            omerDay={getOmerDay(day.gregorianDate)}
            dayOfWeek={day.gregorianDate.getDay()}
            collapsible
          />
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
          <ParashaCard date={day.gregorianDate} title="This Week's Reading" />
        </View>

        <View style={{ marginTop: 24 }}>
          <SectionTitle title="Sacred Timeline" subtitle="The appointed times" />
          <TimelineScroll
            feasts={allFeasts}
            currentDate={day.gregorianDate}
            onFeastPress={(f) =>
              navigation.navigate('EventDetail', {
                feastKey: f.key,
                year: f.startDate.getFullYear(),
              })
            }
          />
        </View>

        {nextFeast && (
          <View style={{ marginTop: 18, paddingHorizontal: 16 }}>
            <SectionTitle title="Next Feast" subtitle={nextFeast.leviticusRef} />
            <FeastCard
              feast={nextFeast}
              onPress={() =>
                navigation.navigate('EventDetail', {
                  feastKey: nextFeast.key,
                  year: nextFeast.startDate.getFullYear(),
                })
              }
            />
          </View>
        )}

        <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
          <SectionTitle title="The Eight Feasts" subtitle="Leviticus 23" />
          {allFeasts
            .filter((f) => f.startDate.getFullYear() === day.gregorianDate.getFullYear())
            .map((f) => (
              <FeastCard
                key={`${f.key}-${f.startDate.toISOString()}`}
                feast={f}
                highlighted={currentFeast?.key === f.key}
                onPress={() =>
                  navigation.navigate('EventDetail', {
                    feastKey: f.key,
                    year: f.startDate.getFullYear(),
                  })
                }
              />
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
      <Text
        style={{
          color: Colors.textMuted,
          fontSize: 10,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}>
        {subtitle}
      </Text>
      <GoldText size="lg" weight="bold" style={{ marginTop: 2 }}>
        {title}
      </GoldText>
    </View>
  );
}
