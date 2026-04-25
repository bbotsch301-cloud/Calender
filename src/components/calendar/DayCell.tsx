import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Colors, FeastPillColors } from '../../constants/colors';
import type { Feast } from '../../engine/feasts';

export interface DayCellData {
  date: Date;
  gregorianDay: number;
  hebrewDay: number;
  hebrewMonthName: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSaturday: boolean;
  isRoshChodesh: boolean;
  feast: Feast | null;
  feastDayNumber: number | null;
  omerDay: number | null;
  /** Moon emoji — only set for quarter phases (🌑 🌓 🌕 🌗); '' otherwise. */
  moonEmoji: string;
  moonPhaseName: string;
}

interface Props {
  data: DayCellData;
  onPress: (d: DayCellData) => void;
  minHeight?: number;
}

/**
 * Stripe priority:
 *   1. Feast (per FeastPillColors palette)
 *   2. Rosh Chodesh (teal, when no feast)
 *   3. Saturday Shabbat (soft purple, when neither above)
 *   4. None
 */
function stripeColorFor(data: DayCellData): string | null {
  if (data.feast && FeastPillColors[data.feast.key]) return FeastPillColors[data.feast.key].bg;
  if (data.isRoshChodesh) return Colors.roshChodeshStripe;
  if (data.isSaturday) return Colors.shabbatStripe;
  return null;
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1).trimEnd() + '…';
}

export function DayCell({ data, onPress, minHeight = 92 }: Props): React.ReactElement {
  const {
    gregorianDay,
    hebrewDay,
    hebrewMonthName,
    isCurrentMonth,
    isToday,
    isSaturday,
    isRoshChodesh,
    feast,
    omerDay,
    moonEmoji,
    moonPhaseName,
  } = data;

  const stripe = stripeColorFor(data);
  const hasFeast = Boolean(feast);
  const dim = !isCurrentMonth;

  // Per-cell Shabbat tint (replaces the old column overlay). Feast+Shabbat
  // gets a slightly stronger tint so the overlap reads clearly.
  let baseBg: string = 'transparent';
  if (isSaturday) {
    baseBg = hasFeast ? Colors.shabbatColumnTintFeast : Colors.shabbatColumnTint;
  }
  const bg = isToday ? 'rgba(201,168,76,0.10)' : baseBg;

  const feastLabel = feast ? truncate(FeastPillColors[feast.key]?.shortName ?? feast.name, 10) : null;

  return (
    <Pressable
      onPress={() => onPress(data)}
      accessibilityRole="button"
      accessibilityLabel={`${data.date.toDateString()}, ${hebrewDay} ${hebrewMonthName}${
        moonPhaseName ? `, moon ${moonPhaseName}` : ''
      }${feast ? `, ${feast.name}` : ''}${isRoshChodesh ? ', Rosh Chodesh' : ''}${
        isSaturday ? ', Shabbat' : ''
      }${omerDay ? `, Omer day ${omerDay}` : ''}`}
      style={({ pressed }) => ({
        flex: 1,
        minHeight,
        paddingVertical: 6,
        paddingRight: 6,
        paddingLeft: 8, // extra room so content doesn't sit on the stripe
        borderWidth: isToday ? 2 : 0,
        borderColor: isToday ? Colors.gold : 'transparent',
        borderRadius: 10,
        backgroundColor: pressed ? 'rgba(255,255,255,0.03)' : bg,
        opacity: dim ? 0.35 : 1,
        justifyContent: 'space-between',
      })}>
      {/* 3px colored left stripe */}
      {stripe && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            top: 4,
            bottom: 4,
            width: 3,
            borderRadius: 2,
            backgroundColor: stripe,
          }}
        />
      )}

      {/* Top row: feast label (left) + Hebrew date (right) */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 4,
        }}>
        <View style={{ flex: 1, flexShrink: 1 }}>
          {feastLabel && (
            <Text
              numberOfLines={1}
              style={{
                color: Colors.text,
                fontSize: 9,
                fontWeight: '700',
                letterSpacing: 0.3,
              }}>
              {feastLabel}
            </Text>
          )}
          {isSaturday && hasFeast && (
            <Text
              numberOfLines={1}
              style={{
                color: Colors.shabbatInline,
                fontSize: 9,
                fontWeight: '600',
                letterSpacing: 0.3,
                marginTop: 1,
              }}>
              Shabbat
            </Text>
          )}
          {isRoshChodesh && !feast && (
            <Text
              numberOfLines={1}
              style={{
                color: Colors.goldLight,
                fontSize: 9,
                fontWeight: '700',
                letterSpacing: 0.3,
              }}>
              Rosh Chodesh
            </Text>
          )}
        </View>
        <Text
          numberOfLines={1}
          style={{
            color: Colors.gold,
            fontSize: 11,
            fontWeight: '600',
            letterSpacing: 0.3,
          }}>
          {hebrewDay} {hebrewMonthName.slice(0, 4)}
        </Text>
      </View>

      {/* Bottom row: Gregorian day (big white) + Omer dot + moon emoji */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginTop: 6,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 18,
              fontWeight: '700',
              letterSpacing: 0.2,
            }}>
            {gregorianDay}
          </Text>
          {omerDay !== null && omerDay >= 1 && omerDay <= 49 && (
            <Text
              accessibilityElementsHidden
              style={{
                color: Colors.gold,
                fontSize: 8,
                lineHeight: 10,
              }}>
              ●
            </Text>
          )}
        </View>
        {moonEmoji ? (
          <Text
            accessibilityElementsHidden
            style={{
              fontSize: 10,
              opacity: 0.85,
            }}>
            {moonEmoji}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
