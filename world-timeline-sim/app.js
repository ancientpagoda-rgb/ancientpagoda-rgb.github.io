// World Timeline Diversity Simulation (Historically Anchored Prototype)
// Broad regional language + ancestry-proxy interpolation, not population-genetics truth.

const REGIONS = [
  {
    id: "north-america",
    name: "North America",
    lat: 40,
    lon: -98,
    populationMillions: 507,
    coverageNote:
      "Approximate macroregion centered on Canada, the United States, and Mexico; Central America and the Caribbean are not modeled separately.",
    baseLanguages: [
      ["English", 57],
      ["Spanish", 33],
      ["French", 2],
      ["Indigenous/Other", 8],
    ],
    baseEthnic: [
      ["European", 39],
      ["African Diaspora", 8],
      ["Indigenous", 12],
      ["Mixed/Other", 41],
    ],
  },
  {
    id: "south-america",
    name: "South America",
    lat: -15,
    lon: -60,
    populationMillions: 440,
    coverageNote:
      "Broad continental aggregate with Brazil and Spanish South America dominating the weight; small Guianas and island territories are absorbed into 'Other'.",
    baseLanguages: [
      ["Spanish", 47],
      ["Portuguese", 42],
      ["Indigenous Languages", 8],
      ["Other", 3],
    ],
    baseEthnic: [
      ["European", 26],
      ["Indigenous", 10],
      ["African Diaspora", 14],
      ["Mixed/Other", 50],
    ],
  },
  {
    id: "europe",
    name: "Europe",
    lat: 54,
    lon: 15,
    populationMillions: 740,
    coverageNote:
      "Population-weighted Europe that effectively includes the Russian share counted in European demographic totals; minority and non-Indo-European strands are compressed into 'Other/Minority'.",
    baseLanguages: [
      ["Germanic", 31],
      ["Romance", 33],
      ["Slavic", 23],
      ["Other/Minority", 13],
    ],
    baseEthnic: [
      ["Western/Central", 39],
      ["Eastern/Southern", 36],
      ["Northern", 9],
      ["Recent Migration", 16],
    ],
  },
  {
    id: "africa",
    name: "Africa",
    lat: 4,
    lon: 20,
    populationMillions: 1400,
    coverageNote:
      "Continental aggregate weighted by population rather than land area; Niger-Congo dominates demographically even though major Afro-Asiatic and Nile-Horn zones remain very important.",
    baseLanguages: [
      ["Niger-Congo", 63],
      ["Afro-Asiatic", 23],
      ["Nilo-Saharan", 6],
      ["Other/Creole", 8],
    ],
    baseEthnic: [
      ["Sub-Saharan", 69],
      ["Maghreb/Arab", 13],
      ["Horn/Red Sea", 10],
      ["Mixed/Other", 8],
    ],
  },
  {
    id: "middle-east",
    name: "Middle East",
    lat: 29,
    lon: 42,
    populationMillions: 440,
    coverageNote:
      "Broad Arabian–Levant–Mesopotamian–Iranian aggregate with a Turkic fringe; Arabic, Persian, and Turkic are modeled as macroregional blocks rather than country-by-country census shares.",
    baseLanguages: [
      ["Arabic", 58],
      ["Turkic", 9],
      ["Persian", 23],
      ["Other", 10],
    ],
    baseEthnic: [
      ["Arab", 60],
      ["Turkic", 8],
      ["Persian", 23],
      ["Mixed/Other", 9],
    ],
  },
  {
    id: "central-asia",
    name: "Central Asia",
    lat: 43,
    lon: 70,
    populationMillions: 80,
    coverageNote:
      "Kazakh-, Uzbek-, Kyrgyz-, Tajik-, and Turkmen-centered macroregion with Russian influence peaking under late imperial and Soviet rule.",
    baseLanguages: [
      ["Turkic", 67],
      ["Russian", 12],
      ["Persian", 15],
      ["Other", 6],
    ],
    baseEthnic: [
      ["Turkic", 60],
      ["Iranic", 22],
      ["Slavic", 8],
      ["Mixed/Other", 10],
    ],
  },
  {
    id: "south-asia",
    name: "South Asia",
    lat: 22,
    lon: 78,
    populationMillions: 1900,
    coverageNote:
      "India-dominant regional aggregate including Pakistan, Bangladesh, Nepal, Sri Lanka, Afghanistan, and Himalayan minorities; Indo-Aryan languages are therefore population-majority by a wide margin.",
    baseLanguages: [
      ["Indo-Aryan", 73],
      ["Dravidian", 20],
      ["Sino-Tibetan", 4],
      ["Other", 3],
    ],
    baseEthnic: [
      ["Indo-Aryan", 61],
      ["Dravidian", 20],
      ["Tibeto-Burman", 6],
      ["Mixed/Other", 13],
    ],
  },
  {
    id: "east-asia",
    name: "East Asia",
    lat: 35,
    lon: 105,
    populationMillions: 1680,
    coverageNote:
      "China-heavy East Asian macroregion including Japan, the Koreas, Mongolia, and Taiwan; Sinitic/Han weight is population-driven rather than simple state counting.",
    baseLanguages: [
      ["Sinitic", 76],
      ["Koreanic/Japonic", 15],
      ["Tibeto-Burman", 4],
      ["Other", 5],
    ],
    baseEthnic: [
      ["Han/Related", 78],
      ["Korean/Japanese", 14],
      ["Tibetan/Mongolic", 4],
      ["Mixed/Other", 4],
    ],
  },
  {
    id: "southeast-asia",
    name: "Southeast Asia",
    lat: 4,
    lon: 106,
    populationMillions: 700,
    coverageNote:
      "Combined mainland and maritime Southeast Asia; Austronesian, Austroasiatic, Tai-Kadai, and Burmic/Sino-Tibetan strands are intentionally grouped very broadly.",
    baseLanguages: [
      ["Austronesian", 40],
      ["Tai-Kadai", 14],
      ["Austroasiatic", 24],
      ["Other", 22],
    ],
    baseEthnic: [
      ["Malay/Indonesian", 34],
      ["Kinh/Thai", 30],
      ["Hill/Mountain Groups", 12],
      ["Mixed/Other", 24],
    ],
  },
  {
    id: "oceania",
    name: "Oceania",
    lat: -15,
    lon: 155,
    populationMillions: 45,
    coverageNote:
      "Australia/New Zealand plus Melanesia, Polynesia, and Micronesia combined; that pushes English and European shares much higher than in the island-Pacific alone.",
    baseLanguages: [
      ["Austronesian", 26],
      ["English", 44],
      ["Papuan", 20],
      ["Other", 10],
    ],
    baseEthnic: [
      ["Melanesian", 24],
      ["Polynesian/Micronesian", 10],
      ["European", 45],
      ["Mixed/Other", 21],
    ],
  },
];

const SCENARIOS = {
  historical: {
    label: "Historical anchors",
    hint:
      "Broad macroregional population totals are paired with hand-curated language and ancestry-proxy anchors around major historical inflection points such as conquest, slavery, industrial migration, decolonization, and post-1990 mobility. Future projections and synthetic drift modes are intentionally removed.",
  },
};

const POPULATION_ANCHORS = {
  "north-america": [
    [1500, 6],
    [1700, 8],
    [1800, 18],
    [1900, 96],
    [1950, 194],
    [2000, 411],
    [2025, 507],
  ],
  "south-america": [
    [1500, 17],
    [1700, 21],
    [1800, 31],
    [1900, 63],
    [1950, 112],
    [2000, 348],
    [2025, 440],
  ],
  europe: [
    [1500, 82],
    [1700, 118],
    [1800, 187],
    [1900, 408],
    [1950, 547],
    [2000, 727],
    [2025, 742],
  ],
  africa: [
    [1500, 86],
    [1700, 106],
    [1800, 111],
    [1900, 133],
    [1950, 228],
    [2000, 811],
    [2025, 1490],
  ],
  "middle-east": [
    [1500, 18],
    [1700, 23],
    [1800, 31],
    [1900, 52],
    [1950, 86],
    [2000, 250],
    [2025, 440],
  ],
  "central-asia": [
    [1500, 5],
    [1700, 6],
    [1800, 8],
    [1900, 15],
    [1950, 23],
    [2000, 57],
    [2025, 82],
  ],
  "south-asia": [
    [1500, 113],
    [1700, 165],
    [1800, 220],
    [1900, 305],
    [1950, 508],
    [2000, 1390],
    [2025, 2010],
  ],
  "east-asia": [
    [1500, 145],
    [1700, 190],
    [1800, 303],
    [1900, 479],
    [1950, 676],
    [2000, 1460],
    [2025, 1680],
  ],
  "southeast-asia": [
    [1500, 18],
    [1700, 25],
    [1800, 34],
    [1900, 80],
    [1950, 126],
    [2000, 522],
    [2025, 690],
  ],
  oceania: [
    [1500, 2],
    [1700, 2.5],
    [1800, 3],
    [1900, 8],
    [1950, 13],
    [2000, 31],
    [2025, 46],
  ],
};

const LANGUAGE_ANCHORS = {
  "north-america": [
    { year: 1500, shares: { English: 0, Spanish: 1, French: 0, "Indigenous/Other": 99 } },
    { year: 1650, shares: { English: 5, Spanish: 6, French: 2, "Indigenous/Other": 87 } },
    { year: 1750, shares: { English: 11, Spanish: 12, French: 5, "Indigenous/Other": 72 } },
    { year: 1825, shares: { English: 16, Spanish: 26, French: 4, "Indigenous/Other": 54 } },
    { year: 1900, shares: { English: 40, Spanish: 43, French: 4, "Indigenous/Other": 13 } },
    { year: 1950, shares: { English: 54, Spanish: 36, French: 3, "Indigenous/Other": 7 } },
    { year: 2000, shares: { English: 57, Spanish: 32, French: 3, "Indigenous/Other": 8 } },
    { year: 2025, shares: { English: 57, Spanish: 33, French: 2, "Indigenous/Other": 8 } },
  ],
  "south-america": [
    { year: 1500, shares: { Spanish: 0, Portuguese: 0, "Indigenous Languages": 99, Other: 1 } },
    { year: 1650, shares: { Spanish: 13, Portuguese: 8, "Indigenous Languages": 77, Other: 2 } },
    { year: 1750, shares: { Spanish: 24, Portuguese: 15, "Indigenous Languages": 57, Other: 4 } },
    { year: 1825, shares: { Spanish: 38, Portuguese: 24, "Indigenous Languages": 33, Other: 5 } },
    { year: 1900, shares: { Spanish: 47, Portuguese: 38, "Indigenous Languages": 11, Other: 4 } },
    { year: 1950, shares: { Spanish: 48, Portuguese: 39, "Indigenous Languages": 10, Other: 3 } },
    { year: 2000, shares: { Spanish: 47, Portuguese: 41, "Indigenous Languages": 9, Other: 3 } },
    { year: 2025, shares: { Spanish: 47, Portuguese: 42, "Indigenous Languages": 8, Other: 3 } },
  ],
  europe: [
    { year: 1500, shares: { Germanic: 33, Romance: 37, Slavic: 20, "Other/Minority": 10 } },
    { year: 1700, shares: { Germanic: 32, Romance: 36, Slavic: 22, "Other/Minority": 10 } },
    { year: 1900, shares: { Germanic: 31, Romance: 34, Slavic: 25, "Other/Minority": 10 } },
    { year: 1950, shares: { Germanic: 31, Romance: 34, Slavic: 24, "Other/Minority": 11 } },
    { year: 2000, shares: { Germanic: 31, Romance: 33, Slavic: 24, "Other/Minority": 12 } },
    { year: 2025, shares: { Germanic: 31, Romance: 33, Slavic: 23, "Other/Minority": 13 } },
  ],
  africa: [
    { year: 1500, shares: { "Niger-Congo": 65, "Afro-Asiatic": 23, "Nilo-Saharan": 9, "Other/Creole": 3 } },
    { year: 1700, shares: { "Niger-Congo": 65, "Afro-Asiatic": 22, "Nilo-Saharan": 8, "Other/Creole": 5 } },
    { year: 1900, shares: { "Niger-Congo": 64, "Afro-Asiatic": 22, "Nilo-Saharan": 7, "Other/Creole": 7 } },
    { year: 1950, shares: { "Niger-Congo": 63, "Afro-Asiatic": 23, "Nilo-Saharan": 6, "Other/Creole": 8 } },
    { year: 2000, shares: { "Niger-Congo": 63, "Afro-Asiatic": 23, "Nilo-Saharan": 6, "Other/Creole": 8 } },
    { year: 2025, shares: { "Niger-Congo": 63, "Afro-Asiatic": 23, "Nilo-Saharan": 6, "Other/Creole": 8 } },
  ],
  "middle-east": [
    { year: 1500, shares: { Arabic: 51, Turkic: 13, Persian: 27, Other: 9 } },
    { year: 1700, shares: { Arabic: 54, Turkic: 12, Persian: 25, Other: 9 } },
    { year: 1900, shares: { Arabic: 58, Turkic: 11, Persian: 22, Other: 9 } },
    { year: 1950, shares: { Arabic: 60, Turkic: 10, Persian: 21, Other: 9 } },
    { year: 2000, shares: { Arabic: 59, Turkic: 9, Persian: 22, Other: 10 } },
    { year: 2025, shares: { Arabic: 58, Turkic: 9, Persian: 23, Other: 10 } },
  ],
  "central-asia": [
    { year: 1500, shares: { Turkic: 70, Russian: 0, Persian: 22, Other: 8 } },
    { year: 1700, shares: { Turkic: 69, Russian: 1, Persian: 22, Other: 8 } },
    { year: 1900, shares: { Turkic: 58, Russian: 21, Persian: 14, Other: 7 } },
    { year: 1950, shares: { Turkic: 62, Russian: 18, Persian: 13, Other: 7 } },
    { year: 2000, shares: { Turkic: 66, Russian: 13, Persian: 15, Other: 6 } },
    { year: 2025, shares: { Turkic: 67, Russian: 12, Persian: 15, Other: 6 } },
  ],
  "south-asia": [
    { year: 1500, shares: { "Indo-Aryan": 72, Dravidian: 21, "Sino-Tibetan": 4, Other: 3 } },
    { year: 1700, shares: { "Indo-Aryan": 72, Dravidian: 20, "Sino-Tibetan": 4, Other: 4 } },
    { year: 1900, shares: { "Indo-Aryan": 73, Dravidian: 20, "Sino-Tibetan": 4, Other: 3 } },
    { year: 1950, shares: { "Indo-Aryan": 73, Dravidian: 20, "Sino-Tibetan": 4, Other: 3 } },
    { year: 2000, shares: { "Indo-Aryan": 73, Dravidian: 20, "Sino-Tibetan": 4, Other: 3 } },
    { year: 2025, shares: { "Indo-Aryan": 73, Dravidian: 20, "Sino-Tibetan": 4, Other: 3 } },
  ],
  "east-asia": [
    { year: 1500, shares: { Sinitic: 74, "Koreanic/Japonic": 14, "Tibeto-Burman": 5, Other: 7 } },
    { year: 1700, shares: { Sinitic: 75, "Koreanic/Japonic": 15, "Tibeto-Burman": 4, Other: 6 } },
    { year: 1900, shares: { Sinitic: 76, "Koreanic/Japonic": 15, "Tibeto-Burman": 4, Other: 5 } },
    { year: 1950, shares: { Sinitic: 76, "Koreanic/Japonic": 15, "Tibeto-Burman": 4, Other: 5 } },
    { year: 2000, shares: { Sinitic: 76, "Koreanic/Japonic": 15, "Tibeto-Burman": 4, Other: 5 } },
    { year: 2025, shares: { Sinitic: 76, "Koreanic/Japonic": 15, "Tibeto-Burman": 4, Other: 5 } },
  ],
  "southeast-asia": [
    { year: 1500, shares: { Austronesian: 42, "Tai-Kadai": 15, Austroasiatic: 28, Other: 15 } },
    { year: 1700, shares: { Austronesian: 41, "Tai-Kadai": 15, Austroasiatic: 27, Other: 17 } },
    { year: 1900, shares: { Austronesian: 40, "Tai-Kadai": 14, Austroasiatic: 25, Other: 21 } },
    { year: 1950, shares: { Austronesian: 40, "Tai-Kadai": 14, Austroasiatic: 24, Other: 22 } },
    { year: 2000, shares: { Austronesian: 40, "Tai-Kadai": 14, Austroasiatic: 24, Other: 22 } },
    { year: 2025, shares: { Austronesian: 40, "Tai-Kadai": 14, Austroasiatic: 24, Other: 22 } },
  ],
  oceania: [
    { year: 1500, shares: { Austronesian: 57, English: 0, Papuan: 36, Other: 7 } },
    { year: 1700, shares: { Austronesian: 56, English: 1, Papuan: 35, Other: 8 } },
    { year: 1850, shares: { Austronesian: 41, English: 24, Papuan: 22, Other: 13 } },
    { year: 1900, shares: { Austronesian: 33, English: 40, Papuan: 18, Other: 9 } },
    { year: 1950, shares: { Austronesian: 29, English: 45, Papuan: 17, Other: 9 } },
    { year: 2000, shares: { Austronesian: 27, English: 44, Papuan: 19, Other: 10 } },
    { year: 2025, shares: { Austronesian: 26, English: 44, Papuan: 20, Other: 10 } },
  ],
};

