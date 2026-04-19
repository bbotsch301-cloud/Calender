/**
 * The 54 Torah portions (parashot) of the annual cycle.
 * The cycle begins on Simchat Torah (Tishrei 23 in the diaspora; we use Tishrei 23
 * for consistency) with Bereshit and ends the following year on Simchat Torah with
 * V\'Zot HaBerakhah.
 *
 * In leap years all 54 are read individually; in regular years certain pairs are
 * doubled. We honor the doubled-portion pattern:
 *   Vayakhel/Pekudei, Tazria/Metzora, Acharei Mot/Kedoshim,
 *   Behar/Bechukotai, Chukat/Balak, Mattot/Massei, Nitzavim/Vayelech.
 *
 * The function `getParashaForDate` finds the parasha for the Sabbath of the
 * given week (or the upcoming Shabbat).
 */

import { hebrewToGregorian, addDays, dayOfWeek } from '../engine/hebrewCalendar';
import { isLeapYear } from '../engine/hebrewCalendar';

export interface Parasha {
  index: number;
  name: string;
  hebrewName: string;
  books: string;
  summary: string;
}

export const PARASHOT: Parasha[] = [
  { index: 1,  name: 'Bereshit',          hebrewName: 'בְּרֵאשִׁית',     books: 'Genesis 1:1 – 6:8',      summary: 'Creation, the garden, the fall, and the early generations.' },
  { index: 2,  name: 'Noach',             hebrewName: 'נֹחַ',             books: 'Genesis 6:9 – 11:32',    summary: 'The flood, the rainbow covenant, and the tower of Babel.' },
  { index: 3,  name: 'Lech-Lecha',        hebrewName: 'לֶךְ-לְךָ',        books: 'Genesis 12:1 – 17:27',   summary: 'Abram is called; the covenant of circumcision.' },
  { index: 4,  name: 'Vayera',            hebrewName: 'וַיֵּרָא',         books: 'Genesis 18:1 – 22:24',   summary: 'Three visitors, Sodom destroyed, the binding of Isaac.' },
  { index: 5,  name: 'Chayei Sarah',      hebrewName: 'חַיֵּי שָׂרָה',    books: 'Genesis 23:1 – 25:18',   summary: "Sarah's death, Rebekah is found for Isaac." },
  { index: 6,  name: 'Toldot',            hebrewName: 'תּוֹלְדֹת',        books: 'Genesis 25:19 – 28:9',   summary: 'Jacob and Esau; the blessing.' },
  { index: 7,  name: 'Vayetzei',          hebrewName: 'וַיֵּצֵא',         books: 'Genesis 28:10 – 32:3',   summary: "Jacob's ladder, his years with Laban, and his family." },
  { index: 8,  name: 'Vayishlach',        hebrewName: 'וַיִּשְׁלַח',      books: 'Genesis 32:4 – 36:43',   summary: "Jacob wrestles God, reconciles with Esau." },
  { index: 9,  name: 'Vayeshev',          hebrewName: 'וַיֵּשֶׁב',        books: 'Genesis 37:1 – 40:23',   summary: "Joseph's dreams; sold into slavery; in prison." },
  { index: 10, name: 'Miketz',            hebrewName: 'מִקֵּץ',           books: 'Genesis 41:1 – 44:17',   summary: "Joseph interprets Pharaoh's dream and rises to power." },
  { index: 11, name: 'Vayigash',          hebrewName: 'וַיִּגַּשׁ',       books: 'Genesis 44:18 – 47:27',  summary: 'Judah pleads; Joseph reveals himself; Israel descends to Egypt.' },
  { index: 12, name: 'Vayechi',           hebrewName: 'וַיְחִי',          books: 'Genesis 47:28 – 50:26',  summary: "Jacob's blessings and death; Joseph's promise." },
  { index: 13, name: 'Shemot',            hebrewName: 'שְׁמוֹת',          books: 'Exodus 1:1 – 6:1',       summary: 'Israel enslaved; Moses called at the burning bush.' },
  { index: 14, name: 'Va\'era',           hebrewName: 'וָאֵרָא',          books: 'Exodus 6:2 – 9:35',      summary: 'The first seven plagues against Egypt.' },
  { index: 15, name: 'Bo',                hebrewName: 'בֹּא',             books: 'Exodus 10:1 – 13:16',    summary: 'The final plagues; Passover; the exodus.' },
  { index: 16, name: 'Beshalach',         hebrewName: 'בְּשַׁלַּח',       books: 'Exodus 13:17 – 17:16',   summary: 'The sea is split; manna; water from the rock.' },
  { index: 17, name: 'Yitro',             hebrewName: 'יִתְרוֹ',          books: 'Exodus 18:1 – 20:23',    summary: "Jethro's counsel; the Ten Commandments at Sinai." },
  { index: 18, name: 'Mishpatim',         hebrewName: 'מִשְׁפָּטִים',     books: 'Exodus 21:1 – 24:18',    summary: 'Civil and ceremonial laws; the covenant ratified.' },
  { index: 19, name: 'Terumah',           hebrewName: 'תְּרוּמָה',        books: 'Exodus 25:1 – 27:19',    summary: 'Instructions to build the Mishkan.' },
  { index: 20, name: 'Tetzaveh',          hebrewName: 'תְּצַוֶּה',        books: 'Exodus 27:20 – 30:10',   summary: 'Priestly garments and consecration.' },
  { index: 21, name: 'Ki Tisa',           hebrewName: 'כִּי תִשָּׂא',     books: 'Exodus 30:11 – 34:35',   summary: 'The golden calf; the second tablets.' },
  { index: 22, name: 'Vayakhel',          hebrewName: 'וַיַּקְהֵל',       books: 'Exodus 35:1 – 38:20',    summary: 'Building the Mishkan; Sabbath emphasized.' },
  { index: 23, name: 'Pekudei',           hebrewName: 'פְקוּדֵי',         books: 'Exodus 38:21 – 40:38',   summary: 'The Mishkan completed and filled with His glory.' },
  { index: 24, name: 'Vayikra',           hebrewName: 'וַיִּקְרָא',       books: 'Leviticus 1:1 – 5:26',   summary: 'Sacrificial system: burnt, grain, peace, sin offerings.' },
  { index: 25, name: 'Tzav',              hebrewName: 'צַו',              books: 'Leviticus 6:1 – 8:36',   summary: "Priestly instructions; Aaron and sons consecrated." },
  { index: 26, name: 'Shemini',           hebrewName: 'שְׁמִינִי',        books: 'Leviticus 9:1 – 11:47',  summary: "Inauguration; Nadab and Abihu; dietary laws." },
  { index: 27, name: 'Tazria',            hebrewName: 'תַזְרִיעַ',        books: 'Leviticus 12:1 – 13:59', summary: 'Childbirth; laws of skin afflictions (tzaraat).' },
  { index: 28, name: 'Metzora',           hebrewName: 'מְצֹרָע',          books: 'Leviticus 14:1 – 15:33', summary: 'Purification of the metzora; ritual uncleanness.' },
  { index: 29, name: 'Acharei Mot',       hebrewName: 'אַחֲרֵי מוֹת',     books: 'Leviticus 16:1 – 18:30', summary: 'Yom Kippur service; sexual purity laws.' },
  { index: 30, name: 'Kedoshim',          hebrewName: 'קְדֹשִׁים',        books: 'Leviticus 19:1 – 20:27', summary: '"You shall be holy"; love your neighbor as yourself.' },
  { index: 31, name: 'Emor',              hebrewName: 'אֱמֹר',            books: 'Leviticus 21:1 – 24:23', summary: 'Priestly conduct; the appointed times.' },
  { index: 32, name: 'Behar',             hebrewName: 'בְּהַר',           books: 'Leviticus 25:1 – 26:2',  summary: 'Sabbatical and Jubilee years.' },
  { index: 33, name: 'Bechukotai',        hebrewName: 'בְּחֻקֹּתַי',      books: 'Leviticus 26:3 – 27:34', summary: 'Blessings and curses; conclusion of Leviticus.' },
  { index: 34, name: 'Bamidbar',          hebrewName: 'בְּמִדְבַּר',      books: 'Numbers 1:1 – 4:20',     summary: 'Census in the wilderness; tribal arrangement.' },
  { index: 35, name: 'Nasso',             hebrewName: 'נָשֹׂא',           books: 'Numbers 4:21 – 7:89',    summary: 'Nazirite vow; priestly blessing; tabernacle dedication.' },
  { index: 36, name: 'Beha\'alotcha',     hebrewName: 'בְּהַעֲלֹתְךָ',    books: 'Numbers 8:1 – 12:16',    summary: 'Lighting the menorah; complaints in the wilderness.' },
  { index: 37, name: 'Sh\'lach',          hebrewName: 'שְׁלַח לְךָ',      books: 'Numbers 13:1 – 15:41',   summary: 'The twelve spies; the generation condemned.' },
  { index: 38, name: 'Korach',            hebrewName: 'קֹרַח',            books: 'Numbers 16:1 – 18:32',   summary: "Korach's rebellion; Aaron's rod blossoms." },
  { index: 39, name: 'Chukat',            hebrewName: 'חֻקַּת',           books: 'Numbers 19:1 – 22:1',    summary: 'Red heifer; Moses strikes the rock.' },
  { index: 40, name: 'Balak',             hebrewName: 'בָּלָק',           books: 'Numbers 22:2 – 25:9',    summary: "Balaam's blessings instead of curses." },
  { index: 41, name: 'Pinchas',           hebrewName: 'פִּינְחָס',        books: 'Numbers 25:10 – 30:1',   summary: "Pinchas's covenant of peace; daughters of Zelophehad." },
  { index: 42, name: 'Mattot',            hebrewName: 'מַטּוֹת',          books: 'Numbers 30:2 – 32:42',   summary: 'Vows; war with Midian; trans-Jordan tribes.' },
  { index: 43, name: 'Massei',            hebrewName: 'מַסְעֵי',          books: 'Numbers 33:1 – 36:13',   summary: 'Wilderness journey summary; cities of refuge.' },
  { index: 44, name: 'Devarim',           hebrewName: 'דְּבָרִים',        books: 'Deuteronomy 1:1 – 3:22', summary: "Moses' first address: review of the journey." },
  { index: 45, name: 'Va\'etchanan',      hebrewName: 'וָאֶתְחַנַּן',     books: 'Deuteronomy 3:23 – 7:11', summary: 'The Shema; Ten Commandments restated.' },
  { index: 46, name: 'Eikev',             hebrewName: 'עֵקֶב',            books: 'Deuteronomy 7:12 – 11:25', summary: 'Blessings of obedience; lessons of the wilderness.' },
  { index: 47, name: 'Re\'eh',            hebrewName: 'רְאֵה',            books: 'Deuteronomy 11:26 – 16:17', summary: 'Blessing and curse; central worship; festivals.' },
  { index: 48, name: 'Shoftim',           hebrewName: 'שֹׁפְטִים',        books: 'Deuteronomy 16:18 – 21:9', summary: 'Justice; kings; prophets; cities of refuge.' },
  { index: 49, name: 'Ki Teitzei',        hebrewName: 'כִּי תֵצֵא',       books: 'Deuteronomy 21:10 – 25:19', summary: 'Numerous laws of conduct and compassion.' },
  { index: 50, name: 'Ki Tavo',           hebrewName: 'כִּי תָבוֹא',      books: 'Deuteronomy 26:1 – 29:8', summary: 'Firstfruits declaration; blessings and curses.' },
  { index: 51, name: 'Nitzavim',          hebrewName: 'נִצָּבִים',        books: 'Deuteronomy 29:9 – 30:20', summary: '"Choose life"; the covenant renewed.' },
  { index: 52, name: 'Vayelech',          hebrewName: 'וַיֵּלֶךְ',        books: 'Deuteronomy 31:1 – 31:30', summary: "Moses charges Joshua; the Torah written down." },
  { index: 53, name: 'Ha\'azinu',         hebrewName: 'הַאֲזִינוּ',       books: 'Deuteronomy 32:1 – 32:52', summary: "Moses' song of witness." },
  { index: 54, name: 'V\'Zot HaBerakhah', hebrewName: 'וְזֹאת הַבְּרָכָה', books: 'Deuteronomy 33:1 – 34:12', summary: "Moses' final blessing; his death." },
];

