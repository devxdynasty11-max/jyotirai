import {
  BirthDetails,
  VedicChartData,
  GrahaPosition,
  BhavaData,
  VimshottariDasha,
  VedicYoga,
} from './types.ts';

export const RASHI_NAMES = [
  'Mesha (Aries)',
  'Vrishabha (Taurus)',
  'Mithuna (Gemini)',
  'Karka (Cancer)',
  'Simha (Leo)',
  'Kanya (Virgo)',
  'Tula (Libra)',
  'Vrishchika (Scorpio)',
  'Dhanu (Sagittarius)',
  'Makara (Capricorn)',
  'Kumbha (Aquarius)',
  'Meena (Pisces)',
];

export const RASHI_SHORT = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karka',
  'Simha', 'Kanya', 'Tula', 'Vrishchika',
  'Dhanu', 'Makara', 'Kumbha', 'Meena',
];

export const RASHI_LORDS = [
  'Mangal (Mars)', 'Shukra (Venus)', 'Budha (Mercury)', 'Chandra (Moon)',
  'Surya (Sun)', 'Budha (Mercury)', 'Shukra (Venus)', 'Mangal (Mars)',
  'Guru (Jupiter)', 'Shani (Saturn)', 'Shani (Saturn)', 'Guru (Jupiter)',
];

export const RASHI_ELEMENTS: Array<'Fire' | 'Earth' | 'Air' | 'Water'> = [
  'Fire', 'Earth', 'Air', 'Water',
  'Fire', 'Earth', 'Air', 'Water',
  'Fire', 'Earth', 'Air', 'Water',
];

export const NAKSHATRAS = [
  { name: 'Ashwini', ruler: 'Ketu', deity: 'Ashvini Kumaras', symbol: 'Horse head', meaning: 'The Physician of Gods' },
  { name: 'Bharani', ruler: 'Venus', deity: 'Yama', symbol: 'Yoni', meaning: 'The Bearer / Transformer' },
  { name: 'Krittika', ruler: 'Sun', deity: 'Agni', symbol: 'Flame / Razor', meaning: 'The Brilliant Cutter' },
  { name: 'Rohini', ruler: 'Moon', deity: 'Brahma', symbol: 'Chariot / Ox-cart', meaning: 'The Red One / Fertility & Charm' },
  { name: 'Mrigashira', ruler: 'Mars', deity: 'Soma', symbol: 'Deer head', meaning: 'The Searching Deer' },
  { name: 'Ardra', ruler: 'Rahu', deity: 'Rudra', symbol: 'Teardrop', meaning: 'The Storm / Transformation' },
  { name: 'Punarvasu', ruler: 'Jupiter', deity: 'Aditi', symbol: 'Bow & Quiver', meaning: 'Return of the Light' },
  { name: 'Pushya', ruler: 'Saturn', deity: 'Brihaspati', symbol: 'Cow udder / Flower', meaning: 'The Nourisher' },
  { name: 'Ashlesha', ruler: 'Mercury', deity: 'Sarpa (Serpents)', symbol: 'Coiled Snake', meaning: 'The Clinging Embrace' },
  { name: 'Magha', ruler: 'Ketu', deity: 'Pitris (Ancestors)', symbol: 'Royal Throne', meaning: 'The Mighty / Ancestral Legacy' },
  { name: 'Purva Phalguni', ruler: 'Venus', deity: 'Bhaga', symbol: 'Hammock / Couch', meaning: 'The Fruit of Delight' },
  { name: 'Uttara Phalguni', ruler: 'Sun', deity: 'Aryaman', symbol: 'Four legs of bed', meaning: 'Noble Patronage & Service' },
  { name: 'Hasta', ruler: 'Moon', deity: 'Savitr', symbol: 'Open Hand', meaning: 'The Golden Touch / Skillful Hand' },
  { name: 'Chitra', ruler: 'Mars', deity: 'Tvashtar', symbol: 'Bright Jewel', meaning: 'The Celestial Architect' },
  { name: 'Swati', ruler: 'Rahu', deity: 'Vayu', symbol: 'Young shoot in the wind', meaning: 'The Independent Sword' },
  { name: 'Vishakha', ruler: 'Jupiter', deity: 'Indra-Agni', symbol: 'Triumphal Arch', meaning: 'The Focused Goal-Getter' },
  { name: 'Anuradha', ruler: 'Saturn', deity: 'Mitra', symbol: 'Lotus / Staff', meaning: 'Sublime Devotion & Friendship' },
  { name: 'Jyeshtha', ruler: 'Mercury', deity: 'Indra', symbol: 'Earring / Amulet', meaning: 'The Eldest / Elder Leader' },
  { name: 'Mula', ruler: 'Ketu', deity: 'Nirriti', symbol: 'Tied roots', meaning: 'The Root / Piercing the Origin' },
  { name: 'Purva Ashadha', ruler: 'Venus', deity: 'Apas (Water)', symbol: 'Winnowing fan', meaning: 'The Invincible Victory' },
  { name: 'Uttara Ashadha', ruler: 'Sun', deity: 'Vishvadevas', symbol: 'Elephant tusk', meaning: 'Universal Victory & Duty' },
  { name: 'Shravana', ruler: 'Moon', deity: 'Vishnu', symbol: 'Three footprints / Ear', meaning: 'The Deep Listener' },
  { name: 'Dhanishta', ruler: 'Mars', deity: 'Eight Vasus', symbol: 'Drum (Damaru) / Flute', meaning: 'The Celestial Rhythm & Wealth' },
  { name: 'Shatabhisha', ruler: 'Rahu', deity: 'Varuna', symbol: 'Empty circle / 100 healers', meaning: 'The Hundred Healers' },
  { name: 'Purva Bhadrapada', ruler: 'Jupiter', deity: 'Aja Ekapada', symbol: 'Two front legs of funeral cot', meaning: 'The Ascetic Fire' },
  { name: 'Uttara Bhadrapada', ruler: 'Saturn', deity: 'Ahirbudhnya', symbol: 'Two back legs of cot', meaning: 'The Deep Dragon of Wisdom' },
  { name: 'Revati', ruler: 'Mercury', deity: 'Pushan', symbol: 'Fish / Pair of fish', meaning: 'The Shepherd of the Journey' },
];