const ANCESTRY_PROXY_ANCHORS = {
  "north-america": [
    { year: 1500, shares: { European: 0, "African Diaspora": 0, Indigenous: 99, "Mixed/Other": 1 } },
    { year: 1650, shares: { European: 6, "African Diaspora": 8, Indigenous: 82, "Mixed/Other": 4 } },
    { year: 1750, shares: { European: 11, "African Diaspora": 9, Indigenous: 71, "Mixed/Other": 9 } },
    { year: 1825, shares: { European: 16, "African Diaspora": 8, Indigenous: 54, "Mixed/Other": 22 } },
    { year: 1900, shares: { European: 32, "African Diaspora": 8, Indigenous: 20, "Mixed/Other": 40 } },
    { year: 1950, shares: { European: 37, "African Diaspora": 9, Indigenous: 15, "Mixed/Other": 39 } },
    { year: 2000, shares: { European: 39, "African Diaspora": 8, Indigenous: 12, "Mixed/Other": 41 } },
    { year: 2025, shares: { European: 39, "African Diaspora": 8, Indigenous: 12, "Mixed/Other": 41 } },
  ],
  "south-america": [
    { year: 1500, shares: { European: 1, Indigenous: 97, "African Diaspora": 1, "Mixed/Other": 1 } },
    { year: 1650, shares: { European: 11, Indigenous: 74, "African Diaspora": 6, "Mixed/Other": 9 } },
    { year: 1750, shares: { European: 18, Indigenous: 58, "African Diaspora": 9, "Mixed/Other": 15 } },
    { year: 1825, shares: { European: 24, Indigenous: 38, "African Diaspora": 12, "Mixed/Other": 26 } },
    { year: 1900, shares: { European: 29, Indigenous: 20, "African Diaspora": 14, "Mixed/Other": 37 } },
    { year: 1950, shares: { European: 28, Indigenous: 15, "African Diaspora": 15, "Mixed/Other": 42 } },
    { year: 2000, shares: { European: 27, Indigenous: 11, "African Diaspora": 14, "Mixed/Other": 48 } },
    { year: 2025, shares: { European: 26, Indigenous: 10, "African Diaspora": 14, "Mixed/Other": 50 } },
  ],
  europe: [
    { year: 1500, shares: { "Western/Central": 42, "Eastern/Southern": 37, Northern: 19, "Recent Migration": 2 } },
    { year: 1700, shares: { "Western/Central": 42, "Eastern/Southern": 37, Northern: 18, "Recent Migration": 3 } },
    { year: 1900, shares: { "Western/Central": 42, "Eastern/Southern": 36, Northern: 15, "Recent Migration": 7 } },
    { year: 1950, shares: { "Western/Central": 41, "Eastern/Southern": 36, Northern: 14, "Recent Migration": 9 } },
    { year: 2000, shares: { "Western/Central": 40, "Eastern/Southern": 36, Northern: 11, "Recent Migration": 13 } },
    { year: 2025, shares: { "Western/Central": 39, "Eastern/Southern": 36, Northern: 9, "Recent Migration": 16 } },
  ],
  africa: [
    { year: 1500, shares: { "Sub-Saharan": 72, "Maghreb/Arab": 12, "Horn/Red Sea": 11, "Mixed/Other": 5 } },
    { year: 1700, shares: { "Sub-Saharan": 71, "Maghreb/Arab": 12, "Horn/Red Sea": 11, "Mixed/Other": 6 } },
    { year: 1900, shares: { "Sub-Saharan": 70, "Maghreb/Arab": 12, "Horn/Red Sea": 10, "Mixed/Other": 8 } },
    { year: 1950, shares: { "Sub-Saharan": 70, "Maghreb/Arab": 13, "Horn/Red Sea": 10, "Mixed/Other": 7 } },
    { year: 2000, shares: { "Sub-Saharan": 69, "Maghreb/Arab": 13, "Horn/Red Sea": 10, "Mixed/Other": 8 } },
    { year: 2025, shares: { "Sub-Saharan": 69, "Maghreb/Arab": 13, "Horn/Red Sea": 10, "Mixed/Other": 8 } },
  ],
  "middle-east": [
    { year: 1500, shares: { Arab: 54, Turkic: 13, Persian: 24, "Mixed/Other": 9 } },
    { year: 1700, shares: { Arab: 56, Turkic: 12, Persian: 23, "Mixed/Other": 9 } },
    { year: 1900, shares: { Arab: 60, Turkic: 9, Persian: 22, "Mixed/Other": 9 } },
    { year: 1950, shares: { Arab: 61, Turkic: 8, Persian: 22, "Mixed/Other": 9 } },
    { year: 2000, shares: { Arab: 61, Turkic: 8, Persian: 22, "Mixed/Other": 9 } },
    { year: 2025, shares: { Arab: 60, Turkic: 8, Persian: 23, "Mixed/Other": 9 } },
  ],
  "central-asia": [
    { year: 1500, shares: { Turkic: 63, Iranic: 27, Slavic: 0, "Mixed/Other": 10 } },
    { year: 1700, shares: { Turkic: 62, Iranic: 26, Slavic: 1, "Mixed/Other": 11 } },
    { year: 1900, shares: { Turkic: 54, Iranic: 20, Slavic: 18, "Mixed/Other": 8 } },
    { year: 1950, shares: { Turkic: 57, Iranic: 21, Slavic: 13, "Mixed/Other": 9 } },
    { year: 2000, shares: { Turkic: 60, Iranic: 22, Slavic: 9, "Mixed/Other": 9 } },
    { year: 2025, shares: { Turkic: 60, Iranic: 22, Slavic: 8, "Mixed/Other": 10 } },
  ],
  "south-asia": [
    { year: 1500, shares: { "Indo-Aryan": 61, Dravidian: 21, "Tibeto-Burman": 6, "Mixed/Other": 12 } },
    { year: 1700, shares: { "Indo-Aryan": 61, Dravidian: 20, "Tibeto-Burman": 6, "Mixed/Other": 13 } },
    { year: 1900, shares: { "Indo-Aryan": 61, Dravidian: 20, "Tibeto-Burman": 6, "Mixed/Other": 13 } },
    { year: 1950, shares: { "Indo-Aryan": 61, Dravidian: 20, "Tibeto-Burman": 6, "Mixed/Other": 13 } },
    { year: 2000, shares: { "Indo-Aryan": 61, Dravidian: 20, "Tibeto-Burman": 6, "Mixed/Other": 13 } },
    { year: 2025, shares: { "Indo-Aryan": 61, Dravidian: 20, "Tibeto-Burman": 6, "Mixed/Other": 13 } },
  ],
  "east-asia": [
    { year: 1500, shares: { "Han/Related": 76, "Korean/Japanese": 14, "Tibetan/Mongolic": 4, "Mixed/Other": 6 } },
    { year: 1700, shares: { "Han/Related": 77, "Korean/Japanese": 14, "Tibetan/Mongolic": 4, "Mixed/Other": 5 } },
    { year: 1900, shares: { "Han/Related": 78, "Korean/Japanese": 14, "Tibetan/Mongolic": 4, "Mixed/Other": 4 } },
    { year: 1950, shares: { "Han/Related": 78, "Korean/Japanese": 14, "Tibetan/Mongolic": 4, "Mixed/Other": 4 } },
    { year: 2000, shares: { "Han/Related": 78, "Korean/Japanese": 14, "Tibetan/Mongolic": 4, "Mixed/Other": 4 } },
    { year: 2025, shares: { "Han/Related": 78, "Korean/Japanese": 14, "Tibetan/Mongolic": 4, "Mixed/Other": 4 } },
  ],
  "southeast-asia": [
    { year: 1500, shares: { "Malay/Indonesian": 31, "Kinh/Thai": 26, "Hill/Mountain Groups": 22, "Mixed/Other": 21 } },
    { year: 1700, shares: { "Malay/Indonesian": 32, "Kinh/Thai": 27, "Hill/Mountain Groups": 20, "Mixed/Other": 21 } },
    { year: 1900, shares: { "Malay/Indonesian": 34, "Kinh/Thai": 29, "Hill/Mountain Groups": 15, "Mixed/Other": 22 } },
    { year: 1950, shares: { "Malay/Indonesian": 34, "Kinh/Thai": 29, "Hill/Mountain Groups": 14, "Mixed/Other": 23 } },
    { year: 2000, shares: { "Malay/Indonesian": 34, "Kinh/Thai": 30, "Hill/Mountain Groups": 12, "Mixed/Other": 24 } },
    { year: 2025, shares: { "Malay/Indonesian": 34, "Kinh/Thai": 30, "Hill/Mountain Groups": 12, "Mixed/Other": 24 } },
  ],
  oceania: [
    { year: 1500, shares: { Melanesian: 49, "Polynesian/Micronesian": 30, European: 0, "Mixed/Other": 21 } },
    { year: 1700, shares: { Melanesian: 49, "Polynesian/Micronesian": 29, European: 1, "Mixed/Other": 21 } },
    { year: 1850, shares: { Melanesian: 37, "Polynesian/Micronesian": 19, European: 24, "Mixed/Other": 20 } },
    { year: 1900, shares: { Melanesian: 31, "Polynesian/Micronesian": 14, European: 38, "Mixed/Other": 17 } },
    { year: 1950, shares: { Melanesian: 27, "Polynesian/Micronesian": 11, European: 43, "Mixed/Other": 19 } },
    { year: 2000, shares: { Melanesian: 24, "Polynesian/Micronesian": 10, European: 45, "Mixed/Other": 21 } },
    { year: 2025, shares: { Melanesian: 24, "Polynesian/Micronesian": 10, European: 45, "Mixed/Other": 21 } },
  ],
};

const TIMELINE_START = -3000;
const TIMELINE_END = 2025;
const YEARS = Array.from({ length: (TIMELINE_END - TIMELINE_START) / 25 + 1 }, (_, i) => TIMELINE_START + i * 25);
const YEAR_MIN = YEARS[0];
const YEAR_MAX = YEARS[YEARS.length - 1];
const YEAR_STEP = 25;
const YEAR_SPAN = YEAR_MAX - YEAR_MIN;

const ERA_BANDS = [
  {
    start: -3000,
    end: -1201,
    label: "Bronze Age foundations",
    note: "Deep-time extension only: broad macroregional proxies stand in for early state formation, long-distance exchange, and prehistoric-to-ancient transitions.",
  },
  {
    start: -1200,
    end: -500,
    label: "Iron Age worlds",
    note: "Still highly schematic: the model should be read as coarse regional continuity before classical-era empires and historically documented ethnolinguistic balances.",
  },
  {
    start: -499,
    end: 500,
    label: "Classical and late antique era",
    note: "Regional labels are still broad abstractions, but written-state history and long-run imperial systems become more legible than in the deep-prehistory segment.",
  },
  {
    start: 501,
    end: 1499,
    label: "Medieval and post-classical world",
    note: "Macroregional balances remain approximate, representing long-run civilizational patterns before the early modern colonial rupture.",
  },
  {
    start: 1500,
    end: 1649,
    label: "Early modern world",
    note: "Before most industrial-era demographic shifts; many regional language and ancestry balances remain strongly pre-colonial.",
  },
  {
    start: 1650,
    end: 1799,
    label: "Imperial expansion era",
    note: "Oceanic empires, settler colonial expansion, Atlantic slavery, and frontier consolidation reshape several regions.",
  },
  {
    start: 1800,
    end: 1913,
    label: "Industrial empire era",
    note: "Industrialization, mass migration, imperial integration, and census-era state formation intensify regional change.",
  },
  {
    start: 1914,
    end: 1945,
    label: "World-war rupture",
    note: "War, partition, genocide, and forced migration create major twentieth-century discontinuities.",
  },
  {
    start: 1946,
    end: 1990,
    label: "Postwar and decolonization",
    note: "Decolonization, nation-state consolidation, and postwar migration define many modern regional balances.",
  },
  {
    start: 1991,
    end: 2025,
    label: "Contemporary global era",
    note: "Late-twentieth- and early-twenty-first-century migration, urbanization, and language shift dominate the latest anchors.",
  },
];

const STORAGE_KEY = "worldTimelineSim.v2";