const DOUBLED_PAIRS: Array<[number, number]> = [
  [22, 23], [27, 28], [29, 30], [32, 33], [39, 40], [42, 43], [51, 52],
];

/**
 * Build the ordered list of "Torah weeks" for a given Hebrew year, returning
 * an array of { index, parasha } where index is the Sabbath number after the
 * cycle start. In a regular (non-leap) Hebrew year, the doubled pairs are read
 * together, producing 47 reading-Sabbaths; in a leap year all 54 are individual.
 */
function buildReadingSequence(hebrewYear: number): Parasha[][] {
  const isLeap = isLeapYear(hebrewYear);
  const seq: Parasha[][] = [];
  let i = 1;
  while (i <= 54) {
    const pair = DOUBLED_PAIRS.find(([a]) => a === i);
    if (pair && !isLeap) {
      seq.push([PARASHOT[pair[0] - 1], PARASHOT[pair[1] - 1]]);
      i = pair[1] + 1;
    } else {
      seq.push([PARASHOT[i - 1]]);
      i++;
    }
  }
  return seq;
}

/**
 * Find the Saturday that begins the Bereshit reading for the cycle that
 * starts in the given Hebrew year (i.e., the first Shabbat after Simchat
 * Torah, Tishrei 23).
 */
function getCycleStartSabbath(hebrewYear: number): Date {
  const simchatTorah = hebrewToGregorian(hebrewYear, 7, 23);
  // Find the next Saturday on or after the day after Simchat Torah
  let d = addDays(simchatTorah, 1);
  while (dayOfWeek(d) !== 6) d = addDays(d, 1);
  return d;
}