export const DASHA_ORDER = [
  { planet: 'Ketu', duration: 7, themes: 'Spiritual introspection, detachment, sudden shifts, karmic culmination' },
  { planet: 'Shukra (Venus)', duration: 20, themes: 'Creativity, romance, luxury, aesthetics, partnerships, material comforts' },
  { planet: 'Surya (Sun)', duration: 6, themes: 'Self-illumination, authority, recognition, father, vitality, purpose' },
  { planet: 'Chandra (Moon)', duration: 10, themes: 'Emotional expansion, motherly bonds, mental peace, home, intuition' },
  { planet: 'Mangal (Mars)', duration: 7, themes: 'Action, courage, enterprise, property, competitive drive, willpower' },
  { planet: 'Rahu', duration: 18, themes: 'Worldly ambition, unconventional expansion, foreign travels, intensity' },
  { planet: 'Guru (Jupiter)', duration: 16, themes: 'Wisdom, mentorship, higher learning, wealth expansion, spiritual grace' },
  { planet: 'Shani (Saturn)', duration: 19, themes: 'Discipline, karmic harvest, long-term mastery, perseverance, structure' },
  { planet: 'Budha (Mercury)', duration: 17, themes: 'Intellect, commerce, communication, analytical pursuits, versatility' },
];

export const BHAVA_SIGNIFICANCES: Record<number, { name: string; area: string; meaning: string }> = {
  1: { name: 'Tanu Bhava (1st House)', area: 'Self & Vitality', meaning: 'Physical vitality, personality, temperament, personal aura, and general orientation toward life.' },
  2: { name: 'Dhana Bhava (2nd House)', area: 'Wealth & Speech', meaning: 'Accumulated wealth, family lineage, speech, values, nourishment, and early upbringing.' },
  3: { name: 'Sahaja Bhava (3rd House)', area: 'Courage & Siblings', meaning: 'Courage, initiative, younger siblings, short travels, manual dexterity, and self-effort.' },
  4: { name: 'Sukha Bhava (4th House)', area: 'Home & Heart', meaning: 'Inner contentment, mother, real estate, emotional foundation, vehicles, and heart-space.' },
  5: { name: 'Putra Bhava (5th House)', area: 'Intelligence & Karma', meaning: 'Purva punya (past merit), creative genius, children, higher intellect, romance, and speculation.' },
  6: { name: 'Ari Bhava (6th House)', area: 'Obstacles & Service', meaning: 'Daily work routine, problem solving, overcoming debts, immunity, disputes, and competitive power.' },
  7: { name: 'Yuvati Bhava (7th House)', area: 'Partnerships & Marriage', meaning: 'Spouse, marriage, significant business partners, contracts, and public interactions.' },
  8: { name: 'Randhra Bhava (8th House)', area: 'Transformation & Longevity', meaning: 'Deep metamorphosis, longevity, occult knowledge, joint finances, inheritance, and hidden truths.' },
  9: { name: 'Dharma Bhava (9th House)', area: 'Fortune & Philosophy', meaning: 'Bhagya (divine grace), higher philosophy, father/guru, pilgrimages, ethics, and destiny.' },
  10: { name: 'Karma Bhava (10th House)', area: 'Career & Legacy', meaning: 'Public status, profession, vocation, executive authority, legacy, and societal reputation.' },
  11: { name: 'Labha Bhava (11th House)', area: 'Gains & Networks', meaning: 'Fulfillment of desires, elder siblings, social networks, lucrative gains, and grand aspirations.' },
  12: { name: 'Vyaya Bhava (12th House)', area: 'Liberation & Solitude', meaning: 'Moksha (liberation), foreign residence, spiritual retreats, dreams, subconscious mind, and letting go.' },
};

