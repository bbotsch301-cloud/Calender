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
import {
  geocode,
  reverseGeocode,
  shortDisplayName,
  type GeocodeResult,
} from '../../engine/geocoding';
import { useCalendarStore, type LocationMode } from '../../store/useCalendarStore';
import { requestLocationPermission } from '../../hooks/useSunset';

const SEARCH_DEBOUNCE_MS = 500;
const MIN_QUERY_LEN = 2;

const MODE_LABEL: Record<LocationMode, string> = {
  gps: 'Detected via GPS',
  manual: 'Set manually',
  fallback: 'Default (Jerusalem)',
};

/**
 * Profile/Settings widget for editing the app's location.
 *
 * Input accepts: "City", "City, State", "City, Country", a ZIP/postcode,
 * or decimal "lat,lon". Nominatim handles the hard cases; the pure
 * coordinate short-circuit lives in src/engine/geocoding.ts.
 */
export function LocationEditor(): React.ReactElement {
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

  function pick(result: GeocodeResult): void {
    // Prefer the first two comma-separated parts of Nominatim's
    // display_name (e.g. "Phoenix, Arizona") — concise and recognizable.
    const label =
      result.source === 'nominatim'
        ? shortDisplayName(result.displayName) || result.shortName
        : result.shortName || result.displayName;
    setLocation(result.latitude, result.longitude, {
      name: label,
      mode: 'manual',
    });
    setQuery('');
    setResults([]);
    setError(null);
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
      const name = await reverseGeocode(r.latitude, r.longitude);
      setLocation(r.latitude, r.longitude, { name, mode: 'gps' });
    } catch {
      setError('Could not detect your location. Type a city above instead.');
    } finally {
      setDetecting(false);
    }
  }

  function onResetToJerusalem(): void {
    markUsingFallback();
    setQuery('');
    setResults([]);
    setError(null);
  }

  const isWeb = Platform.OS === 'web';

  return (
    <View>
      {/* Resolved-location card */}
      <View
        style={{
          backgroundColor: Colors.surface,
          borderWidth: 1,
          borderColor: locationMode === 'fallback' ? Colors.border : Colors.gold,
          borderRadius: 12,
          padding: 14,
        }}>
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
        <Text
          style={{
            color: Colors.gold,
            fontSize: 16,
            fontWeight: '700',
            marginTop: 6,
          }}>
          {locationName && locationName.trim().length > 0 && locationName !== 'No name available'
            ? locationName
            : 'Location detected'}
        </Text>
        <Text style={{ color: Colors.textMuted, fontSize: 11, marginTop: 4 }}>
          {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
        </Text>
      </View>

      {/* Search */}
      <View style={{ marginTop: 14 }}>
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
            placeholder={'City, State or Zip Code or lat,lon'}
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
                  <Text
                    style={{ color: Colors.text, fontSize: 14, fontWeight: '600' }}
                    numberOfLines={1}>
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

      {/* GPS Detect button — secondary */}
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
            {detecting ? 'Detecting…' : 'Use my current location'}
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
