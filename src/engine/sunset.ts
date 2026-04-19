/**
 * Sunset calculation using NOAA solar position algorithm.
 * Returns UTC Date objects.
 *
 * Reference: NOAA Solar Calculator
 * https://gml.noaa.gov/grad/solcalc/calcdetails.html
 */

const ZENITH_OFFICIAL = 90.833; // degrees, accounts for refraction + sun radius

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

function julianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

function julianCentury(jd: number): number {
  return (jd - 2451545.0) / 36525.0;
}

function geomMeanLongSun(t: number): number {
  let l = 280.46646 + t * (36000.76983 + t * 0.0003032);
  l = l % 360;
  if (l < 0) l += 360;
  return l;
}

function geomMeanAnomSun(t: number): number {
  return 357.52911 + t * (35999.05029 - 0.0001537 * t);
}

function eccentricityEarthOrbit(t: number): number {
  return 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
}

function sunEqOfCenter(t: number): number {
  const m = toRad(geomMeanAnomSun(t));
  return (
    Math.sin(m) * (1.914602 - t * (0.004817 + 0.000014 * t)) +
    Math.sin(2 * m) * (0.019993 - 0.000101 * t) +
    Math.sin(3 * m) * 0.000289
  );
}

function sunTrueLong(t: number): number {
  return geomMeanLongSun(t) + sunEqOfCenter(t);
}

function sunAppLong(t: number): number {
  const omega = 125.04 - 1934.136 * t;
  return sunTrueLong(t) - 0.00569 - 0.00478 * Math.sin(toRad(omega));
}

function meanObliquityOfEcliptic(t: number): number {
  const seconds = 21.448 - t * (46.815 + t * (0.00059 - t * 0.001813));
  return 23 + (26 + seconds / 60) / 60;
}

function obliquityCorrection(t: number): number {
  const omega = 125.04 - 1934.136 * t;
  return meanObliquityOfEcliptic(t) + 0.00256 * Math.cos(toRad(omega));
}

function sunDeclination(t: number): number {
  const e = obliquityCorrection(t);
  const lambda = sunAppLong(t);
  return toDeg(Math.asin(Math.sin(toRad(e)) * Math.sin(toRad(lambda))));
}

function equationOfTime(t: number): number {
  const epsilon = obliquityCorrection(t);
  const l0 = geomMeanLongSun(t);
  const e = eccentricityEarthOrbit(t);
  const m = geomMeanAnomSun(t);
  let y = Math.tan(toRad(epsilon) / 2);
  y = y * y;
  const sin2l0 = Math.sin(2 * toRad(l0));
  const sinm = Math.sin(toRad(m));
  const cos2l0 = Math.cos(2 * toRad(l0));
  const sin4l0 = Math.sin(4 * toRad(l0));
  const sin2m = Math.sin(2 * toRad(m));
  const eTime =
    y * sin2l0 -
    2 * e * sinm +
    4 * e * y * sinm * cos2l0 -
    0.5 * y * y * sin4l0 -
    1.25 * e * e * sin2m;
  return toDeg(eTime) * 4;
}

function hourAngleSunset(lat: number, solarDec: number): number {
  const latRad = toRad(lat);
  const sdRad = toRad(solarDec);
  const haArg =
    Math.cos(toRad(ZENITH_OFFICIAL)) / (Math.cos(latRad) * Math.cos(sdRad)) -
    Math.tan(latRad) * Math.tan(sdRad);
  return -toDeg(Math.acos(Math.min(1, Math.max(-1, haArg))));
}

/**
 * Calculate sunset for a given date and location.
 * @param date Date (year, month, day used; time ignored)
 * @param lat Latitude in degrees (positive north)
 * @param lon Longitude in degrees (positive east)
 * @returns UTC Date of sunset, or null if sun does not set (polar regions)
 */
export function calculateSunset(date: Date, lat: number, lon: number): Date {
  const refDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0));
  const jd = julianDay(refDate);
  const t = julianCentury(jd);
  const eqTime = equationOfTime(t);
  const solarDec = sunDeclination(t);
  const hourAngle = hourAngleSunset(lat, solarDec);

  // Sunset in UTC minutes from midnight
  const sunsetUTC = 720 - 4 * (lon + hourAngle) - eqTime;

  if (!isFinite(sunsetUTC)) {
    // Polar; default to 6pm local approx
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 18, 0, 0));
  }

  const totalSeconds = Math.round(sunsetUTC * 60);
  const result = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
  result.setUTCSeconds(totalSeconds);
  return result;
}

/**
 * Returns the Date when the biblical day for `now` ends (next sunset).
 * If sunset for `now`'s date has already passed, returns tomorrow's sunset.
 */
export function getNextDayBoundary(now: Date, lat: number, lon: number): Date {
  const todaySunset = calculateSunset(now, lat, lon);
  if (todaySunset.getTime() > now.getTime()) {
    return todaySunset;
  }
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return calculateSunset(tomorrow, lat, lon);
}

export const JERUSALEM_LAT = 31.7683;
export const JERUSALEM_LON = 35.2137;