/**
 * Calculates Julian Day number from UTC calendar date
 */
function getJulianDay(year: number, month: number, day: number, hourFraction: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524.5 + (hourFraction / 24.0);
  return jd;
}

/**
 * Lahiri Ayanamsha for epoch date
 */
function getLahiriAyanamsha(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  // Mean Lahiri Ayanamsha ~ 23°51' for 2000
  return 23.857 + 1.396 * T;
}

/**
 * Normalizes degrees into 0 - 360
 */
function normalizeDeg(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

/**
 * Deterministic planetary position calculation based on sidereal Lahiri zodiac
 */
export function calculateVedicChart(birth: BirthDetails): VedicChartData {
  const [yearStr, monthStr, dayStr] = birth.birthDate.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  let hour = 12;
  let minute = 0;
  if (!birth.isTimeUnknown && birth.birthTime) {
    const [hStr, mStr] = birth.birthTime.split(':');
    hour = parseInt(hStr, 10) || 12;
    minute = parseInt(mStr, 10) || 0;
  }

  // Convert local birth time to UTC fraction
  const localDecimalHours = hour + minute / 60;
  const utcDecimalHours = localDecimalHours - birth.timezone;
  const jd = getJulianDay(year, month, day, utcDecimalHours);
  const ayanamsha = getLahiriAyanamsha(jd);
  const daysSinceJ2000 = jd - 2451545.0;

  // Approximate Mean Anomalies & Tropical positions, converted to Sidereal
  // Sun
  const meanSunTrop = (280.460 + 0.9856474 * daysSinceJ2000);
  const sunAnomaly = (357.528 + 0.9856003 * daysSinceJ2000) * (Math.PI / 180);
  const sunCenter = 1.915 * Math.sin(sunAnomaly) + 0.020 * Math.sin(2 * sunAnomaly);
  const sunTropLong = normalizeDeg(meanSunTrop + sunCenter);
  const sunSidereal = normalizeDeg(sunTropLong - ayanamsha);

  // Moon
  const meanMoonTrop = (218.316 + 13.176396 * daysSinceJ2000);
  const moonAnomaly = (134.963 + 13.064993 * daysSinceJ2000) * (Math.PI / 180);
  const moonCenter = 6.289 * Math.sin(moonAnomaly);
  const moonTropLong = normalizeDeg(meanMoonTrop + moonCenter);
  const moonSidereal = normalizeDeg(moonTropLong - ayanamsha);

  // Mars
  const marsMeanTrop = (355.433 + 0.524033 * daysSinceJ2000);
  const marsAnomaly = (19.373 + 0.524020 * daysSinceJ2000) * (Math.PI / 180);
  const marsCenter = 10.691 * Math.sin(marsAnomaly);
  const marsSidereal = normalizeDeg(marsMeanTrop + marsCenter - ayanamsha);

  // Mercury (orbits close to Sun)
  const mercuryAnomaly = (174.794 + 4.092334 * daysSinceJ2000) * (Math.PI / 180);
  const mercuryDeviation = 18.0 * Math.sin(mercuryAnomaly) + 4.0 * Math.cos(2 * mercuryAnomaly);
  const mercurySidereal = normalizeDeg(sunSidereal + mercuryDeviation);

  // Jupiter
  const jupMeanTrop = (34.351 + 0.083085 * daysSinceJ2000);
  const jupAnomaly = (20.306 + 0.083085 * daysSinceJ2000) * (Math.PI / 180);
  const jupCenter = 5.555 * Math.sin(jupAnomaly);
  const jupiterSidereal = normalizeDeg(jupMeanTrop + jupCenter - ayanamsha);

  // Venus
  const venusAnomaly = (50.115 + 1.602130 * daysSinceJ2000) * (Math.PI / 180);
  const venusDeviation = 28.0 * Math.sin(venusAnomaly);
  const venusSidereal = normalizeDeg(sunSidereal + venusDeviation);

  // Saturn
  const satMeanTrop = (50.077 + 0.033444 * daysSinceJ2000);
  const satAnomaly = (317.020 + 0.033444 * daysSinceJ2000) * (Math.PI / 180);
  const satCenter = 6.358 * Math.sin(satAnomaly);
  const saturnSidereal = normalizeDeg(satMeanTrop + satCenter - ayanamsha);

  // Rahu & Ketu (Mean lunar nodes move backward ~0.05295 deg/day)
  const rahuMeanTrop = (125.0445 - 0.0529538 * daysSinceJ2000);
  const rahuSidereal = normalizeDeg(rahuMeanTrop - ayanamsha);
  const ketuSidereal = normalizeDeg(rahuSidereal + 180);

  // Ascendant (Lagna) Calculation
  // Local Sidereal Time (LST)
  const GMST = normalizeDeg(280.46061837 + 360.98564736629 * daysSinceJ2000);
  const LST_deg = normalizeDeg(GMST + birth.longitude);
  const LST_rad = LST_deg * (Math.PI / 180);
  const lat_rad = birth.latitude * (Math.PI / 180);
  const obl_rad = (23.439 - 0.0000004 * daysSinceJ2000) * (Math.PI / 180);

  // Oblique Ascension for Ascendant
  const sinLST = Math.sin(LST_rad);
  const cosLST = Math.cos(LST_rad);
  const ascY = -cosLST;
  const ascX = sinLST * Math.cos(obl_rad) + Math.tan(lat_rad) * Math.sin(obl_rad);
  let ascTropical = Math.atan2(ascY, ascX) * (180 / Math.PI);
  ascTropical = normalizeDeg(ascTropical + 90);
  const ascSidereal = normalizeDeg(ascTropical - ayanamsha);

  const ascSignIdx = Math.floor(ascSidereal / 30);
  const ascDegInSign = ascSidereal % 30;
  const ascNakshatraIdx = Math.floor(ascSidereal / (360 / 27));
  const ascPada = Math.floor((ascSidereal % (360 / 27)) / ((360 / 27) / 4)) + 1;

  // Helper to map degrees to sign, nakshatra, and house
  const getSignDetails = (lon: number) => {
    const signIdx = Math.floor(lon / 30);
    const degInSign = lon % 30;
    const nakIdx = Math.floor(lon / (360 / 27));
    const nakInfo = NAKSHATRAS[nakIdx % 27];
    const nakRem = lon % (360 / 27);
    const pada = Math.floor(nakRem / ((360 / 27) / 4)) + 1;
    // Whole sign house: Lagna sign is House 1
    const house = ((signIdx - ascSignIdx + 12) % 12) + 1;

    const degInt = Math.floor(degInSign);
    const minInt = Math.floor((degInSign - degInt) * 60);
    const formattedDegree = `${degInt}°${minInt < 10 ? '0' : ''}${minInt}'`;

    return {
      signIdx,
      signName: RASHI_NAMES[signIdx],
      degInSign,
      formattedDegree,
      nakshatra: nakInfo.name,
      nakshatraIndex: (nakIdx % 27) + 1,
      nakshatraLord: nakInfo.ruler,
      pada,
      house,
      element: RASHI_ELEMENTS[signIdx],
    };
  };

  // Determine Graha Dignity
  const getDignity = (planet: string, signIdx: number): 'Exalted' | 'Debilitated' | 'Own Sign' | 'Moolatrikona' | 'Friendly' | 'Neutral' | 'Enemy' => {
    // Standard Vedic exaltations / debilitations (0=Aries, 1=Taurus, etc.)
    switch (planet) {
      case 'Surya (Sun)':
        if (signIdx === 0) return 'Exalted'; // Aries
        if (signIdx === 6) return 'Debilitated'; // Libra
        if (signIdx === 4) return 'Own Sign'; // Leo
        return [0, 3, 7, 8, 11].includes(signIdx) ? 'Friendly' : 'Neutral';
      case 'Chandra (Moon)':
        if (signIdx === 1) return 'Exalted'; // Taurus
        if (signIdx === 7) return 'Debilitated'; // Scorpio
        if (signIdx === 3) return 'Own Sign'; // Cancer
        return 'Friendly';
      case 'Mangal (Mars)':
        if (signIdx === 9) return 'Exalted'; // Capricorn
        if (signIdx === 3) return 'Debilitated'; // Cancer
        if (signIdx === 0 || signIdx === 7) return 'Own Sign'; // Aries, Scorpio
        return [3, 4, 8, 11].includes(signIdx) ? 'Friendly' : 'Neutral';
      case 'Budha (Mercury)':
        if (signIdx === 5) return 'Exalted'; // Virgo
        if (signIdx === 11) return 'Debilitated'; // Pisces
        if (signIdx === 2 || signIdx === 5) return 'Own Sign'; // Gemini, Virgo
        return [1, 6].includes(signIdx) ? 'Friendly' : 'Neutral';
      case 'Guru (Jupiter)':
        if (signIdx === 3) return 'Exalted'; // Cancer
        if (signIdx === 9) return 'Debilitated'; // Capricorn
        if (signIdx === 8 || signIdx === 11) return 'Own Sign'; // Sagittarius, Pisces
        return [0, 4, 7].includes(signIdx) ? 'Friendly' : 'Neutral';
      case 'Shukra (Venus)':
        if (signIdx === 11) return 'Exalted'; // Pisces
        if (signIdx === 5) return 'Debilitated'; // Virgo
        if (signIdx === 1 || signIdx === 6) return 'Own Sign'; // Taurus, Libra
        return [2, 5, 9, 10].includes(signIdx) ? 'Friendly' : 'Neutral';
      case 'Shani (Saturn)':
        if (signIdx === 6) return 'Exalted'; // Libra
        if (signIdx === 0) return 'Debilitated'; // Aries
        if (signIdx === 9 || signIdx === 10) return 'Own Sign'; // Capricorn, Aquarius
        return [1, 2, 5, 6].includes(signIdx) ? 'Friendly' : 'Neutral';
      case 'Rahu (North Node)':
        if (signIdx === 1 || signIdx === 2) return 'Exalted';
        if (signIdx === 7 || signIdx === 8) return 'Debilitated';
        return 'Neutral';
      case 'Ketu (South Node)':
        if (signIdx === 7 || signIdx === 8) return 'Exalted';
        if (signIdx === 1 || signIdx === 2) return 'Debilitated';
        return 'Neutral';
      default:
        return 'Neutral';
    }
  };

  const rawGrahas = [
    { name: 'Surya (Sun)', shortName: 'Su', sanskritName: 'Surya', englishName: 'Sun', symbol: '☉', lon: sunSidereal, karaka: 'Soul, Father, Vitality, Leadership' },
    { name: 'Chandra (Moon)', shortName: 'Mo', sanskritName: 'Chandra', englishName: 'Moon', symbol: '☽', lon: moonSidereal, karaka: 'Mind, Emotions, Mother, Consciousness' },
    { name: 'Mangal (Mars)', shortName: 'Ma', sanskritName: 'Mangal', englishName: 'Mars', symbol: '♂', lon: marsSidereal, karaka: 'Courage, Energy, Ambition, Brothers' },
    { name: 'Budha (Mercury)', shortName: 'Me', sanskritName: 'Budha', englishName: 'Mercury', symbol: '☿', lon: mercurySidereal, karaka: 'Intellect, Communication, Speech, Trade' },
    { name: 'Guru (Jupiter)', shortName: 'Ju', sanskritName: 'Guru', englishName: 'Jupiter', symbol: '♃', lon: jupiterSidereal, karaka: 'Wisdom, Guru, Dharma, Fortune, Expansion' },
    { name: 'Shukra (Venus)', shortName: 'Ve', sanskritName: 'Shukra', englishName: 'Venus', symbol: '♀', lon: venusSidereal, karaka: 'Love, Beauty, Devotion, Arts, Prosperity' },
    { name: 'Shani (Saturn)', shortName: 'Sa', sanskritName: 'Shani', englishName: 'Saturn', symbol: '♄', lon: saturnSidereal, karaka: 'Discipline, Karma, Longevity, Humility' },
    { name: 'Rahu (North Node)', shortName: 'Ra', sanskritName: 'Rahu', englishName: 'Rahu', symbol: '☊', lon: rahuSidereal, karaka: 'Worldly Desire, Innovation, Quest, Shadow' },
    { name: 'Ketu (South Node)', shortName: 'Ke', sanskritName: 'Ketu', englishName: 'Ketu', symbol: '☋', lon: ketuSidereal, karaka: 'Moksha, Intuition, Renunciation, Mastery' },
  ];

  const grahas: GrahaPosition[] = rawGrahas.map((g) => {
    const details = getSignDetails(g.lon);
    return {
      name: g.name as any,
      shortName: g.shortName,
      sanskritName: g.sanskritName,
      englishName: g.englishName,
      symbol: g.symbol,
      longitude: g.lon,
      sign: details.signName,
      signIndex: details.signIdx + 1,
      degreeInSign: details.degInSign,
      formattedDegree: details.formattedDegree,
      nakshatra: details.nakshatra,
      nakshatraIndex: details.nakshatraIndex,
      pada: details.pada,
      nakshatraLord: details.nakshatraLord,
      house: details.house,
      isRetrograde: ['Rahu (North Node)', 'Ketu (South Node)'].includes(g.name) ? true : false,
      dignity: getDignity(g.name, details.signIdx),
      element: details.element,
      karakaRole: g.karaka,
    };
  });

  // Bhavas (Houses)
  const bhavas: BhavaData[] = [];
  for (let h = 1; h <= 12; h++) {
    const signIdx = (ascSignIdx + (h - 1)) % 12;
    const occupants = grahas.filter((g) => g.house === h);
    const bhavaInfo = BHAVA_SIGNIFICANCES[h];
    bhavas.push({
      houseNumber: h,
      sign: RASHI_NAMES[signIdx],
      signIndex: signIdx + 1,
      lord: RASHI_LORDS[signIdx],
      occupants,
      significance: bhavaInfo.meaning,
      sanskritName: bhavaInfo.name,
      lifeArea: bhavaInfo.area,
    });
  }

  // Vimshottari Dasha calculation based on Moon's Nakshatra
  const moonDetails = getSignDetails(moonSidereal);
  const moonNakIdx = moonDetails.nakshatraIndex - 1; // 0 - 26
  const nakTotalDegrees = 360 / 27; // 13.3333 degrees
  const moonNakRem = moonSidereal % nakTotalDegrees;
  const fractionElapsed = moonNakRem / nakTotalDegrees;
  const fractionRemaining = 1 - fractionElapsed;

  // Dasha starting planet (ruler of Moon's Nakshatra)
  const dashaRuler = NAKSHATRAS[moonNakIdx].ruler;
  const dashaOrderIdx = DASHA_ORDER.findIndex((d) => d.planet.includes(dashaRuler));
  const activeOrderIdx = dashaOrderIdx !== -1 ? dashaOrderIdx : 0;

  // Generate 120-year timeline
  const timeline: VimshottariDasha[] = [];
  let currentYear = year;
  let currentMonth = month;
  let currentDay = day;

  const birthDateObj = new Date(year, month - 1, day);
  const now = new Date();

  let currentMahadasha: VimshottariDasha | null = null;

  for (let i = 0; i < DASHA_ORDER.length; i++) {
    const dashaConfig = DASHA_ORDER[(activeOrderIdx + i) % DASHA_ORDER.length];
    const duration = i === 0 ? dashaConfig.duration * fractionRemaining : dashaConfig.duration;

    const startDateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;
    const endYear = currentYear + Math.floor(duration);
    const remainingFraction = duration - Math.floor(duration);
    let endMonth = currentMonth + Math.round(remainingFraction * 12);
    let finalEndYear = endYear;
    if (endMonth > 12) {
      finalEndYear += 1;
      endMonth -= 12;
    }
    const endDateStr = `${finalEndYear}-${String(endMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;

    const startDateObj = new Date(currentYear, currentMonth - 1, currentDay);
    const endDateObj = new Date(finalEndYear, endMonth - 1, currentDay);
    const isCurrent = now >= startDateObj && now < endDateObj;

    const dashaEntry: VimshottariDasha = {
      planet: dashaConfig.planet,
      startDate: startDateStr,
      endDate: endDateStr,
      durationYears: Math.round(duration * 10) / 10,
      isCurrent,
      keyThemes: dashaConfig.themes,
    };

    if (isCurrent && !currentMahadasha) {
      currentMahadasha = dashaEntry;
    }

    timeline.push(dashaEntry);
    currentYear = finalEndYear;
    currentMonth = endMonth;
  }

  if (!currentMahadasha && timeline.length > 0) {
    currentMahadasha = timeline[0];
  }

  // Current Antardasha approximation
  const antardasha: VimshottariDasha = {
    planet: currentMahadasha ? currentMahadasha.planet : 'Guru (Jupiter)',
    subPlanet: 'Budha (Mercury)',
    startDate: now.toISOString().slice(0, 10),
    endDate: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString().slice(0, 10),
    durationYears: 1.5,
    isCurrent: true,
    keyThemes: 'Mental agility, strategic decisions, communication, and synthesis of recent experiences.',
  };

  // Vedic Yogas Detection
  const yogas: VedicYoga[] = [];

  // 1. Gajakesari Yoga (Jupiter in Kendra 1, 4, 7, 10 from Moon)
  const moonHouse = bhavas.find((b) => b.occupants.some((g) => g.name === 'Chandra (Moon)'))?.houseNumber || 1;
  const jupHouse = bhavas.find((b) => b.occupants.some((g) => g.name === 'Guru (Jupiter)'))?.houseNumber || 1;
  const diffFromMoon = ((jupHouse - moonHouse + 12) % 12) + 1;
  if ([1, 4, 7, 10].includes(diffFromMoon)) {
    yogas.push({
      name: 'Gajakesari Yoga',
      sanskritName: 'गजकेसरी योग',
      type: 'Auspicious',
      planets: ['Jupiter', 'Moon'],
      description: 'Jupiter sits in an angular Kendra house from Moon, forming one of the most venerable alignments in Vedic Jyotish.',
      manifestation: 'Endows natural wisdom, lasting respect, oratorical grace, intellectual resilience during hardship, and widespread goodwill.',
    });
  }

  // 2. Budhaditya Yoga (Sun + Mercury in same house)
  const sunHouse = bhavas.find((b) => b.occupants.some((g) => g.name === 'Surya (Sun)'))?.houseNumber;
  const mercHouse = bhavas.find((b) => b.occupants.some((g) => g.name === 'Budha (Mercury)'))?.houseNumber;
  if (sunHouse && mercHouse && sunHouse === mercHouse) {
    yogas.push({
      name: 'Budhaditya Yoga',
      sanskritName: 'बुधादित्य योग',
      type: 'Raja',
      planets: ['Sun', 'Mercury'],
      description: 'The solar consciousness joins Mercury’s discerning intellect in the same Bhava.',
      manifestation: 'Sharp analytical faculties, sharp wit, administrative acumen, persuasive communication, and scholarly respect.',
    });
  }

  // 3. Chandra-Mangal Yoga (Moon and Mars conjunct or in mutual aspect)
  const marsHouse = bhavas.find((b) => b.occupants.some((g) => g.name === 'Mangal (Mars)'))?.houseNumber;
  if (moonHouse && marsHouse && (moonHouse === marsHouse || Math.abs(moonHouse - marsHouse) === 6)) {
    yogas.push({
      name: 'Chandra-Mangal Yoga',
      sanskritName: 'चन्द्र-मंगल योग',
      type: 'Dhana',
      planets: ['Moon', 'Mars'],
      description: 'Conjunction or direct opposition of Moon (receptivity) and Mars (assertive energy).',
      manifestation: 'Dynamic wealth generation, passionate commercial enterprise, pragmatic persistence, and high practical drive.',
    });
  }

  // 4. Pancha Mahapurusha Yogas (Exalted or Own Sign in Kendra 1,4,7,10)
  grahas.forEach((g) => {
    if ([1, 4, 7, 10].includes(g.house) && ['Exalted', 'Own Sign'].includes(g.dignity)) {
      if (g.name.includes('Jupiter')) {
        yogas.push({
          name: 'Hamsa Yoga',
          sanskritName: 'हंस योग',
          type: 'Mahapurusha',
          planets: ['Jupiter'],
          description: 'Jupiter exalted or in own sign in a Kendra house.',
          manifestation: 'Philosophical eminence, sacred righteousness, generous heart, revered mentorship, and noble character.',
        });
      } else if (g.name.includes('Venus')) {
        yogas.push({
          name: 'Malavya Yoga',
          sanskritName: 'मालव्य योग',
          type: 'Mahapurusha',
          planets: ['Venus'],
          description: 'Venus exalted or in own sign in a Kendra house.',
          manifestation: 'Graceful charisma, refinement in arts, aesthetic discernment, luxurious vehicles, and enduring affectionate partnerships.',
        });
      } else if (g.name.includes('Mars')) {
        yogas.push({
          name: 'Ruchaka Yoga',
          sanskritName: 'रुचक योग',
          type: 'Mahapurusha',
          planets: ['Mars'],
          description: 'Mars exalted or in own sign in a Kendra house.',
          manifestation: 'Physical valor, fearless leadership, strategic execution, triumph over rivals, and mastery over land/technique.',
        });
      } else if (g.name.includes('Mercury')) {
        yogas.push({
          name: 'Bhadra Yoga',
          sanskritName: 'भद्र योग',
          type: 'Mahapurusha',
          planets: ['Mercury'],
          description: 'Mercury exalted or in own sign in a Kendra house.',
          manifestation: 'Genius-level eloquence, commercial mastery, encyclopedic memory, and diplomatic finesse.',
        });
      } else if (g.name.includes('Saturn')) {
        yogas.push({
          name: 'Sasa Yoga',
          sanskritName: 'शश योग',
          type: 'Mahapurusha',
          planets: ['Saturn'],
          description: 'Saturn exalted or in own sign in a Kendra house.',
          manifestation: 'Formidable patience, mass leadership, sovereign discipline, mastery through humble labor, and enduring foundations.',
        });
      }
    }
  });

  // 5. Viparita Raja Yoga (Dusthana lords in dusthana houses 6, 8, 12)
  const sixthLord = bhavas[5].lord;
  const eighthLord = bhavas[7].lord;
  const twelfthLord = bhavas[11].lord;
  const dusthanaGrahas = grahas.filter((g) => [6, 8, 12].includes(g.house));
  const hasViparita = dusthanaGrahas.some((g) => g.name.includes(sixthLord) || g.name.includes(eighthLord) || g.name.includes(twelfthLord));
  if (hasViparita) {
    yogas.push({
      name: 'Viparita Raja Yoga',
      sanskritName: 'विपरीत राज योग',
      type: 'Raja',
      planets: ['Dusthana Lords'],
      description: 'Adversity-neutralizing alignment where difficult houses neutralize obstacles and yield unexpected breakthroughs.',
      manifestation: 'Remarkable ability to rise stronger after crises, turn adversity into profound advantage, and navigate turbulence with uncanny composure.',
    });
  }

  // 6. Dhana Yoga (Wealth alignment between Kendra/Trikona and 2nd/11th)
  const secondHouseOcc = bhavas[1].occupants.length;
  const eleventhHouseOcc = bhavas[10].occupants.length;
  if (secondHouseOcc > 0 || eleventhHouseOcc > 0 || yogas.some(y => y.type === 'Dhana')) {
    yogas.push({
      name: 'Maha Dhana Yoga',
      sanskritName: 'महा धन योग',
      type: 'Dhana',
      planets: ['2nd & 11th Bhava influences'],
      description: 'Harmonious stimulation of the 2nd Bhava of accumulated reserves and 11th Bhava of income gains.',
      manifestation: 'Sound financial intelligence, capacity to monetize knowledge, and steady accumulation of liquid assets across the mid-life arc.',
    });
  }

  // Element analysis
  const elementCounts = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
  grahas.forEach((g) => {
    elementCounts[g.element]++;
  });
  const dominantElement = Object.entries(elementCounts).reduce((a, b) => (b[1] > a[1] ? b : a))[0];

  const ascDetails = getSignDetails(ascSidereal);
  const sunDetails = getSignDetails(sunSidereal);

  return {
    birthDetails: birth,
    ascendant: {
      sign: ascDetails.signName,
      signIndex: ascSignIdx + 1,
      degreeInSign: ascDegInSign,
      formattedDegree: ascDetails.formattedDegree,
      nakshatra: NAKSHATRAS[ascNakshatraIdx % 27].name,
      pada: ascPada,
      lord: RASHI_LORDS[ascSignIdx],
    },
    sunSign: {
      sign: sunDetails.signName,
      nakshatra: sunDetails.nakshatra,
      pada: sunDetails.pada,
      house: sunDetails.house,
    },
    moonSign: {
      sign: moonDetails.signName,
      nakshatra: moonDetails.nakshatra,
      pada: moonDetails.pada,
      house: moonDetails.house,
    },
    grahas,
    bhavas,
    dashas: {
      currentMahadasha: currentMahadasha || timeline[0],
      currentAntardasha: antardasha,
      timeline,
    },
    yogas,
    chartSummary: {
      dominantElement,
      lagnaLordPlacement: `${RASHI_LORDS[ascSignIdx]} positioned in ${bhavas.find(b => b.lord === RASHI_LORDS[ascSignIdx])?.lifeArea || 'Lagna'}`,
      moonLagnaRelation: moonDetails.house === 1 ? 'Moon in Lagna (Soul & Mind unified)' : `Moon situated in ${moonDetails.house}th Bhava (${BHAVA_SIGNIFICANCES[moonDetails.house].area})`,
      strengthHighlights: [
        `${yogas.length} Auspicious Vedic Yogas active in chart`,
        `Ascendant Lord ${RASHI_LORDS[ascSignIdx]} governing primary life purpose`,
        `Current Mahadasha governed by ${currentMahadasha?.planet || 'Guru'}`,
      ],
    },
  };
}
