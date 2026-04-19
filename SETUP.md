# Kingdom Calendar — Setup

A spiritually immersive biblical Hebrew calendar app built with React Native + Expo.

## Stack

- **Expo SDK 51+** with React Native 0.74 and TypeScript
- **NativeWind** (Tailwind CSS for React Native)
- **Zustand** for state management
- **Supabase** for auth + persistence (with guest fallback to AsyncStorage)
- **Expo Notifications** for sabbath / feast / daily reminders
- **Expo Location** for accurate sunset times

## Prerequisites

- Node.js 18+ and npm or yarn
- Expo Go app on your phone, **or** Xcode (iOS) / Android Studio (Android)
- A Supabase project (optional — guest mode works without it)

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment (optional, only for cloud sync)

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```
EXPO_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

> **Note:** If you skip this step, the app still works fully via guest mode
> (everything is persisted locally with AsyncStorage).

## 3. (Optional) Run the Supabase migration

In your Supabase project SQL editor, run:

```bash
supabase/migrations/001_initial_schema.sql
```

This creates: `users`, `events`, `calendar_days`, `user_activity`,
`alignment_scores`, all with row-level security policies and an
auto-profile trigger on auth signup.

## 4. Start the dev server

```bash
npm start
```

Then either:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan the QR code with Expo Go on your device

## 5. Type-check

```bash
npm run type-check
```

---

## Project Structure

```
src/
├── engine/                    # Pure logic, zero UI
│   ├── hebrewCalendar.ts      # Dershowitz-Reingold Gregorian↔Hebrew conversion
│   ├── feasts.ts              # Computes 8 Leviticus 23 feasts for any year
│   ├── sabbath.ts             # Saturday detection, next/prev sabbath
│   ├── sunset.ts              # NOAA solar algorithm
│   └── alignment.ts           # 0–100 alignment score
├── types/
├── constants/
│   ├── colors.ts              # Dark + gold palette + per-feast accents
│   ├── feasts.ts              # Static metadata for all 8 feasts
│   └── scriptures.ts          # Daily scripture pool keyed by Hebrew month
├── supabase/
│   ├── client.ts
│   ├── auth.ts                # signIn / signUp / guest / state changes
│   └── queries.ts             # Hybrid Supabase + AsyncStorage fallback
├── store/                     # Zustand stores
│   ├── useCalendarStore.ts
│   ├── useFeastStore.ts
│   ├── useAlignmentStore.ts
│   ├── useThemeStore.ts
│   └── useAuthStore.ts
├── navigation/
│   ├── RootNavigator.tsx      # Auth stack OR main tabs
│   └── TabNavigator.tsx       # Home / Calendar / Today / Profile
├── hooks/
│   ├── useCurrentDay.ts       # Re-renders at sunset
│   ├── useFeastMode.ts
│   ├── useSunset.ts
│   └── useAlignment.ts
├── components/
│   ├── ui/                    # GoldText, DarkCard, AnimatedBorder
│   ├── shared/                # DualDateHeader, SabbathBadge,
│   │                          # AlignmentScore, CountdownTimer, GlowPulse
│   ├── timeline/              # TimelineScroll, TimelineNode, YouAreHere
│   ├── feast/                 # FeastCard, FeastModeOverlay, FeastBadge
│   └── calendar/              # CalendarGrid, DayCell, DualDateLabel
├── screens/
│   ├── HomeScreen.tsx         # Horizontal sacred timeline
│   ├── CalendarScreen.tsx     # Standard / biblical toggle, monthly grid
│   ├── TodayScreen.tsx        # Sunset countdown, scripture, check-in
│   ├── DailyViewScreen.tsx    # Full day detail
│   ├── EventDetailScreen.tsx  # Feast detail page
│   ├── ProfileScreen.tsx      # Alignment, streak, stats, settings
│   └── auth/                  # LoginScreen, SignupScreen
├── notifications/
│   └── scheduler.ts           # Sabbath / feast / daily check-in alerts
supabase/
└── migrations/001_initial_schema.sql
```

## Implementation notes

- **Day starts at sunset.** `useCurrentDay` provides a live countdown to the
  next biblical day using the NOAA sunset algorithm.
- **Hebrew calendar** uses the traditional rabbinical (Dershowitz-Reingold)
  calculation — leap years, mol of Tishri, postponements (deḥiyyot), etc.
- **Firstfruits** = first Sunday after Passover (15 Nisan), per the spec.
- **Pentecost** = exactly 50 days (7 sabbaths + 1) after Firstfruits.
- **Alignment score** = `(sabbathsKept·40 + feastsEngaged·40 + checkIns·20)
  / maxPossible · 100`, computed over a rolling 90-day window.
- **Guest mode** is completely offline — all activity persists to
  AsyncStorage; no Supabase calls are made.
- **Location is optional** — without permission, the app falls back to
  Jerusalem (31.7683° N, 35.2137° E).

## Verifying feast dates

The engine produces the eight Leviticus 23 feasts for any Gregorian year.
Spot-check 2024–2026:

| Feast | 2024 | 2025 | 2026 |
|---|---|---|---|
| Passover (14 Nisan) | Apr 22 | Apr 12 | Apr 1 |
| Unleavened Bread (15–21 Nisan) | Apr 23–29 | Apr 13–19 | Apr 2–8 |
| Firstfruits (Sun after) | Apr 28 | Apr 20 | Apr 5 |
| Pentecost (+49 days) | Jun 16 | Jun 8 | May 24 |
| Trumpets (1 Tishri) | Oct 3 | Sep 23 | Sep 12 |
| Atonement (10 Tishri) | Oct 12 | Oct 2 | Sep 21 |
| Tabernacles (15–21 Tishri) | Oct 17–23 | Oct 7–13 | Sep 26 – Oct 2 |
| Eighth Day (22 Tishri) | Oct 24 | Oct 14 | Oct 3 |

> Hebrew→Gregorian conversion follows the traditional rabbinic calendar
> (with deḥiyyot postponements), so dates align with `hebcal.com` etc.

## Build for production

```bash
npx eas build -p ios
npx eas build -p android
```

(Requires `eas-cli` configured — see Expo docs.)
