import type { FeastKey } from '../engine/feasts';

export interface FeastStaticMeta {
  key: FeastKey;
  name: string;
  hebrewName: string;
  leviticusRef: string;
  description: string;
  biblicalMeaning: string;
  instructions: string[];
  scriptures: string[];
  colorAccent: string;
  icon: string;
}

export const FEAST_METADATA: Record<FeastKey, FeastStaticMeta> = {
  passover: {
    key: 'passover',
    name: 'Passover',
    hebrewName: 'פֶּסַח',
    leviticusRef: 'Leviticus 23:5',
    description:
      'The LORD\'s Passover begins at twilight on the 14th day of the first month. A memorial of deliverance from Egypt and a foreshadowing of the Lamb of God.',
    biblicalMeaning:
      'Redemption through the blood of the spotless lamb. The doorposts marked, the destroyer passes over. A picture of Messiah, the Lamb slain from the foundation of the world.',
    instructions: [
      'Examine your house — remove all chametz (leaven)',
      'Prepare the Passover meal: lamb, unleavened bread, bitter herbs',
      'Eat the meal at twilight (between sunset and dark)',
      'Recount the story of the Exodus',
      'Reflect on deliverance and the blood of the Lamb',
    ],
    scriptures: [
      'Exodus 12:1-14',
      'Leviticus 23:5',
      'Numbers 9:1-14',
      'Deuteronomy 16:1-8',
      '1 Corinthians 5:7',
      'John 1:29',
    ],
    colorAccent: '#7C2D12',
    icon: 'lamb',
  },
  unleavenedBread: {
    key: 'unleavenedBread',
    name: 'Feast of Unleavened Bread',
    hebrewName: 'חַג הַמַּצּוֹת',
    leviticusRef: 'Leviticus 23:6-8',
    description:
      'On the 15th day of the first month, the seven-day Feast of Unleavened Bread begins. No leaven is to be eaten or found in your dwelling.',
    biblicalMeaning:
      'A walk of sincerity and truth, purged from the leaven of malice and wickedness. The sinless body of Messiah broken for us.',
    instructions: [
      'Eat unleavened bread (matzah) for seven days',
      'Remove all leaven from your home',
      'Hold a holy convocation on day 1 and day 7',
      'Do no customary work on the first and seventh days',
      'Present a food offering to the LORD',
    ],
    scriptures: [
      'Exodus 12:15-20',
      'Exodus 13:6-7',
      'Leviticus 23:6-8',
      'Deuteronomy 16:3-4',
      '1 Corinthians 5:6-8',
    ],
    colorAccent: '#A16207',
    icon: 'wheat',
  },
  firstfruits: {
    key: 'firstfruits',
    name: 'Feast of Firstfruits',
    hebrewName: 'יוֹם הַבִּכּוּרִים',
    leviticusRef: 'Leviticus 23:9-14',
    description:
      'On the day after the Sabbath of Passover week, wave the sheaf of the firstfruits of the harvest before the LORD.',
    biblicalMeaning:
      'Resurrection. Messiah is the firstfruits of those who have fallen asleep. The promise of the full harvest to come.',
    instructions: [
      'Wave the sheaf (omer) of firstfruits before the LORD',
      'Offer a male lamb without blemish as a burnt offering',
      'Eat no bread, parched grain, or fresh ears until this offering is made',
      'Begin the count to Pentecost — count 50 days',
      'Reflect on resurrection and new life',
    ],
    scriptures: [
      'Leviticus 23:9-14',
      '1 Corinthians 15:20-23',
      'Romans 8:23',
      'James 1:18',
    ],
    colorAccent: '#65A30D',
    icon: 'sheaf',
  },
  pentecost: {
    key: 'pentecost',
    name: 'Feast of Weeks (Pentecost)',
    hebrewName: 'שָׁבוּעוֹת',
    leviticusRef: 'Leviticus 23:15-22',
    description:
      'Fifty days after Firstfruits — count seven complete sabbaths plus one day. Bring a new grain offering of two loaves of leavened bread.',
    biblicalMeaning:
      'The giving of Torah at Sinai and the outpouring of the Holy Spirit at Acts 2. The harvest of souls into the body of Messiah.',
    instructions: [
      'Hold a holy convocation — do no customary work',
      'Present two loaves of leavened bread as a wave offering',
      'Offer seven lambs, one bull, and two rams as burnt offering',
      'Leave the corners of your field for the poor and the sojourner',
      'Reflect on the Spirit poured out and the harvest of souls',
    ],
    scriptures: [
      'Leviticus 23:15-22',
      'Deuteronomy 16:9-12',
      'Acts 2:1-4',
      'Numbers 28:26-31',
    ],
    colorAccent: '#0EA5E9',
    icon: 'flame',
  },
  trumpets: {
    key: 'trumpets',
    name: 'Feast of Trumpets',
    hebrewName: 'יוֹם תְּרוּעָה',
    leviticusRef: 'Leviticus 23:23-25',
    description:
      'On the first day of the seventh month, a sabbath rest with a memorial of trumpet blasts (teruah). A holy convocation.',
    biblicalMeaning:
      'A wake-up call. The shofar announces the coming of the King. Awakening to repentance and the trumpet that shall sound.',
    instructions: [
      'Hold a holy convocation',
      'Do no customary work',
      'Sound the shofar — proclaim the day with trumpet blasts',
      'Present a food offering by fire to the LORD',
      'Examine your heart in preparation for Yom Kippur',
    ],
    scriptures: [
      'Leviticus 23:23-25',
      'Numbers 29:1-6',
      'Joel 2:1',
      '1 Thessalonians 4:16',
      '1 Corinthians 15:52',
    ],
    colorAccent: '#DC2626',
    icon: 'trumpet',
  },
  atonement: {
    key: 'atonement',
    name: 'Day of Atonement',
    hebrewName: 'יוֹם כִּפּוּר',
    leviticusRef: 'Leviticus 23:26-32',
    description:
      'On the tenth day of the seventh month, afflict your souls. A holy convocation. A sabbath of solemn rest.',
    biblicalMeaning:
      'The covering of sin. The high priest entering the Holy of Holies. Messiah, our great High Priest, who entered once for all by His own blood.',
    instructions: [
      'Afflict your soul — fast from food and drink',
      'Do no work whatsoever — this is a sabbath of solemn rest',
      'Hold a holy convocation',
      'Reflect on atonement, repentance, and forgiveness',
      'Confess sin and seek reconciliation',
    ],
    scriptures: [
      'Leviticus 16',
      'Leviticus 23:26-32',
      'Numbers 29:7-11',
      'Hebrews 9:11-14',
      'Hebrews 10:1-22',
    ],
    colorAccent: '#1E293B',
    icon: 'incense',
  },
  tabernacles: {
    key: 'tabernacles',
    name: 'Feast of Tabernacles',
    hebrewName: 'סֻכּוֹת',
    leviticusRef: 'Leviticus 23:33-43',
    description:
      'On the fifteenth day of the seventh month, the seven-day Feast of Booths begins. Dwell in temporary shelters as your fathers did when they came out of Egypt.',
    biblicalMeaning:
      'God dwelling with His people. The Word made flesh and tabernacling among us. A foretaste of the Kingdom and the New Jerusalem.',
    instructions: [
      'Build a sukkah (booth) and dwell in it for seven days',
      'Take the four species: citron, palm, myrtle, willow',
      'Hold a holy convocation on day 1',
      'Rejoice before the LORD for seven days',
      'Present food offerings each day',
    ],
    scriptures: [
      'Leviticus 23:33-43',
      'Deuteronomy 16:13-15',
      'Nehemiah 8:13-18',
      'John 7:2,37-39',
      'Zechariah 14:16-19',
      'Revelation 21:3',
    ],
    colorAccent: '#15803D',
    icon: 'palm',
  },
  eighthDay: {
    key: 'eighthDay',
    name: 'The Eighth Day',
    hebrewName: 'שְׁמִינִי עֲצֶרֶת',
    leviticusRef: 'Leviticus 23:36, 39',
    description:
      'On the eighth day, a holy convocation and a solemn assembly. Do no customary work.',
    biblicalMeaning:
      'The day beyond — the new beginning, the eternal kingdom. A picture of the new heavens and new earth, when God will be all in all.',
    instructions: [
      'Hold a holy convocation',
      'Do no customary work',
      'Present a food offering to the LORD',
      'Solemn assembly — linger with the LORD',
      'Reflect on eternity and the world to come',
    ],
    scriptures: [
      'Leviticus 23:36',
      'Numbers 29:35-38',
      'Nehemiah 8:18',
      'Revelation 21:1-7',
    ],
    colorAccent: '#9333EA',
    icon: 'star',
  },
};

export const FEAST_KEYS_ORDERED: FeastKey[] = [
  'passover',
  'unleavenedBread',
  'firstfruits',
  'pentecost',
  'trumpets',
  'atonement',
  'tabernacles',
  'eighthDay',
];
