/**
 * "Meaning of Today" — generates a 2-3 sentence contextual paragraph
 * about the spiritual character of the current day, fully offline.
 *
 * If `EXPO_PUBLIC_ANTHROPIC_API_KEY` is set, the caller can use the
 * `generateMeaningOfTodayWithAI` async function in `src/services/aiMeaning.ts`
 * to get a richer summary; otherwise this curated logic is used.
 */

import type { Feast } from './feasts';
import type { HebrewDate } from './hebrewCalendar';

const HEBREW_MONTH_THEMES: Record<number, { name: string; theme: string; pool: string[] }> = {
  1: {
    name: 'Nisan',
    theme: 'Redemption',
    pool: [
      'We dwell in Nisan — the month of redemption, when Israel was led out of Egypt with a strong arm and an outstretched hand.',
      'Nisan opens the year with the song of deliverance. Recall the blood on the doorposts, the lamb, the sea split open for those who trusted.',
      'In Nisan, the voice that called Abraham still calls today: "Come out, and walk before Me." Liberation begins by leaving what binds you.',
    ],
  },
  2: {
    name: 'Iyar',
    theme: 'Healing',
    pool: [
      'Iyar is the month of healing — Y-H-W-H Rofecha, "I am the LORD that healeth thee" (Exodus 15:26). It is a month for restoration of body and spirit.',
      'In Iyar we count the Omer, refining ourselves day by day. Healing comes through patient sanctification, not haste.',
      'The wilderness journey teaches us in Iyar: provision comes day by day, like manna, like the ascending count to Sinai.',
    ],
  },
  3: {
    name: 'Sivan',
    theme: 'Revelation',
    pool: [
      'Sivan is the month of revelation — when the Torah was given at Sinai and the Spirit was poured out at Pentecost. Listen for His voice.',
      'In Sivan, the heavens open. Both Sinai and the upper room bear witness: God speaks, and His people are commissioned to carry the Word.',
      'Sivan calls for receiving. Stand at the foot of the mountain — quiet your soul and let His Word write itself on your heart.',
    ],
  },
  4: {
    name: 'Tammuz',
    theme: 'Vision and Watchfulness',
    pool: [
      'Tammuz is a month for vision — "Where there is no vision, the people perish" (Proverbs 29:18). Guard what your eyes behold.',
      'In Tammuz the walls of Jerusalem were breached. Watch carefully what you let in and what you walk past today.',
      'Tammuz invites soberness. Restore right vision: see things as the Father sees them, not as the world frames them.',
    ],
  },
  5: {
    name: 'Av',
    theme: 'Mourning and Rebuilding',
    pool: [
      'Av holds both mourning and consolation. The Temple fell on the 9th of Av — yet Messiah is born from the rubble of broken things.',
      'In Av, "Comfort ye, comfort ye my people, saith your God" (Isaiah 40:1). What feels destroyed is being prepared for rebuilding.',
      'Av asks: what are you mourning? Bring it to the One who turns mourning into dancing, ashes into beauty.',
    ],
  },
  6: {
    name: 'Elul',
    theme: 'Return and Repentance',
    pool: [
      'Elul is the month of return — "Ani l\'dodi v\'dodi li" — I am my Beloved\'s and my Beloved is mine (Song of Songs 6:3). Draw near.',
      'In Elul the King is in the field. He is uncommonly accessible. Speak to Him plainly, walk with Him today.',
      'Elul calls for honest examination. Not condemnation — but tender repentance, the kind that brings you home.',
    ],
  },
  7: {
    name: 'Tishrei',
    theme: 'Awe and Joy',
    pool: [
      'Tishrei holds the high holy days — Trumpets, Atonement, Tabernacles. The most concentrated season of the appointed times.',
      'In Tishrei, the shofar wakes us. We move from awe (yirah) to joy (simcha) — fearing rightly leads to rejoicing rightly.',
      'Tishrei reminds us: God is enthroned, atonement is made, and He still desires to dwell with us in the sukkah.',
    ],
  },
  8: {
    name: 'Cheshvan',
    theme: 'Quiet Faithfulness',
    pool: [
      'Cheshvan has no festivals — and that is its lesson. The faithful walk continues even when there is no public gathering.',
      'In Cheshvan we learn the strength of ordinary days. The Lord is no less present in silence than in song.',
      'Cheshvan invites disciplined faithfulness. Build the unseen things — prayer, study, kindness in private.',
    ],
  },
  9: {
    name: 'Kislev',
    theme: 'Light in the Darkness',
    pool: [
      'Kislev is the month when the days are shortest and we kindle light. Even one small flame pushes back the dark.',
      'In Kislev, dedication (Hanukkah) reminds us that the impure can be cleansed and the broken altar rebuilt.',
      'Kislev says: do not despise the small light you can offer. The miracle is that it burns longer than expected.',
    ],
  },
  10: {
    name: 'Tevet',
    theme: 'Steadfastness',
    pool: [
      'Tevet is a month of steadfast waiting. The walls were besieged, but the faithful endured.',
      'In Tevet we learn endurance. Prophetic patience is not passive — it is an active trust that does not waver.',
      'Tevet calls for stillness that is strong. Wait on the Lord; He will renew your strength.',
    ],
  },
  11: {
    name: 'Shevat',
    theme: 'Renewal',
    pool: [
      'Shevat is the month of trees — sap rises again in what looked dead. Renewal moves from root to fruit.',
      'In Shevat, taste and see — the Word becomes nourishment. Tu BiShvat marks the new year of the trees.',
      'Shevat reminds us: planted by streams of water, you will bear fruit in season (Psalm 1).',
    ],
  },
  12: {
    name: 'Adar',
    theme: 'Joy and Reversal',
    pool: [
      'Adar is the month of joy — "When Adar enters, joy increases." The Purim story shows how God reverses the schemes of the enemy.',
      'In Adar we remember Esther, who came to her position "for such a time as this." Hidden providence moves on our behalf.',
      'Adar celebrates the unexpected reversal. What looked like a death decree was overturned — and the people rejoiced.',
    ],
  },
  13: {
    name: 'Adar II',
    theme: 'Doubled Joy',
    pool: [
      'Adar II — in a leap year, joy is extended. The Lord adds days to teach us to dwell in gladness.',
      'In Adar II, deliverance is celebrated again. Some seasons of joy are too full for a single month.',
      'Adar II reminds us: His mercies are new every morning, and sometimes He gives us extra to celebrate them.',
    ],
  },
};

