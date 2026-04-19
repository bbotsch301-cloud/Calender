/**
 * Optional AI-augmented meaning generation using the Anthropic API.
 * If `EXPO_PUBLIC_ANTHROPIC_API_KEY` is set, this function fetches a richer
 * paragraph from claude-haiku-4-5; otherwise it falls back to the curated
 * `generateMeaningOfToday` text.
 *
 * Note: the API key is shipped to the client in development; in production
 * route through your own server.
 */

import type { Feast } from '../engine/feasts';
import type { HebrewDate } from '../engine/hebrewCalendar';
import { generateMeaningOfToday, getHebrewMonthTheme } from '../engine/meaningOfToday';

declare const process: { env: Record<string, string | undefined> };

const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '';
const MODEL = 'claude-haiku-4-5-20251001';
const ENDPOINT = 'https://api.anthropic.com/v1/messages';

export const isAIConfigured = Boolean(ANTHROPIC_API_KEY);

interface Args {
  hebrewDate: HebrewDate;
  activeFeast?: Feast | null;
  isOmerSeason?: boolean;
  omerDay?: number | null;
  dayOfWeek?: number;
  signal?: AbortSignal;
}

export async function generateMeaningOfTodayWithAI(args: Args): Promise<string> {
  const fallback = generateMeaningOfToday(args);
  if (!ANTHROPIC_API_KEY) return fallback;

  const monthTheme = getHebrewMonthTheme(args.hebrewDate.month);
  const promptParts: string[] = [
    `Today is ${args.hebrewDate.day} ${args.hebrewDate.monthName} ${args.hebrewDate.year}.`,
    `The traditional theme of ${monthTheme.name} is "${monthTheme.theme}".`,
  ];
  if (args.activeFeast) {
    promptParts.push(`The active feast is ${args.activeFeast.name} (${args.activeFeast.hebrewName}).`);
  }
  if (args.isOmerSeason && args.omerDay) {
    promptParts.push(`We are counting the Omer — today is day ${args.omerDay} of 49.`);
  }
  if (args.dayOfWeek === 6) promptParts.push('Today is Shabbat.');
  else if (args.dayOfWeek === 5) promptParts.push('Today is Erev Shabbat.');

  const userPrompt =
    promptParts.join(' ') +
    ' Write a 2-3 sentence devotional reflection in a warm, scripturally-rooted voice. Avoid clichés. Do not list scriptures; weave any biblical reference naturally. Speak as a wise companion, not a teacher.';

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 220,
        messages: [{ role: 'user', content: userPrompt }],
      }),
      signal: args.signal,
    });
    if (!res.ok) return fallback;
    const data = (await res.json()) as { content?: Array<{ type: string; text?: string }> };
    const block = data.content?.find((c) => c.type === 'text');
    const text = block?.text?.trim();
    return text && text.length > 0 ? text : fallback;
  } catch {
    return fallback;
  }
}