const state = {
  selectedRegionId: null,
  hoverRegionId: null,
  currentSnapshots: [],
  compareSnapshots: [],
  currentYear: YEAR_MIN,
  compareYear: 2000,
  compareOffset: 100,
  compareEnabled: false,
  compareLock: true,
  regionFilter: "all",
  dimension: "language",
  sizeMode: "combined",
  colorRangeMode: "fixed",
  projection: "natural earth",
  scenarioKey: "historical",
  deltaThreshold: 0,
  animationSpeed: 5,
  loopMode: "wrap",
  playbackDirection: "forward",
  stepSize: 25,
  snapToGrid: true,
  reducedMotion: false,
  highContrast: false,
  playing: false,
  playDirection: 1,
  rafId: null,
  lastTickTs: null,
  mapEventsBound: false,
  lastMapRenderMs: 0,
  lastTrendRenderMs: 0,
  lastMoversRenderMs: 0,
  lastTableRenderMs: 0,
  lastDistributionRenderMs: 0,
  lastRenderDurationMs: 0,
};

function getEraInfo(year) {
  return ERA_BANDS.find((era) => year >= era.start && year <= era.end) || ERA_BANDS[ERA_BANDS.length - 1];
}

const GROUP_COLOR_PALETTE = [
  "#e11d48",
  "#f97316",
  "#f59e0b",
  "#84cc16",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#d946ef",
  "#ec4899",
  "#22c55e",
  "#0ea5e9",
  "#a3e635",
  "#f43f5e",
];

const HISTORICAL_LANGUAGE_ROUTES = {
  "north-america": {
    English: {
      start: 0.05,
      end: 1,
      points: [
        { lat: 52, lon: -1 },
        { lat: 50, lon: -18 },
        { lat: 47, lon: -42 },
        { lat: 44, lon: -63 },
        { lat: 40, lon: -98 },
      ],
    },
    Spanish: {
      start: 0.08,
      end: 1,
      points: [
        { lat: 40, lon: -4 },
        { lat: 29, lon: -17 },
        { lat: 21, lon: -72 },
        { lat: 23, lon: -102 },
        { lat: 40, lon: -98 },
      ],
    },
    French: {
      start: 0.08,
      end: 0.92,
      points: [
        { lat: 48, lon: 2 },
        { lat: 47, lon: -18 },
        { lat: 46, lon: -48 },
        { lat: 47, lon: -68 },
        { lat: 44, lon: -82 },
        { lat: 40, lon: -98 },
      ],
    },
    "Indigenous/Other": {
      start: 0.9,
      end: 1,
      points: [
        { lat: 64, lon: -150 },
        { lat: 55, lon: -128 },
        { lat: 47, lon: -114 },
        { lat: 40, lon: -98 },
      ],
    },
  },
  "south-america": {
    Spanish: {
      start: 0.08,
      end: 1,
      points: [
        { lat: 40, lon: -4 },
        { lat: 28, lon: -17 },
        { lat: 16, lon: -66 },
        { lat: 4, lon: -74 },
        { lat: -15, lon: -60 },
      ],
    },
    Portuguese: {
      start: 0.08,
      end: 1,
      points: [
        { lat: 39, lon: -9 },
        { lat: 18, lon: -25 },
        { lat: -7, lon: -35 },
        { lat: -15, lon: -47 },
        { lat: -15, lon: -60 },
      ],
    },
    "Indigenous Languages": {
      start: 0.92,
      end: 1,
      points: [
        { lat: 7, lon: -76 },
        { lat: -7, lon: -74 },
        { lat: -14, lon: -68 },
        { lat: -15, lon: -60 },
      ],
    },
    Other: {
      start: 0.45,
      end: 1,
      points: [
        { lat: 35, lon: -10 },
        { lat: 5, lon: -20 },
        { lat: -12, lon: -38 },
        { lat: -15, lon: -60 },
      ],
    },
  },
  europe: {
    Germanic: {
      start: 0.86,
      end: 1,
      points: [
        { lat: 58, lon: 8 },
        { lat: 54, lon: 10 },
        { lat: 50, lon: 12 },
        { lat: 54, lon: 15 },
      ],
    },
    Romance: {
      start: 0.88,
      end: 1,
      points: [
        { lat: 42, lon: 12 },
        { lat: 44, lon: 5 },
        { lat: 46, lon: 8 },
        { lat: 54, lon: 15 },
      ],
    },
    Slavic: {
      start: 0.84,
      end: 1,
      points: [
        { lat: 56, lon: 32 },
        { lat: 53, lon: 24 },
        { lat: 52, lon: 18 },
        { lat: 54, lon: 15 },
      ],
    },
    "Other/Minority": {
      start: 0.8,
      end: 1,
      points: [
        { lat: 40, lon: 22 },
        { lat: 45, lon: 20 },
        { lat: 50, lon: 18 },
        { lat: 54, lon: 15 },
      ],
    },
  },
  africa: {
    "Niger-Congo": {
      start: 0.84,
      end: 1,
      points: [
        { lat: 8, lon: -6 },
        { lat: 4, lon: 10 },
        { lat: 1, lon: 18 },
        { lat: 4, lon: 20 },
      ],
    },
    "Afro-Asiatic": {
      start: 0.82,
      end: 1,
      points: [
        { lat: 31, lon: 30 },
        { lat: 23, lon: 20 },
        { lat: 14, lon: 18 },
        { lat: 4, lon: 20 },
      ],
    },
    "Nilo-Saharan": {
      start: 0.84,
      end: 1,
      points: [
        { lat: 14, lon: 24 },
        { lat: 10, lon: 28 },
        { lat: 6, lon: 24 },
        { lat: 4, lon: 20 },
      ],
    },
    "Other/Creole": {
      start: 0.55,
      end: 1,
      points: [
        { lat: -6, lon: 39 },
        { lat: -1, lon: 32 },
        { lat: 3, lon: 24 },
        { lat: 4, lon: 20 },
      ],
    },
  },
  "middle-east": {
    Arabic: {
      start: 0.84,
      end: 1,
      points: [
        { lat: 24, lon: 46 },
        { lat: 29, lon: 40 },
        { lat: 33, lon: 37 },
        { lat: 29, lon: 42 },
      ],
    },
    Turkic: {
      start: 0.78,
      end: 1,
      points: [
        { lat: 40, lon: 34 },
        { lat: 38, lon: 39 },
        { lat: 34, lon: 41 },
        { lat: 29, lon: 42 },
      ],
    },
    Persian: {
      start: 0.8,
      end: 1,
      points: [
        { lat: 35, lon: 53 },
        { lat: 34, lon: 48 },
        { lat: 31, lon: 45 },
        { lat: 29, lon: 42 },
      ],
    },
    Other: {
      start: 0.7,
      end: 1,
      points: [
        { lat: 38, lon: 45 },
        { lat: 35, lon: 42 },
        { lat: 31, lon: 42 },
        { lat: 29, lon: 42 },
      ],
    },
  },
  "central-asia": {
    Turkic: {
      start: 0.8,
      end: 1,
      points: [
        { lat: 48, lon: 88 },
        { lat: 46, lon: 79 },
        { lat: 44, lon: 72 },
        { lat: 43, lon: 70 },
      ],
    },
    Russian: {
      start: 0,
      end: 1,
      points: [
        { lat: 56, lon: 37 },
        { lat: 54, lon: 55 },
        { lat: 51, lon: 68 },
        { lat: 43, lon: 70 },
      ],
    },
    Persian: {
      start: 0.75,
      end: 0.95,
      points: [
        { lat: 36, lon: 59 },
        { lat: 39, lon: 65 },
        { lat: 41, lon: 68 },
        { lat: 43, lon: 70 },
      ],
    },
    Other: {
      start: 0.72,
      end: 1,
      points: [
        { lat: 39, lon: 76 },
        { lat: 42, lon: 74 },
        { lat: 44, lon: 71 },
        { lat: 43, lon: 70 },
      ],
    },
  },
  "south-asia": {
    "Indo-Aryan": {
      start: 0.88,
      end: 1,
      points: [
        { lat: 31, lon: 74 },
        { lat: 28, lon: 79 },
        { lat: 25, lon: 82 },
        { lat: 22, lon: 78 },
      ],
    },
    Dravidian: {
      start: 0.86,
      end: 1,
      points: [
        { lat: 11, lon: 78 },
        { lat: 15, lon: 79 },
        { lat: 19, lon: 80 },
        { lat: 22, lon: 78 },
      ],
    },
    "Sino-Tibetan": {
      start: 0.82,
      end: 1,
      points: [
        { lat: 28, lon: 94 },
        { lat: 27, lon: 89 },
        { lat: 25, lon: 84 },
        { lat: 22, lon: 78 },
      ],
    },
    Other: {
      start: 0.75,
      end: 1,
      points: [
        { lat: 8, lon: 76 },
        { lat: 14, lon: 77 },
        { lat: 19, lon: 78 },
        { lat: 22, lon: 78 },
      ],
    },
  },
  "east-asia": {
    Sinitic: {
      start: 0.88,
      end: 1,
      points: [
        { lat: 35, lon: 112 },
        { lat: 34, lon: 109 },
        { lat: 35, lon: 105 },
      ],
    },
    "Koreanic/Japonic": {
      start: 0.84,
      end: 1,
      points: [
        { lat: 36, lon: 138 },
        { lat: 37, lon: 128 },
        { lat: 36, lon: 118 },
        { lat: 35, lon: 105 },
      ],
    },
    "Tibeto-Burman": {
      start: 0.84,
      end: 1,
      points: [
        { lat: 31, lon: 91 },
        { lat: 30, lon: 97 },
        { lat: 32, lon: 101 },
        { lat: 35, lon: 105 },
      ],
    },
    Other: {
      start: 0.8,
      end: 1,
      points: [
        { lat: 47, lon: 127 },
        { lat: 44, lon: 120 },
        { lat: 39, lon: 112 },
        { lat: 35, lon: 105 },
      ],
    },
  },
  "southeast-asia": {
    Austronesian: {
      start: 0.78,
      end: 1,
      points: [
        { lat: 24, lon: 121 },
        { lat: 14, lon: 122 },
        { lat: 4, lon: 118 },
        { lat: -3, lon: 112 },
        { lat: 4, lon: 106 },
      ],
    },
    "Tai-Kadai": {
      start: 0.82,
      end: 1,
      points: [
        { lat: 24, lon: 106 },
        { lat: 20, lon: 103 },
        { lat: 16, lon: 101 },
        { lat: 4, lon: 106 },
      ],
    },
    Austroasiatic: {
      start: 0.84,
      end: 1,
      points: [
        { lat: 15, lon: 105 },
        { lat: 12, lon: 104 },
        { lat: 8, lon: 103 },
        { lat: 4, lon: 106 },
      ],
    },
    Other: {
      start: 0.72,
      end: 1,
      points: [
        { lat: 22, lon: 97 },
        { lat: 16, lon: 99 },
        { lat: 10, lon: 101 },
        { lat: 4, lon: 106 },
      ],
    },
  },
  oceania: {
    Austronesian: {
      start: 0.82,
      end: 1,
      points: [
        { lat: 18, lon: 122 },
        { lat: 4, lon: 132 },
        { lat: -8, lon: 147 },
        { lat: -15, lon: 155 },
      ],
    },
    English: {
      start: 0.02,
      end: 1,
      points: [
        { lat: 52, lon: -1 },
        { lat: -34, lon: 18 },
        { lat: -32, lon: 115 },
        { lat: -25, lon: 134 },
        { lat: -15, lon: 155 },
      ],
    },
    Papuan: {
      start: 0.92,
      end: 1,
      points: [
        { lat: -5, lon: 143 },
        { lat: -7, lon: 147 },
        { lat: -11, lon: 151 },
        { lat: -15, lon: 155 },
      ],
    },
    Other: {
      start: 0.68,
      end: 1,
      points: [
        { lat: 0, lon: 160 },
        { lat: -10, lon: 163 },
        { lat: -15, lon: 160 },
        { lat: -15, lon: 155 },
      ],
    },
  },
};

function isMapOnlyMode() {
  return document.body.classList.contains("map-only");
}

function colorForGroup(groupName) {
  const idx = hashString(`group|${groupName}`) % GROUP_COLOR_PALETTE.length;
  return GROUP_COLOR_PALETTE[idx];
}

