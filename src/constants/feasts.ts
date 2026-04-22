import type { FeastKey } from '../engine/feasts';

export interface FeastStaticMeta {
  key: FeastKey;
  name: string;
  hebrewName: string;
  /** One-line description shown in the day-detail modal. */
  description: string;
}

export const FEAST_METADATA: Record<FeastKey, FeastStaticMeta> = {
  passover: {
    key: 'passover',
    name: 'Passover',
    hebrewName: 'פֶּסַח',
    description: 'Passover — remembrance of the Exodus from Egypt.',
  },
  unleavenedBread: {
    key: 'unleavenedBread',
    name: 'Unleavened Bread',
    hebrewName: 'חַג הַמַּצּוֹת',
    description: 'Feast of Unleavened Bread — seven days without leaven.',
  },
  firstfruits: {
    key: 'firstfruits',
    name: 'Firstfruits',
    hebrewName: 'יוֹם הַבִּכּוּרִים',
    description: 'Firstfruits — wave-sheaf offering on the Sunday after Passover.',
  },
  shavuot: {
    key: 'shavuot',
    name: 'Shavuot',
    hebrewName: 'שָׁבוּעוֹת',
    description: 'Shavuot (Pentecost) — the 50th day from Firstfruits; giving of Torah.',
  },
  yomTeruah: {
    key: 'yomTeruah',
    name: 'Yom Teruah',
    hebrewName: 'יוֹם תְּרוּעָה',
    description: 'Yom Teruah (Feast of Trumpets) — a memorial of shofar blasts on 1 Tishri.',
  },
  yomKippur: {
    key: 'yomKippur',
    name: 'Yom Kippur',
    hebrewName: 'יוֹם כִּפּוּר',
    description: 'Yom Kippur (Day of Atonement) — a sabbath of solemn rest, affliction of soul.',
  },
  sukkot: {
    key: 'sukkot',
    name: 'Sukkot',
    hebrewName: 'סֻכּוֹת',
    description: 'Sukkot (Feast of Tabernacles) — seven days dwelling in booths.',
  },
  sheminiAtzeret: {
    key: 'sheminiAtzeret',
    name: 'Shemini Atzeret',
    hebrewName: 'שְׁמִינִי עֲצֶרֶת',
    description: 'Shemini Atzeret — the eighth-day solemn assembly after Sukkot.',
  },
  hanukkah: {
    key: 'hanukkah',
    name: 'Hanukkah',
    hebrewName: 'חֲנֻכָּה',
    description: 'Hanukkah — eight days of rededication; the festival of lights.',
  },
  purim: {
    key: 'purim',
    name: 'Purim',
    hebrewName: 'פּוּרִים',
    description: 'Purim — deliverance of the Jewish people through Esther.',
  },
};

export const FEAST_KEYS_ORDERED: FeastKey[] = [
  'passover',
  'unleavenedBread',
  'firstfruits',
  'shavuot',
  'yomTeruah',
  'yomKippur',
  'sukkot',
  'sheminiAtzeret',
  'hanukkah',
  'purim',
];
