-- Kingdom Calendar :: Initial Schema
-- Tables: users, events, calendar_days, user_activity, alignment_scores
-- Row Level Security enabled on all user-owned tables

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email text,
  display_name text,
  latitude double precision,
  longitude double precision,
  timezone text,
  notifications_enabled boolean NOT NULL DEFAULT true,
  sabbath_reminders_enabled boolean NOT NULL DEFAULT true,
  feast_reminders_enabled boolean NOT NULL DEFAULT true,
  daily_checkin_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_own" ON public.users;
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "users_insert_own" ON public.users;
CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "users_update_own" ON public.users;
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- EVENTS  (feasts and special days, can be canonical or user-defined)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users (id) ON DELETE CASCADE,
  feast_key text,
  name text NOT NULL,
  hebrew_name text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  hebrew_year integer,
  hebrew_month integer,
  hebrew_day integer,
  description text,
  is_canonical boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS events_user_idx ON public.events(user_id);
CREATE INDEX IF NOT EXISTS events_date_idx ON public.events(start_date, end_date);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "events_select_own_or_canonical" ON public.events;
CREATE POLICY "events_select_own_or_canonical" ON public.events
  FOR SELECT USING (is_canonical = true OR auth.uid() = user_id);

DROP POLICY IF EXISTS "events_insert_own" ON public.events;
CREATE POLICY "events_insert_own" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "events_update_own" ON public.events;
CREATE POLICY "events_update_own" ON public.events
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "events_delete_own" ON public.events;
CREATE POLICY "events_delete_own" ON public.events
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- CALENDAR_DAYS (cached/precomputed Hebrew↔Gregorian mappings)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.calendar_days (
  gregorian_date date PRIMARY KEY,
  hebrew_year integer NOT NULL,
  hebrew_month integer NOT NULL,
  hebrew_day integer NOT NULL,
  hebrew_month_name text NOT NULL,
  is_sabbath boolean NOT NULL,
  feast_key text,
  notes text
);

CREATE INDEX IF NOT EXISTS calendar_days_hebrew_idx
  ON public.calendar_days (hebrew_year, hebrew_month, hebrew_day);

ALTER TABLE public.calendar_days ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "calendar_days_select_all" ON public.calendar_days;
CREATE POLICY "calendar_days_select_all" ON public.calendar_days
  FOR SELECT USING (true);

-- ============================================================
-- USER_ACTIVITY (sabbath kept, feast observed, check-ins, etc.)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_activity (
  id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('sabbath', 'feast', 'checkin', 'scripture', 'fast')),
  activity_date timestamptz NOT NULL,
  feast_key text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_activity_user_idx
  ON public.user_activity (user_id, activity_date DESC);
CREATE INDEX IF NOT EXISTS user_activity_type_idx
  ON public.user_activity (user_id, type);

ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_activity_select_own" ON public.user_activity;
CREATE POLICY "user_activity_select_own" ON public.user_activity
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_activity_insert_own" ON public.user_activity;
CREATE POLICY "user_activity_insert_own" ON public.user_activity
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_activity_delete_own" ON public.user_activity;
CREATE POLICY "user_activity_delete_own" ON public.user_activity
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- ALIGNMENT_SCORES (snapshots over time)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.alignment_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  score integer NOT NULL CHECK (score BETWEEN 0 AND 100),
  streak_days integer NOT NULL DEFAULT 0,
  sabbaths_kept integer NOT NULL DEFAULT 0,
  feasts_engaged integer NOT NULL DEFAULT 0,
  check_ins integer NOT NULL DEFAULT 0,
  scriptures_read integer NOT NULL DEFAULT 0,
  computed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS alignment_scores_user_time_idx
  ON public.alignment_scores (user_id, computed_at DESC);

ALTER TABLE public.alignment_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "alignment_scores_select_own" ON public.alignment_scores;
CREATE POLICY "alignment_scores_select_own" ON public.alignment_scores
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "alignment_scores_insert_own" ON public.alignment_scores;
CREATE POLICY "alignment_scores_insert_own" ON public.alignment_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Trigger: auto-create profile row on auth user creation
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
