import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { LearnParagraph, LearnSectionHeader, ScriptureQuote } from './SharedLearnBits';

export function CalendarExplainer(): React.ReactElement {
  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 22,
        paddingTop: 10,
        paddingBottom: 48,
      }}
      showsVerticalScrollIndicator={false}>
      <Text
        style={{
          color: Colors.text,
          fontSize: 26,
          fontWeight: '800',
          letterSpacing: 0.3,
          marginTop: 4,
        }}>
        The Biblical Calendar
      </Text>
      <Text
        style={{
          color: Colors.textMuted,
          fontSize: 14,
          marginTop: 6,
          lineHeight: 22,
        }}>
        God's appointed times, written into creation
      </Text>

      <LearnSectionHeader>A Calendar Written in Creation</LearnSectionHeader>
      <ScriptureQuote
        reference="Genesis 1:14"
        text="Let there be lights in the expanse of the heavens to separate the day from the night. And let them be for signs and for seasons (מוֹעֲדִים, moadim) and for days and years."
      />
      <LearnParagraph>
        The Hebrew word moadim means "appointed times" — the same word used throughout
        Leviticus 23 for the biblical feasts. God embedded His calendar into the lights of
        heaven from the very beginning. The sun marks the year; the moon marks the months;
        the stars mark the seasons.
      </LearnParagraph>

      <LearnSectionHeader>The Day Begins at Sunset</LearnSectionHeader>
      <ScriptureQuote
        reference="Genesis 1:5"
        text="And there was evening and there was morning, the first day."
      />
      <LearnParagraph>
        In Scripture, the day begins at evening — at sunset. This is why the Sabbath begins
        Friday at sundown and ends Saturday at sundown. This is why Passover, which falls on
        14 Nisan, begins the evening before what the Gregorian calendar calls April 14.
        Every feast, every appointed time, begins the evening before.
      </LearnParagraph>

      <LearnSectionHeader>The Week: Six Days and Shabbat</LearnSectionHeader>
      <ScriptureQuote
        reference="Exodus 20:8–11"
        text="Remember the Sabbath day, to keep it holy. Six days you shall labor, and do all your work, but the seventh day is a Sabbath to the LORD your God."
      />
      <LearnParagraph>
        The biblical week is seven days, culminating in Shabbat — the seventh day of rest.
        Shabbat is not just a Jewish practice; it is the fourth commandment, woven into
        creation when God rested on the seventh day (Genesis 2:2–3). It is a sign between
        God and His people (Exodus 31:13).
      </LearnParagraph>

      <LearnSectionHeader>The Month: Following the Moon</LearnSectionHeader>
      <ScriptureQuote
        reference="Psalm 104:19"
        text="He made the moon to mark the seasons; the sun knows its time for setting."
      />
      <LearnParagraph>
        Each Hebrew month begins at the new moon (Rosh Chodesh — "head of the month"). The
        months are lunar, approximately 29–30 days each. Because a lunar year is ~11 days
        shorter than a solar year, a 13th month (Adar II) is added 7 times in every 19-year
        cycle to keep the feasts aligned with their agricultural seasons.
      </LearnParagraph>

      <LearnSectionHeader>The Year Begins in Spring</LearnSectionHeader>
      <ScriptureQuote
        reference="Exodus 12:2"
        text="This month shall be for you the beginning of months. It shall be the first month of the year for you."
      />
      <LearnParagraph>
        God told Moses that Nisan (the month of the Exodus) is the first month of the
        biblical year. The year begins in spring, not January. Nisan falls in March–April.
        The entire calendar — the feasts, the counting of the Omer, the fall appointments —
        flows from this starting point.
      </LearnParagraph>

      <LearnSectionHeader>The Feasts Are Prophetic</LearnSectionHeader>
      <ScriptureQuote
        reference="Colossians 2:17"
        text="These are a shadow of the things to come, but the substance belongs to Christ."
      />
      <LearnParagraph>
        The seven biblical feasts are not merely historical commemorations — they are
        prophetic blueprints. The spring feasts (Passover, Unleavened Bread, Firstfruits,
        Shavuot) have already been fulfilled in Yeshua's first coming: he was crucified on
        Passover, buried during Unleavened Bread, resurrected on Firstfruits, and sent the
        Spirit on Shavuot. The fall feasts (Yom Teruah, Yom Kippur, Sukkot) point to his
        return — the trumpet call, the final atonement, God dwelling fully with His people.
      </LearnParagraph>

      <LearnSectionHeader>The Sabbath Year and Jubilee</LearnSectionHeader>
      <ScriptureQuote
        reference="Leviticus 25:4, 10"
        text="In the seventh year there shall be a Sabbath of solemn rest for the land... and you shall consecrate the fiftieth year, and proclaim liberty throughout the land to all its inhabitants."
      />
      <LearnParagraph>
        Just as the week has a seventh-day rest, the land has a seventh-year rest (Shemitah).
        Every 49 years (7 × 7), the 50th year is declared a Jubilee — all debts cancelled,
        all slaves freed, all land returned. This points to the ultimate Jubilee:
        restoration of all things.
      </LearnParagraph>
    </ScrollView>
  );
}