function byId(id) {
  return document.getElementById(id);
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function announce(msg) {
  const el = byId("a11yStatus");
  if (!el) return;
  el.textContent = "";
  setTimeout(() => {
    el.textContent = msg;
  }, 0);
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function unitRand(...parts) {
  return hashString(parts.join("|")) / 4294967295;
}

function signedRand(...parts) {
  return unitRand(...parts) * 2 - 1;
}

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function rgbaFromHex(hex, alpha) {
  if (typeof hex !== "string" || !hex.startsWith("#") || (hex.length !== 7 && hex.length !== 4)) {
    return `rgba(148,163,184,${alpha})`;
  }

  const normalized =
    hex.length === 4
      ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
      : hex;

  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function segmentLength(a, b) {
  const lonScale = Math.max(0.28, Math.cos((((a.lat + b.lat) / 2) * Math.PI) / 180));
  const dx = (b.lon - a.lon) * lonScale;
  const dy = b.lat - a.lat;
  return Math.hypot(dx, dy);
}

function routePoint(points, progress) {
  if (!points?.length) {
    return {
      lat: 0,
      lon: 0,
      tangentLat: 0,
      tangentLon: 1,
      normalLat: -1,
      normalLon: 0,
    };
  }

  if (points.length === 1) {
    return {
      lat: points[0].lat,
      lon: points[0].lon,
      tangentLat: 0,
      tangentLon: 1,
      normalLat: -1,
      normalLon: 0,
    };
  }

  const targetProgress = clamp(progress, 0, 1);
  const total = points.slice(1).reduce((sum, point, idx) => sum + segmentLength(points[idx], point), 0);
  if (total <= 0) {
    return {
      lat: points[points.length - 1].lat,
      lon: points[points.length - 1].lon,
      tangentLat: 0,
      tangentLon: 1,
      normalLat: -1,
      normalLon: 0,
    };
  }

  let travelled = 0;
  const targetDistance = total * targetProgress;

  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    const seg = segmentLength(a, b);
    if (seg <= 0) continue;

    if (travelled + seg >= targetDistance || i === points.length - 2) {
      const local = clamp((targetDistance - travelled) / seg, 0, 1);
      const lat = lerp(a.lat, b.lat, local);
      const lon = lerp(a.lon, b.lon, local);
      const lonScale = Math.max(0.28, Math.cos((lat * Math.PI) / 180));
      const rawLat = b.lat - a.lat;
      const rawLon = b.lon - a.lon;
      const tangentMagnitude = Math.hypot(rawLat, rawLon * lonScale) || 1;
      const tangentLat = rawLat / tangentMagnitude;
      const tangentLon = rawLon / tangentMagnitude;
      const normalLat = (-(rawLon * lonScale)) / tangentMagnitude;
      const normalLon = rawLat / (tangentMagnitude * lonScale || 1);

      return { lat, lon, tangentLat, tangentLon, normalLat, normalLon };
    }

    travelled += seg;
  }

  const last = points[points.length - 1];
  return {
    lat: last.lat,
    lon: last.lon,
    tangentLat: 0,
    tangentLon: 1,
    normalLat: -1,
    normalLon: 0,
  };
}

function partialRoute(points, progress) {
  if (!points?.length) return [];
  if (points.length === 1) return points.slice();

  const targetProgress = clamp(progress, 0, 1);
  const total = points.slice(1).reduce((sum, point, idx) => sum + segmentLength(points[idx], point), 0);
  if (total <= 0) return points.slice(0, 1);

  const targetDistance = total * targetProgress;
  const partial = [points[0]];
  let travelled = 0;

  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    const seg = segmentLength(a, b);
    if (seg <= 0) continue;

    if (travelled + seg >= targetDistance) {
      const local = clamp((targetDistance - travelled) / seg, 0, 1);
      partial.push({ lat: lerp(a.lat, b.lat, local), lon: lerp(a.lon, b.lon, local) });
      return partial;
    }

    partial.push(b);
    travelled += seg;
  }

  return partial;
}

function historicalLanguageRoute(snapshot, groupName) {
  const regionRoutes = HISTORICAL_LANGUAGE_ROUTES[snapshot.id] || {};
  const route = regionRoutes[groupName] || regionRoutes.__default__;

  if (!route?.points?.length) {
    return {
      start: 0.72,
      end: 1,
      points: [{ lat: snapshot.lat, lon: snapshot.lon }],
    };
  }

  const points = route.points.map((point) => ({ lat: point.lat, lon: point.lon }));
  const last = points[points.length - 1];
  if (Math.abs(last.lat - snapshot.lat) > 0.01 || Math.abs(last.lon - snapshot.lon) > 0.01) {
    points.push({ lat: snapshot.lat, lon: snapshot.lon });
  }

  return {
    start: route.start ?? 0.72,
    end: route.end ?? 1,
    points,
  };
}

function routeProgress(route, year) {
  const timelineT = smoothstep(clamp((year - YEAR_MIN) / YEAR_SPAN, 0, 1));
  return clamp(lerp(route.start ?? 0.72, route.end ?? 1, timelineT), 0.02, 1);
}

function valueNoise(regionId, dimension, categoryIndex, x) {
  const x0 = Math.floor(x);
  const x1 = x0 + 1;
  const t = x - x0;

  const n0 = signedRand(regionId, dimension, categoryIndex, "noise", x0);
  const n1 = signedRand(regionId, dimension, categoryIndex, "noise", x1);

  return lerp(n0, n1, smoothstep(t));
}

function normalizeTo100(weighted) {
  const sum = weighted.reduce((acc, item) => acc + item.value, 0);

  if (sum <= 0) {
    const fallback = weighted.length ? 100 / weighted.length : 0;
    return weighted.map((item) => ({ name: item.name, pct: fallback }));
  }

  return weighted.map((item) => ({ name: item.name, pct: (item.value / sum) * 100 }));
}

function interpolateNumericAnchors(anchors, year) {
  if (!anchors?.length) return null;

  const sorted = anchors.slice().sort((a, b) => a[0] - b[0]);

  if (year <= sorted[0][0]) return sorted[0][1];
  if (year >= sorted[sorted.length - 1][0]) return sorted[sorted.length - 1][1];

  for (let i = 0; i < sorted.length - 1; i += 1) {
    const [y0, v0] = sorted[i];
    const [y1, v1] = sorted[i + 1];
    if (year >= y0 && year <= y1) {
      const t = (year - y0) / (y1 - y0);
      return lerp(v0, v1, t);
    }
  }

  return sorted[sorted.length - 1][1];
}

function interpolateShareAnchors(anchorSeries, categoryNames, year) {
  if (!anchorSeries?.length) return null;

  const sorted = anchorSeries.slice().sort((a, b) => a.year - b.year);

  let lower = sorted[0];
  let upper = sorted[sorted.length - 1];

  if (year <= lower.year) upper = lower;
  else if (year >= upper.year) lower = upper;
  else {
    for (let i = 0; i < sorted.length - 1; i += 1) {
      const a = sorted[i];
      const b = sorted[i + 1];
      if (year >= a.year && year <= b.year) {
        lower = a;
        upper = b;
        break;
      }
    }
  }

  const t = lower.year === upper.year ? 0 : (year - lower.year) / (upper.year - lower.year);

  return categoryNames.map((name) => {
    const l = lower.shares[name] ?? 0;
    const u = upper.shares[name] ?? l;
    return { name, pct: lerp(l, u, t) };
  });
}

function getPopulationAtYear(regionId, year) {
  const anchors = POPULATION_ANCHORS[regionId];
  const v = interpolateNumericAnchors(anchors, year);
  return v == null ? 100 : v;
}

function getHistoricalLanguageShares(regionId, basePairs, year) {
  const series = LANGUAGE_ANCHORS[regionId];
  if (!series) return null;
  const categories = basePairs.map(([name]) => name);
  return interpolateShareAnchors(series, categories, year);
}

function getHistoricalAncestryShares(regionId, basePairs, year) {
  const series = ANCESTRY_PROXY_ANCHORS[regionId];
  if (!series) return null;
  const categories = basePairs.map(([name]) => name);
  return interpolateShareAnchors(series, categories, year);
}

function simulateComposition(basePairs, regionId, year, dimension, scenarioKey) {
  const _scenario = SCENARIOS[scenarioKey] || SCENARIOS.historical;
  const anchored =
    dimension === "language"
      ? getHistoricalLanguageShares(regionId, basePairs, year)
      : getHistoricalAncestryShares(regionId, basePairs, year);

  if (anchored) {
    return normalizeTo100(anchored.map((item) => ({ name: item.name, value: Math.max(item.pct, 0.01) })));
  }

  return normalizeTo100(basePairs.map(([name, pct]) => ({ name, value: pct })));
}

function shannonEvenness(composition) {
  const n = composition.length;
  if (!n) return 0;

  const entropy = composition.reduce((acc, item) => {
    const p = item.pct / 100;
    return p > 0 ? acc - p * Math.log(p) : acc;
  }, 0);

  const maxEntropy = Math.log(n);
  return maxEntropy > 0 ? (entropy / maxEntropy) * 100 : 0;
}

function getRegionById(id) {
  return REGIONS.find((region) => region.id === id) || null;
}

function scoreByDimension(snapshot, dimension) {
  if (dimension === "language") return snapshot.languageScore;
  if (dimension === "ethnic") return snapshot.ethnicScore;
  return snapshot.combinedScore;
}

function dimensionLabel(dimension) {
  if (dimension === "language") return "Language";
  if (dimension === "ethnic") return "Ancestry";
  return "Combined";
}

function formatYearLabel(year, { includeCE = false } = {}) {
  if (year < 0) return `${Math.abs(Math.round(year))} BCE`;
  if (year === 0) return "0";
  return includeCE ? `${Math.round(year)} CE` : `${Math.round(year)}`;
}

function formatYearValue(year) {
  return formatYearLabel(year);
}

function formatYearRange(startYear, endYear) {
  return `${formatYearLabel(startYear)} → ${formatYearLabel(endYear)}`;
}

function snapshotForRegion(region, year, scenarioKey) {
  const languageComp = simulateComposition(region.baseLanguages, region.id, year, "language", scenarioKey);
  const ethnicComp = simulateComposition(region.baseEthnic, region.id, year, "ethnic", scenarioKey);

  const languageScore = shannonEvenness(languageComp);
  const ethnicScore = shannonEvenness(ethnicComp);
  const combinedScore = (languageScore + ethnicScore) / 2;

  return {
    id: region.id,
    region: region.name,
    year,
    lat: region.lat,
    lon: region.lon,
    coverageNote: region.coverageNote || "",
    populationMillions: getPopulationAtYear(region.id, year),
    languageComp,
    ethnicComp,
    languageScore,
    ethnicScore,
    combinedScore,
  };
}

function getSnapshots(year, regionFilter, scenarioKey) {
  return REGIONS
    .filter((region) => regionFilter === "all" || region.id === regionFilter)
    .map((region) => snapshotForRegion(region, year, scenarioKey));
}

function mapById(snapshots) {
  return new Map(snapshots.map((snapshot) => [snapshot.id, snapshot]));
}

function sortedComposition(comp) {
  return comp.slice().sort((a, b) => b.pct - a.pct);
}

function topListHtml(comp, n = 3) {
  return sortedComposition(comp)
    .slice(0, n)
    .map((item) => `${item.name}: ${item.pct.toFixed(1)}%`)
    .join("<br>");
}

function dominantAncestryGroup(snapshot) {
  const top = sortedComposition(snapshot.ethnicComp)[0] || { name: "Unknown", pct: 0 };
  return top;
}

function topLanguageOverlayText(snapshot, n = 2) {
  return sortedComposition(snapshot.languageComp)
    .slice(0, n)
    .map((item) => `${item.name} ${item.pct.toFixed(0)}%`)
    .join("<br>");
}

function average(snapshots, key) {
  if (!snapshots.length) return 0;
  return snapshots.reduce((acc, s) => acc + s[key], 0) / snapshots.length;
}

function median(values) {
  if (!values.length) return 0;
  const sorted = values.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2) return sorted[mid];
  return (sorted[mid - 1] + sorted[mid]) / 2;
}

function stdDev(values) {
  if (!values.length) return 0;
  const avg = values.reduce((acc, value) => acc + value, 0) / values.length;
  const variance = values.reduce((acc, value) => acc + (value - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function formatDelta(value) {
  const rounded = Math.abs(value) < 0.05 ? 0 : value;
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded.toFixed(1)}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatPopulationMillions(value) {
  if (!Number.isFinite(value)) return "n/a";
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}B`;
  return `${value.toFixed(value >= 100 ? 0 : 1)}M`;
}

function compositionCardHtml(title, comp, tone) {
  const rows = sortedComposition(comp).slice(0, 4);

  return `
    <section class="map-only-card">
      <h3>${escapeHtml(title)}</h3>
      ${rows
        .map(
          (item) => `
            <div class="map-only-bar-row">
              <div class="map-only-bar-meta">
                <span>${escapeHtml(item.name)}</span>
                <strong>${item.pct.toFixed(1)}%</strong>
              </div>
              <div class="map-only-bar-track">
                <span class="map-only-bar-fill ${tone}" style="width: ${clamp(item.pct, 0, 100).toFixed(1)}%"></span>
              </div>
            </div>
          `
        )
        .join("")}
    </section>
  `;
}

function buildMapOnlyTrendSvg(regionId) {
  const region = getRegionById(regionId);
  if (!region) return "";

  const width = 296;
  const height = 92;
  const pad = 10;
  const innerWidth = width - pad * 2;
  const innerHeight = height - pad * 2;

  const xForYear = (year) => pad + ((year - YEAR_MIN) / YEAR_SPAN) * innerWidth;
  const yForValue = (value) => height - pad - (clamp(value, 0, 100) / 100) * innerHeight;

  const series = YEARS.map((year) => snapshotForRegion(region, year, state.scenarioKey));
  const current = snapshotForRegion(region, state.currentYear, state.scenarioKey);
  const currentX = xForYear(state.currentYear);
  const compareX = state.compareEnabled ? xForYear(state.compareYear) : null;

  const paths = [
    { key: "languageScore", color: "#60a5fa", width: state.dimension === "language" ? 2.8 : 1.9 },
    { key: "ethnicScore", color: "#f59e0b", width: state.dimension === "ethnic" ? 2.8 : 1.9 },
    { key: "combinedScore", color: "#22d3ee", width: state.dimension === "combined" ? 2.8 : 1.8, dash: "5 4" },
  ];

  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Regional diversity trend from ${formatYearLabel(YEAR_MIN)} to ${formatYearLabel(YEAR_MAX)}">
      <rect x="0" y="0" width="${width}" height="${height}" rx="12" fill="rgba(15, 23, 51, 0.18)"></rect>
      ${[25, 50, 75]
        .map(
          (tick) =>
            `<line x1="${pad}" x2="${width - pad}" y1="${yForValue(tick).toFixed(1)}" y2="${yForValue(tick).toFixed(1)}" stroke="rgba(148,163,184,0.22)" stroke-width="1"></line>`
        )
        .join("")}
      <line x1="${currentX.toFixed(1)}" x2="${currentX.toFixed(1)}" y1="${pad}" y2="${height - pad}" stroke="rgba(248,250,252,0.42)" stroke-width="1.2" stroke-dasharray="3 4"></line>
      ${compareX == null ? "" : `<line x1="${compareX.toFixed(1)}" x2="${compareX.toFixed(1)}" y1="${pad}" y2="${height - pad}" stroke="rgba(250,204,21,0.58)" stroke-width="1.2" stroke-dasharray="3 4"></line>`}
      ${paths
        .map((path) => {
          const d = series
            .map((point, idx) => {
              const x = xForYear(point.year);
              const y = yForValue(point[path.key]);
              return `${idx === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
            })
            .join(" ");

          return `<path d="${d}" fill="none" stroke="${path.color}" stroke-width="${path.width}" stroke-linecap="round" stroke-linejoin="round" ${path.dash ? `stroke-dasharray="${path.dash}"` : ""}></path>`;
        })
        .join("")}
      ${paths
        .map((path) => `<circle cx="${currentX.toFixed(1)}" cy="${yForValue(current[path.key]).toFixed(1)}" r="${state.dimension === path.key.replace("Score", "") ? 3.8 : 2.6}" fill="${path.color}" stroke="#f8fafc" stroke-width="0.9"></circle>`)
        .join("")}
      <text x="${pad}" y="${height - 2}" fill="rgba(203,216,251,0.76)" font-size="10">${formatYearLabel(YEAR_MIN)}</text>
      <text x="${width - pad}" y="${height - 2}" text-anchor="end" fill="rgba(203,216,251,0.76)" font-size="10">${formatYearLabel(YEAR_MAX)}</text>
    </svg>
  `;
}

function renderMapOnlyInspector(snapshot) {
  const container = byId("mapOnlyInspector");
  const title = byId("mapOnlyInspectorTitle");
  const content = byId("mapOnlyInspectorContent");
  const closeBtn = byId("mapOnlyInspectorClose");

  if (!container || !title || !content || !closeBtn) return;

  if (!isMapOnlyMode()) {
    container.hidden = true;
    return;
  }

  container.hidden = false;

  if (!snapshot) {
    title.textContent = "Region detail";
    closeBtn.hidden = true;
    content.innerHTML = `
      <p class="map-only-empty">Hover any region for a live preview, or click one to pin a richer detail card that stays visible while the timeline moves.</p>
      <p class="map-only-hint">Tip: ← and → step 25 years, Space plays or pauses, Esc clears a pinned region.</p>
    `;
    return;
  }

  const isPinned = state.selectedRegionId === snapshot.id;
  const ordered = state.currentSnapshots
    .slice()
    .sort((a, b) => scoreByDimension(b, state.dimension) - scoreByDimension(a, state.dimension));
  const rank = ordered.findIndex((item) => item.id === snapshot.id) + 1;
  const dimensionScore = scoreByDimension(snapshot, state.dimension);
  const visibleAvg = ordered.length
    ? ordered.reduce((acc, item) => acc + scoreByDimension(item, state.dimension), 0) / ordered.length
    : dimensionScore;
  const avgDelta = dimensionScore - visibleAvg;
  const topLanguage = sortedComposition(snapshot.languageComp)[0] || { name: "Unknown", pct: 0 };
  const topEthnic = dominantAncestryGroup(snapshot);
  const era = getEraInfo(snapshot.year);
  const compareSnapshot = state.compareEnabled ? getSnapshotByRegionId(snapshot.id, state.compareSnapshots) : null;
  const compareText = compareSnapshot
    ? `<small>${dimensionLabel(state.dimension)} Δ ${formatDelta(computeIntervalDelta(snapshot, compareSnapshot, state.dimension))} pp to ${formatYearLabel(compareSnapshot.year)}</small>`
    : `<small>${formatDelta(avgDelta)} vs visible average · rank #${Math.max(rank, 1)}/${Math.max(ordered.length, 1)} in ${dimensionLabel(state.dimension).toLowerCase()}</small>`;

  title.textContent = snapshot.region;
  closeBtn.hidden = !isPinned;

  content.innerHTML = `
    <p class="map-only-status ${isPinned ? "is-pinned" : ""}">
      <span class="map-only-status-dot" aria-hidden="true"></span>
      ${isPinned ? "Pinned focus card" : "Hover preview"} · year ${formatYearLabel(snapshot.year)} · ${escapeHtml(era.label)}
    </p>
    <p class="map-only-summary">
      ${dimensionLabel(state.dimension)} diversity sits at <strong>${dimensionScore.toFixed(1)}</strong>. Dominant language is <strong>${escapeHtml(topLanguage.name)}</strong> (${topLanguage.pct.toFixed(1)}%), while the strongest ancestry-proxy signal is <strong>${escapeHtml(topEthnic.name)}</strong> (${topEthnic.pct.toFixed(1)}%).
    </p>
    <p class="map-only-hint">${escapeHtml(era.note)}</p>
    <p class="map-only-hint"><strong>Coverage note:</strong> ${escapeHtml(snapshot.coverageNote)}</p>

    <div class="map-only-chip-grid">
      <div class="map-only-chip">
        <span>Language diversity</span>
        <strong>${snapshot.languageScore.toFixed(1)}</strong>
        <small>${escapeHtml(topLanguage.name)} leads</small>
      </div>
      <div class="map-only-chip">
        <span>Ancestry diversity (proxy)</span>
        <strong>${snapshot.ethnicScore.toFixed(1)}</strong>
        <small>${escapeHtml(topEthnic.name)} leads</small>
      </div>
      <div class="map-only-chip">
        <span>Combined diversity</span>
        <strong>${snapshot.combinedScore.toFixed(1)}</strong>
        ${compareText}
      </div>
      <div class="map-only-chip">
        <span>Estimated population</span>
        <strong>${formatPopulationMillions(snapshot.populationMillions)}</strong>
        <small>anchor-based regional estimate</small>
      </div>
    </div>

    <section class="map-only-trend">
      <div class="map-only-trend-head">
        <strong>Historical diversity trace</strong>
        <span>${formatYearRange(YEAR_MIN, YEAR_MAX)}</span>
      </div>
      ${buildMapOnlyTrendSvg(snapshot.id)}
      <div class="map-only-trend-legend">
        <span><i style="background:#60a5fa"></i>Language</span>
        <span><i style="background:#f59e0b"></i>Ancestry</span>
        <span><i style="background:#22d3ee"></i>Combined</span>
      </div>
    </section>

    <div class="map-only-composition-grid">
      ${compositionCardHtml("Top language groups", snapshot.languageComp, "language")}
      ${compositionCardHtml("Top ancestry groups (proxy)", snapshot.ethnicComp, "ethnic")}
    </div>

    <p class="map-only-hint">${isPinned ? "Click another region to repin, or Clear/Esc to release the card." : "Click to pin this card so it keeps tracking as the map animates."}</p>
  `;
}

