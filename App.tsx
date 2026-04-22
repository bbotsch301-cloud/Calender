import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ErrorBoundary } from './src/components/shared/ErrorBoundary';
import { useCalendarStore } from './src/store/useCalendarStore';
import { useSettingsStore } from './src/store/useSettingsStore';

export default function App(): React.ReactElement {
  // Hydrate persisted state from AsyncStorage once on mount.
  useEffect(() => {
    useCalendarStore.getState().hydrate();
    useSettingsStore.getState().hydrate();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <ErrorBoundary>
          <AppNavigator />
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
