import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Colors } from '../../constants/colors';
import { GoldText } from '../ui/GoldText';

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(_error: Error, info: React.ErrorInfo): void {
    // Intentionally no analytics/telemetry — PII risk. Log the stack only
    // so developers attaching a debugger can see it.
    if (__DEV__) {
      console.warn('[ErrorBoundary]', _error.message, info.componentStack);
    }
  }

  reset = (): void => this.setState({ error: null });

  render(): React.ReactNode {
    if (this.state.error) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.background,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 28,
          }}>
          <Text style={{ fontSize: 52 }}>✦</Text>
          <GoldText size="2xl" weight="bold" glow style={{ marginTop: 8, textAlign: 'center' }}>
            Something went wrong
          </GoldText>
          <Text
            style={{
              color: Colors.textMuted,
              fontSize: 14,
              textAlign: 'center',
              marginTop: 12,
              lineHeight: 20,
            }}>
            The app hit an unexpected error. You can try again — your data is safe.
          </Text>
          {__DEV__ && (
            <Text
              style={{
                color: Colors.error,
                fontSize: 11,
                marginTop: 16,
                textAlign: 'center',
                fontFamily: 'monospace',
              }}>
              {this.state.error.message}
            </Text>
          )}
          <Pressable
            onPress={this.reset}
            accessibilityLabel="Try again"
            style={({ pressed }) => ({
              marginTop: 28,
              backgroundColor: Colors.gold,
              paddingVertical: 14,
              paddingHorizontal: 32,
              borderRadius: 12,
              opacity: pressed ? 0.85 : 1,
            })}>
            <Text
              style={{
                color: Colors.background,
                fontWeight: '800',
                fontSize: 13,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}>
              Try Again
            </Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}
