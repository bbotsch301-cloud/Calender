-- Kingdom Calendar :: 002 — manual / GPS location persistence
--
-- Adds a human-readable location label and a mode hint to public.users
-- so the app can display "Jerusalem, Israel" alongside coordinates and
-- remember whether the user typed it in or had it auto-detected.
--
-- Safe to re-run on existing projects.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS location_name text,
  ADD COLUMN IF NOT EXISTS location_mode text NOT NULL DEFAULT 'fallback';

ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_location_mode_check;

ALTER TABLE public.users
  ADD CONSTRAINT users_location_mode_check
  CHECK (location_mode IN ('gps', 'manual', 'fallback'));
