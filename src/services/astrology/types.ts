export type Rashi = 
  | 'Mesha (Aries)'
  | 'Vrishabha (Taurus)'
  | 'Mithuna (Gemini)'
  | 'Karka (Cancer)'
  | 'Simha (Leo)'
  | 'Kanya (Virgo)'
  | 'Tula (Libra)'
  | 'Vrishchika (Scorpio)'
  | 'Dhanu (Sagittarius)'
  | 'Makara (Capricorn)'
  | 'Kumbha (Aquarius)'
  | 'Meena (Pisces)';

export type GrahaName =
  | 'Surya (Sun)'
  | 'Chandra (Moon)'
  | 'Mangal (Mars)'
  | 'Budha (Mercury)'
  | 'Guru (Jupiter)'
  | 'Shukra (Venus)'
  | 'Shani (Saturn)'
  | 'Rahu (North Node)'
  | 'Ketu (South Node)';

export interface GrahaPosition {
  name: GrahaName;
  shortName: string;
  sanskritName: string;
  englishName: string;
  symbol: string;
  longitude: number; // 0 - 360
  sign: string;
  signIndex: number; // 1 - 12 (Mesha=1, etc.)
  degreeInSign: number; // 0 - 30
  formattedDegree: string; // e.g. 14°28'
  nakshatra: string;
  nakshatraIndex: number; // 1 - 27
  pada: number; // 1 - 4
  nakshatraLord: string;
  house: number; // 1 - 12
  isRetrograde: boolean;
  dignity: 'Exalted' | 'Debilitated' | 'Own Sign' | 'Moolatrikona' | 'Friendly' | 'Neutral' | 'Enemy';
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  karakaRole: string; // e.g. Soul, Mind, Energy, Intellect
}

export interface BhavaData {
  houseNumber: number; // 1 - 12
  sign: string;
  signIndex: number;
  lord: string;
  occupants: GrahaPosition[];
  significance: string;
  sanskritName: string;
  lifeArea: string;
}

export interface NakshatraData {
  name: string;
  sanskritName: string;
  ruler: string;
  deity: string;
  symbol: string;
  meaning: string;
  quality: string;
}

export interface VimshottariDasha {
  planet: string;
  subPlanet?: string;
  startDate: string;
  endDate: string;
  durationYears: number;
  isCurrent: boolean;
  keyThemes: string;
}

export interface VedicYoga {
  name: string;
  sanskritName: string;
  type: 'Raja' | 'Dhana' | 'Mahapurusha' | 'Auspicious' | 'Challenging';
  planets: string[];
  description: string;
  manifestation: string;
}

export interface BirthDetails {
  id?: string;
  name: string;
  preferredName?: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:MM
  isTimeUnknown: boolean;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: number; // UTC offset in hours e.g. +5.5 for IST
  system: 'Vedic (Sidereal Lahiri)';
  createdAt?: string;
}

export interface VedicChartData {
  birthDetails: BirthDetails;
  ascendant: {
    sign: string;
    signIndex: number;
    degreeInSign: number;
    formattedDegree: string;
    nakshatra: string;
    pada: number;
    lord: string;
  };
  sunSign: {
    sign: string;
    nakshatra: string;
    pada: number;
    house: number;
  };
  moonSign: {
    sign: string;
    nakshatra: string;
    pada: number;
    house: number;
  };
  grahas: GrahaPosition[];
  bhavas: BhavaData[];
  dashas: {
    currentMahadasha: VimshottariDasha;
    currentAntardasha: VimshottariDasha;
    timeline: VimshottariDasha[];
  };
  yogas: VedicYoga[];
  chartSummary: {
    dominantElement: string;
    lagnaLordPlacement: string;
    moonLagnaRelation: string;
    strengthHighlights: string[];
  };
}

export interface AstrologerMessage {
  id: string;
  sender: 'user' | 'astrologer';
  text: string;
  timestamp: string;
  astrologicalFactors?: string[];
  reasoning?: {
    factor: string;
    explanation: string;
  }[];
  suggestedQuestions?: string[];
}

export interface InitialReadingSection {
  title: string;
  category: 'snapshot' | 'nature' | 'mind' | 'strengths' | 'challenges' | 'career' | 'love' | 'money' | 'lifePhase' | 'next';
  content: string;
  astrologicalFactors: string[];
}

export interface InitialReadingResult {
  headline: string;
  sections: InitialReadingSection[];
  suggestedQuestions: string[];
  generatedAt: string;
}