function snap25(year) {
  const idx = Math.round((year - YEAR_MIN) / YEAR_STEP);
  return clamp(YEAR_MIN + idx * YEAR_STEP, YEAR_MIN, YEAR_MAX);
}

function getSnapshotByRegionId(regionId, snapshots) {
  return snapshots.find((s) => s.id === regionId) || null;
}

function computeIntervalDelta(snapshotA, snapshotB, dimension) {
  if (!snapshotA || !snapshotB) return 0;
  return scoreByDimension(snapshotB, dimension) - scoreByDimension(snapshotA, dimension);
}

function buildDeltaRows() {
  const mapB = mapById(state.compareSnapshots);
  return state.currentSnapshots
    .map((a) => ({
      region: a.region,
      id: a.id,
      scoreA: scoreByDimension(a, state.dimension),
      delta: state.compareEnabled ? computeIntervalDelta(a, mapB.get(a.id), state.dimension) : NaN,
      langA: a.languageScore,
      ethA: a.ethnicScore,
      combinedA: a.combinedScore,
    }))
    .filter((row) => Number.isFinite(row.scoreA));
}

function renderScenarioHint() {
  byId("scenarioHint").textContent = SCENARIOS[state.scenarioKey].hint;
}

function renderLegend(meta) {
  byId("legendTitle").textContent = meta.title;
  byId("legendGradient").style.background = meta.gradient;
  byId("legendMin").textContent = meta.min;
  byId("legendMid").textContent = meta.mid;
  byId("legendMax").textContent = meta.max;
}

function syncCompareYearFromOffset() {
  const target = snap25(state.currentYear + state.compareOffset);
  state.compareYear = target;
  byId("compareYearSelect").value = String(target);
}

function refreshCompareControlState() {
  const enabled = state.compareEnabled;
  const lock = state.compareLock;

  byId("compareYearSelect").disabled = !enabled || lock;
  byId("compareOffsetSelect").disabled = !enabled || !lock;
  byId("compareLockToggle").disabled = !enabled;

  if (enabled && lock) {
    syncCompareYearFromOffset();
  }
}

function applyHighContrast(enabled) {
  document.body.classList.toggle("high-contrast", enabled);
}

function persistableState() {
  return {
    currentYear: state.currentYear,
    compareYear: state.compareYear,
    compareOffset: state.compareOffset,
    compareEnabled: state.compareEnabled,
    compareLock: state.compareLock,
    regionFilter: state.regionFilter,
    dimension: state.dimension,
    sizeMode: state.sizeMode,
    colorRangeMode: state.colorRangeMode,
    projection: state.projection,
    scenarioKey: state.scenarioKey,
    deltaThreshold: state.deltaThreshold,
    animationSpeed: state.animationSpeed,
    loopMode: state.loopMode,
    playbackDirection: state.playbackDirection,
    stepSize: state.stepSize,
    snapToGrid: state.snapToGrid,
    reducedMotion: state.reducedMotion,
    highContrast: state.highContrast,
  };
}

function savePreferences() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistableState()));
  } catch (_err) {
    // ignore persistence errors
  }
}

function loadPreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);

    if (Number.isFinite(parsed.currentYear)) state.currentYear = clamp(parsed.currentYear, YEAR_MIN, YEAR_MAX);
    if (Number.isFinite(parsed.compareYear)) state.compareYear = snap25(parsed.compareYear);
    if (Number.isFinite(parsed.compareOffset)) {
      const snappedOffset = Math.round(parsed.compareOffset / YEAR_STEP) * YEAR_STEP;
      state.compareOffset = clamp(snappedOffset, -300, 300);
    }
    if (typeof parsed.compareEnabled === "boolean") state.compareEnabled = parsed.compareEnabled;
    if (typeof parsed.compareLock === "boolean") state.compareLock = parsed.compareLock;
    if (typeof parsed.regionFilter === "string") {
      const allowedRegion = parsed.regionFilter === "all" || REGIONS.some((region) => region.id === parsed.regionFilter);
      state.regionFilter = allowedRegion ? parsed.regionFilter : "all";
    }
    if (["language", "ethnic", "combined"].includes(parsed.dimension)) state.dimension = parsed.dimension;
    if (["combined", "selected"].includes(parsed.sizeMode)) state.sizeMode = parsed.sizeMode;
    if (["fixed", "auto"].includes(parsed.colorRangeMode)) state.colorRangeMode = parsed.colorRangeMode;
    if (["natural earth", "equirectangular", "orthographic"].includes(parsed.projection)) state.projection = parsed.projection;
    if (SCENARIOS[parsed.scenarioKey]) state.scenarioKey = parsed.scenarioKey;
    if (Number.isFinite(parsed.deltaThreshold)) state.deltaThreshold = clamp(parsed.deltaThreshold, 0, 2);
    if (Number.isFinite(parsed.animationSpeed)) state.animationSpeed = parsed.animationSpeed;
    if (["wrap", "bounce"].includes(parsed.loopMode)) state.loopMode = parsed.loopMode;
    if (["forward", "backward"].includes(parsed.playbackDirection)) state.playbackDirection = parsed.playbackDirection;
    if ([25, 50, 100].includes(parsed.stepSize)) state.stepSize = parsed.stepSize;
    if (typeof parsed.snapToGrid === "boolean") state.snapToGrid = parsed.snapToGrid;
    if (typeof parsed.reducedMotion === "boolean") state.reducedMotion = parsed.reducedMotion;
    if (typeof parsed.highContrast === "boolean") state.highContrast = parsed.highContrast;
  } catch (_err) {
    // ignore malformed saved state
  }
}

function resetControlsToDefaults() {
  stopAnimation();

  state.currentYear = YEAR_MIN;
  state.compareYear = 2000;
  state.compareOffset = 100;
  state.compareEnabled = false;
  state.compareLock = true;
  state.regionFilter = "all";
  state.dimension = "language";
  state.sizeMode = "combined";
  state.colorRangeMode = "fixed";
  state.projection = "natural earth";
  state.scenarioKey = "historical";
  state.deltaThreshold = 0;
  state.animationSpeed = 5;
  state.loopMode = "wrap";
  state.playbackDirection = "forward";
  state.stepSize = 25;
  state.snapToGrid = true;
  state.reducedMotion = false;
  state.highContrast = false;
  state.selectedRegionId = null;
  state.hoverRegionId = null;

  syncControlsFromState();
  applyHighContrast(false);
  renderAll();
  announce("Simulation controls reset to defaults");
}

function hoverText(snapshotA) {
  const dominant = dominantAncestryGroup(snapshotA);
  const era = getEraInfo(snapshotA.year);
  const rows = [
    `<b>${snapshotA.region}</b>`,
    `Year A: ${formatYearValue(snapshotA.year)}`,
    `Historical era: ${era.label}`,
    `Dominant ancestry group (proxy): ${dominant.name} (${dominant.pct.toFixed(1)}%)`,
    `Language diversity: ${snapshotA.languageScore.toFixed(1)}`,
    `Ancestry diversity (proxy): ${snapshotA.ethnicScore.toFixed(1)}`,
  ];

  if (state.compareEnabled) {
    const snapshotB = getSnapshotByRegionId(snapshotA.id, state.compareSnapshots);
    const delta = computeIntervalDelta(snapshotA, snapshotB, state.dimension);
    rows.push(`${dimensionLabel(state.dimension)} Δ (B−A): ${formatDelta(delta)} pp`);
  }

  rows.push(`<b>Top languages</b><br>${topListHtml(snapshotA.languageComp, 3)}`);
  rows.push(`<b>Top ancestry groups (proxy)</b><br>${topListHtml(snapshotA.ethnicComp, 3)}`);
  return rows.join("<br>");
}

function renderDetails(snapshotA) {
  const detail = byId("detailContent");

  if (!snapshotA) {
    detail.innerHTML = "<p>Click or hover a marker to inspect simulated composition details.</p>";
    return;
  }

  const topLangA = sortedComposition(snapshotA.languageComp).slice(0, 3);
  const topEthA = sortedComposition(snapshotA.ethnicComp).slice(0, 3);

  if (!state.compareEnabled) {
    detail.innerHTML = `
      <p><strong>${snapshotA.region}</strong> — Year ${formatYearValue(snapshotA.year)}</p>
      <p><strong>Historical era</strong>: ${getEraInfo(snapshotA.year).label}</p>
      <p><strong>Coverage note</strong>: ${escapeHtml(snapshotA.coverageNote)}</p>
      <p>Language diversity: ${snapshotA.languageScore.toFixed(1)}</p>
      <p>Ancestry diversity (proxy): ${snapshotA.ethnicScore.toFixed(1)}</p>
      <p><strong>Top languages</strong>: ${topLangA.map((x) => `${x.name} ${x.pct.toFixed(1)}%`).join(", ")}</p>
      <p><strong>Top ancestry groups (proxy)</strong>: ${topEthA.map((x) => `${x.name} ${x.pct.toFixed(1)}%`).join(", ")}</p>
      <p class="note">Enable compare mode to inspect interval deltas.</p>
    `;
    return;
  }

  const snapshotB = getSnapshotByRegionId(snapshotA.id, state.compareSnapshots);
  if (!snapshotB) {
    detail.innerHTML = `<p><strong>${snapshotA.region}</strong> — comparison snapshot unavailable.</p>`;
    return;
  }

  const dimDelta = computeIntervalDelta(snapshotA, snapshotB, state.dimension);
  const langDelta = snapshotB.languageScore - snapshotA.languageScore;
  const ethDelta = snapshotB.ethnicScore - snapshotA.ethnicScore;

  const topLangB = sortedComposition(snapshotB.languageComp).slice(0, 3);
  const topEthB = sortedComposition(snapshotB.ethnicComp).slice(0, 3);

  detail.innerHTML = `
    <p><strong>${snapshotA.region}</strong></p>
    <p>Year A: ${formatYearValue(snapshotA.year)} → Year B: ${formatYearValue(snapshotB.year)}</p>
    <p><strong>Coverage note</strong>: ${escapeHtml(snapshotA.coverageNote)}</p>
    <p>Selected dimension Δ: <span class="delta ${dimDelta >= 0 ? "up" : "down"}">${formatDelta(dimDelta)} pp</span></p>
    <p>Language diversity Δ: <span class="delta ${langDelta >= 0 ? "up" : "down"}">${formatDelta(langDelta)} pp</span></p>
    <p>Ancestry diversity Δ (proxy): <span class="delta ${ethDelta >= 0 ? "up" : "down"}">${formatDelta(ethDelta)} pp</span></p>
    <p><strong>Top languages A</strong>: ${topLangA.map((x) => `${x.name} ${x.pct.toFixed(1)}%`).join(", ")}</p>
    <p><strong>Top languages B</strong>: ${topLangB.map((x) => `${x.name} ${x.pct.toFixed(1)}%`).join(", ")}</p>
    <p><strong>Top ancestry groups (proxy) A</strong>: ${topEthA.map((x) => `${x.name} ${x.pct.toFixed(1)}%`).join(", ")}</p>
    <p><strong>Top ancestry groups (proxy) B</strong>: ${topEthB.map((x) => `${x.name} ${x.pct.toFixed(1)}%`).join(", ")}</p>
  `;
}

