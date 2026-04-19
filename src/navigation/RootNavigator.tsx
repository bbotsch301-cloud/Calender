import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/useAuthStore';
import { useFeastStore } from '../store/useFeastStore';
import { useAlignmentStore } from '../store/useAlignmentStore';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { TabNavigator } from './TabNavigator';
import { EventDetailScreen } from '../screens/EventDetailScreen';
import { DailyViewScreen } from '../screens/DailyViewScreen';
import { Colors } from '../constants/colors';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Main: undefined;
  EventDetail: { feastKey: string; year: number };
  DailyView: { dateISO: string };
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

  useEffect(() => {
    initialize();
    loadFeasts();
  }, []);

  useEffect(() => {
    setUserId(user?.id ?? null);
  }, [user?.id]);

  if (!initialized) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={Colors.gold} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
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
