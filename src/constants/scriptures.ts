/**
 * Daily scripture pool, keyed by Hebrew month (1-13).
 * Provides a contextual scripture for each day.
 */

export interface ScriptureEntry {
  reference: string;
  text: string;
}

export const SCRIPTURES_BY_MONTH: Record<number, ScriptureEntry[]> = {
  1: [
    {
      reference: 'Exodus 12:2',
      text: 'This month shall be unto you the beginning of months: it shall be the first month of the year to you.',
    },
    {
      reference: 'Exodus 13:3',
      text: 'Remember this day, in which ye came out from Egypt, out of the house of bondage.',
    },
    {
      reference: 'Deuteronomy 16:1',
      text: 'Observe the month of Abib, and keep the passover unto the LORD thy God.',
    },
    {
      reference: '1 Corinthians 5:7',
      text: 'For even Christ our passover is sacrificed for us.',
    },
    {
      reference: 'Isaiah 53:7',
      text: 'He is brought as a lamb to the slaughter, and as a sheep before her shearers is dumb.',
    },
  ],
  2: [
    {
      reference: 'Numbers 9:11',
      text: 'The fourteenth day of the second month at even they shall keep it.',
    },
    {
      reference: 'Psalm 118:24',
      text: 'This is the day which the LORD hath made; we will rejoice and be glad in it.',
    },
    {
      reference: '1 Kings 6:1',
      text: 'In the second month, Solomon began to build the house of the LORD.',
    },
  ],
  3: [
    {
      reference: 'Acts 2:1-4',
      text: 'When the day of Pentecost was fully come, they were all with one accord in one place.',
    },
    {
      reference: 'Exodus 19:1',
      text: 'In the third month, when the children of Israel were gone forth out of the land of Egypt.',
    },
    {
      reference: 'Joel 2:28',
      text: 'I will pour out my spirit upon all flesh; and your sons and your daughters shall prophesy.',
    },
  ],
  4: [
    {
      reference: 'Jeremiah 39:2',
      text: 'In the fourth month, the ninth day of the month, the city was broken up.',
    },
    {
      reference: 'Lamentations 3:22-23',
      text: 'His compassions fail not. They are new every morning: great is thy faithfulness.',
    },
  ],
  5: [
    {
      reference: 'Psalm 91:1',
      text: 'He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.',
    },
    {
      reference: 'Lamentations 1:1',
      text: 'How doth the city sit solitary, that was full of people!',
    },
  ],
  6: [
    {
      reference: 'Psalm 27:1',
      text: 'The LORD is my light and my salvation; whom shall I fear?',
    },
    {
      reference: 'Joel 2:12',
      text: 'Turn ye even to me with all your heart, and with fasting, and with weeping.',
    },
  ],
  7: [
    {
      reference: 'Leviticus 23:24',
      text: 'In the seventh month, in the first day of the month, shall ye have a sabbath, a memorial of blowing of trumpets.',
    },
    {
      reference: 'Numbers 29:1',
      text: 'It is a day of blowing the trumpets unto you.',
    },
    {
      reference: '1 Thessalonians 4:16',
      text: 'The Lord himself shall descend from heaven with a shout, with the voice of the archangel, and with the trump of God.',
    },
    {
      reference: 'Hebrews 9:12',
      text: 'By his own blood he entered in once into the holy place, having obtained eternal redemption for us.',
    },
    {
      reference: 'Zechariah 14:16',
      text: 'They shall go up from year to year to worship the King, the LORD of hosts, and to keep the feast of tabernacles.',
    },
  ],
  8: [
    {
      reference: '1 Kings 6:38',
      text: 'In the eleventh year, in the month Bul, which is the eighth month, was the house finished.',
    },
    {
      reference: 'Psalm 23:1',
      text: 'The LORD is my shepherd; I shall not want.',
    },
  ],
  9: [
    {
      reference: 'Haggai 2:18',
      text: 'Consider now from this day and upward, from the four and twentieth day of the ninth month.',
    },
    {
      reference: 'John 10:22',
      text: 'It was at Jerusalem the feast of the dedication, and it was winter.',
    },
  ],
  10: [
    {
      reference: 'Ezekiel 24:1-2',
      text: 'Son of man, write thee the name of the day, even of this same day: the king of Babylon set himself against Jerusalem this same day.',
    },
    {
      reference: 'Psalm 46:10',
      text: 'Be still, and know that I am God: I will be exalted among the heathen.',
    },
  ],
  11: [
    {
      reference: 'Deuteronomy 1:3',
      text: 'In the fortieth year, in the eleventh month, on the first day of the month, Moses spake unto the children of Israel.',
    },
    {
      reference: 'Psalm 119:105',
      text: 'Thy word is a lamp unto my feet, and a light unto my path.',
    },
  ],
  12: [
    {
      reference: 'Esther 9:1',
      text: 'In the twelfth month, that is, the month Adar, on the thirteenth day of the same.',
    },
    {
      reference: 'Esther 9:22',
      text: 'The month which was turned unto them from sorrow to joy, and from mourning into a good day.',
    },
  ],
  13: [
    {
      reference: 'Esther 4:14',
      text: 'Who knoweth whether thou art come to the kingdom for such a time as this?',
    },
  ],
};

export function getScriptureForDay(hebrewMonth: number, dayOfYear: number): ScriptureEntry {
  const pool = SCRIPTURES_BY_MONTH[hebrewMonth] || SCRIPTURES_BY_MONTH[1];
  return pool[dayOfYear % pool.length];
}