function renderStats() {
  const snapsA = state.currentSnapshots;
  const selectedValues = snapsA.map((snapshot) => scoreByDimension(snapshot, state.dimension));

  byId("statRegions").textContent = String(snapsA.length);
  byId("statLanguage").textContent = average(snapsA, "languageScore").toFixed(1);
  byId("statEthnic").textContent = average(snapsA, "ethnicScore").toFixed(1);
  byId("statCombined").textContent = average(snapsA, "combinedScore").toFixed(1);
  byId("statMedian").textContent = median(selectedValues).toFixed(1);
  byId("statStdDev").textContent = stdDev(selectedValues).toFixed(1);

  if (!state.compareEnabled) {
    byId("statCombinedDelta").textContent = "n/a";
    byId("statMover").textContent = "—";
    return;
  }

  const rows = buildDeltaRows().filter((r) => Number.isFinite(r.delta));
  const avg = rows.length ? rows.reduce((acc, row) => acc + row.delta, 0) / rows.length : 0;
  byId("statCombinedDelta").textContent = `${formatDelta(avg)} pp`;

  const eligible = rows.filter((r) => Math.abs(r.delta) >= state.deltaThreshold);
  const strongest = (eligible.length ? eligible : rows).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))[0];
  byId("statMover").textContent = strongest ? `${strongest.region} (${formatDelta(strongest.delta)} pp)` : "—";
}

