import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { gregorianToHebrew } from '../../engine/hebrewCalendar';
import { isRoshChodesh } from '../../engine/sabbath';
import { getFeastDayNumber, getFeastsForMonthRange, type Feast } from '../../engine/feasts';
import { getOmerDay } from '../../engine/omer';
import { getMoonPhase, type MoonPhaseIndex } from '../../engine/moonPhase';
import { DayCell, type DayCellData } from './DayCell';

interface Props {
  year: number;
  /** 0-indexed Gregorian month (0 = January). */
  month: number;
  weekStartSunday: boolean;
  onDayPress: (d: DayCellData) => void;
}

const DAY_LETTERS_SUN_FIRST = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAY_LETTERS_SAT_FIRST = ['S', 'S', 'M', 'T', 'W', 'T', 'F'];

/** Only the four quarter phases surface in the grid; crescents/gibbous hide. */
const QUARTER_PHASES: ReadonlySet<MoonPhaseIndex> = new Set<MoonPhaseIndex>([0, 2, 4, 6]);

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function findFeastFor(date: Date, feasts: Feast[]): Feast | null {
  const t = startOfDay(date).getTime();
  for (const f of feasts) {
    const s = startOfDay(f.startDate).getTime();
    const e = startOfDay(f.endDate).getTime();
    if (t >= s && t <= e) return f;
  }
  return null;
}

export function MonthGrid({
  year,
  month,
  weekStartSunday,
  onDayPress,
}: Props): React.ReactElement {
  const today = useMemo(() => startOfDay(new Date()), []);
  const feasts = useMemo(() => getFeastsForMonthRange(year), [year]);

  const { weekdayHeaders, rows } = useMemo(() => {
    const first = new Date(year, month, 1);
    const firstDow = first.getDay();
    const offset = weekStartSunday ? firstDow : (firstDow + 1) % 7;
    const gridStart = new Date(year, month, 1 - offset);

    const rows: DayCellData[][] = [];
    for (let r = 0; r < 6; r++) {
      const row: DayCellData[] = [];
      for (let c = 0; c < 7; c++) {
        const d = new Date(gridStart);
        d.setDate(gridStart.getDate() + r * 7 + c);
        const hebrew = gregorianToHebrew(d);
        const feast = findFeastFor(d, feasts);
        const feastDayNumber = feast ? getFeastDayNumber(d, feast) : null;
        const omer = getOmerDay(d);
        const noon = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);
        const moon = getMoonPhase(noon);
        const isQuarter = QUARTER_PHASES.has(moon.phase);
        row.push({
          date: d,
          gregorianDay: d.getDate(),
          hebrewDay: hebrew.day,
          hebrewMonthName: hebrew.monthName,
          isCurrentMonth: d.getMonth() === month,
          isToday: startOfDay(d).getTime() === today.getTime(),
          isSaturday: d.getDay() === 6,
          isRoshChodesh: isRoshChodesh(d),
          feast,
          feastDayNumber,
          omerDay: omer,
          moonEmoji: isQuarter ? moon.emoji : '',
          moonPhaseName: moon.name,
        });
      }
      rows.push(row);
    }

    const weekdayHeaders = weekStartSunday ? DAY_LETTERS_SUN_FIRST : DAY_LETTERS_SAT_FIRST;
    return { weekdayHeaders, rows };
  }, [year, month, weekStartSunday, today, feasts]);

  const saturdayColIndex = weekStartSunday ? 6 : 0;

  return (
    <View>
      {/* Weekday headers — Saturday gets the full "Shabbat" label in purple */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 4, marginBottom: 6 }}>
        {weekdayHeaders.map((letter, idx) => {
          const isSat = idx === saturdayColIndex;
          return (
            <View
              key={`hdr-${idx}`}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: 8,
                backgroundColor: isSat ? Colors.shabbatColumnTint : 'transparent',
                borderTopLeftRadius: isSat ? 8 : 0,
                borderTopRightRadius: isSat ? 8 : 0,
              }}>
              <Text
                numberOfLines={1}
                style={{
                  color: isSat ? Colors.shabbatLabel : Colors.textMuted,
                  fontSize: isSat ? 10 : 12,
                  fontWeight: '700',
                  letterSpacing: isSat ? 1 : 2,
                  textTransform: isSat ? 'uppercase' : 'none',
                }}>
                {isSat ? 'Shabbat' : letter}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Day rows — column tint now lives per-cell in DayCell, so we no
          longer paint a single vertical bar underneath the cells. */}
      <View style={{ paddingHorizontal: 4 }}>
        {rows.map((row, rIdx) => (
          <View key={`row-${rIdx}`} style={{ flexDirection: 'row', gap: 2, marginBottom: 2 }}>
            {row.map((cell) => (
              <DayCell key={cell.date.toISOString()} data={cell} onPress={onDayPress} />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
