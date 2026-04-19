import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { GoldText } from '../../components/ui/GoldText';
import { useAuthStore } from '../../store/useAuthStore';
import type { RootStackParamList } from '../../navigation/RootNavigator';

export function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { signIn, signInAsGuest, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function onLogin() {
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    try {
      await signIn(email.trim(), password);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Sign in failed';
      Alert.alert('Sign in failed', msg);
    }
  }

  async function onGuest() {
    await signInAsGuest();
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'center' }}>
          <View style={{ alignItems: 'center', marginBottom: 36 }}>
            <Text style={{ fontSize: 56 }}>✦</Text>
            <GoldText size="3xl" weight="bold" glow style={{ marginTop: 8, letterSpacing: 1 }}>
              Kingdom Calendar
            </GoldText>
            <Text
              style={{
                color: Colors.textMuted,
                fontSize: 12,
                letterSpacing: 2,
                textTransform: 'uppercase',
                marginTop: 4,
              }}>
              Walk in the appointed times
            </Text>
          </View>

          <Field
            label="Email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
          />
          <Field
            label="Password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            secure
          />

          <Pressable
            onPress={onLogin}
            disabled={loading}
            style={({ pressed }) => ({
              backgroundColor: Colors.gold,
              paddingVertical: 16,
              borderRadius: 14,
              alignItems: 'center',
              marginTop: 18,
              opacity: pressed || loading ? 0.7 : 1,
            })}>
            <Text
              style={{
                color: Colors.background,
                fontSize: 14,
                fontWeight: '800',
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('Signup')}
            style={{ marginTop: 14, alignItems: 'center' }}>
            <Text style={{ color: Colors.gold, fontSize: 13 }}>Create an account</Text>
          </Pressable>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 24,
              gap: 12,
            }}>
            <View style={{ flex: 1, height: 1, backgroundColor: Colors.border }} />
            <Text style={{ color: Colors.textMuted, fontSize: 11, letterSpacing: 2 }}>OR</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: Colors.border }} />
          </View>

          <Pressable
            onPress={onGuest}
            style={({ pressed }) => ({
              borderWidth: 1,
              borderColor: Colors.border,
              paddingVertical: 16,
              borderRadius: 14,
              alignItems: 'center',
              opacity: pressed ? 0.85 : 1,
            })}>
            <Text style={{ color: Colors.text, fontSize: 13, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }}>
              Continue as Guest
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  secure,
  keyboardType,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  secure?: boolean;
  keyboardType?: 'default' | 'email-address';
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text
        style={{
          color: Colors.textMuted,
          fontSize: 11,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          marginBottom: 6,
        }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={Colors.textDim}
        secureTextEntry={secure}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize="none"
        style={{
          backgroundColor: Colors.surface,
          borderWidth: 1,
          borderColor: Colors.border,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
          color: Colors.text,
          fontSize: 15,
        }}
      />
    </View>
  );
}
