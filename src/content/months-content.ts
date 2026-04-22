/**
 * Pre-written content for the Learn → Months section.
 * Hebrew months in canonical order (Nisan = 1), with Adar II (13) added
 * in leap years only.
 */

export interface LearnMonth {
  number: number; // 1..13 (13 = Adar II in leap years)
  hebrewName: string;
  transliteration: string;
  /** What the name means, with a note on its origin. */
  meaning: string;
  /** Gregorian months the Hebrew month typically overlaps. */
  gregorianApprox: string;
  days: 29 | 30;
  /** Two to four notable biblical events that happened in this month. */
  biblicalEvents: string[];
  /** Feast keys (matches LearnFeastKey) that fall in this month. */
  feasts: string[];
}

export const LEARN_MONTHS: LearnMonth[] = [
  {
    number: 1,
    hebrewName: 'נִיסָן',
    transliteration: 'Nisan',
    meaning:
      'Nisan likely derives from a root meaning "to begin" or "miracles" — the month God named the first month of the year (Exodus 12:2). It is also called Aviv, "the month of fresh green ears," marking the start of the barley harvest.',
    gregorianApprox: 'March–April',
    days: 30,
    biblicalEvents: [
      'Israel leaves Egypt on the night of Passover (Exodus 12)',
      'The Tabernacle is set up on the 1st of Nisan (Exodus 40:17)',
      'Joshua leads Israel across the Jordan into the Promised Land (Joshua 4:19)',
    ],
    feasts: ['passover', 'unleavenedBread', 'firstfruits', 'omerCount'],
  },
  {
    number: 2,
    hebrewName: 'אִיָּר',
    transliteration: 'Iyar',
    meaning:
      'Iyar is traditionally called the month of healing — the Hebrew letters of its name are sometimes read as an acronym for "I am the LORD your healer" (Exodus 15:26). The Omer count continues through the entire month.',
    gregorianApprox: 'April–May',
    days: 29,
    biblicalEvents: [
      'Solomon began building the Temple in the second month (1 Kings 6:1)',
      'The Israelites wandered through the Wilderness of Sin and grumbled for bread; God sent manna (Exodus 16)',
      "Israel's second Passover was kept in the second month by those who had been unclean (Numbers 9:1-14)",
    ],
    feasts: ['omerCount'],
  },
  {
    number: 3,
    hebrewName: 'סִיוָן',
    transliteration: 'Sivan',
    meaning:
      'Sivan is the month of revelation. Tradition holds that God spoke the Ten Commandments at Sinai on the sixth day of this month — the same day celebrated as Shavuot (Pentecost).',
    gregorianApprox: 'May–June',
    days: 30,
    biblicalEvents: [
      'Israel arrives at Mount Sinai in the third month (Exodus 19:1)',
      'The Torah is given at Sinai — 6 Sivan',
      'The Holy Spirit is poured out in Jerusalem on Shavuot (Acts 2:1-4)',
    ],
    feasts: ['shavuot'],
  },
  {
    number: 4,
    hebrewName: 'תַּמּוּז',
    transliteration: 'Tammuz',
    meaning:
      'Tammuz is associated with a turning point in Israel\'s history — a month where the walls of Jerusalem were breached. Traditionally a month of soberness and watchful repentance.',
    gregorianApprox: 'June–July',
    days: 29,
    biblicalEvents: [
      "The walls of Jerusalem are breached by Nebuchadnezzar on 17 Tammuz (Jeremiah 39:2)",
      'Moses descends Sinai and sees the golden calf; the first tablets are broken (Exodus 32)',
      'A fast is observed on the 17th of Tammuz, beginning three weeks of mourning leading to 9 Av',
    ],
    feasts: [],
  },
  {
    number: 5,
    hebrewName: 'אָב',
    transliteration: 'Av',
    meaning:
      'Av is the most mournful month in the biblical year — the month of Tisha B\'Av (the 9th of Av), when both the First and Second Temples were destroyed (586 BCE and 70 CE). Yet the prophets also speak of Av becoming a month of comfort and rejoicing when God restores His people.',
    gregorianApprox: 'July–August',
    days: 30,
    biblicalEvents: [
      'The twelve spies return with a bad report; Israel is condemned to wander 40 years (Numbers 13-14)',
      'The First Temple is destroyed by Nebuchadnezzar — 9 Av, 586 BCE',
      'The Second Temple is destroyed by the Romans — 9 Av, 70 CE',
    ],
    feasts: [],
  },
  {
    number: 6,
    hebrewName: 'אֱלוּל',
    transliteration: 'Elul',
    meaning:
      'Elul is the month of preparation before the High Holy Days. The rabbis interpret its four Hebrew letters as an acronym for "I am my Beloved\'s and my Beloved is mine" (Song of Solomon 6:3). It is a 40-day window of return, matching the 40 days Moses spent on Sinai to receive the second tablets.',
    gregorianApprox: 'August–September',
    days: 29,
    biblicalEvents: [
      'Moses ascends Sinai for 40 days to intercede and receive the second tablets, ending on Yom Kippur',
      'Ezra and Nehemiah rebuild the walls of Jerusalem in 52 days, completed on 25 Elul (Nehemiah 6:15)',
      'The shofar is traditionally blown every weekday morning through Elul to awaken hearts to repentance',
    ],
    feasts: [],
  },
  {
    number: 7,
    hebrewName: 'תִּשְׁרֵי',
    transliteration: 'Tishrei',
    meaning:
      'Tishrei is the seventh month and the most feast-dense of the year. Yom Teruah falls on the 1st; Yom Kippur on the 10th; Sukkot runs 15th–21st; Shemini Atzeret on the 22nd. In civil reckoning, Tishrei 1 is also the start of the new Jewish year (Rosh Hashanah).',
    gregorianApprox: 'September–October',
    days: 30,
    biblicalEvents: [
      'Yom Teruah / Rosh Hashanah — the Day of Blowing (Leviticus 23:24)',
      'Yom Kippur — the Day of Atonement (Leviticus 16)',
      "Solomon's Temple is dedicated at Sukkot in the seventh month (1 Kings 8:2)",
      'The exiles return and build the altar on 1 Tishrei (Ezra 3:1-6)',
    ],
    feasts: ['yomTeruah', 'yomKippur', 'sukkot', 'sheminiAtzeret'],
  },
  {
    number: 8,
    hebrewName: 'חֶשְׁוָן',
    transliteration: 'Cheshvan',
    meaning:
      'Cheshvan is the only Hebrew month with no feasts — it is sometimes called Mar-Cheshvan, "bitter Cheshvan." And yet in the quiet of this month, God works. Traditionally it is the month in which the Messianic Temple will be dedicated.',
    gregorianApprox: 'October–November',
    days: 29,
    biblicalEvents: [
      "Noah's flood begins on the 17th of the second month (Cheshvan in some reckonings, Genesis 7:11)",
      'Solomon finishes the First Temple in Cheshvan (1 Kings 6:38) — but the dedication waits until Tishrei of the next year',
      'The waters of the flood abate on the 27th of Cheshvan (Genesis 8:14)',
    ],
    feasts: [],
  },
  {
    number: 9,
    hebrewName: 'כִּסְלֵו',
    transliteration: 'Kislev',
    meaning:
      'Kislev is the month when days grow shortest and the festival of lights begins. On the 25th of Kislev, Judah Maccabee rededicated the Temple after Antiochus Epiphanes had defiled it. Hanukkah is the annual memorial of that light relit.',
    gregorianApprox: 'November–December',
    days: 30,
    biblicalEvents: [
      'The Temple is rededicated on 25 Kislev, 165 BCE — the first Hanukkah (1 Maccabees 4:52-59)',
      'Haggai prophesies on 24 Kislev: "From this day on I will bless you" (Haggai 2:18-19)',
      'Yeshua walks in Solomon\'s Colonnade at the Feast of Dedication (John 10:22-23)',
    ],
    feasts: ['hanukkah'],
  },
  {
    number: 10,
    hebrewName: 'טֵבֵת',
    transliteration: 'Tevet',
    meaning:
      "Tevet is the month when the siege of Jerusalem began. It is traditionally a month of remembering loss and standing firm in exile. Esther was chosen as queen in Tevet — God preparing a deliverer before the threat even appeared.",
    gregorianApprox: 'December–January',
    days: 29,
    biblicalEvents: [
      "Nebuchadnezzar's siege of Jerusalem begins on 10 Tevet (2 Kings 25:1; Jeremiah 52:4)",
      'Esther is taken to King Ahasuerus and chosen as queen in Tevet (Esther 2:16)',
      'Ezra begins the work of separating Israel from foreign practices (Ezra 10:16-17)',
    ],
    feasts: [],
  },
  {
    number: 11,
    hebrewName: 'שְׁבָט',
    transliteration: 'Shevat',
    meaning:
      'Shevat is traditionally called the new year of the trees. On the 15th — Tu BiShvat — the sap begins to rise in the land of Israel, signaling the first stirring of spring. It was the month Moses began reviewing the Torah with Israel on the plains of Moab.',
    gregorianApprox: 'January–February',
    days: 30,
    biblicalEvents: [
      'On 1 Shevat, Moses begins the speeches of Deuteronomy (Deuteronomy 1:3)',
      'Tu BiShvat — the 15th of Shevat — marks the New Year of the Trees (Mishnah Rosh Hashanah 1:1)',
      "Zechariah receives a night vision on 24 Shevat (Zechariah 1:7)",
    ],
    feasts: [],
  },
  {
    number: 12,
    hebrewName: 'אֲדָר',
    transliteration: 'Adar',
    meaning:
      '"When Adar enters, joy increases" (Talmud). Adar is the month of reversal — when Haman\'s plot to destroy the Jews was turned upside down through Esther. In regular years, Purim falls on 14 Adar; in leap years, Purim moves to Adar II.',
    gregorianApprox: 'February–March',
    days: 29,
    biblicalEvents: [
      'Haman casts pur (lots) and chooses Adar as the month of Jewish destruction (Esther 3:7)',
      'The plot is reversed; Purim is kept on 14 Adar (Esther 9:20-28)',
      "Moses dies on 7 Adar; the same day he was born (Deuteronomy 34)",
    ],
    feasts: ['purim'],
  },
  {
    number: 13,
    hebrewName: 'אֲדָר ב׳',
    transliteration: 'Adar II',
    meaning:
      'Adar II is added in 7 of every 19 years to keep the biblical feasts aligned with their agricultural seasons. Without it, Passover would drift away from spring. In leap years, Purim is celebrated in Adar II, not Adar I — so the deliverance falls closest to the spring feasts.',
    gregorianApprox: 'March (only in leap years)',
    days: 29,
    biblicalEvents: [
      'Purim is kept in Adar II in leap years, so deliverance and Passover remain adjacent',
      'Adar I in a leap year is called "Purim Katan" — a small, joyful echo of the real Purim',
      'The 19-year cycle was finalized by Hillel II around 358 CE to preserve the feast calendar across the diaspora',
    ],
    feasts: ['purim'],
  },
];

export function getLearnMonthByNumber(n: number): LearnMonth | undefined {
  return LEARN_MONTHS.find((m) => m.number === n);
}
