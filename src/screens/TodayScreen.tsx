import React, { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors, FeastPillColors } from '../constants/colors';
import { gregorianToHebrew, toHebrewNumeral } from '../engine/hebrewCalendar';
import { computeFeastsForYear, getActiveFeast, getFeastDayNumber } from '../engine/feasts';
import { isRoshChodesh, isSabbath } from '../engine/sabbath';
import { getOmerDay } from '../engine/omer';
import { getParashaForDate } from '../constants/parasha';
import { getMoonPhase } from '../engine/moonPhase';
import { useCalendarStore } from '../store/useCalendarStore';
import { useNow } from '../hooks/useNow';
import { ParashaModal } from '../components/learn/ParashaModal';

const GREG_MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const GREG_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const GREG_WEEKDAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
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
  const now = useNow(1000);
  const latitude = useCalendarStore((s) => s.latitude);
  const longitude = useCalendarStore((s) => s.longitude);
  const locationName = useCalendarStore((s) => s.locationName);
  const locationMode = useCalendarStore((s) => s.locationMode);
  const refreshDates = useCalendarStore((s) => s.refreshDates);
  const sunsetToday = useCalendarStore((s) => s.sunsetToday);
  const nextDayBegins = useCalendarStore((s) => s.nextDayBegins);
  const navigation = useNavigation() as unknown as {
    navigate: (name: string, params?: unknown) => void;
  };
  const [parashaModalOpen, setParashaModalOpen] = useState(false);

  useEffect(() => {
    refreshDates();
  }, [latitude, longitude, refreshDates]);

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
  const moon = useMemo(
    () => getMoonPhase(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12)),
    [today]
  );

  const countdownMs = Math.max(0, nextDayBegins.getTime() - now.getTime());
  const locationSet = locationMode !== 'fallback';

  // Lunar "day of cycle" — 1-based age in days for the card subtitle.
  const lunarDayOfCycle = Math.floor(moon.ageDays) + 1;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 60 }}>
        {/* Card 1 — TODAY'S DATE */}
        <Card>
          <CardLabel>Today</CardLabel>
          <Text
            style={{
              color: Colors.text,
              fontSize: 22,
              fontWeight: '700',
              marginTop: 6,
              letterSpacing: 0.3,
            }}>
            {GREG_WEEKDAYS[today.getDay()]}, {today.getDate()} {GREG_MONTHS[today.getMonth()]}{' '}
            {today.getFullYear()}
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Learn', {
                screen: 'MonthDetail',
                params: { monthNumber: hebrew.month },
              })
            }
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Learn about the Hebrew month ${hebrew.monthName}`}
            style={{
              marginTop: 6,
              paddingVertical: 4,
              alignSelf: 'flex-start',
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
              <Text style={{ color: Colors.gold, fontSize: 16, fontWeight: '700' }}>
                {hebrew.day} {hebrew.monthName} {hebrew.year}
              </Text>
              <Text style={{ color: Colors.textMuted, fontSize: 12 }}>↗</Text>
            </View>
          </TouchableOpacity>
          <Text
            style={{
              color: Colors.gold,
              fontSize: 14,
              marginTop: 6,
              textAlign: 'right',
              letterSpacing: 0.3,
            }}>
            {toHebrewNumeral(hebrew.day)} {hebrew.monthNameHebrew} {toHebrewNumeral(hebrew.year)}
          </Text>

          {(feast || isSabbath(today) || omer !== null || isRoshChodesh(today)) && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
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
              {isSabbath(today) && <Badge label="Shabbat" bg={Colors.shabbatStripe} fg="#FFFFFF" />}
              {isRoshChodesh(today) && (
                <Badge label="🌒 Rosh Chodesh" bg="rgba(201,168,76,0.15)" fg={Colors.gold} />
              )}
              {omer !== null && (
                <Badge label={`Omer Day ${omer}`} bg="rgba(201,168,76,0.15)" fg={Colors.gold} />
              )}
            </View>
          )}
        </Card>

        {/* Card 2 — DAY BEGINS AT SUNSET */}
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 14 }}>🌅</Text>
            <CardLabel>Day Begins at Sunset</CardLabel>
          </View>
          <Text
            style={{
              color: Colors.textMuted,
              fontSize: 11,
              lineHeight: 16,
              marginTop: 6,
            }}>
            In the Hebrew calendar, each day runs from sunset to sunset, following Genesis 1:
            "evening and morning."
          </Text>
          <Text
            style={{
              color: Colors.gold,
              fontSize: 28,
              fontWeight: '700',
              letterSpacing: 1.5,
              marginTop: 14,
              fontVariant: ['tabular-nums'],
              fontFamily: Platform.select({
                ios: 'Menlo',
                android: 'monospace',
                default: 'Menlo, Consolas, monospace',
              }),
            }}>
            {formatCountdown(countdownMs)}
          </Text>
          <Text style={{ color: Colors.textMuted, fontSize: 12, marginTop: 6 }}>
            Sunset today: {fmtTimeLocal(sunsetToday)}
          </Text>
          {!locationSet && (
            <Text
              style={{
                color: Colors.goldLight,
                fontSize: 10,
                fontStyle: 'italic',
                marginTop: 6,
                lineHeight: 14,
              }}>
              Using Jerusalem time ·{' '}
              <Text
                onPress={() => navigation.navigate('Settings')}
                accessibilityRole="link"
                style={{
                  color: Colors.gold,
                  fontWeight: '700',
                  textDecorationLine: 'underline',
                }}>
                Set your location in Settings
              </Text>
            </Text>
          )}
        </Card>

        {/* Card 3 — PARASHA (TouchableOpacity wraps the Card so the
            entire surface — title, name, even "Tap to read →" — fires
            the modal open). */}
        <TouchableOpacity
          onPress={() => setParashaModalOpen(true)}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={`View details for parasha ${parasha.parasha.name}`}>
          <Card>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 14 }}>📖</Text>
              <CardLabel>This Week's Torah Portion</CardLabel>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
              <Text
                style={{
                  color: Colors.text,
                  fontSize: 20,
                  fontWeight: '700',
                  letterSpacing: 0.3,
                }}>
                {parasha.pairedWith
                  ? `${parasha.parasha.name} – ${parasha.pairedWith.name}`
                  : parasha.parasha.name}
              </Text>
              <Text style={{ color: Colors.gold, fontSize: 14, fontWeight: '700' }}>→</Text>
            </View>
            <Text
              style={{
                color: Colors.gold,
                fontSize: 16,
                fontWeight: '600',
                marginTop: 4,
                textAlign: 'right',
              }}>
              {parasha.pairedWith
                ? `${parasha.parasha.hebrewName} – ${parasha.pairedWith.hebrewName}`
                : parasha.parasha.hebrewName}
            </Text>
            <Text style={{ color: Colors.textMuted, fontSize: 12, marginTop: 8 }}>
              {parasha.parasha.books}
              {parasha.pairedWith ? ` · ${parasha.pairedWith.books}` : ''}
            </Text>
            <Text style={{ color: Colors.textMuted, fontSize: 11, marginTop: 2 }}>
              Reading on Shabbat {GREG_MONTHS_SHORT[parasha.sabbathDate.getMonth()]}{' '}
              {parasha.sabbathDate.getDate()}
            </Text>
            <Text
              style={{
                color: Colors.gold,
                fontSize: 11,
                textAlign: 'right',
                marginTop: 8,
                fontWeight: '700',
                letterSpacing: 0.5,
              }}>
              Tap to read →
            </Text>
          </Card>
        </TouchableOpacity>

        {/* Card 4 — MOON PHASE */}
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 14 }}>{moon.emoji}</Text>
            <CardLabel>Moon Phase</CardLabel>
          </View>
          <Text
            style={{
              color: Colors.text,
              fontSize: 16,
              fontWeight: '700',
              marginTop: 8,
              letterSpacing: 0.3,
            }}>
            {moon.name}
          </Text>
          <Text style={{ color: Colors.textMuted, fontSize: 12, marginTop: 4 }}>
            Day {lunarDayOfCycle} of the lunar month · {Math.round(moon.illumination * 100)}% illuminated
          </Text>
        </Card>
      </ScrollView>

      <ParashaModal
        parashaName={parasha.parasha.name}
        pairedName={parasha.pairedWith?.name}
        sabbathDateLabel={`Shabbat ${GREG_MONTHS_SHORT[parasha.sabbathDate.getMonth()]} ${parasha.sabbathDate.getDate()}`}
        visible={parashaModalOpen}
        onClose={() => setParashaModalOpen(false)}
      />
    </SafeAreaView>
  );
}

/* --- card primitives --- */

function Card({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <View
      style={{
        backgroundColor: '#1A1A2E',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(201,168,76,0.15)',
      }}>
      {children}
    </View>
  );
}

function CardLabel({ children }: { children: string }): React.ReactElement {
  return (
    <Text
      style={{
        color: Colors.gold,
        fontSize: 10,
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontWeight: '800',
      }}>
      {children}
    </Text>
  );
}

function Badge({
  label,
  bg,
  fg,
}: {
  label: string;
  bg: string;
  fg: string;
}): React.ReactElement {
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
        backgroundColor: bg,
      }}>
      <Text
        style={{
          color: fg,
          fontSize: 11,
          fontWeight: '800',
          letterSpacing: 0.6,
        }}>
        {label}
      </Text>
    </View>
  );
}
