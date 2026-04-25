import React, { useMemo } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, FeastPillColors } from '../../constants/colors';
import { gregorianToHebrew, toHebrewNumeral } from '../../engine/hebrewCalendar';
import { computeFeastsForYear, getActiveFeast, getFeastDayNumber } from '../../engine/feasts';
import { isRoshChodesh, isSabbath } from '../../engine/sabbath';
import { getOmerDay } from '../../engine/omer';
import { getParashaForDate } from '../../constants/parasha';
import { calculateSunset } from '../../engine/sunset';
import { getMoonPhase } from '../../engine/moonPhase';
import { useCalendarStore } from '../../store/useCalendarStore';
import { getLearnFeastByKey } from '../../content/feasts-content';

interface Props {
  date: Date | null;
  onClose: () => void;
}

const GREG_WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const GREG_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const HEBREW_WEEKDAYS = [
  { name: 'Yom Rishon', he: 'יוֹם רִאשׁוֹן', ordinal: '1st' },
  { name: 'Yom Sheni', he: 'יוֹם שֵׁנִי', ordinal: '2nd' },
  { name: "Yom Shlishi", he: 'יוֹם שְׁלִישִׁי', ordinal: '3rd' },
  { name: "Yom Revi'i", he: 'יוֹם רְבִיעִי', ordinal: '4th' },
  { name: 'Yom Chamishi', he: 'יוֹם חֲמִישִׁי', ordinal: '5th' },
  { name: 'Yom Shishi', he: 'יוֹם שִׁשִּׁי', ordinal: '6th' },
  { name: 'Shabbat', he: 'שַׁבָּת', ordinal: '7th' },
];

