import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './src/navigation/RootNavigator';
import { DayTransitionToast } from './src/components/shared/DayTransitionToast';
import { NetworkBanner } from './src/components/shared/NetworkBanner';
import { ErrorBoundary } from './src/components/shared/ErrorBoundary';

export default function App(): React.ReactElement {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <ErrorBoundary>
          <RootNavigator />
        </ErrorBoundary>
        <NetworkBanner />
        <DayTransitionToast />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
