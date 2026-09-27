import React from 'react';
import { VedicChartData, InitialReadingResult } from '../../services/astrology/types.ts';
import { BRAND_CONFIG } from '../../config/brand.ts';
import { Sun, Moon, Compass, Sparkles, Clock, ArrowRight, Bookmark, ShieldCheck, Star } from 'lucide-react';

interface OverviewTabProps {
  chart: VedicChartData;
  initialReading: InitialReadingResult | null;
  onAskQuestion: (q: string) => void;
  onSaveReading: (reading: any) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  chart,
  initialReading,
  onAskQuestion,
  onSaveReading,
}) => {
  return (
    <div className="space-y-8">
      {/* Astrologer Welcome Card */}
      <div className="bg-gradient-to-r from-[#141A28] via-[#101420] to-[#0A0D15] border border-[#273248] rounded-xl p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs text-[#B89647] font-medium uppercase tracking-wider mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B89647]" />
            <span>Consultation Session · {BRAND_CONFIG.ASTROLOGER_NAME}</span>
          </div>

          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#F4EFE6] mb-3">
            Namaste, {chart.birthDetails.preferredName || chart.birthDetails.name}.
          </h2>

          <p className="font-cormorant text-base sm:text-lg text-[#C8D1E3] leading-relaxed mb-4">
            {initialReading?.headline ||
              `Your chart rises with ${chart.ascendant.sign}, governed by ${chart.ascendant.lord}. Your consciousness carries the light of ${chart.sunSign.sign} and the emotional depth of ${chart.moonSign.sign} under ${chart.moonSign.nakshatra} Nakshatra.`}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#959FAF]">
            <div>
              Ascendant: <strong className="text-[#F0E6D2]">{chart.ascendant.sign.split(' ')[0]}</strong>
            </div>
            <span>·</span>
            <div>
              Moon Sign (Janma Rashi): <strong className="text-[#F0E6D2]">{chart.moonSign.sign.split(' ')[0]}</strong>
            </div>
            <span>·</span>
            <div>
              Birth Nakshatra: <strong className="text-[#F0E6D2]">{chart.moonSign.nakshatra} (Pada {chart.moonSign.pada})</strong>
            </div>
          </div>
        </div>
      </div>

      {/* The Core Big Three Placements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Ascendant / Lagna */}
        <div className="bg-[#0C1019] border border-[#1E2536] p-5 rounded-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#8E97AB] mb-2">
              <span className="font-cinzel font-semibold text-[#B89647]">Lagna (Ascendant)</span>
              <span>1st Bhava</span>
            </div>
            <h3 className="font-cinzel text-lg font-bold text-[#F0E6D2] mb-1">
              {chart.ascendant.sign}
            </h3>
            <div className="text-xs text-[#A2ACBF] mb-2">
              Nakshatra: <strong className="text-[#DFCA93]">{chart.ascendant.nakshatra}</strong> (Pada {chart.ascendant.pada})
            </div>
            <p className="text-xs text-[#7B8497] leading-relaxed">
              Governs your physical vitality, natural demeanor, instinctive approach to obstacles, and outward persona.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#181F2F] text-[11px] text-[#939EAF]">
            Lagna Lord: <strong className="text-[#E7EBF5]">{chart.ascendant.lord}</strong>
          </div>
        </div>

        {/* Moon Sign / Chandra Rashi */}
        <div className="bg-[#0C1019] border border-[#1E2536] p-5 rounded-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#8E97AB] mb-2">
              <span className="font-cinzel font-semibold text-[#B89647]">Chandra (Moon Sign)</span>
              <span>House {chart.moonSign.house}</span>
            </div>
            <h3 className="font-cinzel text-lg font-bold text-[#F0E6D2] mb-1">
              {chart.moonSign.sign}
            </h3>
            <div className="text-xs text-[#A2ACBF] mb-2">
              Nakshatra: <strong className="text-[#DFCA93]">{chart.moonSign.nakshatra}</strong> (Pada {chart.moonSign.pada})
            </div>
            <p className="text-xs text-[#7B8497] leading-relaxed">
              Reflects your internal consciousness (Manas), emotional rhythm, subconscious memory, and instinctual needs.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#181F2F] text-[11px] text-[#939EAF]">
            Mind Archetype: <strong className="text-[#E7EBF5]">Deep Intuition & Thought</strong>
          </div>
        </div>

        {/* Sun Sign / Surya Rashi */}
        <div className="bg-[#0C1019] border border-[#1E2536] p-5 rounded-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#8E97AB] mb-2">
              <span className="font-cinzel font-semibold text-[#B89647]">Surya (Sun Sign)</span>
              <span>House {chart.sunSign.house}</span>
            </div>
            <h3 className="font-cinzel text-lg font-bold text-[#F0E6D2] mb-1">
              {chart.sunSign.sign}
            </h3>
            <div className="text-xs text-[#A2ACBF] mb-2">
              Nakshatra: <strong className="text-[#DFCA93]">{chart.sunSign.nakshatra}</strong> (Pada {chart.sunSign.pada})
            </div>
            <p className="text-xs text-[#7B8497] leading-relaxed">
              Represents your Atman (Soul purpose), authority, inner self-respect, and spiritual compass.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#181F2F] text-[11px] text-[#939EAF]">
            Vedic Solar Placement: <strong className="text-[#E7EBF5]">Sidereal Lahiri</strong>
          </div>
        </div>
      </div>

      {/* Active Vimshottari Dasha Banner */}
      <div className="bg-[#0F1420] border border-[#242D40] rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1C2333] pb-4 mb-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#B89647] font-semibold flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>Current Life Epoch (Vimshottari Dasha)</span>
            </div>
            <h3 className="font-cinzel text-lg font-bold text-[#F4EFE6] mt-0.5">
              {chart.dashas.currentMahadasha.planet} Mahadasha
            </h3>
          </div>
          <div className="text-xs text-[#A2ACBF] text-right">
            Active: <span className="text-[#F0E6D2] font-mono">{chart.dashas.currentMahadasha.startDate}</span> to{' '}
            <span className="text-[#F0E6D2] font-mono">{chart.dashas.currentMahadasha.endDate}</span>
          </div>
        </div>

        <p className="text-xs text-[#A0A9BC] leading-relaxed mb-4">
          <strong>Key Archetypal Themes:</strong> {chart.dashas.currentMahadasha.keyThemes}
        </p>

        <div className="bg-[#141A28] p-3 rounded border border-[#20293B] flex items-center justify-between text-xs">
          <span className="text-[#8D97AB]">
            Active Sub-Period (Antardasha): <strong className="text-[#E7EBF5]">{chart.dashas.currentAntardasha.subPlanet}</strong>
          </span>
          <span className="text-[#DFCA93] font-medium">
            Influencing present decisions & focus
          </span>
        </div>
      </div>

      {/* Auspicious Vedic Yogas Detected */}
      {chart.yogas.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-cinzel text-base font-bold text-[#F4EFE6] flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#B89647]" />
              <span>Auspicious Vedic Yogas Formed ({chart.yogas.length})</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chart.yogas.map((yoga, i) => (
              <div key={i} className="bg-[#0C1019] border border-[#1E2536] p-4 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-cinzel text-sm font-bold text-[#F0E6D2]">
                    {yoga.name} <span className="font-normal text-xs text-[#8A95AA]">({yoga.sanskritName})</span>
                  </div>
                  <span className="text-[10px] text-[#B89647] font-medium border border-[#B89647]/30 px-2 py-0.5 rounded">
                    {yoga.type} Yoga
                  </span>
                </div>
                <p className="text-xs text-[#8A95AA] leading-relaxed">
                  {yoga.description}
                </p>
                <div className="text-xs text-[#DFCA93] bg-[#121622] p-2 rounded border border-[#1B2130]">
                  <strong>Manifestation:</strong> {yoga.manifestation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Initial Reading Detailed Sections */}
      {initialReading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#1E2536] pb-3">
            <div>
              <h3 className="font-cinzel text-lg font-bold text-[#F4EFE6]">
                Your Astrological Snapshot & Initial Consultation
              </h3>
              <p className="text-xs text-[#7E889D]">
                Grounded in your exact sidereal planetary placements
              </p>
            </div>
            <button
              onClick={() => onSaveReading({
                title: initialReading.headline,
                category: 'initial',
                summary: initialReading.sections[0]?.content.slice(0, 180) + '...',
                fullContent: JSON.stringify(initialReading),
              })}
              className="flex items-center gap-1.5 text-xs text-[#B89647] hover:text-[#D8BC75] border border-[#2B354C] hover:border-[#B89647] px-3 py-1.5 rounded transition-all"
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span>Save Reading</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {initialReading.sections.map((sec, idx) => (
              <div
                key={idx}
                className="bg-[#0C1019] border border-[#1E2536] p-5 rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-cinzel text-sm font-bold text-[#F0E6D2]">
                    {sec.title}
                  </h4>
                  <span className="text-[10px] uppercase tracking-wider text-[#B89647] font-semibold">
                    {sec.category}
                  </span>
                </div>

                <div className="text-xs text-[#A0A9BC] leading-relaxed space-y-2">
                  {sec.content.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>

                {sec.astrologicalFactors && sec.astrologicalFactors.length > 0 && (
                  <div className="pt-2 border-t border-[#181F2F] flex flex-wrap gap-1.5">
                    {sec.astrologicalFactors.map((fact, fIdx) => (
                      <span
                        key={fIdx}
                        className="text-[10px] bg-[#141A28] border border-[#242E40] text-[#939FB4] px-2 py-0.5 rounded font-mono"
                      >
                        {fact}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Suggested Next Questions */}
          {initialReading.suggestedQuestions && initialReading.suggestedQuestions.length > 0 && (
            <div className="bg-[#0F1420] border border-[#242D40] rounded-xl p-5">
              <h4 className="font-cinzel text-xs font-semibold uppercase tracking-wider text-[#B89647] mb-3">
                Suggested Next Inquiries with {BRAND_CONFIG.ASTROLOGER_NAME}
              </h4>
              <div className="flex flex-wrap gap-2">
                {initialReading.suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => onAskQuestion(q)}
                    className="flex items-center gap-1.5 text-xs text-[#D8DFEE] bg-[#141926] hover:bg-[#1E2538] hover:text-[#FFFFFF] border border-[#232B3E] px-3.5 py-2 rounded transition-colors text-left"
                  >
                    <span>"{q}"</span>
                    <ArrowRight className="h-3 w-3 text-[#B89647]" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
