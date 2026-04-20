/**
 * Storage adapter for Supabase auth persistence.
 *
 * Uses expo-secure-store (Keychain on iOS, EncryptedSharedPreferences on
 * Android) for refresh-token-like secrets. Values over SecureStore's size
 * limit (~2KB) and web fall back to AsyncStorage.
 *
 * API matches the shape Supabase expects for its `storage` option.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// SecureStore keys must be alphanumeric/._-; Supabase uses keys with colons.
function safeKey(key: string): string {
  return key.replace(/[^a-zA-Z0-9._-]/g, '_');
}

// SecureStore has a ~2KB value limit on some devices. Values larger than
// this are automatically stored in AsyncStorage with a marker.
const MAX_SECURE = 1800;
const OVERFLOW_MARKER = '@@overflow:';

function supportsSecure(): boolean {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

export const secureStorage = {
  async getItem(key: string): Promise<string | null> {
    if (!supportsSecure()) {
      return AsyncStorage.getItem(key);
    }
    try {
      const value = await SecureStore.getItemAsync(safeKey(key));
      if (value === null) {
        // Legacy path: maybe stored in AsyncStorage previously; migrate if found.
        const legacy = await AsyncStorage.getItem(key);
        if (legacy !== null) {
          await this.setItem(key, legacy);
          await AsyncStorage.removeItem(key);
          return legacy;
        }
        return null;
      }
      if (value.startsWith(OVERFLOW_MARKER)) {
        return AsyncStorage.getItem(key);
      }
      return value;
    } catch {
      return AsyncStorage.getItem(key);
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    if (!supportsSecure()) {
      return AsyncStorage.setItem(key, value);
    }
    try {
      if (value.length > MAX_SECURE) {
        await AsyncStorage.setItem(key, value);
        await SecureStore.setItemAsync(safeKey(key), OVERFLOW_MARKER + 'async');
        return;
      }
      await SecureStore.setItemAsync(safeKey(key), value);
      // Ensure stale overflow isn't left behind.
      await AsyncStorage.removeItem(key);
    } catch {
      // Last-resort fallback. Still better than crashing auth.
      await AsyncStorage.setItem(key, value);
    }
  },

  async removeItem(key: string): Promise<void> {
    if (!supportsSecure()) {
      return AsyncStorage.removeItem(key);
    }
    try {
      await SecureStore.deleteItemAsync(safeKey(key));
    } catch {
      /* ignore */
    }
    await AsyncStorage.removeItem(key);
  },
};