const FEAST_LINES: Record<string, string> = {
  passover:
    'Today the Passover meets us — the Lamb is slain, the doorposts are marked, the destroyer passes over those covered by the blood.',
  unleavenedBread:
    'In these days of Unleavened Bread, we walk in sincerity and truth, purged from the leaven of malice and wickedness (1 Cor 5:8).',
  firstfruits:
    'Today is Firstfruits — the wave-sheaf, a foretaste of resurrection. Messiah is the firstfruits of those who slept (1 Cor 15:20).',
  pentecost:
    'Pentecost is upon us — Sinai\'s thunder and the upper room\'s fire. The Word is given; the Spirit is poured out.',
  trumpets:
    'Today the trumpets sound — a memorial of awakening. Lift your head; the King is announcing His season.',
  atonement:
    'It is Yom Kippur — the day of covering. Afflict your soul, and trust the great High Priest who has entered once for all by His own blood.',
  tabernacles:
    'In these days of Sukkot we dwell in fragile booths — to remember that all our security is in Him who tabernacles with us.',
  eighthDay:
    'Today is Shemini Atzeret — the eighth day, the new beginning. A foretaste of the world to come, when God will be all in all.',
};

interface MeaningArgs {
  hebrewDate: HebrewDate;
  activeFeast?: Feast | null;
  isOmerSeason?: boolean;
  omerDay?: number | null;
  dayOfWeek?: number; // 0 = Sunday … 6 = Saturday
}

/**
 * Generate the contextual paragraph. Always returns a non-empty string.
 */
export function generateMeaningOfToday({
  hebrewDate,
  activeFeast,
  isOmerSeason,
  omerDay,
  dayOfWeek,
}: MeaningArgs): string {
  const month = HEBREW_MONTH_THEMES[hebrewDate.month] ?? HEBREW_MONTH_THEMES[1];
  const variant = month.pool[(hebrewDate.day - 1 + month.pool.length) % month.pool.length];

  const parts: string[] = [variant];

  if (activeFeast) {
    parts.push(FEAST_LINES[activeFeast.key] ?? `Today is ${activeFeast.name}. Walk in its meaning.`);
  } else if (isOmerSeason && omerDay && omerDay >= 1 && omerDay <= 49) {
    const week = Math.ceil(omerDay / 7);
    parts.push(
      `We are counting the Omer — today is day ${omerDay}, week ${week} of the seven. Sanctify each day toward Sinai and the harvest of souls.`
    );
  }

  if (dayOfWeek === 6) {
    parts.push('It is Shabbat — cease from labor, delight in His presence, and remember the Creator who rested on the seventh day.');
  } else if (dayOfWeek === 5) {
    parts.push('It is Erev Shabbat — prepare your heart and home; the holy day approaches at sunset.');
  }

  return parts.join(' ');
}

export function getHebrewMonthTheme(month: number): { name: string; theme: string } {
  const m = HEBREW_MONTH_THEMES[month] ?? HEBREW_MONTH_THEMES[1];
  return { name: m.name, theme: m.theme };
}
