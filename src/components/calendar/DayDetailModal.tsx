import React, { useMemo } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Colors, FeastPillColors } from '../../constants/colors';
import { gregorianToHebrew, toHebrewNumeral } from '../../engine/hebrewCalendar';
import { computeFeastsForYear, getActiveFeast, getFeastDayNumber } from '../../engine/feasts';
import { isRoshChodesh, isSabbath } from '../../engine/sabbath';
import { getOmerDay } from '../../engine/omer';
import { getParashaForDate } from '../../constants/parasha';
import { calculateSunset } from '../../engine/sunset';
import { useCalendarStore } from '../../store/useCalendarStore';

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

export function DayDetailModal({ date, onClose }: Props): React.ReactElement {
  const latitude = useCalendarStore((s) => s.latitude);
  const longitude = useCalendarStore((s) => s.longitude);
  const locationName = useCalendarStore((s) => s.locationName);
  const locationMode = useCalendarStore((s) => s.locationMode);

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
                      <Badge label="Shabbat" bg={Colors.shabbatBadge} fg="#FFFFFF" />
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
