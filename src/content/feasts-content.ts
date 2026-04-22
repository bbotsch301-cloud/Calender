/**
 * Pre-written content for the Learn → Feasts section.
 *
 * This is NOT the calendar-date computation data — that lives in
 * `src/engine/feasts.ts` and `src/constants/feasts.ts`. This file is
 * human-authored devotional/educational copy shown in the Learn tab.
 */

export type LearnFeastKey =
  | 'shabbat'
  | 'roshChodesh'
  | 'passover'
  | 'unleavenedBread'
  | 'firstfruits'
  | 'omerCount'
  | 'shavuot'
  | 'yomTeruah'
  | 'yomKippur'
  | 'sukkot'
  | 'sheminiAtzeret'
  | 'hanukkah'
  | 'purim';

export interface LearnFeast {
  key: LearnFeastKey;
  hebrewName: string;
  transliteration: string;
  englishName: string;
  hebrewDate: string;
  gregorianApprox: string;
  torahRef: string;
  commandmentQuote: string;
  meaning: string;
  propheticFulfillment: string;
  howObserved: string;
  /** Hex color matching the feast palette used on the calendar grid. */
  color: string;
}

export const LEARN_FEASTS: LearnFeast[] = [
  {
    key: 'shabbat',
    hebrewName: 'שַׁבָּת',
    transliteration: 'Shabbat',
    englishName: 'Sabbath',
    hebrewDate: 'Every seventh day',
    gregorianApprox: 'Friday sunset to Saturday sunset',
    torahRef: 'Leviticus 23:3',
    commandmentQuote:
      '"Six days shall work be done, but on the seventh day is a Sabbath of solemn rest, a holy convocation. You shall do no work."',
    meaning:
      "Shabbat is the seventh-day rest God embedded in creation itself (Genesis 2:2-3). It is the fourth commandment, given not as a suggestion but as a sign between God and His people (Exodus 31:13). One day in seven, the people of God cease from labor and remember that the LORD is the one who creates, sustains, and sanctifies.",
    propheticFulfillment:
      "Shabbat points to the eternal rest that remains for the people of God (Hebrews 4:9-10). Yeshua declared Himself 'Lord of the Sabbath' (Mark 2:28), and entering His rest by faith is a foretaste of the final Sabbath when creation itself will be restored.",
    howObserved:
      'Cease from customary work; gather for worship; share a meal; delight in God. Kindle lights before sunset Friday; bless bread and wine; rest until sunset Saturday.',
    color: '#6D5CC4',
  },
  {
    key: 'roshChodesh',
    hebrewName: 'רֹאשׁ חוֹדֶשׁ',
    transliteration: 'Rosh Chodesh',
    englishName: 'New Moon',
    hebrewDate: '1st of every Hebrew month',
    gregorianApprox: 'Varies — each month',
    torahRef: 'Numbers 10:10',
    commandmentQuote:
      '"On the day of your gladness also, and at your appointed feasts and at the beginnings of your months, you shall blow the trumpets."',
    meaning:
      "Rosh Chodesh — literally 'head of the month' — marks the new moon, the beginning of each Hebrew month. In ancient Israel, the new moon was declared by witnesses and announced with trumpet blasts (Psalm 81:3). Each new moon is a small renewal, a reset of time itself.",
    propheticFulfillment:
      "The new moons foreshadow the rhythm of new beginnings God gives His people (2 Corinthians 5:17). In the age to come, Isaiah foretells, 'from new moon to new moon, and from Sabbath to Sabbath, all flesh shall come to worship before Me' (Isaiah 66:23).",
    howObserved:
      'Note the new moon with prayer and gladness. Some congregations blow the shofar and add a special liturgy (Hallel).',
    color: '#C9A84C',
  },
  {
    key: 'passover',
    hebrewName: 'פֶּסַח',
    transliteration: 'Pesach',
    englishName: 'Passover',
    hebrewDate: '14 Nisan',
    gregorianApprox: 'March–April',
    torahRef: 'Leviticus 23:5',
    commandmentQuote:
      '"In the first month, on the fourteenth day of the month at twilight, is the LORD\'s Passover."',
    meaning:
      "Passover remembers the night God delivered Israel from Egypt. Each household slaughtered a spotless lamb and marked the doorposts with its blood — the destroyer 'passed over' every home covered by the blood (Exodus 12). The deliverance was not earned; it was received by those who trusted the Lord's word.",
    propheticFulfillment:
      "Yeshua is the Passover Lamb. 'For Christ, our Passover Lamb, has been sacrificed' (1 Corinthians 5:7). He was crucified on the very day the lambs were being slain in the Temple. His blood covers those who trust Him; the judgment of death passes over.",
    howObserved:
      "A seder meal is held at twilight: unleavened bread, bitter herbs, the lamb, the four cups — each retelling the story of redemption (Exodus 12:26-27).",
    color: '#B91C1C',
  },
  {
    key: 'unleavenedBread',
    hebrewName: 'חַג הַמַּצּוֹת',
    transliteration: 'Chag HaMatzot',
    englishName: 'Feast of Unleavened Bread',
    hebrewDate: '15–21 Nisan',
    gregorianApprox: 'March–April',
    torahRef: 'Leviticus 23:6',
    commandmentQuote:
      '"On the fifteenth day of the same month is the Feast of Unleavened Bread to the LORD; for seven days you shall eat unleavened bread."',
    meaning:
      "For seven days following Passover, no leaven is to be eaten or even found in Israelite homes. Leaven (chametz) in Scripture is a picture of pride, of sin, of corruption that spreads silently. Israel left Egypt in such haste their bread did not have time to rise — the bread of affliction became the bread of freedom.",
    propheticFulfillment:
      "Yeshua, the sinless one, was buried during Unleavened Bread — His body did not see corruption (Acts 2:27). Believers are called to 'cleanse out the old leaven... for Christ our Passover Lamb has been sacrificed. Let us therefore celebrate the festival, not with the old leaven, the leaven of malice and evil, but with the unleavened bread of sincerity and truth' (1 Corinthians 5:7-8).",
    howObserved:
      'Remove all leaven from the home before the feast begins. Eat matzah (unleavened bread) daily for seven days. The first and seventh days are holy convocations with no customary work.',
    color: '#DC2626',
  },
  {
    key: 'firstfruits',
    hebrewName: 'יוֹם הַבִּכּוּרִים',
    transliteration: 'Yom HaBikkurim',
    englishName: 'Firstfruits',
    hebrewDate: '16 Nisan (the day after the Sabbath of Passover week)',
    gregorianApprox: 'March–April',
    torahRef: 'Leviticus 23:10–11',
    commandmentQuote:
      '"When you come into the land... and reap its harvest, you shall bring the sheaf of the firstfruits of your harvest to the priest, and he shall wave the sheaf before the LORD."',
    meaning:
      "Firstfruits was a wave-sheaf offering — the first of the barley harvest lifted up before the LORD on the morning after the weekly Sabbath of Passover week. By offering the first, Israel declared that the whole harvest belonged to God and trusted Him to provide the rest.",
    propheticFulfillment:
      "Yeshua was raised from the dead on Firstfruits. 'But Christ has indeed been raised from the dead, the firstfruits of those who have fallen asleep' (1 Corinthians 15:20-23). His resurrection is the pledge and pattern of the resurrection to come for all who belong to Him.",
    howObserved:
      'Offer the first of the harvest to the LORD. Read 1 Corinthians 15. Reflect on the resurrection and begin the counting of the Omer.',
    color: '#16A34A',
  },
  {
    key: 'omerCount',
    hebrewName: 'סְפִירַת הָעוֹמֶר',
    transliteration: 'Sefirat HaOmer',
    englishName: 'Counting of the Omer',
    hebrewDate: '49 days: 16 Nisan through 5 Sivan',
    gregorianApprox: 'Mid-April through late May / early June',
    torahRef: 'Leviticus 23:15–16',
    commandmentQuote:
      '"You shall count seven full weeks from the day after the Sabbath... you shall count fifty days."',
    meaning:
      'From Firstfruits to Shavuot, Israel counts 49 days — seven complete weeks — culminating in the 50th day, Shavuot. Each evening the day is counted aloud: "Today is day three of the Omer..." The count is a journey of preparation, day by day, from redemption toward the giving of Torah.',
    propheticFulfillment:
      "The count spans resurrection (Firstfruits) to the outpouring of the Spirit (Shavuot / Pentecost). The disciples spent these same 49 days with the risen Messiah until the day the Spirit fell (Acts 1-2). The count invites every believer to walk with Him day by day toward Pentecost.",
    howObserved:
      "Each evening after sunset, count the day aloud: 'Today is the Nth day, which is X weeks and Y days of the Omer.' Meditate on one attribute of God each week.",
    color: '#C9A84C',
  },
  {
    key: 'shavuot',
    hebrewName: 'שָׁבוּעוֹת',
    transliteration: 'Shavuot',
    englishName: 'Feast of Weeks (Pentecost)',
    hebrewDate: '6 Sivan',
    gregorianApprox: 'Late May / early June',
    torahRef: 'Leviticus 23:15–21',
    commandmentQuote:
      '"You shall proclaim on that same day that it shall be a holy convocation for you; you shall do no customary work."',
    meaning:
      "Shavuot — 'weeks' — falls fifty days after Firstfruits. Tradition holds that on this day God gave the Torah at Sinai in thunder, fire, and trumpet blast. It is the wheat harvest, the second of the three pilgrimage feasts, a day of firstfruits of a different kind: the revelation of God's Word.",
    propheticFulfillment:
      "On the very day Israel received the Torah at Sinai, the Spirit was poured out in Jerusalem. 'When the day of Pentecost arrived, they were all together in one place... and they were all filled with the Holy Spirit' (Acts 2:1-4). The Torah written on tablets of stone became the Torah written on hearts of flesh.",
    howObserved:
      'Read Ruth and the giving of the Law at Sinai (Exodus 19-20). Study Torah through the night. Bring firstfruits offerings. Decorate homes with flowers and greenery.',
    color: '#15803D',
  },
  {
    key: 'yomTeruah',
    hebrewName: 'יוֹם תְּרוּעָה',
    transliteration: 'Yom Teruah',
    englishName: 'Feast of Trumpets',
    hebrewDate: '1 Tishrei',
    gregorianApprox: 'September',
    torahRef: 'Leviticus 23:24',
    commandmentQuote:
      '"In the seventh month, on the first day of the month, you shall observe a day of solemn rest, a memorial proclaimed with blast of trumpets, a holy convocation."',
    meaning:
      'Yom Teruah is the day of the shofar blast — a day of shouting, of awakening. It opens the High Holy Days and begins ten days of introspection leading to Yom Kippur. The shofar calls Israel to attention: the King is in His field, His judgment is near, return to Him.',
    propheticFulfillment:
      "The trumpet announces the coming of the King. 'For the Lord himself will descend from heaven with a cry of command, with the voice of an archangel, and with the sound of the trumpet of God' (1 Thessalonians 4:16). Many see Yom Teruah as the prophetic pattern for the return of Messiah and the gathering of His people.",
    howObserved:
      'Blow the shofar (100 blasts in traditional observance). Hold a holy convocation. Examine your heart in preparation for Yom Kippur.',
    color: '#0EA5E9',
  },
  {
    key: 'yomKippur',
    hebrewName: 'יוֹם כִּפּוּר',
    transliteration: 'Yom Kippur',
    englishName: 'Day of Atonement',
    hebrewDate: '10 Tishrei',
    gregorianApprox: 'September–October',
    torahRef: 'Leviticus 23:27',
    commandmentQuote:
      '"It shall be for you a time of holy convocation, and you shall afflict yourselves and present a food offering to the LORD."',
    meaning:
      'Yom Kippur is the most solemn day of the biblical year. Once a year the High Priest entered the Holy of Holies with blood to make atonement for the sins of the nation (Leviticus 16). The people fasted, afflicted their souls, and waited — if the High Priest returned, atonement had been accepted.',
    propheticFulfillment:
      "Yeshua is our great High Priest who 'entered once for all into the holy places, not by means of the blood of goats and calves but by means of his own blood, thus securing an eternal redemption' (Hebrews 9:12). The veil was torn; the way into the Holiest is opened in Him.",
    howObserved:
      'Fast from sunset to sunset. Abstain from all work. Pray, confess sin, and seek reconciliation. Hold a solemn convocation.',
    color: '#4C1D95',
  },
  {
    key: 'sukkot',
    hebrewName: 'סֻכּוֹת',
    transliteration: 'Sukkot',
    englishName: 'Feast of Tabernacles',
    hebrewDate: '15–21 Tishrei',
    gregorianApprox: 'September–October',
    torahRef: 'Leviticus 23:34',
    commandmentQuote:
      '"On the fifteenth day of this seventh month and for seven days is the Feast of Booths to the LORD."',
    meaning:
      "For seven days Israel dwells in temporary shelters — sukkot — to remember the wilderness journey from Egypt to the Promised Land. It is called z'man simchateinu, 'the time of our rejoicing.' The booth is fragile; the roof lets the stars shine through; every meal is a lesson that security is in the Lord, not walls.",
    propheticFulfillment:
      "Sukkot pictures God tabernacling with His people. 'And the Word became flesh and tabernacled among us' (John 1:14). It points forward to the day when 'the dwelling place of God is with man. He will dwell with them, and they will be his people' (Revelation 21:3).",
    howObserved:
      'Build and dwell in a sukkah for seven days. Take the four species (lulav and etrog). Rejoice with family and friends. The first day is a holy convocation.',
    color: '#EA580C',
  },
  {
    key: 'sheminiAtzeret',
    hebrewName: 'שְׁמִינִי עֲצֶרֶת',
    transliteration: 'Shemini Atzeret',
    englishName: 'The Eighth Day',
    hebrewDate: '22 Tishrei',
    gregorianApprox: 'September–October',
    torahRef: 'Leviticus 23:36',
    commandmentQuote:
      '"On the eighth day you shall hold a holy convocation... it is a solemn assembly; you shall not do any ordinary work."',
    meaning:
      "The day after Sukkot ends is itself a feast: an atzeret, a 'lingering' with God. The rabbis pictured the Lord saying to His people, 'Your departure is difficult for Me; stay one more day.' Eight is the number of new beginnings — circumcision on the eighth day, the first day of a new week.",
    propheticFulfillment:
      "The eighth day points beyond the seven-day cycle of time itself — to the new creation, the world to come, eternity with God. It is the day beyond the feasts, where God is all in all (1 Corinthians 15:28, Revelation 21-22).",
    howObserved:
      'Hold a holy convocation and solemn assembly. Do no customary work. In many communities this is combined with Simchat Torah — rejoicing over the completion of the annual Torah reading cycle.',
    color: '#C9A84C',
  },
  {
    key: 'hanukkah',
    hebrewName: 'חֲנֻכָּה',
    transliteration: 'Hanukkah',
    englishName: 'Feast of Dedication',
    hebrewDate: '25 Kislev – 2 or 3 Tevet (8 days)',
    gregorianApprox: 'November–December',
    torahRef: 'John 10:22; 1 Maccabees 4',
    commandmentQuote:
      '"At that time the Feast of Dedication took place at Jerusalem. It was winter, and Jesus was walking in the temple, in the colonnade of Solomon." (John 10:22-23)',
    meaning:
      "Hanukkah commemorates the rededication of the Temple in 165 BCE after its desecration by Antiochus Epiphanes. The Maccabees cleansed the altar and relit the menorah; tradition holds that one day's oil miraculously burned for eight. It is the festival of lights — of a lampstand that would not go out.",
    propheticFulfillment:
      "Yeshua walked in the Temple during Hanukkah (John 10:22-23) and declared Himself 'the light of the world' (John 8:12). He is the light that the darkness could not overcome (John 1:5). In Him, the true Temple is dedicated forever.",
    howObserved:
      'Light the hanukkiah — one candle the first night, adding one each night until all eight burn. Place it where it can be seen. Recite the blessings. Tell the story of God\'s deliverance.',
    color: '#2563EB',
  },
  {
    key: 'purim',
    hebrewName: 'פּוּרִים',
    transliteration: 'Purim',
    englishName: 'Feast of Lots',
    hebrewDate: '14 Adar (14 Adar II in leap years)',
    gregorianApprox: 'February–March',
    torahRef: 'Esther 9:20–28',
    commandmentQuote:
      '"That these days should be remembered and kept throughout every generation, in every clan, province, and city, and that these days of Purim should never fall into disuse among the Jews." (Esther 9:28)',
    meaning:
      "Purim celebrates the deliverance of the Jewish people in Persia through Esther and Mordecai. Haman cast 'pur' — lots — to choose the day of their destruction; the lot fell on 13 Adar. But the LORD turned the decree upside down, and on 14 Adar His people rested. The name of God does not appear in the book of Esther — and yet His hand is on every page.",
    propheticFulfillment:
      "Purim is a picture of hidden providence: God at work behind the curtain, writing deliverance even when His name is not spoken. 'We know that for those who love God all things work together for good' (Romans 8:28). What was meant for evil, He turns for life.",
    howObserved:
      'Read the Megillah (book of Esther) aloud. Give gifts of food to friends (mishloach manot) and alms to the poor (matanot la\'evyonim). Share a festive meal. Dress in costume — a picture of the hidden becoming revealed.',
    color: '#9333EA',
  },
];

export function getLearnFeastByKey(key: string): LearnFeast | undefined {
  return LEARN_FEASTS.find((f) => f.key === key);
}
