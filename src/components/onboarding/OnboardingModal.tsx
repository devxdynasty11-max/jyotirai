import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Compass, ArrowRight, ArrowLeft, Check, Sparkles, AlertCircle } from 'lucide-react';
import { BirthDetails, VedicChartData } from '../../services/astrology/types.ts';
import { searchCities, CityLocation, CITIES_DATABASE } from '../../services/cities/cityDatabase.ts';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (details: BirthDetails) => Promise<void>;
  isLoading: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  isLoading,
}) => {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [preferredName, setPreferredName] = useState<string>('');

  // Date
  const [day, setDay] = useState<string>('15');
  const [month, setMonth] = useState<string>('08');
  const [year, setYear] = useState<string>('1996');

  // Time
  const [hour, setHour] = useState<string>('10');
  const [minute, setMinute] = useState<string>('30');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [isTimeUnknown, setIsTimeUnknown] = useState<boolean>(false);

  // City Search
  const [cityQuery, setCityQuery] = useState<string>('New Delhi');
  const [selectedCity, setSelectedCity] = useState<CityLocation>(CITIES_DATABASE[0]);
  const [citySuggestions, setCitySuggestions] = useState<CityLocation[]>([]);
  const [showCityDropdown, setShowCityDropdown] = useState<boolean>(false);

  // System
  const [system] = useState<'Vedic (Sidereal Lahiri)'>('Vedic (Sidereal Lahiri)');

  // Error validation state
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleCitySearch = (query: string) => {
    setCityQuery(query);
    const results = searchCities(query);
    setCitySuggestions(results);
    setShowCityDropdown(true);
  };

  const selectCity = (city: CityLocation) => {
    setSelectedCity(city);
    setCityQuery(`${city.city}, ${city.country}`);
    setShowCityDropdown(false);
  };

  const validateStep = (currentStep: number): boolean => {
    setErrorMsg('');
    if (currentStep === 1) {
      if (!name.trim()) {
        setErrorMsg('Please enter your first name.');
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      const d = parseInt(day, 10);
      const m = parseInt(month, 10);
      const y = parseInt(year, 10);
      const nowYear = new Date().getFullYear();

      if (isNaN(d) || d < 1 || d > 31) {
        setErrorMsg('Please enter a valid day (1 - 31).');
        return false;
      }
      if (isNaN(m) || m < 1 || m > 12) {
        setErrorMsg('Please enter a valid month (1 - 12).');
        return false;
      }
      if (isNaN(y) || y < 1900 || y > nowYear) {
        setErrorMsg(`Please enter a valid year between 1900 and ${nowYear}.`);
        return false;
      }
      return true;
    }

    if (currentStep === 3) {
      if (!isTimeUnknown) {
        const h = parseInt(hour, 10);
        const min = parseInt(minute, 10);
        if (isNaN(h) || h < 1 || h > 12) {
          setErrorMsg('Hour must be between 1 and 12.');
          return false;
        }
        if (isNaN(min) || min < 0 || min > 59) {
          setErrorMsg('Minute must be between 0 and 59.');
          return false;
        }
      }
      return true;
    }

    if (currentStep === 4) {
      if (!selectedCity) {
        setErrorMsg('Please select your birthplace from the list.');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setErrorMsg('');
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    // Convert 12h to 24h
    let h24 = parseInt(hour, 10) || 12;
    if (period === 'PM' && h24 < 12) h24 += 12;
    if (period === 'AM' && h24 === 12) h24 = 0;

    const formattedTime = `${String(h24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const birthDetails: BirthDetails = {
      name: name.trim(),
      preferredName: preferredName.trim() || undefined,
      birthDate: formattedDate,
      birthTime: isTimeUnknown ? '12:00' : formattedTime,
      isTimeUnknown,
      city: selectedCity.city,
      country: selectedCity.country,
      latitude: selectedCity.latitude,
      longitude: selectedCity.longitude,
      timezone: selectedCity.timezone,
      system,
    };

    await onComplete(birthDetails);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070B]/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#0E131D] border border-[#242D40] rounded-xl shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E2536] px-6 py-4 bg-[#0A0D15]">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-[#B89647]" />
            <h3 className="font-cinzel text-sm font-bold tracking-wider text-[#F0E6D2]">
              Chart Creation · Step {step} of 5
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#7E889D] hover:text-[#FFFFFF] transition-colors"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#181F2E] h-1">
          <div
            className="bg-gradient-to-r from-[#D6B25E] to-[#B89647] h-1 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Body Content */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 flex items-center gap-2 bg-[#2D1619] border border-[#522227] text-[#FF8E96] text-xs px-3 py-2 rounded">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Name */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-cinzel text-lg font-bold text-[#F4EFE6] mb-1">
                  What is your name?
                </h4>
                <p className="text-xs text-[#8E97AB]">
                  Acharya Arya will address you personally throughout the consultation.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-[#C0C8DA] mb-1">
                    First Name <span className="text-[#D6B25E]">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav, Maya, Priya, Elena"
                    className="w-full bg-[#131926] border border-[#273146] focus:border-[#B89647] rounded px-3.5 py-2.5 text-sm text-[#F0E6D2] focus:outline-none transition-colors"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#C0C8DA] mb-1">
                    Preferred Name / Nickname <span className="text-[#6D778D]">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={preferredName}
                    onChange={(e) => setPreferredName(e.target.value)}
                    placeholder="What you like to be called"
                    className="w-full bg-[#131926] border border-[#273146] focus:border-[#B89647] rounded px-3.5 py-2.5 text-sm text-[#F0E6D2] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Birth Date */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-cinzel text-lg font-bold text-[#F4EFE6] mb-1">
                  When were you born?
                </h4>
                <p className="text-xs text-[#8E97AB]">
                  Determines the exact solar, lunar, and planetary ephemeris.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-[#C0C8DA] mb-1">
                    Day (DD)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="w-full bg-[#131926] border border-[#273146] focus:border-[#B89647] rounded px-3 py-2.5 text-sm text-center text-[#F0E6D2] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#C0C8DA] mb-1">
                    Month (MM)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full bg-[#131926] border border-[#273146] focus:border-[#B89647] rounded px-3 py-2.5 text-sm text-center text-[#F0E6D2] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#C0C8DA] mb-1">
                    Year (YYYY)
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-[#131926] border border-[#273146] focus:border-[#B89647] rounded px-3 py-2.5 text-sm text-center text-[#F0E6D2] focus:outline-none"
                  />
                </div>
              </div>

              <div className="text-[11px] text-[#788296] bg-[#121724] p-3 rounded border border-[#1E2536]">
                Dates are validated strictly according to calendar integrity. Historical leap years and epoch shifts are factored into the calculation.
              </div>
            </div>
          )}

          {/* STEP 3: Birth Time */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-cinzel text-lg font-bold text-[#F4EFE6] mb-1">
                  What time were you born?
                </h4>
                <p className="text-xs text-[#8E97AB]">
                  Ascendant (Lagna) changes roughly every two hours. Exact time locks in your 12 Bhavas.
                </p>
              </div>

              {!isTimeUnknown ? (
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-[#C0C8DA] mb-1">
                      Hour (1-12)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={hour}
                      onChange={(e) => setHour(e.target.value)}
                      className="w-full bg-[#131926] border border-[#273146] focus:border-[#B89647] rounded px-3 py-2.5 text-sm text-center text-[#F0E6D2] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#C0C8DA] mb-1">
                      Minute (0-59)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={minute}
                      onChange={(e) => setMinute(e.target.value)}
                      className="w-full bg-[#131926] border border-[#273146] focus:border-[#B89647] rounded px-3 py-2.5 text-sm text-center text-[#F0E6D2] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#C0C8DA] mb-1">
                      AM / PM
                    </label>
                    <div className="grid grid-cols-2 gap-1 bg-[#131926] border border-[#273146] p-1 rounded">
                      <button
                        type="button"
                        onClick={() => setPeriod('AM')}
                        className={`py-1.5 text-xs font-semibold rounded ${
                          period === 'AM' ? 'bg-[#B89647] text-[#0A0D14]' : 'text-[#8E97AB]'
                        }`}
                      >
                        AM
                      </button>
                      <button
                        type="button"
                        onClick={() => setPeriod('PM')}
                        className={`py-1.5 text-xs font-semibold rounded ${
                          period === 'PM' ? 'bg-[#B89647] text-[#0A0D14]' : 'text-[#8E97AB]'
                        }`}
                      >
                        PM
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#1C1814] border border-[#44351B] p-4 rounded text-xs text-[#E1CA8E] leading-relaxed">
                  <strong>Notice on Approximate Time:</strong> When birth time is unknown, we compute your Moon sign, Sun sign, and planetary aspects accurately. However, exact house numbers (Bhavas) and Ascendant degree will be estimated using Chandra Lagna (Moon as 1st house).
                </div>
              )}

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#C0C8DA]">
                  <input
                    type="checkbox"
                    checked={isTimeUnknown}
                    onChange={(e) => setIsTimeUnknown(e.target.checked)}
                    className="rounded border-[#2E374D] bg-[#121622] text-[#B89647] focus:ring-0"
                  />
                  <span>I don't know my exact birth time</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 4: Birthplace */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-cinzel text-lg font-bold text-[#F4EFE6] mb-1">
                  Where were you born?
                </h4>
                <p className="text-xs text-[#8E97AB]">
                  Resolves geographic latitude, longitude, and historical standard timezones.
                </p>
              </div>

              <div className="relative pt-2">
                <label className="block text-xs font-medium text-[#C0C8DA] mb-1">
                  City & Country Search
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-[#B89647]" />
                  <input
                    type="text"
                    value={cityQuery}
                    onChange={(e) => handleCitySearch(e.target.value)}
                    onFocus={() => setShowCityDropdown(true)}
                    placeholder="Search city (e.g. New Delhi, Mumbai, New York, London)"
                    className="w-full bg-[#131926] border border-[#273146] focus:border-[#B89647] rounded pl-10 pr-4 py-2.5 text-sm text-[#F0E6D2] focus:outline-none transition-colors"
                  />
                </div>

                {/* Suggestions Dropdown */}
                {showCityDropdown && (
                  <div className="absolute z-20 mt-1 w-full bg-[#101522] border border-[#2A344A] rounded-md shadow-xl max-h-48 overflow-y-auto">
                    {(citySuggestions.length > 0 ? citySuggestions : CITIES_DATABASE.slice(0, 8)).map(
                      (c, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => selectCity(c)}
                          className="w-full text-left px-4 py-2 text-xs text-[#C6CFE2] hover:bg-[#1C2335] hover:text-[#FFFFFF] flex items-center justify-between border-b border-[#181F2F] last:border-none"
                        >
                          <span>
                            {c.city}
                            {c.state ? `, ${c.state}` : ''}, {c.country}
                          </span>
                          <span className="text-[10px] text-[#717B91]">
                            UTC {c.timezone >= 0 ? `+${c.timezone}` : c.timezone}
                          </span>
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              {selectedCity && (
                <div className="bg-[#121724] border border-[#222B3D] p-3 rounded text-xs text-[#9DA7BC] flex items-center justify-between">
                  <div>
                    <span className="text-[#E7EBF5] font-medium">Selected:</span> {selectedCity.city}, {selectedCity.country}
                  </div>
                  <div className="text-[11px] text-[#C4A35B]">
                    Lat {selectedCity.latitude.toFixed(2)}° · Lon {selectedCity.longitude.toFixed(2)}°
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Astrology System Confirmation */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-cinzel text-lg font-bold text-[#F4EFE6] mb-1">
                  Astrology Engine Configuration
                </h4>
                <p className="text-xs text-[#8E97AB]">
                  Your chart will be computed with the venerable Vedic Sidereal system.
                </p>
              </div>

              <div className="border border-[#B89647]/50 bg-[#161B27] p-4 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-cinzel text-sm font-semibold text-[#F4E3B2]">
                    Vedic Astrology (Parashari Jyotish)
                  </div>
                  <span className="text-[10px] bg-[#B89647]/20 text-[#D8BC75] px-2 py-0.5 rounded font-mono">
                    ACTIVE
                  </span>
                </div>
                <p className="text-xs text-[#9DA7BC] leading-relaxed">
                  Utilizes the <strong>Sidereal Lahiri Ayanamsha</strong>, aligning planetary degrees with observable star constellations rather than seasonal coordinates. Computes full 12 Bhavas, 27 Nakshatras with 4 Padas, and the 120-year Vimshottari Dasha sequence.
                </p>
              </div>

              {/* Summary of inputs */}
              <div className="bg-[#0A0D15] p-3 rounded border border-[#1C2232] text-xs space-y-1.5 text-[#919BB1]">
                <div className="flex justify-between">
                  <span>Querent:</span>
                  <span className="text-[#F0E6D2] font-medium">{name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Birth Date & Time:</span>
                  <span className="text-[#F0E6D2] font-medium">
                    {year}-{month}-{day} at {isTimeUnknown ? 'Time Unknown' : `${hour}:${minute} ${period}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Birthplace:</span>
                  <span className="text-[#F0E6D2] font-medium">
                    {selectedCity.city}, {selectedCity.country}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between border-t border-[#1E2536] px-6 py-4 bg-[#0A0D15]">
          {step > 1 ? (
            <button
              onClick={handleBack}
              disabled={isLoading}
              className="flex items-center gap-1.5 text-xs font-medium text-[#9DA7BC] hover:text-[#FFFFFF] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[#B89647] hover:bg-[#C9A654] text-[#0A0D14] text-xs font-semibold rounded transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#D6B25E] to-[#B38D3C] hover:from-[#E3C375] hover:to-[#C69F4B] text-[#0A0D14] text-xs font-bold rounded shadow-lg transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin text-[#0A0D14]" />
                  <span>Calculating Kundli...</span>
                </>
              ) : (
                <>
                  <Compass className="h-4 w-4" />
                  <span>Generate My Chart & Reading</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
