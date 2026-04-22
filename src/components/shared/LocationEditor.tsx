import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { GoldText } from '../ui/GoldText';
import { DarkCard } from '../ui/DarkCard';
import { geocode, reverseGeocode, type GeocodeResult } from '../../engine/geocoding';
import { useCalendarStore, type LocationMode } from '../../store/useCalendarStore';
import { requestLocationPermission } from '../../hooks/useSunset';
import { updateUserProfile } from '../../supabase/queries';
import { useAuthStore } from '../../store/useAuthStore';

const SEARCH_DEBOUNCE_MS = 500;
const MIN_QUERY_LEN = 2;

const MODE_LABEL: Record<LocationMode, string> = {
  gps: 'Detected via GPS',
  manual: 'Set manually',
  fallback: 'Default (Jerusalem)',
};

export function LocationEditor(): React.ReactElement {
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const latitude = useCalendarStore((s) => s.latitude);
  const longitude = useCalendarStore((s) => s.longitude);
  const locationName = useCalendarStore((s) => s.locationName);
  const locationMode = useCalendarStore((s) => s.locationMode);
  const setLocation = useCalendarStore((s) => s.setLocation);
  const markUsingFallback = useCalendarStore((s) => s.markUsingFallback);

  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Debounced search.
  useEffect(() => {
    const q = query.trim();
    if (q.length < MIN_QUERY_LEN) {
      setResults([]);
      setError(null);
      return;
    }
    setSearching(true);
    setError(null);
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const timer = setTimeout(async () => {
      try {
        const r = await geocode(q, { signal: ctrl.signal, limit: 5 });
        if (ctrl.signal.aborted) return;
        setResults(r);
        if (r.length === 0) {
          setError("No matches. Try a different spelling, or paste \"lat,lon\".");
        }
      } catch {
        if (!ctrl.signal.aborted) setError('Search failed. Check your connection and try again.');
      } finally {
        if (!ctrl.signal.aborted) setSearching(false);
      }
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [query]);

  async function persistTo(profile: {
    latitude: number;
    longitude: number;
    name: string | null;
    mode: LocationMode;
  }): Promise<void> {
    if (!userId) return;
    try {
      await updateUserProfile(userId, {
        latitude: profile.latitude,
        longitude: profile.longitude,
        locationName: profile.name,
        locationMode: profile.mode,
      });
    } catch {
      // Non-fatal: store has already updated; profile sync will retry later.
    }
  }

  async function pick(result: GeocodeResult): Promise<void> {
    setLocation(result.latitude, result.longitude, {
      name: result.shortName || result.displayName,
      mode: 'manual',
    });
    setQuery('');
    setResults([]);
    setError(null);
    await persistTo({
      latitude: result.latitude,
      longitude: result.longitude,
      name: result.shortName || result.displayName,
      mode: 'manual',
    });
  }

  async function onDetectGPS(): Promise<void> {
    if (detecting) return;
    setDetecting(true);
    setError(null);
    try {
      const r = await requestLocationPermission();
      if (!r.granted || r.latitude === null || r.longitude === null) {
        setError(
          Platform.OS === 'web'
            ? 'Browser denied location access. Type a city above instead.'
            : 'Location permission denied. Type a city above instead.'
        );
        return;
      }
      // Best-effort reverse geocode for a friendly name.
      const name = await reverseGeocode(r.latitude, r.longitude);
      setLocation(r.latitude, r.longitude, { name, mode: 'gps' });
      await persistTo({
        latitude: r.latitude,
        longitude: r.longitude,
        name,
        mode: 'gps',
      });
    } catch {
      setError('Could not detect your location. Type a city above instead.');
    } finally {
      setDetecting(false);
    }
  }

  async function onResetToJerusalem(): Promise<void> {
    markUsingFallback();
    setQuery('');
    setResults([]);
    setError(null);
    await persistTo({
      latitude: 31.7683,
      longitude: 35.2137,
      name: 'Jerusalem, Israel',
      mode: 'fallback',
    });
  }

  const isWeb = Platform.OS === 'web';

  return (
    <View>
      {/* Resolved location card */}
      <DarkCard bordered borderColor={locationMode === 'manual' || locationMode === 'gps' ? Colors.gold : Colors.border}>
        <Text
          style={{
            color: Colors.textMuted,
            fontSize: 10,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            fontWeight: '700',
          }}>
          Current Location · {MODE_LABEL[locationMode]}
        </Text>
        <GoldText size="lg" weight="bold" style={{ marginTop: 6 }}>
          {locationName ?? 'No name available'}
        </GoldText>
        <Text style={{ color: Colors.textMuted, fontSize: 12, marginTop: 2 }}>
          {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
        </Text>
      </DarkCard>

      {/* Search input + results */}
      <View style={{ marginTop: 14 }}>
        <Text
          style={{
            color: Colors.textMuted,
            fontSize: 11,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            marginBottom: 6,
            fontWeight: '700',
          }}>
          {isWeb ? 'Type a city, ZIP, or "lat,lon"' : 'Search by city, ZIP, or "lat,lon"'}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.surface,
            borderWidth: 1,
            borderColor: error ? Colors.error : Colors.border,
            borderRadius: 12,
            paddingHorizontal: 12,
          }}>
          <Text style={{ color: Colors.textMuted, fontSize: 16, marginRight: 6 }}>⌕</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={isWeb ? 'e.g. Dallas, TX' : 'e.g. Jerusalem'}
            placeholderTextColor={Colors.textDim}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Search by city, ZIP, or coordinates"
            style={{
              flex: 1,
              paddingVertical: 12,
              color: Colors.text,
              fontSize: 15,
            }}
          />
          {searching ? (
            <ActivityIndicator color={Colors.gold} size="small" />
          ) : query.length > 0 ? (
            <Pressable
              onPress={() => {
                setQuery('');
                setResults([]);
                setError(null);
              }}
              accessibilityLabel="Clear search">
              <Text style={{ color: Colors.textMuted, fontSize: 18, paddingHorizontal: 4 }}>×</Text>
            </Pressable>
          ) : null}
        </View>

        {/* Inline result list */}
        {results.length > 0 && (
          <View
            style={{
              marginTop: 8,
              backgroundColor: Colors.surface,
              borderWidth: 1,
              borderColor: Colors.border,
              borderRadius: 12,
              overflow: 'hidden',
            }}>
            <FlatList
              data={results}
              keyExtractor={(r, i) => `${r.latitude},${r.longitude},${i}`}
              keyboardShouldPersistTaps="handled"
              ItemSeparatorComponent={() => (
                <View style={{ height: 1, backgroundColor: Colors.border }} />
              )}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => pick(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${item.shortName}`}
                  style={({ pressed }) => ({
                    paddingVertical: 12,
                    paddingHorizontal: 14,
                    backgroundColor: pressed ? 'rgba(201,168,76,0.10)' : 'transparent',
                  })}>
                  <Text style={{ color: Colors.text, fontSize: 14, fontWeight: '600' }} numberOfLines={1}>
                    {item.shortName}
                  </Text>
                  <Text style={{ color: Colors.textMuted, fontSize: 11, marginTop: 2 }}>
                    {item.latitude.toFixed(4)}°, {item.longitude.toFixed(4)}°
                    {item.source === 'coords' ? ' · entered as coordinates' : ''}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        )}

        {error && (
          <Text style={{ color: Colors.error, fontSize: 12, marginTop: 6 }}>{error}</Text>
        )}
      </View>

      {/* GPS Detect button — secondary on web, equal weight on native */}
      <View style={{ marginTop: 14, gap: 8 }}>
        <Pressable
          onPress={onDetectGPS}
          disabled={detecting}
          accessibilityRole="button"
          accessibilityLabel="Detect location via GPS"
          accessibilityState={{ disabled: detecting, busy: detecting }}
          style={({ pressed }) => ({
            paddingVertical: 12,
            borderRadius: 12,
            backgroundColor: isWeb ? 'transparent' : Colors.surface,
            borderWidth: 1,
            borderColor: Colors.border,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            opacity: pressed || detecting ? 0.7 : 1,
          })}>
          {detecting ? (
            <ActivityIndicator color={Colors.gold} size="small" />
          ) : (
            <Text style={{ color: Colors.gold, fontSize: 14 }}>📍</Text>
          )}
          <Text
            style={{
              color: Colors.gold,
              fontSize: 12,
              fontWeight: '700',
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}>
            {detecting ? 'Detecting…' : isWeb ? 'Or detect via browser GPS' : 'Detect my location'}
          </Text>
        </Pressable>

        <Pressable
          onPress={onResetToJerusalem}
          accessibilityRole="button"
          accessibilityLabel="Reset to Jerusalem default"
          style={({ pressed }) => ({
            paddingVertical: 8,
            alignItems: 'center',
            opacity: pressed ? 0.7 : 1,
          })}>
          <Text style={{ color: Colors.textMuted, fontSize: 11, letterSpacing: 1 }}>
            Reset to Jerusalem (default)
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
