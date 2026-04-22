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

# Optional — enables AI-augmented "Meaning of Today" via claude-haiku-4-5
EXPO_PUBLIC_ANTHROPIC_API_KEY=
```

> **Note:** If you skip Supabase, the app still works fully via guest mode
> (everything is persisted locally with AsyncStorage).
>
> **Anthropic key (optional):** If `EXPO_PUBLIC_ANTHROPIC_API_KEY` is set,
> the "Meaning of Today" card calls Claude Haiku 4.5 directly from the
> client to generate a richer devotional reflection. **Without** the key,
> the app uses an entirely offline curated text pool (no network call).
> For production, route the Anthropic API call through your own server —
> shipping the key in a public app exposes it.

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

## Deploying to Render (static site)

The repo ships with `render.yaml` — a Blueprint that stands up Kingdom
Calendar as a hardened static site on Render. The app's Expo web target
builds a single-file bundle; React Navigation owns client-side routing,
so every non-asset path rewrites to `index.html`.

### One-time setup

1. Push this branch to GitHub (already done if you pulled this repo from
   a Claude session — the remote is wired).
2. In the Render dashboard, click **New +** → **Blueprint** → connect
   the GitHub repo → select the branch. Render reads `render.yaml` and
   creates a service named **kingdom-calendar** of type Static Site.
3. Fill in the three env vars (marked `sync: false` in the YAML) on the
   service's Environment page — see the table below. Trigger a deploy.

Build command (already set by the blueprint):

```
npm ci --legacy-peer-deps && npx expo export --platform web
```

Publish directory: `./dist`.

### Environment variables

Set these in **Render dashboard → your service → Environment**.

| Variable | Required? | Value |
|---|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Recommended (app runs in guest/local mode without it) | `https://YOUR-PROJECT.supabase.co` — from Supabase → Project Settings → API → **Project URL** |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Recommended | The `anon` `public` key from Supabase → Project Settings → API → **Project API keys** |
| `EXPO_PUBLIC_ANTHROPIC_PROXY_URL` | Optional | URL of a server you control that proxies to `https://api.anthropic.com/v1/messages` with your API key attached server-side. If unset, Meaning of Today falls back to offline curated text — no errors surfaced to the user. |
| `NODE_VERSION` | Pre-filled by the blueprint | `20` — Node 20 LTS. Don't change unless you know why. |

**Do NOT** set `EXPO_PUBLIC_ANTHROPIC_API_KEY` on the production service:
the AI service layer refuses the direct-to-Anthropic path outside
`__DEV__`, because any client-side key is readable by anyone who opens
devtools. Use the proxy URL instead.

### Security posture