function fmtTimeLocal(d: Date): string {
  const h24 = d.getHours();
  const m = d.getMinutes();
  const ampm = h24 >= 12 ? 'PM' : 'AM';
  const h12 = ((h24 + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function fmtDateShort(d: Date): string {
  return `${GREG_MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
}

// Navigation prop is loose-typed here because the modal is rendered by
// CalendarScreen (a tab) but routes into a nested stack under the Learn
// tab. React Navigation resolves this at runtime.
interface NavHandle {
  navigate: (name: string, params?: unknown) => void;
}

export function DayDetailModal({ date, onClose }: Props): React.ReactElement {
  const latitude = useCalendarStore((s) => s.latitude);
  const longitude = useCalendarStore((s) => s.longitude);
  const locationName = useCalendarStore((s) => s.locationName);
  const locationMode = useCalendarStore((s) => s.locationMode);
  const navigation = useNavigation() as unknown as NavHandle;

  const detail = useMemo(() => {
    if (!date) return null;
    const hebrew = gregorianToHebrew(date);
    const weekdayMeta = HEBREW_WEEKDAYS[date.getDay()];
    const feasts = computeFeastsForYear(date.getFullYear());
    const feast = getActiveFeast(date, feasts);
    const feastDayNumber = feast ? getFeastDayNumber(date, feast) : null;
    const omer = getOmerDay(date);
    const parasha = getParashaForDate(date, hebrew.year);
    const sunset = calculateSunset(date, latitude, longitude);
    const noon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
    const moon = getMoonPhase(noon);
    const prevDay = new Date(date);
    prevDay.setDate(prevDay.getDate() - 1);
    return {
      hebrew,
      weekdayMeta,
      feast,
      feastDayNumber,
      omer,
      parasha,
      sunset,
      moon,
      prevDay,
      isSabbath: isSabbath(date),
      isRoshChodesh: isRoshChodesh(date),
    };
  }, [date, latitude, longitude]);

  const hebrewYearGlyph = detail ? toHebrewNumeral(detail.hebrew.year) : '';

  return (
    <Modal
      visible={date !== null}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close day detail"
        style={{
          flex: 1,
          backgroundColor: Colors.modalBackdrop,
          justifyContent: 'flex-end',
        }}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          accessible={false}
          style={{
            backgroundColor: Colors.surface,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderTopWidth: 1,
            borderColor: Colors.border,
            paddingBottom: 32,
            maxHeight: '88%',
          }}>
          {/* Handle bar */}
          <View style={{ alignItems: 'center', paddingVertical: 10 }}>
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: Colors.border,
              }}
            />
          </View>

          <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 10 }}>
            {detail && date && (
              <>
                {/* Close button (top-right) */}
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Pressable
                    onPress={onClose}
                    accessibilityRole="button"
                    accessibilityLabel="Close"
                    hitSlop={12}
                    style={{ padding: 4 }}>
                    <Text style={{ color: Colors.textMuted, fontSize: 22, fontWeight: '600' }}>
                      ×
                    </Text>
                  </Pressable>
                </View>

                {/* Gregorian date */}
                <Text
                  style={{
                    color: Colors.textMuted,
                    fontSize: 11,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    fontWeight: '700',
                  }}>
                  {GREG_WEEKDAYS[date.getDay()]}
                </Text>
                <Text
                  style={{
                    color: Colors.text,
                    fontSize: 26,
                    fontWeight: '800',
                    marginTop: 2,
                    letterSpacing: 0.3,
                  }}>
                  {GREG_MONTHS[date.getMonth()]} {date.getDate()}, {date.getFullYear()}
                </Text>

                {/* Hebrew date */}
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  <Text style={{ color: Colors.gold, fontSize: 20, fontWeight: '700', letterSpacing: 0.5 }}>
                    {detail.hebrew.day} {detail.hebrew.monthName} {detail.hebrew.year}
                  </Text>
                  <Text style={{ color: Colors.goldLight, fontSize: 18 }}>
                    · {toHebrewNumeral(detail.hebrew.day)} {detail.hebrew.monthNameHebrew} {hebrewYearGlyph}
                  </Text>
                </View>

                {/* Hebrew weekday */}
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
                  <Text style={{ color: Colors.text, fontSize: 13, fontWeight: '600' }}>
                    {detail.weekdayMeta.name}
                  </Text>
                  <Text style={{ color: Colors.textMuted, fontSize: 12 }}>
                    · {detail.weekdayMeta.he} ({detail.weekdayMeta.ordinal} day)
                  </Text>
                </View>

                {/* Biblical day begin note */}
                <Text style={{ color: Colors.textMuted, fontSize: 12, marginTop: 14, fontStyle: 'italic' }}>
                  Biblical day began at sunset on {GREG_MONTHS[detail.prevDay.getMonth()]}{' '}
                  {detail.prevDay.getDate()}
                </Text>

                {/* Badges row */}
                {(detail.feast || detail.omer !== null || detail.isSabbath || detail.isRoshChodesh) && (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                    {detail.feast && FeastPillColors[detail.feast.key] && (
                      <Badge
                        label={
                          detail.feastDayNumber && detail.feast.durationDays > 1
                            ? `${FeastPillColors[detail.feast.key].shortName} · Day ${detail.feastDayNumber}`
                            : FeastPillColors[detail.feast.key].shortName
                        }
                        bg={FeastPillColors[detail.feast.key].bg}
                        fg={FeastPillColors[detail.feast.key].text}
                      />
                    )}
                    {detail.isSabbath && (
                      <Badge label="Shabbat" bg={Colors.shabbatStripe} fg="#FFFFFF" />
                    )}
                    {detail.isRoshChodesh && (
                      <Badge label="🌒 Rosh Chodesh" bg="rgba(201,168,76,0.15)" fg={Colors.gold} />
                    )}
                    {detail.omer !== null && (
                      <Badge
                        label={`Omer Day ${detail.omer} of 49`}
                        bg="rgba(201,168,76,0.15)"
                        fg={Colors.gold}
                      />
                    )}
                  </View>
                )}

                {/* Feast description */}
                {detail.feast && (
                  <View style={{ marginTop: 18 }}>
                    <SectionLabel>Feast</SectionLabel>
                    <Text style={{ color: Colors.text, fontSize: 14, lineHeight: 22, marginTop: 4 }}>
                      {detail.feast.description}
                    </Text>
                  </View>
                )}

                {/* Omer */}
                {detail.omer !== null && (
                  <View style={{ marginTop: 18 }}>
                    <SectionLabel>Counting of the Omer</SectionLabel>
                    <Text style={{ color: Colors.text, fontSize: 14, marginTop: 4 }}>
                      Day {detail.omer} of 49
                    </Text>
                  </View>
                )}

                {/* Torah portion */}
                <View style={{ marginTop: 18 }}>
                  <SectionLabel>Torah portion this week</SectionLabel>
                  <Text style={{ color: Colors.text, fontSize: 14, fontWeight: '600', marginTop: 4 }}>
                    {detail.parasha.pairedWith
                      ? `${detail.parasha.parasha.name} – ${detail.parasha.pairedWith.name}`
                      : detail.parasha.parasha.name}{' '}
                    <Text style={{ color: Colors.goldLight, fontWeight: '400' }}>
                      · {detail.parasha.parasha.hebrewName}
                    </Text>
                  </Text>
                  <Text style={{ color: Colors.textMuted, fontSize: 12, marginTop: 2 }}>
                    {detail.parasha.parasha.books}
                    {detail.parasha.pairedWith ? ` · ${detail.parasha.pairedWith.books}` : ''}
                  </Text>
                  <Text style={{ color: Colors.textMuted, fontSize: 12, marginTop: 2 }}>
                    Reading on Shabbat {fmtDateShort(detail.parasha.sabbathDate)}
                  </Text>
                </View>

                {/* Sunset */}
                <View style={{ marginTop: 18, marginBottom: 6 }}>
                  <SectionLabel>Sunset</SectionLabel>
                  {locationMode === 'fallback' && !locationName ? (
                    <Text style={{ color: Colors.textMuted, fontSize: 13, marginTop: 4 }}>
                      Set location in Settings to see sunset times.
                    </Text>
                  ) : (
                    <>
                      <Text style={{ color: Colors.text, fontSize: 16, fontWeight: '700', marginTop: 4 }}>
                        {fmtTimeLocal(detail.sunset)}
                      </Text>
                      {locationName && (
                        <Text style={{ color: Colors.textMuted, fontSize: 12, marginTop: 2 }}>
                          at {locationName}
                        </Text>
                      )}
                    </>
                  )}
                </View>

                {/* Moon phase */}
                <View style={{ marginTop: 18 }}>
                  <SectionLabel>Moon</SectionLabel>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 }}>
                    <Text style={{ fontSize: 28 }}>{detail.moon.emoji}</Text>
                    <View>
                      <Text style={{ color: Colors.text, fontSize: 14, fontWeight: '700' }}>
                        {detail.moon.name}
                      </Text>
                      <Text style={{ color: Colors.textMuted, fontSize: 12, marginTop: 2 }}>
                        {Math.round(detail.moon.illumination * 100)}% illuminated
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Deep link into Learn > Feasts */}
                {detail.feast && (() => {
                  const learnKey = mapFeastKeyToLearn(detail.feast.key);
                  if (!learnKey || !getLearnFeastByKey(learnKey)) return null;
                  return (
                    <Pressable
                      onPress={() => {
                        onClose();
                        navigation.navigate('Learn', {
                          screen: 'FeastDetail',
                          params: { feastKey: learnKey },
                        });
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`Learn about ${detail.feast.name}`}
                      style={({ pressed }) => ({
                        marginTop: 22,
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: Colors.gold,
                        backgroundColor: pressed ? 'rgba(201,168,76,0.18)' : 'rgba(201,168,76,0.08)',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      })}>
                      <Text
                        style={{
                          color: Colors.gold,
                          fontSize: 13,
                          fontWeight: '800',
                          letterSpacing: 1.2,
                          textTransform: 'uppercase',
                        }}>
                        Learn about {detail.feast.name}
                      </Text>
                      <Text style={{ color: Colors.gold, fontSize: 16, fontWeight: '700' }}>→</Text>
                    </Pressable>
                  );
                })()}
              </>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function Badge({ label, bg, fg }: { label: string; bg: string; fg: string }): React.ReactElement {
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

/**
 * Map calendar-engine feast keys (the date-computation names) to the
 * Learn content file's keys. Most are identical — the divergence is
 * purely cosmetic on the Learn side.
 */
function mapFeastKeyToLearn(key: string): string | null {
  // 1:1 mapping today; the function exists so future renames or aliases
  // (e.g. adding Shabbat / Rosh Chodesh deep links that aren't feasts
  // in the calendar engine) have a single place to live.
  const map: Record<string, string> = {
    passover: 'passover',
    unleavenedBread: 'unleavenedBread',
    firstfruits: 'firstfruits',
    shavuot: 'shavuot',
    yomTeruah: 'yomTeruah',
    yomKippur: 'yomKippur',
    sukkot: 'sukkot',
    sheminiAtzeret: 'sheminiAtzeret',
    hanukkah: 'hanukkah',
    purim: 'purim',
  };
  return map[key] ?? null;
}
