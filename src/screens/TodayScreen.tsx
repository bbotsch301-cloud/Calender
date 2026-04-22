import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FeastPillColors } from '../constants/colors';
import { gregorianToHebrew, toHebrewNumeral } from '../engine/hebrewCalendar';
import { computeFeastsForYear, getActiveFeast, getFeastDayNumber } from '../engine/feasts';
import { isRoshChodesh, isSabbath } from '../engine/sabbath';
import { getOmerDay } from '../engine/omer';
import { getParashaForDate } from '../constants/parasha';
import { useCalendarStore } from '../store/useCalendarStore';
import { useNow } from '../hooks/useNow';

const GREG_MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const GREG_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const HEBREW_WEEKDAYS = [
  { en: 'Sunday', he: 'יוֹם רִאשׁוֹן' },
  { en: 'Monday', he: 'יוֹם שֵׁנִי' },
  { en: 'Tuesday', he: 'יוֹם שְׁלִישִׁי' },
  { en: 'Wednesday', he: 'יוֹם רְבִיעִי' },
  { en: 'Thursday', he: 'יוֹם חֲמִישִׁי' },
  { en: 'Friday', he: 'יוֹם שִׁשִּׁי' },
  { en: 'Saturday · Shabbat', he: 'שַׁבָּת' },
];

