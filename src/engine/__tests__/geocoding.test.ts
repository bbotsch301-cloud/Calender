import { parseCoordinates, parseNominatimResponse } from '../geocoding';

describe('parseCoordinates', () => {
  test('parses comma-separated decimal pair', () => {
    expect(parseCoordinates('32.7767,-96.7970')).toEqual({
      latitude: 32.7767,
      longitude: -96.797,
    });
  });

  test('tolerates whitespace and degree symbols', () => {
    expect(parseCoordinates(' 31.7683° , 35.2137° ')).toEqual({
      latitude: 31.7683,
      longitude: 35.2137,
    });
  });

  test('parses N/S/E/W suffixes', () => {
    expect(parseCoordinates('40.7128 N, 74.0060 W')).toEqual({
      latitude: 40.7128,
      longitude: -74.006,
    });
    expect(parseCoordinates('33.8688 S, 151.2093 E')).toEqual({
      latitude: -33.8688,
      longitude: 151.2093,
    });
  });

  test('parses whitespace-separated pair', () => {
    expect(parseCoordinates('51.5074  -0.1278')).toEqual({
      latitude: 51.5074,
      longitude: -0.1278,
    });
  });

  test('rejects out-of-range latitude', () => {
    expect(parseCoordinates('91,0')).toBeNull();
    expect(parseCoordinates('-91,0')).toBeNull();
  });

  test('rejects out-of-range longitude', () => {
    expect(parseCoordinates('0,181')).toBeNull();
    expect(parseCoordinates('0,-181')).toBeNull();
  });

  test('rejects non-coordinate text', () => {
    expect(parseCoordinates('Jerusalem')).toBeNull();
    expect(parseCoordinates('Dallas, TX')).toBeNull();
    expect(parseCoordinates('10001')).toBeNull();
    expect(parseCoordinates('')).toBeNull();
    expect(parseCoordinates('   ')).toBeNull();
  });

  test('rejects malformed numerics', () => {
    expect(parseCoordinates('1.2.3,4')).toBeNull();
    expect(parseCoordinates('NaN,NaN')).toBeNull();
  });
});

describe('parseNominatimResponse', () => {
  test('parses a typical city result', () => {
    const fixture = [
      {
        display_name: 'Jerusalem, Jerusalem District, Israel',
        lat: '31.7682631',
        lon: '35.2137512',
        name: 'Jerusalem',
        address: { city: 'Jerusalem', state: 'Jerusalem District', country: 'Israel' },
      },
    ];
    const r = parseNominatimResponse(fixture);
    expect(r).toHaveLength(1);
    expect(r[0].latitude).toBeCloseTo(31.7683, 3);
    expect(r[0].longitude).toBeCloseTo(35.2138, 3);
    expect(r[0].shortName).toBe('Jerusalem, Jerusalem District, Israel');
    expect(r[0].country).toBe('Israel');
    expect(r[0].source).toBe('nominatim');
  });

  test('uses town/village/hamlet fallback when city is missing', () => {
    const fixture = [
      {
        display_name: 'Bethlehem, West Bank',
        lat: '31.7054',
        lon: '35.2024',
        address: { town: 'Bethlehem', country: 'Palestinian Territories' },
      },
    ];
    const r = parseNominatimResponse(fixture);
    expect(r[0].shortName).toContain('Bethlehem');
    expect(r[0].shortName).toContain('Palestinian Territories');
  });

  test('drops items with non-finite or out-of-range coords', () => {
    const fixture = [
      { display_name: 'Bad', lat: 'not-a-number', lon: '0' },
      { display_name: 'Bad2', lat: '95', lon: '0' },
      { display_name: 'Bad3', lat: '0', lon: '200' },
      { display_name: 'OK', lat: '10', lon: '20', address: { country: 'X' } },
    ];
    const r = parseNominatimResponse(fixture);
    expect(r).toHaveLength(1);
    expect(r[0].latitude).toBe(10);
  });

  test('returns [] for non-array input', () => {
    expect(parseNominatimResponse(null)).toEqual([]);
    expect(parseNominatimResponse({})).toEqual([]);
    expect(parseNominatimResponse('error')).toEqual([]);
    expect(parseNominatimResponse(undefined)).toEqual([]);
  });

  test('handles items missing the address object', () => {
    const fixture = [
      { display_name: 'Atlantis, Lost', lat: '0', lon: '0' },
    ];
    const r = parseNominatimResponse(fixture);
    expect(r).toHaveLength(1);
    expect(r[0].shortName).toBe('Atlantis');
  });

  test('skips garbage entries', () => {
    const fixture = [null, undefined, 'string', { display_name: 'OK', lat: '10', lon: '20' }];
    const r = parseNominatimResponse(fixture);
    expect(r).toHaveLength(1);
  });
});