The Blueprint applies the following headers to every response:

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Content-Security-Policy` — locked-down CSP that only allows
  connecting to `*.supabase.co`, `*.supabase.in`, and
  `api.anthropic.com` / `*.anthropic.com`.
- `X-Frame-Options: DENY` + `frame-ancestors 'none'` (no iframe embedding)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — geolocation allowed (sunset calc); camera,
  microphone, payment blocked.

Fingerprinted bundles under `/_expo/*` and `/assets/*` are served with
`Cache-Control: public, max-age=31536000, immutable`; the HTML shell is
`must-revalidate` so deploys propagate instantly.

### Diagnosing a Bad Gateway

If the deployed service returns 502:

1. Check the **Logs** tab — look for a failed build step. The most
   common cause is stale lockfile mismatches; `npm ci --legacy-peer-deps`
   in the blueprint avoids this.
2. Confirm `staticPublishPath: ./dist` matches the Expo export output.
   If the build succeeded but Render can't find files, the build
   command silently exited 0 without populating `dist/`.
3. Verify the service type is **Static Site**, not **Web Service**.
   Static sites serve files; Web Services expect an HTTP server.

### Running the same build locally

```bash
npm ci --legacy-peer-deps
npx expo export --platform web
npx serve dist   # or any static-file server
```

Open the URL → you should see the dark Kingdom Calendar onboarding.

## Security

- **Encrypted session storage.** Supabase auth persistence lives in
  `expo-secure-store` (iOS Keychain / Android EncryptedSharedPreferences);
  only the rare >1800-char value overflows to AsyncStorage.
- **Input validation.** Email, password (≥8 chars, letter + digit), and
  display-name checks happen client-side before any Supabase call. Free-text
  notes are clamped to 500 chars and stripped of control characters.
- **Local rate limiting.** After 3 failed sign-ins in a 15-minute window,
  backoff begins (exponential, capped at 2 min). Complements Supabase's
  own server-side limits — not a replacement.
- **Clean sign-out.** Signing out wipes every guest-mode cache
  (`guest-user`, `activity`, `profile:guest-*`).
- **Guest → account migration.** When a guest signs up or signs in, any
  existing AsyncStorage activity is pushed into Supabase under the new
  `user_id` and then cleared — idempotent, gated by a `migrated:<uid>` flag.
- **Auth listener.** `onAuthStateChange` is subscribed once and torn down
  on app unmount. Token refreshes and remote sign-outs propagate through
  Zustand.
- **RLS everywhere.** All tables have per-user row-level security policies
  (see `001_initial_schema.sql`). The `calendar_days` table is read-open
  (it contains no PII).
- **AI key hygiene.** In `__DEV__` the "Meaning of Today" card can call the
  Anthropic API directly with `EXPO_PUBLIC_ANTHROPIC_API_KEY`. In production
  the direct path is disabled; set `EXPO_PUBLIC_ANTHROPIC_PROXY_URL` to a
  server you control that holds the real key. If neither is set, the
  offline curated text is used transparently.
- **No telemetry.** The `ErrorBoundary` logs only in `__DEV__`; nothing is
  shipped to a third party.

## Running tests

```bash
npm run test
```

Covers the pure engines (Hebrew calendar, feasts, Omer, moon phase, sunset,
sabbath, alignment) plus the input validators. 51 tests across 8 suites.

## Tier 1–2 features

- **Real moon phase.** Pure-math Dershowitz-style synodic-month calculation
  in `src/engine/moonPhase.ts` (no API). `MoonPhaseDisplay` shows the phase
  on Home and DailyView; new moon days (Hebrew day 1) are flagged as
  **Rosh Chodesh** in the calendar grid and on DailyView.
- **3-screen onboarding.** `OnboardingScreen1`–`3` with animated previews;
  AsyncStorage gate (`hasSeenOnboarding`) so it shows only once.
- **Sunset-based day switching.** `useCurrentDay` watches every minute for
  the biblical-day boundary and emits a `DayTransitionToast` (slide-in
  banner with the new Hebrew date and any active feast). Does not fire on
  first load.
- **Location flow.** `useSunset` checks permission silently, falls back to
  Jerusalem on denial. `LocationBanner` (dismissible, persisted) prompts
  the user to grant permission. Store tracks `userLatitude`,
  `userLongitude`, and `usingLocationFallback`.
- **Meaning of Today.** Curated 2-3 sentence reflections per Hebrew month
  (3+ variations selected by Hebrew day); feast-specific lines override on
  active feasts; Omer & Shabbat handled. Optional AI augmentation via
  Claude Haiku 4.5 if `EXPO_PUBLIC_ANTHROPIC_API_KEY` is set; otherwise
  fully offline.
- **Torah portion (Parasha).** All 54 portions in `src/constants/parasha.ts`,
  with annual cycle starting from Simchat Torah (Tishrei 23). Doubled pairs
  (Vayakhel/Pekudei, Tazria/Metzora, etc.) are handled in non-leap years.
  `ParashaCard` on Home (every day) and DailyView (Sabbath only).
- **Omer counter.** `src/engine/omer.ts` exports `isOmerSeason`,
  `getOmerDay` (1–49 or null), `getOmerBlessing` (traditional formula),
  and `getOmerWeekTheme` (Kabbalistic Sefirot pairing). Dedicated
  `OmerScreen` with circular ring, blessing, week theme, streak, and
  49-day grid. Tab appears only during Omer season; `OmerBadge` surfaces
  on Home + DailyView.
- **Year at a Glance.** `YearScreen` + `YearTimeline` show all 12 (or 13)
  Hebrew months as horizontal rows: feast blocks colored per accent,
  sabbath gold tick marks, Rosh Chodesh moon, "You Are Here" gold ring,
  and an Omer gradient band between Firstfruits and Pentecost. Toggle
  between This Year / Next Year. Legend at the bottom.

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
| Pentecost (Firstfruits + 50 days) | Jun 17 | Jun 9 | May 25 |
| Trumpets (1 Tishri) | Oct 3 | Sep 23 | Sep 12 |
| Atonement (10 Tishri) | Oct 12 | Oct 2 | Sep 21 |
| Tabernacles (15–21 Tishri) | Oct 17–23 | Oct 7–13 | Sep 26 – Oct 2 |
| Eighth Day (22 Tishri) | Oct 24 | Oct 14 | Oct 3 |

The Omer count covers days 1–49 (the day after Firstfruits through the
day before Pentecost), with Pentecost itself the 50th day.

> Hebrew→Gregorian conversion follows the traditional rabbinic calendar
> (with deḥiyyot postponements), so dates align with `hebcal.com` etc.

## Build for production

```bash
npx eas build -p ios
npx eas build -p android
```

(Requires `eas-cli` configured — see Expo docs.)