function fmtTimeLocal(d: Date): string {
  const h24 = d.getHours();
  const m = d.getMinutes();
  const ampm = h24 >= 12 ? 'PM' : 'AM';
  const h12 = ((h24 + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
}

export function TodayScreen(): React.ReactElement {
  // Ticks every second for the sunset countdown display. The rest of the
  // derived state only recomputes across day boundaries.
  const now = useNow(1000);
  const latitude = useCalendarStore((s) => s.latitude);
  const longitude = useCalendarStore((s) => s.longitude);
  const locationName = useCalendarStore((s) => s.locationName);
  const locationMode = useCalendarStore((s) => s.locationMode);
  const refreshDates = useCalendarStore((s) => s.refreshDates);
  const sunsetToday = useCalendarStore((s) => s.sunsetToday);
  const nextDayBegins = useCalendarStore((s) => s.nextDayBegins);

  // Keep sunset/boundary in sync when latitude/longitude change.
  useEffect(() => {
    refreshDates();
  }, [latitude, longitude, refreshDates]);

  // Also refresh if we cross the biblical day boundary — the boundary
  // itself is a Date so a cheap comparison each tick is fine.
  const [lastBoundary, setLastBoundary] = useState<number>(nextDayBegins.getTime());
  useEffect(() => {
    if (now.getTime() >= lastBoundary) {
      refreshDates();
      setLastBoundary(useCalendarStore.getState().nextDayBegins.getTime());
    }
  }, [now, lastBoundary, refreshDates]);

  const today = useMemo(() => new Date(), []);
  const hebrew = useMemo(() => gregorianToHebrew(today), [today]);
  const feasts = useMemo(() => computeFeastsForYear(today.getFullYear()), [today]);
  const feast = useMemo(() => getActiveFeast(today, feasts), [today, feasts]);
  const feastDayNumber = feast ? getFeastDayNumber(today, feast) : null;
  const omer = useMemo(() => getOmerDay(today), [today]);
  const parasha = useMemo(() => getParashaForDate(today, hebrew.year), [today, hebrew.year]);
  const countdownMs = Math.max(0, nextDayBegins.getTime() - now.getTime());
  const weekday = HEBREW_WEEKDAYS[today.getDay()];
  const locationSet = locationMode !== 'fallback' || Boolean(locationName);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 60 }}>
        {/* Weekday + Hebrew name */}
        <Text
          style={{
            color: Colors.textMuted,
            fontSize: 11,
            letterSpacing: 2.5,
            textTransform: 'uppercase',
            fontWeight: '800',
          }}>
          {weekday.en.toUpperCase()}
        </Text>
        <Text
          style={{
            color: Colors.goldLight,
            fontSize: 18,
            marginTop: 2,
            fontWeight: '600',
          }}>
          {weekday.he}
        </Text>

        {/* Large date */}
        <Text
          style={{
            color: Colors.text,
            fontSize: 34,
            fontWeight: '800',
            marginTop: 14,
            letterSpacing: 0.3,
          }}>
          {today.getDate()} {GREG_MONTHS[today.getMonth()]} {today.getFullYear()}
        </Text>

        {/* Hebrew date */}
        <View style={{ flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: 10, marginTop: 6 }}>
          <Text
            style={{
              color: Colors.gold,
              fontSize: 22,
              fontWeight: '700',
              letterSpacing: 0.4,
            }}>
            {hebrew.day} {hebrew.monthName} {hebrew.year}
          </Text>
          <Text style={{ color: Colors.goldLight, fontSize: 18 }}>
            · {toHebrewNumeral(hebrew.day)} {hebrew.monthNameHebrew} {toHebrewNumeral(hebrew.year)}
          </Text>
        </View>

        {/* Badges */}
        {(feast || isSabbath(today) || omer !== null || isRoshChodesh(today)) && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 18 }}>
            {feast && FeastPillColors[feast.key] && (
              <Badge
                label={
                  feastDayNumber && feast.durationDays > 1
                    ? `${FeastPillColors[feast.key].shortName} · Day ${feastDayNumber}`
                    : FeastPillColors[feast.key].shortName
                }
                bg={FeastPillColors[feast.key].bg}
                fg={FeastPillColors[feast.key].text}
              />
            )}
            {isSabbath(today) && <Badge label="Shabbat" bg={Colors.shabbatBadge} fg="#FFFFFF" />}
            {isRoshChodesh(today) && (
              <Badge label="🌒 Rosh Chodesh" bg="rgba(201,168,76,0.15)" fg={Colors.gold} />
            )}
            {omer !== null && (
              <Badge label={`Omer Day ${omer}`} bg="rgba(201,168,76,0.15)" fg={Colors.gold} />
            )}
          </View>
        )}

        {/* Sunset countdown */}
        <View style={{ marginTop: 28 }}>
          <SectionLabel>Next Biblical Day</SectionLabel>
          {locationSet ? (
            <>
              <Text
                style={{
                  color: Colors.gold,
                  fontSize: 36,
                  fontWeight: '800',
                  letterSpacing: 1.5,
                  marginTop: 6,
                  fontVariant: ['tabular-nums'],
                }}>
                {formatCountdown(countdownMs)}
              </Text>
              <Text style={{ color: Colors.textMuted, fontSize: 13, marginTop: 4 }}>
                Sunset today: {fmtTimeLocal(sunsetToday)}
                {locationName ? ` · ${locationName}` : ''}
              </Text>
            </>
          ) : (
            <Text style={{ color: Colors.textMuted, fontSize: 13, marginTop: 6 }}>
              Set location in Settings to see sunset times.
            </Text>
          )}
        </View>

        {/* Torah portion */}
        <View style={{ marginTop: 28 }}>
          <SectionLabel>This Week's Torah Portion</SectionLabel>
          <Text
            style={{
              color: Colors.text,
              fontSize: 17,
              fontWeight: '700',
              marginTop: 6,
              letterSpacing: 0.2,
            }}>
            {parasha.pairedWith
              ? `${parasha.parasha.name} – ${parasha.pairedWith.name}`
              : parasha.parasha.name}
          </Text>
          <Text style={{ color: Colors.goldLight, fontSize: 14, marginTop: 2, fontWeight: '600' }}>
            {parasha.pairedWith
              ? `${parasha.parasha.hebrewName} – ${parasha.pairedWith.hebrewName}`
              : parasha.parasha.hebrewName}
          </Text>
          <Text style={{ color: Colors.textMuted, fontSize: 13, marginTop: 6 }}>
            {parasha.parasha.books}
            {parasha.pairedWith ? ` · ${parasha.pairedWith.books}` : ''}
          </Text>
          <Text style={{ color: Colors.textMuted, fontSize: 13, marginTop: 2 }}>
            Reading on Shabbat {GREG_MONTHS_SHORT[parasha.sabbathDate.getMonth()]}{' '}
            {parasha.sabbathDate.getDate()}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Badge({ label, bg, fg }: { label: string; bg: string; fg: string }): React.ReactElement {
  return (
    <View
      style={{
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: bg,
      }}>
      <Text
        style={{
          color: fg,
          fontSize: 12,
          fontWeight: '800',
          letterSpacing: 0.6,
        }}>
        {label}
      </Text>
    </View>
  );
}

function SectionLabel({ children }: { children: string }): React.ReactElement {
  return (
    <Text
      style={{
        color: Colors.textMuted,
        fontSize: 10,
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontWeight: '700',
      }}>
      {children}
    </Text>
  );
}
