import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { gregorianToHebrew } from '../../engine/hebrewCalendar';
import { isRoshChodesh, isSabbath } from '../../engine/sabbath';
import { getFeastDayNumber, getFeastsForMonthRange, type Feast } from '../../engine/feasts';
import { getOmerDay } from '../../engine/omer';
import { getMoonPhase } from '../../engine/moonPhase';
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

export function MonthGrid({ year, month, weekStartSunday, onDayPress }: Props): React.ReactElement {
  // `today` used only for the today-ring — snapping to start-of-day keeps
  // the comparison stable across a re-render that straddles midnight.
  const today = useMemo(() => startOfDay(new Date()), []);

  const feasts = useMemo(() => getFeastsForMonthRange(year), [year]);

  const { weekdayHeaders, rows } = useMemo(() => {
    // Build the 6-row × 7-col grid starting either Sunday or Saturday.
    const first = new Date(year, month, 1);
    const firstDow = first.getDay(); // 0 = Sunday
    // offset = number of blank-or-prev-month cells before day 1
    const offset = weekStartSunday
      ? firstDow
      : (firstDow + 1) % 7; // Saturday first → Saturday is column 0
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
        // Sample moon phase at noon local — stable within a cell, avoids
        // the pre-dawn edge where the phase emoji might flip mid-hour.
        const noon = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);
        const moon = getMoonPhase(noon);
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
          moonEmoji: moon.emoji,
          moonPhaseName: moon.name,
        });
      }
      rows.push(row);
    }

    const weekdayHeaders = weekStartSunday ? DAY_LETTERS_SUN_FIRST : DAY_LETTERS_SAT_FIRST;
    return { weekdayHeaders, rows };
  }, [year, month, weekStartSunday, today, feasts]);

  // Which column index holds Saturday (for the tint).
  const saturdayColIndex = weekStartSunday ? 6 : 0;

  return (
    <View>
      {/* Weekday headers */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 4, marginBottom: 6 }}>
        {weekdayHeaders.map((letter, idx) => (
          <View
            key={`hdr-${idx}`}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 8,
              backgroundColor:
                idx === saturdayColIndex ? Colors.shabbatColumnTint : 'transparent',
              borderTopLeftRadius: idx === saturdayColIndex ? 8 : 0,
              borderTopRightRadius: idx === saturdayColIndex ? 8 : 0,
            }}>
            <Text
              style={{
                color: idx === saturdayColIndex ? Colors.goldLight : Colors.textMuted,
                fontSize: 12,
                fontWeight: '700',
                letterSpacing: 2,
              }}>
              {letter}
            </Text>
          </View>
        ))}
      </View>

      {/* Day rows */}
      <View
        style={{
          position: 'relative',
          paddingHorizontal: 4,
        }}>
        {/* Saturday column tint spanning all 6 rows */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${(100 / 7) * saturdayColIndex}%`,
            width: `${100 / 7}%`,
            backgroundColor: Colors.shabbatColumnTint,
          }}
        />
        {rows.map((row, rIdx) => (
          <View key={`row-${rIdx}`} style={{ flexDirection: 'row', gap: 2, marginBottom: 2 }}>
            {row.map((cell) => (
              <DayCell
                key={cell.date.toISOString()}
                data={cell}
                onPress={onDayPress}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
