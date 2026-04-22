/**
 * All 54 weekly Torah portions of the annual reading cycle.
 *
 * Haftarot given are the standard Ashkenazi assignments. When Shabbat
 * falls on Rosh Chodesh, a feast, or another special day, the cycle
 * substitutes a special haftarah; the `haftarah` field here gives only
 * the regular-week reading.
 *
 * Summaries are pre-written devotional content — no generation at
 * runtime.
 */

export interface LearnParasha {
  /** URL/param-safe slug (lowercase, hyphenated). */
  key: string;
  hebrewName: string;
  transliteration: string;
  /** One- to three-word English gloss of the Hebrew name. */
  meaning: string;
  torahReading: string;
  haftarah: string;
  summary: string;
}

export const LEARN_PARASHOT: LearnParasha[] = [
  {
    key: 'bereshit',
    hebrewName: 'בְּרֵאשִׁית',
    transliteration: 'Bereshit',
    meaning: '"In the beginning"',
    torahReading: 'Genesis 1:1 – 6:8',
    haftarah: 'Isaiah 42:5 – 43:10',
    summary:
      'God creates the heavens and the earth in six days and rests on the seventh. Adam and Eve are placed in the Garden, given one command, and fall. Cain kills Abel; the generations from Seth to Noah unfold, and the wickedness of humanity grieves the LORD.',
  },
  {
    key: 'noach',
    hebrewName: 'נֹחַ',
    transliteration: 'Noach',
    meaning: '"Noah"',
    torahReading: 'Genesis 6:9 – 11:32',
    haftarah: 'Isaiah 54:1 – 55:5',
    summary:
      'Noah finds favor with the LORD and is spared through the flood; God makes a covenant with creation, set in the sign of the rainbow. The nations scatter from Babel when they try to build a tower to heaven, and the line from Shem to Abram is traced.',
  },
  {
    key: 'lech-lecha',
    hebrewName: 'לֶךְ-לְךָ',
    transliteration: 'Lech-Lecha',
    meaning: '"Go forth"',
    torahReading: 'Genesis 12:1 – 17:27',
    haftarah: 'Isaiah 40:27 – 41:16',
    summary:
      'God calls Abram to leave his country, promising to make him a great nation and to bless all families of the earth through him. Abram rescues Lot, is blessed by Melchizedek, receives the covenant of the pieces, fathers Ishmael, and — as Abraham — receives circumcision as the sign of the covenant.',
  },
  {
    key: 'vayera',
    hebrewName: 'וַיֵּרָא',
    transliteration: 'Vayera',
    meaning: '"And He appeared"',
    torahReading: 'Genesis 18:1 – 22:24',
    haftarah: '2 Kings 4:1 – 37',
    summary:
      'Three visitors come to Abraham; Sarah laughs at the promise of a son; Sodom and Gomorrah are destroyed. Isaac is born, Ishmael is sent away, and on Mount Moriah Abraham binds Isaac — trusting the God who provides — only to hear the voice that stops his hand.',
  },
  {
    key: 'chayei-sarah',
    hebrewName: 'חַיֵּי שָׂרָה',
    transliteration: 'Chayei Sarah',
    meaning: '"The life of Sarah"',
    torahReading: 'Genesis 23:1 – 25:18',
    haftarah: '1 Kings 1:1 – 31',
    summary:
      'Sarah dies and Abraham buys the cave of Machpelah. Abraham\'s servant travels to Haran and Rebekah is found by a well, willing to follow; she becomes Isaac\'s wife. Abraham dies and is buried; the generations of Ishmael close the parasha.',
  },
  {
    key: 'toldot',
    hebrewName: 'תּוֹלְדֹת',
    transliteration: 'Toldot',
    meaning: '"Generations"',
    torahReading: 'Genesis 25:19 – 28:9',
    haftarah: 'Malachi 1:1 – 2:7',
    summary:
      'Rebekah gives birth to Esau and Jacob; Esau sells his birthright for a bowl of stew. Isaac and Rebekah sojourn among the Philistines, and Isaac is blessed in drought. By Rebekah\'s counsel, Jacob receives the blessing meant for Esau, and flees to Haran.',
  },
  {
    key: 'vayetzei',
    hebrewName: 'וַיֵּצֵא',
    transliteration: 'Vayetzei',
    meaning: '"And he went out"',
    torahReading: 'Genesis 28:10 – 32:3',
    haftarah: 'Hosea 12:13 – 14:10',
    summary:
      'Fleeing from Esau, Jacob dreams of a ladder joining heaven and earth and vows to follow the God of his fathers. He works fourteen years for Rachel and Leah, fathers the twelve tribes, prospers despite Laban\'s trickery, and departs back toward the land of promise.',
  },
  {
    key: 'vayishlach',
    hebrewName: 'וַיִּשְׁלַח',
    transliteration: 'Vayishlach',
    meaning: '"And he sent"',
    torahReading: 'Genesis 32:4 – 36:43',
    haftarah: 'Obadiah 1:1 – 21',
    summary:
      'Jacob prepares to meet Esau; wrestling with a divine figure through the night he is renamed Israel — "one who strives with God." Dinah is assaulted at Shechem and her brothers answer with the sword. Rachel dies birthing Benjamin; the generations of Esau are recorded.',
  },
  {
    key: 'vayeshev',
    hebrewName: 'וַיֵּשֶׁב',
    transliteration: 'Vayeshev',
    meaning: '"And he dwelt"',
    torahReading: 'Genesis 37:1 – 40:23',
    haftarah: 'Amos 2:6 – 3:8',
    summary:
      'Joseph\'s dreams stir his brothers to hatred; he is sold into Egypt and carried to the house of Potiphar. Judah fathers children by Tamar through an unexpected path of justice. Joseph is unjustly imprisoned, where he interprets the dreams of Pharaoh\'s cupbearer and baker.',
  },
  {
    key: 'miketz',
    hebrewName: 'מִקֵּץ',
    transliteration: 'Miketz',
    meaning: '"At the end of"',
    torahReading: 'Genesis 41:1 – 44:17',
    haftarah: '1 Kings 3:15 – 4:1',
    summary:
      'Pharaoh dreams of seven fat and seven lean cattle; Joseph interprets and is raised from the dungeon to rule Egypt. Famine strikes the lands, and Joseph\'s brothers come to buy grain — not yet recognizing the brother they sold. Benjamin is framed with the silver cup; the family is brought to the edge of repentance.',
  },
  {
    key: 'vayigash',
    hebrewName: 'וַיִּגַּשׁ',
    transliteration: 'Vayigash',
    meaning: '"And he drew near"',
    torahReading: 'Genesis 44:18 – 47:27',
    haftarah: 'Ezekiel 37:15 – 28',
    summary:
      'Judah steps forward and pleads for Benjamin\'s life; Joseph can no longer hold back and reveals himself with weeping. The family is reunited, Jacob hears his son is alive, and Israel descends to Egypt — seventy souls settled in Goshen under Joseph\'s care.',
  },
  {
    key: 'vayechi',
    hebrewName: 'וַיְחִי',
    transliteration: 'Vayechi',
    meaning: '"And he lived"',
    torahReading: 'Genesis 47:28 – 50:26',
    haftarah: '1 Kings 2:1 – 12',
    summary:
      'Jacob blesses his grandsons Ephraim and Manasseh and then each of his twelve sons, prophesying their futures. He is buried in the cave of Machpelah. Joseph reassures his brothers — "you meant evil against me, but God meant it for good" — and dies in Egypt, charging his people to carry his bones home.',
  },
  {
    key: 'shemot',
    hebrewName: 'שְׁמוֹת',
    transliteration: 'Shemot',
    meaning: '"Names"',
    torahReading: 'Exodus 1:1 – 6:1',
    haftarah: 'Isaiah 27:6 – 28:13; 29:22 – 23',
    summary:
      'A new king arises over Egypt who knew not Joseph; Israel is enslaved and cries out. Moses is drawn from the Nile, flees after striking down an Egyptian, and meets God in a burning bush. Sent back with his brother Aaron, Moses confronts Pharaoh — and Pharaoh only makes the labor heavier.',
  },
  {
    key: 'vaera',
    hebrewName: 'וָאֵרָא',
    transliteration: "Va'era",
    meaning: '"And I appeared"',
    torahReading: 'Exodus 6:2 – 9:35',
    haftarah: 'Ezekiel 28:25 – 29:21',
    summary:
      'God renews His covenant with Israel and commissions Moses again. The first seven plagues fall on Egypt — blood, frogs, gnats, flies, pestilence, boils, hail — each one a judgment on the gods of Egypt. Pharaoh\'s heart hardens even as the nation crumbles.',
  },
  {
    key: 'bo',
    hebrewName: 'בֹּא',
    transliteration: 'Bo',
    meaning: '"Come"',
    torahReading: 'Exodus 10:1 – 13:16',
    haftarah: 'Jeremiah 46:13 – 28',
    summary:
      'Locusts and darkness fall on Egypt. God gives Israel the first commandment as a nation: keep this month as the beginning of months. The Passover is instituted, the firstborn of Egypt die, and Israel goes out in haste — six hundred thousand on foot, with a great mixed multitude.',
  },
  {
    key: 'beshalach',
    hebrewName: 'בְּשַׁלַּח',
    transliteration: 'Beshalach',
    meaning: '"When he sent"',
    torahReading: 'Exodus 13:17 – 17:16',
    haftarah: 'Judges 4:4 – 5:31',
    summary:
      'God leads Israel by cloud and fire; Pharaoh pursues and the sea splits in two. Moses and Miriam lead the Song of the Sea. In the wilderness God provides manna and water from the rock, and Israel wins its first battle against Amalek — while Moses\' hands are held up in prayer.',
  },
  {
    key: 'yitro',
    hebrewName: 'יִתְרוֹ',
    transliteration: 'Yitro',
    meaning: '"Jethro"',
    torahReading: 'Exodus 18:1 – 20:23',
    haftarah: 'Isaiah 6:1 – 7:6; 9:5 – 6',
    summary:
      "Jethro, Moses' father-in-law, counsels him to delegate judgment among the elders. At Sinai, Israel prepares three days and God descends in fire and smoke. The Ten Commandments are spoken from the mountain — Israel trembles and asks Moses to stand between them and the voice of God.",
  },
  {
    key: 'mishpatim',
    hebrewName: 'מִשְׁפָּטִים',
    transliteration: 'Mishpatim',
    meaning: '"Judgments"',
    torahReading: 'Exodus 21:1 – 24:18',
    haftarah: 'Jeremiah 34:8 – 22; 33:25 – 26',
    summary:
      "After the Ten Commandments come civil ordinances: slaves, oxen, damages, restitution, festivals, kindness to the stranger. The covenant is ratified with the blood of the covenant sprinkled on the people. Moses ascends the mountain for forty days and enters the cloud of God's glory.",
  },
  {
    key: 'terumah',
    hebrewName: 'תְּרוּמָה',
    transliteration: 'Terumah',
    meaning: '"Offering"',
    torahReading: 'Exodus 25:1 – 27:19',
    haftarah: '1 Kings 5:26 – 6:13',
    summary:
      "God instructs Moses to take an offering from every willing heart and build a sanctuary so He may dwell among His people. Detailed plans are given for the ark, the table, the menorah, the tabernacle itself, and the bronze altar — heaven's pattern drawn down to earth.",
  },
  {
    key: 'tetzaveh',
    hebrewName: 'תְּצַוֶּה',
    transliteration: 'Tetzaveh',
    meaning: '"You shall command"',
    torahReading: 'Exodus 27:20 – 30:10',
    haftarah: 'Ezekiel 43:10 – 27',
    summary:
      "Pure olive oil is to burn continually in the tabernacle. Aaron and his sons are to be consecrated as priests, clothed in holy garments — breastplate, ephod, robe, tunic, turban, sash. Daily offerings are established, and the incense altar is described at the close.",
  },
  {
    key: 'ki-tisa',
    hebrewName: 'כִּי תִשָּׂא',
    transliteration: 'Ki Tisa',
    meaning: '"When you take"',
    torahReading: 'Exodus 30:11 – 34:35',
    haftarah: '1 Kings 18:1 – 39',
    summary:
      "A census is taken, the washing laver is placed, and Bezalel is filled with the Spirit for craftsmanship. While Moses is on the mountain, Israel fashions the golden calf; Moses shatters the tablets. He intercedes, God relents, and — hidden in the cleft of the rock — Moses is shown the glory and hears the thirteen attributes of mercy.",
  },
  {
    key: 'vayakhel',
    hebrewName: 'וַיַּקְהֵל',
    transliteration: 'Vayakhel',
    meaning: '"And he assembled"',
    torahReading: 'Exodus 35:1 – 38:20',
    haftarah: '1 Kings 7:40 – 50',
    summary:
      "Moses gathers Israel and repeats the command of Shabbat before the work of building begins. The people bring freewill offerings in such abundance that Moses must tell them to stop. Bezalel, Oholiab, and every wise-hearted artisan fashion the tabernacle, its furnishings, and the priestly garments.",
  },
  {
    key: 'pekudei',
    hebrewName: 'פְקוּדֵי',
    transliteration: 'Pekudei',
    meaning: '"Accounts"',
    torahReading: 'Exodus 38:21 – 40:38',
    haftarah: '1 Kings 7:51 – 8:21',
    summary:
      "Every gift of silver and gold is accounted for; the priestly garments are finished; the tabernacle is completed just as the LORD commanded. On the first day of the first month, the tabernacle is raised up — and the cloud covers the tent, the glory of the LORD fills the dwelling, and Moses cannot enter.",
  },
  {
    key: 'vayikra',
    hebrewName: 'וַיִּקְרָא',
    transliteration: 'Vayikra',
    meaning: '"And He called"',
    torahReading: 'Leviticus 1:1 – 5:26',
    haftarah: 'Isaiah 43:21 – 44:23',
    summary:
      "From within the tent of meeting the LORD calls Moses and gives the laws of the offerings: burnt, grain, peace, sin, and guilt. Each has its ritual, each its meaning — drawing near to a holy God requires a way. The book of Leviticus opens with how that way is given.",
  },
  {
    key: 'tzav',
    hebrewName: 'צַו',
    transliteration: 'Tzav',
    meaning: '"Command"',
    torahReading: 'Leviticus 6:1 – 8:36',
    haftarah: 'Jeremiah 7:21 – 8:3; 9:22 – 23',
    summary:
      "Further instructions are given for each offering, now from the priests' perspective. The fire on the altar is never to go out. Aaron and his sons are consecrated with blood and oil, and remain in the tent of meeting seven days to complete their ordination.",
  },
  {
    key: 'shemini',
    hebrewName: 'שְׁמִינִי',
    transliteration: 'Shemini',
    meaning: '"Eighth"',
    torahReading: 'Leviticus 9:1 – 11:47',
    haftarah: '2 Samuel 6:1 – 7:17',
    summary:
      "On the eighth day the priesthood begins its service; fire goes out from before the LORD and consumes the offerings. Yet Nadab and Abihu offer strange fire and die before Him — a sobering reminder that holiness is not trifled with. The dietary laws — clean and unclean animals — are given.",
  },
  {
    key: 'tazria',
    hebrewName: 'תַזְרִיעַ',
    transliteration: 'Tazria',
    meaning: '"She conceives"',
    torahReading: 'Leviticus 12:1 – 13:59',
    haftarah: '2 Kings 4:42 – 5:19',
    summary:
      "Laws of purification after childbirth are given. The bulk of the parasha details the examination of tzara'at — a skin affliction, often translated 'leprosy,' that renders a person ritually unclean. The priest examines, declares, and prescribes isolation and restoration.",
  },
  {
    key: 'metzora',
    hebrewName: 'מְצֹרָע',
    transliteration: 'Metzora',
    meaning: '"One afflicted"',
    torahReading: 'Leviticus 14:1 – 15:33',
    haftarah: '2 Kings 7:3 – 20',
    summary:
      "The rite of purification for the metzora is prescribed: two birds, cedar, scarlet, hyssop, washing, oil. Tzara'at may afflict not only people but garments and even houses. Laws of bodily impurity — for both men and women — close the parasha with care for how holiness is maintained in the camp.",
  },
  {
    key: 'acharei-mot',
    hebrewName: 'אַחֲרֵי מוֹת',
    transliteration: 'Acharei Mot',
    meaning: '"After the death"',
    torahReading: 'Leviticus 16:1 – 18:30',
    haftarah: 'Ezekiel 22:1 – 19',
    summary:
      "After the death of Nadab and Abihu, God gives the service of the Day of Atonement — how the High Priest is to enter the Holy of Holies one day a year with blood. The scapegoat is sent into the wilderness bearing the sins of the people. Laws of blood and of forbidden sexual relations follow.",
  },
  {
    key: 'kedoshim',
    hebrewName: 'קְדֹשִׁים',
    transliteration: 'Kedoshim',
    meaning: '"Holy ones"',
    torahReading: 'Leviticus 19:1 – 20:27',
    haftarah: 'Amos 9:7 – 15',
    summary:
      "\"You shall be holy, for I the LORD your God am holy.\" The parasha is a summary of ethical holiness: honor parents, leave gleanings for the poor, pay wages on time, do not slander, love your neighbor as yourself. The call to be set apart is grounded in the character of God.",
  },
  {
    key: 'emor',
    hebrewName: 'אֱמֹר',
    transliteration: 'Emor',
    meaning: '"Speak"',
    torahReading: 'Leviticus 21:1 – 24:23',
    haftarah: 'Ezekiel 44:15 – 31',
    summary:
      "Instructions for priestly holiness are given — who may serve, how they must live, what blemishes disqualify. Then comes the great calendar of the LORD's appointed times: Shabbat, Passover, Unleavened Bread, Firstfruits, Shavuot, Yom Teruah, Yom Kippur, Sukkot. The parasha is the heartbeat of the biblical year.",
  },
  {
    key: 'behar',
    hebrewName: 'בְּהַר',
    transliteration: 'Behar',
    meaning: '"On the mountain"',
    torahReading: 'Leviticus 25:1 – 26:2',
    haftarah: 'Jeremiah 32:6 – 27',
    summary:
      "On Mount Sinai the LORD gives the laws of the sabbatical year (Shemitah) and the Jubilee (Yovel): every seventh year the land rests; every fiftieth year debts are cancelled, slaves freed, and ancestral land returned. The land and its people belong to God — and every fifty years, He makes it plain.",
  },
  {
    key: 'bechukotai',
    hebrewName: 'בְּחֻקֹּתַי',
    transliteration: 'Bechukotai',
    meaning: '"In My statutes"',
    torahReading: 'Leviticus 26:3 – 27:34',
    haftarah: 'Jeremiah 16:19 – 17:14',
    summary:
      "The closing chapters of Leviticus set forth the blessings of obedience and the warnings of exile for disobedience — and the promise that even in exile, God will remember His covenant with the fathers. Laws of vows, valuations, and tithes conclude the book.",
  },
  {
    key: 'bamidbar',
    hebrewName: 'בְּמִדְבַּר',
    transliteration: 'Bamidbar',
    meaning: '"In the wilderness"',
    torahReading: 'Numbers 1:1 – 4:20',
    haftarah: 'Hosea 2:1 – 22',
    summary:
      "A census is taken of the men of Israel of fighting age — over 600,000 — and the tribes are arrayed around the tabernacle in their marching order. The Levites are numbered separately and given charge of the sanctuary; the sons of Kohath carry the holy vessels.",
  },
  {
    key: 'nasso',
    hebrewName: 'נָשֹׂא',
    transliteration: 'Nasso',
    meaning: '"Take [a census]"',
    torahReading: 'Numbers 4:21 – 7:89',
    haftarah: 'Judges 13:2 – 25',
    summary:
      "The remaining Levite families are numbered. Laws of purity, the sotah ordeal, and the Nazirite vow are given. The priestly blessing — \"The LORD bless you and keep you\" — is spoken for the first time. The tribal leaders bring identical offerings to dedicate the altar, one chief per day for twelve days.",
  },
  {
    key: 'behaalotcha',
    hebrewName: 'בְּהַעֲלֹתְךָ',
    transliteration: "Beha'alotcha",
    meaning: '"When you kindle"',
    torahReading: 'Numbers 8:1 – 12:16',
    haftarah: 'Zechariah 2:14 – 4:7',
    summary:
      "Aaron lights the menorah, the Levites are consecrated, and Passover is observed in the wilderness. The cloud by day and the fire by night lead Israel on its way. The people complain about food; quail is sent in judgment. Miriam speaks against Moses and is stricken — Moses prays, and God heals her.",
  },
  {
    key: 'shlach',
    hebrewName: 'שְׁלַח לְךָ',
    transliteration: "Sh'lach",
    meaning: '"Send for yourself"',
    torahReading: 'Numbers 13:1 – 15:41',
    haftarah: 'Joshua 2:1 – 24',
    summary:
      "Twelve spies are sent into the land. Ten return with a report that terrifies Israel; only Caleb and Joshua trust God. The generation is condemned to die in the wilderness — forty years for forty days of scouting. The command of the tzitzit — fringes on the corners of garments — closes the parasha.",
  },
  {
    key: 'korach',
    hebrewName: 'קֹרַח',
    transliteration: 'Korach',
    meaning: '"Korah"',
    torahReading: 'Numbers 16:1 – 18:32',
    haftarah: '1 Samuel 11:14 – 12:22',
    summary:
      "Korach and two hundred and fifty leaders rebel against Moses and Aaron. The earth opens and swallows them; fire consumes the rebels who burn incense. Aaron's staff buds almond blossoms in the tent of meeting as a sign that God has chosen him. The priestly and Levitical portions are confirmed.",
  },
  {
    key: 'chukat',
    hebrewName: 'חֻקַּת',
    transliteration: 'Chukat',
    meaning: '"Statute"',
    torahReading: 'Numbers 19:1 – 22:1',
    haftarah: 'Judges 11:1 – 33',
    summary:
      "The law of the red heifer is given — a mystery even to the wise. Miriam dies and the water dries up; Moses strikes the rock in anger and loses the right to enter the land. Aaron dies on Mount Hor. The bronze serpent is lifted in the wilderness, and all who look on it live.",
  },
  {
    key: 'balak',
    hebrewName: 'בָּלָק',
    transliteration: 'Balak',
    meaning: '"Balak"',
    torahReading: 'Numbers 22:2 – 25:9',
    haftarah: 'Micah 5:6 – 6:8',
    summary:
      "Balak king of Moab hires the prophet Balaam to curse Israel. Balaam's donkey sees the angel; Balaam does not. Three times he opens his mouth to curse and blessings pour out instead — including the prophecy, 'a star shall come out of Jacob.' Israel then sins with the daughters of Moab, and Pinchas acts with zeal.",
  },
  {
    key: 'pinchas',
    hebrewName: 'פִּינְחָס',
    transliteration: 'Pinchas',
    meaning: '"Phinehas"',
    torahReading: 'Numbers 25:10 – 30:1',
    haftarah: '1 Kings 18:46 – 19:21',
    summary:
      "Pinchas is given a covenant of peace. A new census is taken of the next generation. The daughters of Zelophehad request an inheritance and God affirms them. Joshua is commissioned to succeed Moses. The calendar of offerings — daily, Sabbath, new moon, and feast — is set out in full.",
  },
  {
    key: 'mattot',
    hebrewName: 'מַטּוֹת',
    transliteration: 'Mattot',
    meaning: '"Tribes"',
    torahReading: 'Numbers 30:2 – 32:42',
    haftarah: 'Jeremiah 1:1 – 2:3',
    summary:
      "Laws of vows are given — a word once spoken binds. Israel takes vengeance on Midian for the sin at Peor. The tribes of Reuben and Gad, with half of Manasseh, request land east of the Jordan; Moses assents on the condition that their warriors cross over with their brothers to fight.",
  },
  {
    key: 'massei',
    hebrewName: 'מַסְעֵי',
    transliteration: "Massei",
    meaning: '"Journeys"',
    torahReading: 'Numbers 33:1 – 36:13',
    haftarah: 'Jeremiah 2:4 – 28; 3:4',
    summary:
      "Moses records the forty-two stages of Israel's journey from Egypt to the edge of the Jordan. The borders of the promised land are drawn. Cities of refuge are appointed. The daughters of Zelophehad marry within their tribe so the inheritance is not moved — and the book of Numbers ends in sight of the land.",
  },
  {
    key: 'devarim',
    hebrewName: 'דְּבָרִים',
    transliteration: 'Devarim',
    meaning: '"Words"',
    torahReading: 'Deuteronomy 1:1 – 3:22',
    haftarah: 'Isaiah 1:1 – 27',
    summary:
      "On the plains of Moab, Moses begins his farewell address — the book of Deuteronomy, Mishneh Torah, a second telling of the Law. He recounts the wilderness journey, the rebellion at Kadesh, the battles with Sihon and Og, and charges Joshua not to fear, for the LORD goes before him.",
  },
  {
    key: 'vaetchanan',
    hebrewName: 'וָאֶתְחַנַּן',
    transliteration: "Va'etchanan",
    meaning: '"And I pleaded"',
    torahReading: 'Deuteronomy 3:23 – 7:11',
    haftarah: 'Isaiah 40:1 – 26',
    summary:
      "Moses pleads with God to let him enter the land — and is refused but shown the view from Pisgah. The Ten Commandments are repeated. The Shema — \"Hear, O Israel: the LORD our God, the LORD is one\" — is given, with the command to love God with all your heart, soul, and might.",
  },
  {
    key: 'eikev',
    hebrewName: 'עֵקֶב',
    transliteration: 'Eikev',
    meaning: '"Because"',
    torahReading: 'Deuteronomy 7:12 – 11:25',
    haftarah: 'Isaiah 49:14 – 51:3',
    summary:
      "If Israel keeps the commandments, the LORD will keep the covenant and multiply blessings. Moses warns them not to forget God when they are satisfied in the good land — man does not live by bread alone. He recounts the breaking of the tablets, the second forty days, and Aaron's death.",
  },
  {
    key: 'reeh',
    hebrewName: 'רְאֵה',
    transliteration: "Re'eh",
    meaning: '"See"',
    torahReading: 'Deuteronomy 11:26 – 16:17',
    haftarah: 'Isaiah 54:11 – 55:5',
    summary:
      "\"See, I set before you today a blessing and a curse.\" Moses commands worship in the place the LORD will choose, warns against false prophets and idolatrous cities, repeats the laws of clean food, the tithes, the sabbatical release of debts, and the three pilgrimage feasts — Passover, Shavuot, Sukkot.",
  },
  {
    key: 'shoftim',
    hebrewName: 'שֹׁפְטִים',
    transliteration: 'Shoftim',
    meaning: '"Judges"',
    torahReading: 'Deuteronomy 16:18 – 21:9',
    haftarah: 'Isaiah 51:12 – 52:12',
    summary:
      "\"Justice, justice you shall pursue.\" Moses appoints judges and officers in every gate. The laws of kings, priests, Levites, and prophets are given. Cities of refuge are provided for accidental killers. Rules for warfare — and the stern mercy of the egla arufa — close the parasha.",
  },
  {
    key: 'ki-teitzei',
    hebrewName: 'כִּי תֵצֵא',
    transliteration: 'Ki Teitzei',
    meaning: '"When you go out"',
    torahReading: 'Deuteronomy 21:10 – 25:19',
    haftarah: 'Isaiah 54:1 – 10',
    summary:
      "Seventy-four mitzvot are given — more than in any other parasha. Laws for the rebellious son, the mother bird, the roof-parapet, honest weights, kindness to the poor and the stranger, the levirate marriage, and the remembrance of Amalek. The God who gave the big commandments gives the small ones too.",
  },
  {
    key: 'ki-tavo',
    hebrewName: 'כִּי תָבוֹא',
    transliteration: 'Ki Tavo',
    meaning: '"When you come"',
    torahReading: 'Deuteronomy 26:1 – 29:8',
    haftarah: 'Isaiah 60:1 – 22',
    summary:
      "When you enter the land, bring the firstfruits to the priest and declare: \"My father was a wandering Aramean.\" The blessings and curses are to be proclaimed on Mount Gerizim and Mount Ebal. Moses lists in sobering detail what will befall Israel if they abandon the covenant — and holds out, even there, the promise of return.",
  },
  {
    key: 'nitzavim',
    hebrewName: 'נִצָּבִים',
    transliteration: 'Nitzavim',
    meaning: '"You are standing"',
    torahReading: 'Deuteronomy 29:9 – 30:20',
    haftarah: 'Isaiah 61:10 – 63:9',
    summary:
      "\"You are standing today, all of you, before the LORD your God.\" The covenant is given to every Israelite — man and woman, elder and child, stranger and woodcutter. The commandment is not too hard or too far; it is very near, in your mouth and in your heart. \"I have set before you life and death, blessing and curse. Choose life.\"",
  },
  {
    key: 'vayelech',
    hebrewName: 'וַיֵּלֶךְ',
    transliteration: 'Vayelech',
    meaning: '"And he went"',
    torahReading: 'Deuteronomy 31:1 – 30',
    haftarah: 'Isaiah 55:6 – 56:8',
    summary:
      "Moses is a hundred and twenty years old and can no longer go out and come in. He encourages Joshua, writes the Torah down, and commands that it be read publicly every seventh year at Sukkot. God tells him the people will turn away after his death — and gives him the song of witness.",
  },
  {
    key: 'haazinu',
    hebrewName: 'הַאֲזִינוּ',
    transliteration: "Ha'azinu",
    meaning: '"Listen"',
    torahReading: 'Deuteronomy 32:1 – 52',
    haftarah: '2 Samuel 22:1 – 51',
    summary:
      "\"Give ear, O heavens, and I will speak.\" Moses sings the song God gave him — a poetic witness of God's faithfulness, Israel's waywardness, and the ultimate vindication of His name. Then Moses climbs Mount Nebo, sees the land he cannot enter, and prepares to die.",
  },
  {
    key: 'vezot-haberakhah',
    hebrewName: 'וְזֹאת הַבְּרָכָה',
    transliteration: "V'Zot HaBerakhah",
    meaning: '"And this is the blessing"',
    torahReading: 'Deuteronomy 33:1 – 34:12',
    haftarah: 'Joshua 1:1 – 18',
    summary:
      "Before his death, Moses blesses the twelve tribes, each in turn. He ascends Mount Nebo, sees the land from Dan to the western sea, and dies by the mouth of the LORD. No man knows his burial place. Israel mourns thirty days, and Joshua, full of the spirit of wisdom, takes up the work — and the Torah ends where the nation stands ready to begin.",
  },
];

export function getLearnParashaByKey(key: string): LearnParasha | undefined {
  return LEARN_PARASHOT.find((p) => p.key === key);
}

/** Slug the existing calendar Parasha name into the Learn content key. */
export function learnParashaKeyFor(englishName: string): string {
  return englishName
    .toLowerCase()
    .replace(/[‘’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