/**
 * Get the parasha (or doubled pair) for the Shabbat of the week containing
 * `date`. If `date` is mid-week, returns the upcoming Shabbat's reading.
 */
export function getParashaForDate(
  date: Date,
  hebrewYear: number
): { parasha: Parasha; pairedWith?: Parasha; sabbathDate: Date } {
  // The active cycle is the one whose start Sabbath is on or before `date`.
  let cycleYear = hebrewYear;
  let cycleStart = getCycleStartSabbath(cycleYear);
  if (date.getTime() < cycleStart.getTime()) {
    cycleYear = hebrewYear - 1;
    cycleStart = getCycleStartSabbath(cycleYear);
  }

  // Find the Shabbat for this week (next Saturday on or after `date`)
  let sabbath = new Date(date);
  while (dayOfWeek(sabbath) !== 6) sabbath = addDays(sabbath, 1);

  // Index of this Shabbat within the cycle
  const weeksFromStart = Math.floor((sabbath.getTime() - cycleStart.getTime()) / (7 * 86_400_000));
  const sequence = buildReadingSequence(cycleYear);
  const reading = sequence[Math.min(weeksFromStart, sequence.length - 1)] ?? sequence[0];

  return {
    parasha: reading[0],
    pairedWith: reading[1],
    sabbathDate: sabbath,
  };
}