function renderIntervalAnalytics() {
  const analytics = byId("analyticsContent");
  const snapsA = state.currentSnapshots;

  if (!snapsA.length) {
    analytics.innerHTML = "<p>No visible regions under current filter.</p>";
    return;
  }

  const ordered = buildDeltaRows().sort((a, b) => b.scoreA - a.scoreA);
  const top = ordered[0];
  const low = ordered[ordered.length - 1];
  const focusId = state.selectedRegionId || (state.regionFilter !== "all" ? state.regionFilter : null);
  const focusRow = focusId ? ordered.find((row) => row.id === focusId) : null;
  const focusRank = focusRow ? ordered.findIndex((row) => row.id === focusId) + 1 : null;

  if (!state.compareEnabled) {
    analytics.innerHTML = `
      <p><strong>Top ${dimensionLabel(state.dimension).toLowerCase()} diversity:</strong> ${top.region} (${top.scoreA.toFixed(1)})</p>
      <p><strong>Lowest ${dimensionLabel(state.dimension).toLowerCase()} diversity:</strong> ${low.region} (${low.scoreA.toFixed(1)})</p>
      <p><strong>Spread:</strong> ${(top.scoreA - low.scoreA).toFixed(1)} points</p>
      ${focusRow ? `<p><strong>Focus rank:</strong> #${focusRank}/${ordered.length} (${focusRow.region})</p>` : ""}
      <p class="note">Enable compare mode for gainers/decliners over interval.</p>
    `;
    return;
  }

  const rows = buildDeltaRows()
    .filter((r) => Number.isFinite(r.delta))
    .filter((r) => Math.abs(r.delta) >= state.deltaThreshold)
    .sort((a, b) => b.delta - a.delta);

  if (!rows.length) {
    analytics.innerHTML = `
      <p><strong>Interval:</strong> Year A ${state.currentYear.toFixed(1)} → Year B ${state.compareYear.toFixed(1)}</p>
      <p>No regions exceed threshold of ${state.deltaThreshold.toFixed(1)} pp.</p>
      ${focusRow ? `<p><strong>Focus rank at Year A:</strong> #${focusRank}/${ordered.length} (${focusRow.region})</p>` : ""}
    `;
    return;
  }

  const gainers = rows.slice(0, 3);
  const decliners = rows.slice(-3).reverse();

  analytics.innerHTML = `
    <p><strong>Interval:</strong> Year A ${state.currentYear.toFixed(1)} → Year B ${state.compareYear.toFixed(1)}</p>
    <p><strong>Threshold:</strong> ±${state.deltaThreshold.toFixed(1)} pp</p>
    <p><strong>Top gainers (${dimensionLabel(state.dimension).toLowerCase()})</strong></p>
    <ul>${gainers.map((x) => `<li>${x.region}: <span class="delta up">${formatDelta(x.delta)} pp</span></li>`).join("")}</ul>
    <p><strong>Top decliners (${dimensionLabel(state.dimension).toLowerCase()})</strong></p>
    <ul>${decliners
      .map((x) => `<li>${x.region}: <span class="delta ${x.delta <= 0 ? "down" : "up"}">${formatDelta(x.delta)} pp</span></li>`)
      .join("")}</ul>
    ${focusId ? `<p><strong>Focus rank at Year A:</strong> #${focusRank ?? "—"}/${ordered.length}</p>` : ""}
  `;
}

function renderMoversChart(light = false) {
  const now = Date.now();
  if (light && now - state.lastMoversRenderMs < 620) return;
  state.lastMoversRenderMs = now;

  const snapsA = state.currentSnapshots;
  if (!snapsA.length) return;

  let rows;
  let title;

  if (state.compareEnabled) {
    rows = buildDeltaRows()
      .map((r) => ({ region: r.region, value: r.delta }))
      .filter((x) => Number.isFinite(x.value))
      .filter((x) => Math.abs(x.value) >= state.deltaThreshold)
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
      .slice(0, 6);
    title = `Top interval movers (${dimensionLabel(state.dimension).toLowerCase()})`;
  } else {
    rows = buildDeltaRows()
      .map((r) => ({ region: r.region, value: r.scoreA }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
    title = `Top regions (${dimensionLabel(state.dimension).toLowerCase()})`;
  }

  if (!rows.length) {
    Plotly.react(
      "moversChart",
      [],
      {
        margin: { l: 16, r: 12, t: 30, b: 24 },
        title: { text: `${title} — no data at current threshold`, font: { size: 12, color: "#dce7ff" }, x: 0.02 },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
      },
      { responsive: true, displayModeBar: false }
    );
    return;
  }

  const trace = {
    type: "bar",
    orientation: "h",
    y: rows.map((x) => x.region).reverse(),
    x: rows.map((x) => x.value).reverse(),
    marker: {
      color: rows
        .map((x) => {
          if (!state.compareEnabled) return "rgba(96,165,250,0.85)";
          return x.value >= 0 ? "rgba(52,211,153,0.82)" : "rgba(248,113,113,0.82)";
        })
        .reverse(),
      line: { color: "rgba(226,232,240,0.6)", width: 0.6 },
    },
    text: rows
      .map((x) => (state.compareEnabled ? `${formatDelta(x.value)} pp` : x.value.toFixed(1)))
      .reverse(),
    textposition: "outside",
    hovertemplate: state.compareEnabled
      ? "%{y}<br>Δ (B−A): %{x:.1f} pp<extra></extra>"
      : "%{y}<br>Score: %{x:.1f}<extra></extra>",
  };

  const maxAbs = Math.max(8, ...rows.map((r) => Math.abs(r.value))) * 1.22;

  Plotly.react(
    "moversChart",
    [trace],
    {
      margin: { l: 96, r: 12, t: 26, b: 24 },
      title: { text: title, font: { size: 12, color: "#dce7ff" }, x: 0.02 },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      font: { color: "#d9e5ff", size: 10 },
      xaxis: {
        range: state.compareEnabled ? [-maxAbs, maxAbs] : [0, 100],
        gridcolor: "#33487b",
        zeroline: false,
        tickfont: { size: 10 },
      },
      yaxis: { tickfont: { size: 10 }, automargin: true },
    },
    { responsive: true, displayModeBar: false }
  );
}

function renderDistributionChart(light = false) {
  const now = Date.now();
  if (light && now - state.lastDistributionRenderMs < 650) return;
  state.lastDistributionRenderMs = now;

  const rows = buildDeltaRows();
  if (!rows.length) return;

  const values = state.compareEnabled
    ? rows
        .filter((row) => Number.isFinite(row.delta))
        .filter((row) => Math.abs(row.delta) >= state.deltaThreshold)
        .map((row) => row.delta)
    : rows.map((row) => row.scoreA);

  const title = state.compareEnabled
    ? `${dimensionLabel(state.dimension)} interval distribution`
    : `${dimensionLabel(state.dimension)} score distribution`;

  if (!values.length) {
    Plotly.react(
      "distributionChart",
      [],
      {
        margin: { l: 24, r: 12, t: 28, b: 26 },
        title: { text: `${title} — no data at threshold`, font: { size: 12, color: "#dce7ff" }, x: 0.02 },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
      },
      { responsive: true, displayModeBar: false }
    );
    return;
  }

  const histogram = {
    type: "histogram",
    x: values,
    marker: {
      color: state.compareEnabled ? "rgba(129,140,248,0.72)" : "rgba(96,165,250,0.76)",
      line: { color: "rgba(226,232,240,0.55)", width: 0.5 },
    },
    nbinsx: Math.min(10, Math.max(4, Math.round(Math.sqrt(values.length) + 1))),
    hovertemplate: state.compareEnabled ? "Δ bin: %{x:.1f}<br>Count: %{y}<extra></extra>" : "Score bin: %{x:.1f}<br>Count: %{y}<extra></extra>",
    opacity: 0.9,
  };

  const avg = values.reduce((acc, value) => acc + value, 0) / values.length;

  Plotly.react(
    "distributionChart",
    [histogram],
    {
      margin: { l: 28, r: 12, t: 26, b: 26 },
      title: { text: title, font: { size: 12, color: "#dce7ff" }, x: 0.02 },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      font: { color: "#d9e5ff", size: 10 },
      xaxis: {
        title: { text: state.compareEnabled ? "Delta (pp)" : "Score" },
        gridcolor: "#33487b",
        zeroline: false,
      },
      yaxis: { title: { text: "Regions" }, gridcolor: "#33487b", zeroline: false },
      shapes: [
        {
          type: "line",
          x0: avg,
          x1: avg,
          y0: 0,
          y1: 1,
          yref: "paper",
          line: { color: "#facc15", width: 1.2, dash: "dot" },
        },
      ],
      annotations: [
        {
          x: avg,
          y: 1,
          yref: "paper",
          text: `mean ${avg.toFixed(1)}`,
          showarrow: false,
          yshift: 10,
          font: { size: 9, color: "#facc15" },
        },
      ],
    },
    { responsive: true, displayModeBar: false }
  );
}

function renderRegionTable(light = false) {
  const now = Date.now();
  if (light && now - state.lastTableRenderMs < 520) return;
  state.lastTableRenderMs = now;

  const container = byId("regionTable");
  const rows = buildDeltaRows()
    .map((row) => ({
      ...row,
      absDelta: Number.isFinite(row.delta) ? Math.abs(row.delta) : 0,
    }))
    .sort((a, b) => {
      if (!state.compareEnabled) return b.scoreA - a.scoreA;
      return b.absDelta - a.absDelta;
    });

  if (!rows.length) {
    container.innerHTML = "<p>No rows.</p>";
    return;
  }

  const body = rows
    .map((row) => {
      const deltaText = state.compareEnabled ? `${formatDelta(row.delta)} pp` : "—";
      const cls = !state.compareEnabled ? "" : row.delta >= 0 ? "up" : "down";
      const selectedCls = state.selectedRegionId === row.id ? "is-selected" : "";
      return `<tr class="${selectedCls}" data-region-id="${row.id}" tabindex="0" role="button" aria-label="Focus ${row.region}"><td>${row.region}</td><td>${row.scoreA.toFixed(1)}</td><td class="delta ${cls}">${deltaText}</td></tr>`;
    })
    .join("");

  container.innerHTML = `
    <table>
      <caption class="sr-only">Visible region ranking table for ${dimensionLabel(state.dimension).toLowerCase()} scores</caption>
      <thead>
        <tr>
          <th scope="col">Region</th>
          <th scope="col">${dimensionLabel(state.dimension)} score</th>
          <th scope="col">Δ (B−A)</th>
        </tr>
      </thead>
      <tbody>${body}</tbody>
    </table>
  `;

  const focusRegion = (regionId) => {
    state.selectedRegionId = regionId;
    state.hoverRegionId = null;
    renderAll();
    announce(`Focused ${getRegionById(regionId)?.name || "region"}`);
  };

  container.querySelectorAll("tr[data-region-id]").forEach((rowEl) => {
    rowEl.addEventListener("click", () => focusRegion(rowEl.dataset.regionId));
    rowEl.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      focusRegion(rowEl.dataset.regionId);
    });
  });
}

function renderTrendChart(light = false) {
  const now = Date.now();
  if (light && now - state.lastTrendRenderMs < 450) return;
  state.lastTrendRenderMs = now;

  const focusRegionId = state.selectedRegionId || (state.regionFilter !== "all" ? state.regionFilter : null);

  const series = YEARS.map((year) => {
    const snaps = focusRegionId
      ? [snapshotForRegion(getRegionById(focusRegionId), year, state.scenarioKey)]
      : getSnapshots(year, state.regionFilter, state.scenarioKey);

    return {
      year,
      language: average(snaps, "languageScore"),
      ethnic: average(snaps, "ethnicScore"),
      combined: average(snaps, "combinedScore"),
    };
  });

  const traces = [
    {
      type: "scatter",
      mode: "lines",
      x: series.map((p) => p.year),
      y: series.map((p) => p.language),
      line: { color: "#60a5fa", width: state.dimension === "language" ? 2.6 : 2.1 },
      name: "Language",
    },
    {
      type: "scatter",
      mode: "lines",
      x: series.map((p) => p.year),
      y: series.map((p) => p.ethnic),
      line: { color: "#f59e0b", width: state.dimension === "ethnic" ? 2.6 : 2.1 },
      name: "Ancestry",
    },
    {
      type: "scatter",
      mode: "lines",
      x: series.map((p) => p.year),
      y: series.map((p) => p.combined),
      line: { color: "#22d3ee", width: state.dimension === "combined" ? 2.8 : 1.8, dash: "dash" },
      name: "Combined",
    },
  ];

  const shapes = [
    {
      type: "line",
      x0: state.currentYear,
      x1: state.currentYear,
      y0: 0,
      y1: 100,
      line: { color: "#94a3b8", width: 1, dash: "dot" },
    },
  ];

  if (state.compareEnabled) {
    shapes.push({
      type: "line",
      x0: state.compareYear,
      x1: state.compareYear,
      y0: 0,
      y1: 100,
      line: { color: "#facc15", width: 1, dash: "dot" },
    });
  }

  Plotly.react(
    "trendChart",
    traces,
    {
      margin: { l: 36, r: 12, t: 28, b: 30 },
      title: {
        text: focusRegionId ? `${getRegionById(focusRegionId).name} trend` : "Visible-region average trend",
        font: { size: 12, color: "#dce7ff" },
        x: 0.02,
      },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      font: { color: "#d9e5ff", size: 11 },
      xaxis: {
        tickmode: "array",
        tickvals: YEARS.filter((y) => (y - YEAR_MIN) % 100 === 0),
        ticktext: YEARS.filter((y) => (y - YEAR_MIN) % 100 === 0).map((y) => formatYearLabel(y)),
        showgrid: false,
        zeroline: false,
        tickfont: { size: 10 },
      },
      yaxis: { range: [0, 100], gridcolor: "#33487b", zeroline: false, tickfont: { size: 10 } },
      legend: { orientation: "h", x: 0.02, y: 1.18, bgcolor: "rgba(0,0,0,0)", font: { size: 10 } },
      shapes,
    },
    { responsive: true, displayModeBar: false }
  );
}

function bindMapEventsIfNeeded() {
  if (state.mapEventsBound) return;

  const map = byId("map");

  map.on("plotly_click", (eventData) => {
    const snapshot = eventData.points?.[0]?.customdata || null;
    if (!snapshot) return;

    state.selectedRegionId = snapshot.id;
    state.hoverRegionId = null;
    renderAll();
  });

  map.on("plotly_hover", (eventData) => {
    if (state.selectedRegionId) return;
    const snapshot = eventData.points?.[0]?.customdata || null;
    if (!snapshot) return;
    state.hoverRegionId = snapshot.id;
    renderPanelFromState();
  });

  map.on("plotly_unhover", () => {
    if (state.selectedRegionId) return;
    state.hoverRegionId = null;
    renderPanelFromState();
  });

  state.mapEventsBound = true;
}

function renderMap(light = false) {
  const now = Date.now();
  if (light && now - state.lastMapRenderMs < 120) return;
  state.lastMapRenderMs = now;

  const snapsA = state.currentSnapshots;
  const mapB = mapById(state.compareSnapshots);
  const mapOnly = isMapOnlyMode();

  let traces = [];
  let legendMeta;

  if (mapOnly) {
    const branchLines = [];
    const groupedPoints = new Map();
    const timelineT = smoothstep(clamp((state.currentYear - YEAR_MIN) / YEAR_SPAN, 0, 1));

    snapsA.forEach((snapshot) => {
      const topLangs = sortedComposition(snapshot.languageComp).slice(0, 4);

      topLangs.forEach((lang, idx) => {
        const route = historicalLanguageRoute(snapshot, lang.name);
        const travel = routeProgress(route, state.currentYear);
        const corridor = partialRoute(route.points, travel);
        const anchor = routePoint(route.points, travel);
        const speakersM = (snapshot.populationMillions || 100) * (lang.pct / 100);
        const dotCount = Math.round(clamp(Math.sqrt(Math.max(1, speakersM)) / 2, 1, 12));
        const tailSpan = 0.08 + timelineT * 0.22;
        const crossSpread = 0.12 + idx * 0.04 + timelineT * 0.06;
        const lineColor = rgbaFromHex(colorForGroup(lang.name), 0.24);

        branchLines.push({
          type: "scattergeo",
          mode: "lines",
          lat: corridor.map((point) => point.lat),
          lon: corridor.map((point) => point.lon),
          hoverinfo: "skip",
          line: { color: lineColor, width: 0.9 + lang.pct * 0.028 },
          showlegend: false,
        });

        if (!groupedPoints.has(lang.name)) groupedPoints.set(lang.name, []);

        for (let j = 0; j < dotCount; j += 1) {
          const positionSeed = (j + 1) / (dotCount + 1);
          const along = clamp(
            travel - tailSpan * (1 - positionSeed) + signedRand(snapshot.id, lang.name, j, "route-position") * 0.018,
            Math.max(0.02, travel - tailSpan),
            travel
          );
          const point = routePoint(route.points, along);
          const crossOffset = signedRand(snapshot.id, lang.name, j, "route-cross") * crossSpread;
          const alongOffset = signedRand(snapshot.id, lang.name, j, "route-forward") * 0.08;

          const lat = point.lat + point.normalLat * crossOffset + point.tangentLat * alongOffset;
          const lon = point.lon + point.normalLon * crossOffset + point.tangentLon * alongOffset;

          groupedPoints.get(lang.name).push({
            snapshot,
            pct: lang.pct,
            lat,
            lon,
            group: lang.name,
            speakersM,
            dotCount,
            anchorLat: anchor.lat,
            anchorLon: anchor.lon,
          });
        }
      });
    });

    const languageTraces = Array.from(groupedPoints.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .map(([groupName, points]) => ({
        type: "scattergeo",
        mode: "markers",
        name: groupName,
        lat: points.map((p) => p.lat),
        lon: points.map((p) => p.lon),
        text: points.map((p) => {
          return `<b>${p.snapshot.region}</b><br>Year: ${formatYearValue(p.snapshot.year)}<br>Language group: ${p.group} (${p.pct.toFixed(1)}%)<br>Estimated speakers: ${p.speakersM.toFixed(1)}M<br>Broad route: historically anchored corridor<br>Dot density for this group: ${p.dotCount}<br><b>Top language mix</b><br>${topListHtml(
            p.snapshot.languageComp,
            3
          )}<br><b>Top ancestry groups (proxy)</b><br>${topListHtml(p.snapshot.ethnicComp, 2)}`;
        }),
        hovertemplate: "%{text}<extra></extra>",
        customdata: points.map((p) => p.snapshot),
        marker: {
          color: colorForGroup(groupName),
          size: points.map((p) => 4.2 + Math.sqrt(Math.max(0.2, p.speakersM)) * 0.55),
          opacity: 0.88,
          line: { color: "#e9eefc", width: 0.45 },
        },
        showlegend: true,
      }));

    traces = [...branchLines, ...languageTraces];

    const groupsShown = Array.from(groupedPoints.keys())
      .slice(0, 4)
      .join(" · ");

    legendMeta = {
      title: `Historical language corridors · ${formatYearLabel(state.currentYear)} · density≈speakers`,
      gradient: "linear-gradient(90deg, #e11d48, #f59e0b, #84cc16, #10b981, #06b6d4, #6366f1, #d946ef)",
      min: groupsShown || "—",
      mid: "broad historically anchored routes",
      max: `${groupedPoints.size} groups`,
    };

    const selected = state.selectedRegionId ? getSnapshotByRegionId(state.selectedRegionId, snapsA) : null;
    if (selected) {
      const dominant = sortedComposition(selected.languageComp)[0];
      const route = dominant ? historicalLanguageRoute(selected, dominant.name) : null;
      const highlight = route ? routePoint(route.points, routeProgress(route, state.currentYear)) : selected;

      traces.push({
        type: "scattergeo",
        mode: "markers",
        lat: [highlight.lat],
        lon: [highlight.lon],
        hoverinfo: "skip",
        marker: {
          size: 32,
          symbol: "circle-open",
          color: "#f8fafc",
          line: { color: "#f8fafc", width: 2 },
        },
        showlegend: false,
      });
    }
  } else {
    let colorValues;
    let colorscale;
    let cmin;
    let cmax;
    let colorTitle;

    if (state.compareEnabled) {
      colorValues = snapsA.map((a) => computeIntervalDelta(a, mapB.get(a.id), state.dimension));

      const maxAbsAuto = Math.max(5, ...colorValues.map((v) => Math.abs(v))) * 1.1;
      const maxAbs = state.colorRangeMode === "auto" ? maxAbsAuto : 20;

      colorscale = "RdBu";
      cmin = -maxAbs;
      cmax = maxAbs;
      colorTitle = `${dimensionLabel(state.dimension)} Δ (B−A)`;

      legendMeta = {
        title: `${colorTitle} (pp, ${state.colorRangeMode})`,
        gradient: "linear-gradient(90deg, #313695, #74add1, #f7f7f7, #f46d43, #a50026)",
        min: `${(-maxAbs).toFixed(1)}`,
        mid: "0",
        max: `${maxAbs.toFixed(1)}`,
      };
    } else {
      colorValues = snapsA.map((a) => scoreByDimension(a, state.dimension));
      colorscale = "Turbo";

      if (state.colorRangeMode === "auto" && colorValues.length) {
        const min = Math.min(...colorValues);
        const max = Math.max(...colorValues);
        const pad = Math.max(1.5, (max - min) * 0.08);
        cmin = clamp(min - pad, 0, 100);
        cmax = clamp(max + pad, 0, 100);
        if (cmax - cmin < 3) {
          cmin = Math.max(0, cmin - 1.5);
          cmax = Math.min(100, cmax + 1.5);
        }
      } else {
        cmin = 0;
        cmax = 100;
      }

      colorTitle = `${dimensionLabel(state.dimension)} diversity`;

      legendMeta = {
        title: `${colorTitle} (${state.colorRangeMode})`,
        gradient: "linear-gradient(90deg, #440154, #3b528b, #21918c, #5ec962, #fde725)",
        min: `${cmin.toFixed(1)}`,
        mid: `${((cmin + cmax) / 2).toFixed(1)}`,
        max: `${cmax.toFixed(1)}`,
      };
    }

    const sizeValues = snapsA.map((a) => {
      if (state.sizeMode === "combined") return a.combinedScore;
      if (state.compareEnabled) {
        return Math.abs(computeIntervalDelta(a, mapB.get(a.id), state.dimension)) * 2;
      }
      return scoreByDimension(a, state.dimension);
    });

    const markerSizes = sizeValues.map((v) => 8 + Math.sqrt(clamp(v, 0, 100)) * 2.05);
    const selected = state.selectedRegionId ? getSnapshotByRegionId(state.selectedRegionId, snapsA) : null;

    traces = [
      {
        type: "scattergeo",
        mode: "markers",
        lat: snapsA.map((s) => s.lat),
        lon: snapsA.map((s) => s.lon),
        text: snapsA.map(hoverText),
        hovertemplate: "%{text}<extra></extra>",
        customdata: snapsA,
        marker: {
          color: colorValues,
          size: markerSizes,
          colorscale,
          cmin,
          cmax,
          opacity: 0.92,
          line: { color: "#e9eefc", width: 0.7 },
          colorbar: {
            title: { text: colorTitle, side: "right", font: { color: "#dce7ff", size: 11 } },
            thickness: 11,
            len: 0.56,
            x: 1.03,
            tickfont: { color: "#dce7ff", size: 10 },
          },
        },
      },
    ];

    if (selected) {
      traces.push({
        type: "scattergeo",
        mode: "markers",
        lat: [selected.lat],
        lon: [selected.lon],
        hoverinfo: "skip",
        marker: {
          size: 30,
          symbol: "circle-open",
          color: "#f8fafc",
          line: { color: "#f8fafc", width: 2 },
        },
        showlegend: false,
      });
    }
  }

  if (legendMeta) renderLegend(legendMeta);

  Plotly.react(
    "map",
    traces,
    {
      margin: { l: 0, r: 0, t: 8, b: 0 },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      font: { color: "#e8eeff" },
      showlegend: mapOnly,
      legend: mapOnly
        ? {
            orientation: "v",
            x: 0.01,
            y: 0.99,
            bgcolor: "rgba(12,16,40,0.75)",
            bordercolor: "#2f437b",
            borderwidth: 1,
            font: { size: 11, color: "#e8eeff" },
          }
        : undefined,
      geo: {
        projection: { type: state.projection },
        showland: true,
        landcolor: "#0f1838",
        showocean: true,
        oceancolor: "#0c1028",
        showcountries: true,
        countrycolor: "#1f2d55",
        bgcolor: "#0f1838",
      },
    },
    { responsive: true, displayModeBar: false }
  );

  bindMapEventsIfNeeded();
}

function renderPanelFromState() {

  const chosen = state.selectedRegionId
    ? getSnapshotByRegionId(state.selectedRegionId, state.currentSnapshots)
    : state.hoverRegionId
    ? getSnapshotByRegionId(state.hoverRegionId, state.currentSnapshots)
    : state.regionFilter !== "all"
    ? getSnapshotByRegionId(state.regionFilter, state.currentSnapshots)
    : null;

  renderDetails(chosen);
  renderMapOnlyInspector(chosen);
}

function setPlaying(playing) {
  state.playing = playing;
  ["playBtn", "mapPlayBtn"].forEach((id) => {
    const btn = byId(id);
    if (!btn) return;
    btn.textContent = playing ? "Pause" : "Play";
    btn.setAttribute("aria-pressed", String(playing));
  });
}

function stopAnimation() {
  if (state.rafId) {
    cancelAnimationFrame(state.rafId);
    state.rafId = null;
  }
  state.lastTickTs = null;
  setPlaying(false);
  announce("Animation paused");
}

function animateStep(current, deltaYears) {
  const baseDirection = state.playbackDirection === "backward" ? -1 : 1;

  if (state.loopMode === "bounce") {
    let next = current + deltaYears * state.playDirection;

    if (next > YEAR_MAX) {
      next = YEAR_MAX - (next - YEAR_MAX);
      state.playDirection = -1;
    } else if (next < YEAR_MIN) {
      next = YEAR_MIN + (YEAR_MIN - next);
      state.playDirection = 1;
    }

    return clamp(next, YEAR_MIN, YEAR_MAX);
  }

  let next = current + deltaYears * baseDirection;
  if (next > YEAR_MAX) next = YEAR_MIN + ((next - YEAR_MIN) % YEAR_SPAN);
  if (next < YEAR_MIN) next = YEAR_MAX - ((YEAR_MIN - next) % YEAR_SPAN);
  return next;
}

function animationTick(ts) {
  if (!state.playing) return;

  if (state.lastTickTs == null) state.lastTickTs = ts;
  const dtSec = (ts - state.lastTickTs) / 1000;
  state.lastTickTs = ts;

  const slider = byId("yearSlider");
  const current = Number(slider.value);
  const effectiveSpeed = state.reducedMotion ? state.animationSpeed * 0.35 : state.animationSpeed;
  const next = animateStep(current, dtSec * effectiveSpeed);

  slider.value = String(next);
  byId("yearValue").textContent = next.toFixed(1);

  renderAll(true);
  state.rafId = requestAnimationFrame(animationTick);
}

function startAnimation() {
  if (state.playing) return;
  setPlaying(true);
  state.playDirection = state.playbackDirection === "backward" ? -1 : 1;
  state.lastTickTs = null;
  announce(`Animation playing ${state.playbackDirection}`);
  state.rafId = requestAnimationFrame(animationTick);
}

function toggleAnimation() {
  if (state.playing) stopAnimation();
  else startAnimation();
}

function stepDiscrete(direction) {
  const slider = byId("yearSlider");
  const current = Number(slider.value);
  const anchor = state.snapToGrid ? snap25(current) : current;
  const step = state.stepSize;
  const next = clamp(anchor + direction * step, YEAR_MIN, YEAR_MAX);
  slider.value = String(state.snapToGrid ? snap25(next) : next);
  renderAll();
}

function exportVisibleCsv() {
  const mapB = mapById(state.compareSnapshots);
  const header = [
    "region",
    "year_a",
    "year_b",
    "scenario",
    "dimension",
    "score_a",
    "delta_b_minus_a",
    "language_a",
    "ancestry_proxy_a",
    "combined_a",
  ];

  const rows = state.currentSnapshots
    .map((a) => {
      const b = mapB.get(a.id);
      return [
        a.region,
        state.currentYear.toFixed(1),
        state.compareEnabled ? state.compareYear.toFixed(1) : "",
        state.scenarioKey,
        state.dimension,
        scoreByDimension(a, state.dimension).toFixed(2),
        state.compareEnabled ? computeIntervalDelta(a, b, state.dimension).toFixed(2) : "",
        a.languageScore.toFixed(2),
        a.ethnicScore.toFixed(2),
        a.combinedScore.toFixed(2),
      ];
    })
    .map((row) => row.map((cell) => {
      const text = String(cell ?? "");
      return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    }).join(","));

  const csv = [header.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `world-timeline-${state.scenarioKey}-${state.currentYear}${state.compareEnabled ? `-vs-${state.compareYear}` : ""}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  announce("CSV exported");
}

function updateRuntimeStatus() {
  const status = byId("runtimeStatus");
  if (!status) return;

  const mode = state.compareEnabled
    ? `${formatYearLabel(state.currentYear)} → ${formatYearLabel(state.compareYear)} (${dimensionLabel(state.dimension)} Δ)`
    : `Year ${formatYearLabel(state.currentYear)} (${dimensionLabel(state.dimension)})`;

  const motion = state.reducedMotion ? "reduced motion" : "full motion";
  const contrast = state.highContrast ? "high contrast" : "standard contrast";

  status.textContent = `${mode} · ${getEraInfo(state.currentYear).label} · step ${state.stepSize}y · ${motion} · ${contrast} · render ${state.lastRenderDurationMs.toFixed(1)}ms`;
}

function renderAll(light = false) {
  const renderStart = performance.now();

  state.currentYear = clamp(Number(byId("yearSlider").value), YEAR_MIN, YEAR_MAX);
  state.compareYear = Number(byId("compareYearSelect").value);
  state.compareEnabled = byId("compareToggle").checked;
  state.compareLock = byId("compareLockToggle").checked;
  state.compareOffset = Number(byId("compareOffsetSelect").value);
  state.regionFilter = byId("regionSelect").value;
  state.dimension = byId("dimensionSelect").value;
  state.sizeMode = byId("sizeModeSelect").value;
  state.colorRangeMode = byId("colorRangeModeSelect").value;
  state.projection = byId("projectionSelect").value;
  state.scenarioKey = byId("scenarioSelect").value;
  state.deltaThreshold = Number(byId("deltaThresholdSelect").value);
  state.playbackDirection = byId("playDirectionSelect").value;
  state.stepSize = Number(byId("stepSizeSelect").value);
  state.snapToGrid = byId("snapToGridToggle").checked;
  state.reducedMotion = byId("reducedMotionToggle").checked;
  state.highContrast = byId("highContrastToggle").checked;

  applyHighContrast(state.highContrast);

  if (state.snapToGrid && !state.playing) {
    state.currentYear = snap25(state.currentYear);
    byId("yearSlider").value = String(state.currentYear);
  }

  if (state.compareEnabled && state.compareLock) {
    syncCompareYearFromOffset();
  }

  refreshCompareControlState();

  byId("yearValue").textContent = state.currentYear.toFixed(1);
  const mapYearSlider = byId("mapYearSlider");
  if (mapYearSlider) mapYearSlider.value = String(state.currentYear);
  const mapYearValue = byId("mapYearValue");
  if (mapYearValue) mapYearValue.textContent = state.currentYear.toFixed(1);

  const snapsA = getSnapshots(state.currentYear, state.regionFilter, state.scenarioKey);
  const snapsB = state.compareEnabled ? getSnapshots(state.compareYear, state.regionFilter, state.scenarioKey) : [];

  state.currentSnapshots = snapsA;
  state.compareSnapshots = snapsB;

  if (state.selectedRegionId && !getSnapshotByRegionId(state.selectedRegionId, snapsA)) {
    state.selectedRegionId = null;
  }

  renderScenarioHint();
  renderStats();
  renderIntervalAnalytics();
  renderMap(light);
  renderPanelFromState();
  renderMoversChart(light);
  renderDistributionChart(light);
  renderRegionTable(light);
  renderTrendChart(light);

  state.lastRenderDurationMs = performance.now() - renderStart;
  updateRuntimeStatus();

  if (!light) savePreferences();
}

function buildRegionSelect() {
  const select = byId("regionSelect");
  select.innerHTML = "";

  const all = document.createElement("option");
  all.value = "all";
  all.textContent = "All regions";
  select.appendChild(all);

  REGIONS.forEach((region) => {
    const opt = document.createElement("option");
    opt.value = region.id;
    opt.textContent = region.name;
    select.appendChild(opt);
  });
}

function buildCompareYearSelect() {
  const select = byId("compareYearSelect");
  select.innerHTML = "";

  YEARS.forEach((year) => {
    const opt = document.createElement("option");
    opt.value = String(year);
    opt.textContent = formatYearLabel(year);
    select.appendChild(opt);
  });

  select.value = "2000";
}

function buildOffsetSelect() {
  const select = byId("compareOffsetSelect");
  select.innerHTML = "";

  for (let offset = -300; offset <= 300; offset += 25) {
    const opt = document.createElement("option");
    opt.value = String(offset);
    opt.textContent = `${offset >= 0 ? "+" : ""}${offset}`;
    select.appendChild(opt);
  }

  select.value = "100";
}

function syncControlsFromState() {
  const slider = byId("yearSlider");
  slider.value = String(state.currentYear);
  byId("yearValue").textContent = formatYearValue(state.currentYear);

  const mapYearSlider = byId("mapYearSlider");
  if (mapYearSlider) mapYearSlider.value = String(state.currentYear);
  const mapYearValue = byId("mapYearValue");
  if (mapYearValue) mapYearValue.textContent = formatYearValue(state.currentYear);

  byId("speedSelect").value = String(state.animationSpeed);
  byId("loopModeSelect").value = state.loopMode;
  byId("playDirectionSelect").value = state.playbackDirection;
  byId("dimensionSelect").value = state.dimension;
  byId("sizeModeSelect").value = state.sizeMode;
  byId("colorRangeModeSelect").value = state.colorRangeMode;
  byId("projectionSelect").value = state.projection;
  byId("scenarioSelect").value = state.scenarioKey;
  byId("compareToggle").checked = state.compareEnabled;
  byId("compareLockToggle").checked = state.compareLock;
  byId("compareOffsetSelect").value = String(state.compareOffset);
  byId("compareYearSelect").value = String(snap25(state.compareYear));
  byId("deltaThresholdSelect").value = String(state.deltaThreshold);
  byId("regionSelect").value = state.regionFilter;
  byId("stepSizeSelect").value = String(state.stepSize);
  byId("snapToGridToggle").checked = state.snapToGrid;
  byId("reducedMotionToggle").checked = state.reducedMotion;
  byId("highContrastToggle").checked = state.highContrast;

  applyHighContrast(state.highContrast);
}

function initControls() {
  const slider = byId("yearSlider");
  slider.min = String(YEAR_MIN);
  slider.max = String(YEAR_MAX);
  slider.step = "1";

  syncControlsFromState();

  slider.addEventListener("input", () => renderAll(true));

  const mapYearSlider = byId("mapYearSlider");
  if (mapYearSlider) {
    mapYearSlider.min = String(YEAR_MIN);
    mapYearSlider.max = String(YEAR_MAX);
    mapYearSlider.step = "1";
    mapYearSlider.value = String(state.currentYear);
    mapYearSlider.addEventListener("input", () => {
      slider.value = mapYearSlider.value;
      renderAll(true);
    });
  }

  byId("speedSelect").addEventListener("change", (e) => {
    state.animationSpeed = Number(e.target.value);
    announce(`Animation speed ${e.target.options[e.target.selectedIndex].text}`);
    renderAll();
  });

  byId("loopModeSelect").addEventListener("change", (e) => {
    state.loopMode = e.target.value;
    announce(`Loop mode ${state.loopMode}`);
    renderAll();
  });

  byId("playDirectionSelect").addEventListener("change", (e) => {
    state.playbackDirection = e.target.value;
    if (state.playing) state.playDirection = state.playbackDirection === "backward" ? -1 : 1;
    announce(`Playback direction ${state.playbackDirection}`);
    renderAll();
  });

  byId("dimensionSelect").addEventListener("change", () => renderAll());
  byId("sizeModeSelect").addEventListener("change", () => renderAll());
  byId("colorRangeModeSelect").addEventListener("change", () => renderAll());
  byId("projectionSelect").addEventListener("change", () => renderAll());
  byId("scenarioSelect").addEventListener("change", () => renderAll());
  byId("regionSelect").addEventListener("change", () => renderAll());
  byId("deltaThresholdSelect").addEventListener("change", () => renderAll());

  byId("stepSizeSelect").addEventListener("change", () => {
    announce(`Step size ${byId("stepSizeSelect").value} years`);
    renderAll();
  });

  byId("snapToGridToggle").addEventListener("change", () => {
    announce(byId("snapToGridToggle").checked ? "Timeline snapping enabled" : "Timeline snapping disabled");
    renderAll();
  });

  byId("reducedMotionToggle").addEventListener("change", () => {
    if (byId("reducedMotionToggle").checked && state.playing) {
      stopAnimation();
    }
    announce(byId("reducedMotionToggle").checked ? "Reduced motion enabled" : "Reduced motion disabled");
    renderAll();
  });

  byId("highContrastToggle").addEventListener("change", () => {
    announce(byId("highContrastToggle").checked ? "High contrast enabled" : "High contrast disabled");
    renderAll();
  });

  byId("compareToggle").addEventListener("change", () => {
    renderAll();
    announce(byId("compareToggle").checked ? "Compare mode enabled" : "Compare mode disabled");
  });

  byId("compareLockToggle").addEventListener("change", () => {
    renderAll();
    announce(byId("compareLockToggle").checked ? "Year B offset lock enabled" : "Year B offset lock disabled");
  });

  byId("compareOffsetSelect").addEventListener("change", () => renderAll());
  byId("compareYearSelect").addEventListener("change", () => renderAll());

  byId("prevYearBtn").addEventListener("click", () => stepDiscrete(-1));
  byId("nextYearBtn").addEventListener("click", () => stepDiscrete(1));
  byId("playBtn").addEventListener("click", toggleAnimation);
  const mapPrevYearBtn = byId("mapPrevYearBtn");
  if (mapPrevYearBtn) mapPrevYearBtn.addEventListener("click", () => stepDiscrete(-1));
  const mapNextYearBtn = byId("mapNextYearBtn");
  if (mapNextYearBtn) mapNextYearBtn.addEventListener("click", () => stepDiscrete(1));
  const mapPlayBtn = byId("mapPlayBtn");
  if (mapPlayBtn) mapPlayBtn.addEventListener("click", toggleAnimation);
  byId("exportCsvBtn").addEventListener("click", exportVisibleCsv);
  byId("resetViewBtn").addEventListener("click", resetControlsToDefaults);

  const inspectorClose = byId("mapOnlyInspectorClose");
  if (inspectorClose) {
    inspectorClose.addEventListener("click", () => {
      state.selectedRegionId = null;
      state.hoverRegionId = null;
      renderAll();
      announce("Pinned region cleared");
    });
  }

  window.addEventListener("blur", () => {
    if (state.playing && state.reducedMotion) stopAnimation();
  });

  window.addEventListener("keydown", (event) => {
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === "input" || tag === "select" || tag === "textarea") return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stepDiscrete(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      stepDiscrete(1);
    } else if (event.key === " ") {
      event.preventDefault();
      toggleAnimation();
    } else if (event.key === "Escape") {
      state.selectedRegionId = null;
      state.hoverRegionId = null;
      renderAll();
      announce("Selection cleared");
    } else if (event.key.toLowerCase() === "h") {
      event.preventDefault();
      byId("highContrastToggle").checked = !byId("highContrastToggle").checked;
      renderAll();
      announce(byId("highContrastToggle").checked ? "High contrast enabled" : "High contrast disabled");
    } else if (event.key === "?") {
      event.preventDefault();
      announce("Keyboard shortcuts: left and right arrows step timeline, space toggles animation, escape clears selection, h toggles high contrast");
    }
  });
}

function init() {
  buildRegionSelect();
  buildCompareYearSelect();
  buildOffsetSelect();

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    state.reducedMotion = true;
    state.snapToGrid = true;
  }

  loadPreferences();

  const mapOnly = isMapOnlyMode();
  if (mapOnly) {
    state.compareEnabled = false;
    state.compareLock = true;
    state.regionFilter = "all";
    state.dimension = "language";
    state.sizeMode = "selected";
    state.colorRangeMode = "fixed";
    state.scenarioKey = "historical";
    state.projection = "natural earth";
    state.snapToGrid = true;
    state.stepSize = 25;
    state.animationSpeed = 8;
  }

  initControls();
  refreshCompareControlState();
  renderAll();
  bindMapEventsIfNeeded();

  if (mapOnly) {
    if (state.reducedMotion) {
      announce("Map-only mode loaded with reduced motion; use the timeline slider to scrub manually");
    } else {
      announce("Map shows historically anchored language corridors over time; use play or pause, hover, or click regions for detail");
      startAnimation();
    }
  }
}

window.addEventListener("DOMContentLoaded", init);
