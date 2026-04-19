import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/useAuthStore';
import { useFeastStore } from '../store/useFeastStore';
import { useAlignmentStore } from '../store/useAlignmentStore';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { TabNavigator } from './TabNavigator';
import { EventDetailScreen } from '../screens/EventDetailScreen';
import { DailyViewScreen } from '../screens/DailyViewScreen';
import { OmerScreen } from '../screens/OmerScreen';
import { OnboardingScreen1 } from '../screens/onboarding/OnboardingScreen1';
import { OnboardingScreen2 } from '../screens/onboarding/OnboardingScreen2';
import { OnboardingScreen3, ONBOARDING_KEY } from '../screens/onboarding/OnboardingScreen3';
import { Colors } from '../constants/colors';

export type RootStackParamList = {
  Onboard1: undefined;
  Onboard2: undefined;
  Onboard3: undefined;
  Login: undefined;
  Signup: undefined;
  Main: undefined;
  EventDetail: { feastKey: string; year: number };
  DailyView: { dateISO: string };
  Omer: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.background,
    card: Colors.surface,
    text: Colors.text,
    border: Colors.border,
    primary: Colors.gold,
    notification: Colors.gold,
  },
};

export function RootNavigator() {
  const { user, initialize, initialized } = useAuthStore();
  const loadFeasts = useFeastStore((s) => s.loadFeasts);
  const setUserId = useAlignmentStore((s) => s.setUserId);
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    initialize();
    loadFeasts();
    AsyncStorage.getItem(ONBOARDING_KEY).then((v) => {
      setHasSeenOnboarding(v === '1');
      setOnboardingChecked(true);
    });
  }, []);

  useEffect(() => {
    setUserId(user?.id ?? null);
  }, [user?.id]);

  if (!initialized || !onboardingChecked) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator color={Colors.gold} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasSeenOnboarding ? (
          <>
            <Stack.Screen name="Onboard1" component={OnboardingScreen1} />
            <Stack.Screen name="Onboard2" component={OnboardingScreen2} />
            <Stack.Screen name="Onboard3">
              {() => <OnboardingScreen3 onComplete={() => setHasSeenOnboarding(true)} />}
            </Stack.Screen>
          </>
        ) : user ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen
              name="EventDetail"
              component={EventDetailScreen}
              options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="DailyView"
              component={DailyViewScreen}
              options={{ presentation: 'card', animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="Omer"
              component={OmerScreen}
              options={{ presentation: 'card', animation: 'slide_from_right' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
