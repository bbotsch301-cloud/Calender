/**
 * Geocoding engine.
 *
 * Accepts three input forms:
 *   1. A decimal-coordinate pair — "32.7767,-96.7970" or "32.7767, -96.7970"
 *   2. A ZIP/postal code — "10001", "SW1A 1AA"
 *   3. A free-text place name — "Jerusalem", "Dallas, TX", "London, UK"
 *
 * Resolution order:
 *   - Coordinate pair: parsed locally, no network.
 *   - Everything else: Nominatim (OpenStreetMap) — free, no API key.
 *     Rate limit is 1 request/second per Nominatim's usage policy, so
 *     callers must debounce. We send a descriptive User-Agent as
 *     required by that policy.
 *
 * The pure `parseCoordinates` and `parseNominatimResponse` functions
 * have no platform dependency and are covered by unit tests.
 */

export interface GeocodeResult {
  /** Full display name, e.g. "Jerusalem, Jerusalem District, Israel". */
  displayName: string;
  /** Shorter form, e.g. "Jerusalem, Israel". */
  shortName: string;
  latitude: number;
  longitude: number;
  country?: string;
  region?: string;
  /** How the result was obtained — useful for analytics and UX copy. */
  source: 'coords' | 'nominatim';
}

const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org';
// Nominatim requires a descriptive User-Agent identifying the app.
// If you fork this, set an email in your own User-Agent string.
const USER_AGENT = 'KingdomCalendar/1.0 (https://kingdom-calendar.app)';
const NOMINATIM_TIMEOUT_MS = 6000;

/**
 * Tries to parse a "lat,lon" pair from user input. Returns null if the
 * input doesn't look like a coordinate pair.
 *
 * Accepts optional whitespace, optional "N/S/E/W" suffixes, and either
 * comma or whitespace separator.
 */
export function parseCoordinates(raw: string): { latitude: number; longitude: number } | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Strip common direction suffixes and normalize separators.
  const normalized = trimmed
    .replace(/\s+/g, ' ')
    .replace(/°/g, '')
    .replace(/,\s*/g, ',')
    .trim();

  // Match "<num>[NS] <num>[EW]" or "<num>[NS],<num>[EW]" or plain "<num>,<num>".
  const match = normalized.match(
    /^(-?\d+(?:\.\d+)?)\s*([NS])?[,\s]+(-?\d+(?:\.\d+)?)\s*([EW])?$/i
  );
  if (!match) return null;

  let lat = parseFloat(match[1]);
  let lon = parseFloat(match[3]);
  const latSuffix = (match[2] || '').toUpperCase();
  const lonSuffix = (match[4] || '').toUpperCase();

  if (latSuffix === 'S') lat = -Math.abs(lat);
  if (latSuffix === 'N') lat = Math.abs(lat);
  if (lonSuffix === 'W') lon = -Math.abs(lon);
  if (lonSuffix === 'E') lon = Math.abs(lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (lat < -90 || lat > 90) return null;
  if (lon < -180 || lon > 180) return null;

  return { latitude: lat, longitude: lon };
}

interface NominatimItem {
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    hamlet?: string;
    municipality?: string;
    state?: string;
    region?: string;
    country?: string;
    postcode?: string;
  };
}

/** Pure function: parse raw Nominatim JSON into GeocodeResult[]. */
export function parseNominatimResponse(raw: unknown): GeocodeResult[] {
  if (!Array.isArray(raw)) return [];
  const results: GeocodeResult[] = [];
  for (const item of raw as NominatimItem[]) {
    if (!item || typeof item !== 'object') continue;
    const latitude = parseFloat(item.lat);
    const longitude = parseFloat(item.lon);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) continue;
    if (latitude < -90 || latitude > 90) continue;
    if (longitude < -180 || longitude > 180) continue;

    const addr = item.address ?? {};
    const locality =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.hamlet ||
      addr.municipality ||
      item.name ||
      item.display_name.split(',')[0].trim();
    const region = addr.state || addr.region;
    const country = addr.country;

    const shortParts: string[] = [locality];
    if (region && region !== locality) shortParts.push(region);
    if (country) shortParts.push(country);

    results.push({
      displayName: item.display_name,
      shortName: shortParts.join(', '),
      latitude,
      longitude,
      region,
      country,
      source: 'nominatim',
    });
  }
  return results;
}

async function fetchWithTimeout(url: string, signal?: AbortSignal): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), NOMINATIM_TIMEOUT_MS);
  // Propagate caller cancellation.
  const onCancel = (): void => controller.abort();
  signal?.addEventListener('abort', onCancel);
  try {
    return await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
        'Accept-Language': 'en',
      },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onCancel);
  }
}

/**
 * Resolve a user-typed query to at most `limit` candidate locations.
 * Tries coordinates first (instant, offline); falls back to Nominatim.
 */
export async function geocode(
  query: string,
  opts: { limit?: number; signal?: AbortSignal } = {}
): Promise<GeocodeResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  // Coordinate short-circuit.
  const coords = parseCoordinates(q);
  if (coords) {
    return [
      {
        displayName: `${coords.latitude.toFixed(4)}°, ${coords.longitude.toFixed(4)}°`,
        shortName: `${coords.latitude.toFixed(4)}°, ${coords.longitude.toFixed(4)}°`,
        latitude: coords.latitude,
        longitude: coords.longitude,
        source: 'coords',
      },
    ];
  }

  const limit = Math.max(1, Math.min(10, opts.limit ?? 5));
  const url =
    `${NOMINATIM_ENDPOINT}/search` +
    `?q=${encodeURIComponent(q)}` +
    `&format=json&limit=${limit}&addressdetails=1`;

  try {
    const res = await fetchWithTimeout(url, opts.signal);
    if (!res.ok) return [];
    const raw = (await res.json()) as unknown;
    return parseNominatimResponse(raw);
  } catch {
    return [];
  }
}

/**
 * Reverse-geocode raw coordinates into a human-readable name.
 * Returns null if the lookup fails.
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number,
  opts: { signal?: AbortSignal } = {}
): Promise<string | null> {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  const url =
    `${NOMINATIM_ENDPOINT}/reverse` +
    `?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;
  try {
    const res = await fetchWithTimeout(url, opts.signal);
    if (!res.ok) return null;
    const data = (await res.json()) as NominatimItem & { error?: string };
    if (!data || data.error) return null;
    const addr = data.address ?? {};
    const locality = addr.city || addr.town || addr.village || addr.hamlet || addr.municipality;
    const country = addr.country;
    if (locality && country) return `${locality}, ${country}`;
    if (locality) return locality;
    return data.display_name ?? null;
  } catch {
    return null;
  }
}
