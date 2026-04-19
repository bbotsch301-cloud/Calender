import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { GoldText } from '../../components/ui/GoldText';
import { useAuthStore } from '../../store/useAuthStore';
import { requestLocationPermission } from '../../hooks/useSunset';
import { useCalendarStore } from '../../store/useCalendarStore';
import { updateUserProfile } from '../../supabase/queries';
import type { RootStackParamList } from '../../navigation/RootNavigator';

export function SignupScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { signUp, loading } = useAuthStore();
  const setLocation = useCalendarStore((s) => s.setLocation);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function onSignup() {
    if (!name.trim() || !email.trim() || password.length < 6) {
      Alert.alert('Check your details', 'Provide a name, email, and password (min 6 chars).');
      return;
    }
    try {
      await signUp(email.trim(), password, name.trim());
      // Request location for sunset
      const r = await requestLocationPermission();
      if (r.granted && r.latitude !== null && r.longitude !== null) {
        setLocation(r.latitude, r.longitude);
        const userId = useAuthStore.getState().user?.id;
        if (userId) {
          await updateUserProfile(userId, {
            displayName: name.trim(),
            email: email.trim(),
            latitude: r.latitude,
            longitude: r.longitude,
          });
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Sign up failed';
      Alert.alert('Sign up failed', msg);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 36 }}>
          <View style={{ alignItems: 'center', marginBottom: 28 }}>
            <Text style={{ fontSize: 44 }}>✦</Text>
            <GoldText size="2xl" weight="bold" glow style={{ marginTop: 8 }}>
              Begin Your Walk
            </GoldText>
            <Text style={{ color: Colors.textMuted, fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 4 }}>
              Create your account
            </Text>
          </View>

          <Field label="Display Name" value={name} onChange={setName} placeholder="Your name" />
          <Field label="Email" value={email} onChange={setEmail} placeholder="you@example.com" keyboardType="email-address" />
          <Field label="Password" value={password} onChange={setPassword} placeholder="At least 6 characters" secure />

          <Pressable
            onPress={onSignup}
            disabled={loading}
            style={({ pressed }) => ({
              backgroundColor: Colors.gold,
              paddingVertical: 16,
              borderRadius: 14,
              alignItems: 'center',
              marginTop: 20,
              opacity: pressed || loading ? 0.7 : 1,
            })}>
            <Text style={{ color: Colors.background, fontSize: 14, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase' }}>
              {loading ? 'Creating…' : 'Create Account'}
            </Text>
          </Pressable>

          <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 14, alignItems: 'center' }}>
            <Text style={{ color: Colors.gold, fontSize: 13 }}>Back to sign in</Text>
          </Pressable>
        </ScrollView>
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
      <Text style={{ color: Colors.textMuted, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={Colors.textDim}
        secureTextEntry={secure}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize={label === 'Email' ? 'none' : 'words'}
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
