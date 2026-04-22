import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRoute } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import { CalendarExplainer } from '../components/learn/CalendarExplainer';
import { FeastsList } from '../components/learn/FeastsList';
import { MonthsList } from '../components/learn/MonthsList';
import { FeastDetail } from '../components/learn/FeastDetail';
import { MonthDetail } from '../components/learn/MonthDetail';

export type LearnStackParamList = {
  LearnHome: { initialSection?: LearnSection } | undefined;
  FeastDetail: { feastKey: string };
  MonthDetail: { monthNumber: number };
};

export type LearnSection = 'calendar' | 'feasts' | 'months';

const Stack = createNativeStackNavigator<LearnStackParamList>();

/**
 * The Learn tab is a nested stack: a landing screen with 3 sub-sections
 * (CalendarExplainer / FeastsList / MonthsList), and two detail screens
 * that other tabs can deep-link into.
 */
export function LearnScreen(): React.ReactElement {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: Colors.background },
      }}>
      <Stack.Screen name="LearnHome" component={LearnHome} />
      <Stack.Screen name="FeastDetail" component={FeastDetailScreen} />
      <Stack.Screen name="MonthDetail" component={MonthDetailScreen} />
    </Stack.Navigator>
  );
}

/* ------------------------------------------------------------------ */
/* Landing page with segmented sub-nav                                */
/* ------------------------------------------------------------------ */

function LearnHome({
  navigation,
}: {
  navigation: { navigate: (name: string, params?: unknown) => void };
}): React.ReactElement {
  const route = useRoute();
  const initial = ((route.params as LearnStackParamList['LearnHome']) ?? {}).initialSection;
  const [section, setSection] = useState<LearnSection>(initial ?? 'calendar');

  // If the param changes (deep link from another tab), respect it.
  React.useEffect(() => {
    if (initial) setSection(initial);
  }, [initial]);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
        <Text
          style={{
            color: Colors.textMuted,
            fontSize: 11,
            letterSpacing: 2.5,
            textTransform: 'uppercase',
            fontWeight: '800',
          }}>
          Learn
        </Text>
      </View>

      <SubNav current={section} onChange={setSection} />

      {section === 'calendar' && <CalendarExplainer />}
      {section === 'feasts' && (
        <FeastsList
          onPressFeast={(feastKey) => navigation.navigate('FeastDetail', { feastKey })}
        />
      )}
      {section === 'months' && (
        <MonthsList
          onPressMonth={(monthNumber) =>
            navigation.navigate('MonthDetail', { monthNumber })
          }
        />
      )}
    </SafeAreaView>
  );
}

function SubNav({
  current,
  onChange,
}: {
  current: LearnSection;
  onChange: (s: LearnSection) => void;
}): React.ReactElement {
  const tabs: Array<{ key: LearnSection; label: string }> = [
    { key: 'calendar', label: 'The Calendar' },
    { key: 'feasts', label: 'Feasts' },
    { key: 'months', label: 'Months' },
  ];
  return (
    <View
      style={{
        flexDirection: 'row',
        marginHorizontal: 18,
        marginTop: 12,
        marginBottom: 8,
        padding: 4,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 10,
      }}>
      {tabs.map((t) => {
        const active = t.key === current;
        return (
          <Pressable
            key={t.key}
            onPress={() => onChange(t.key)}
            accessibilityRole="button"
            accessibilityLabel={t.label}
            accessibilityState={{ selected: active }}
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
                fontSize: 11,
                fontWeight: '800',
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}>
              {t.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Detail route wrappers                                              */
/* ------------------------------------------------------------------ */

interface FeastDetailRouteProps {
  route: { params: { feastKey: string } };
  navigation: { goBack: () => void };
}

function FeastDetailScreen({ route, navigation }: FeastDetailRouteProps): React.ReactElement {
  return <FeastDetail feastKey={route.params.feastKey} onBack={() => navigation.goBack()} />;
}

interface MonthDetailRouteProps {
  route: { params: { monthNumber: number } };
  navigation: { goBack: () => void };
}

function MonthDetailScreen({ route, navigation }: MonthDetailRouteProps): React.ReactElement {
  return (
    <MonthDetail monthNumber={route.params.monthNumber} onBack={() => navigation.goBack()} />
  );
}
