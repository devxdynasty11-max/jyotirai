import React, { useState, useEffect, useRef } from 'react';
import { VedicChartData } from '../../services/astrology/types.ts';
import { BRAND_CONFIG } from '../../config/brand.ts';
import { Sparkles, Bookmark, ArrowRight, Compass, Shield, Clock, Heart, Briefcase, DollarSign, Users, User, Flame } from 'lucide-react';

interface LifeAreaTabProps {
  chart: VedicChartData;
  onAskQuestion: (q: string) => void;
  onSaveReading: (reading: any) => void;
}

const CATEGORIES = [
  { id: 'personality', label: 'Personality & Soul', icon: User, bhava: '1st Bhava' },
  { id: 'career', label: 'Career & Legacy', icon: Briefcase, bhava: '10th Bhava' },
  { id: 'love', label: 'Love & Romance', icon: Heart, bhava: '5th & 7th Bhava' },
  { id: 'marriage', label: 'Marriage & Partnership', icon: Users, bhava: '7th Bhava' },
  { id: 'money', label: 'Wealth & Prosperity', icon: DollarSign, bhava: '2nd & 11th Bhava' },
  { id: 'family', label: 'Family & Roots', icon: Users, bhava: '2nd & 4th Bhava' },
  { id: 'life-period', label: 'Vimshottari Life Periods', icon: Clock, bhava: 'Dashas' },
];

export const LifeAreaTab: React.FC<LifeAreaTabProps> = ({
  chart,
  onAskQuestion,
  onSaveReading,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('career');
  const [readingsCache, setReadingsCache] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const currentAbortRef = useRef<AbortController | null>(null);

  const fetchCategoryReading = async (catId: string) => {
    if (readingsCache[catId]) {
      setLoading(false);
      setError('');
      return;
    }

    // Abort previous in-flight request to prevent race conditions or hanging requests
    if (currentAbortRef.current) {
      currentAbortRef.current.abort();
    }

    const abortController = new AbortController();
    currentAbortRef.current = abortController;

    // Safety client-side timeout (80s) to guarantee UI never gets stuck
    const clientTimeout = setTimeout(() => {
      abortController.abort(new Error('Request timed out.'));
    }, 80000);

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/astrology/category-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chart, category: catId }),
        signal: abortController.signal,
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success && data.data) {
        setReadingsCache((prev) => ({ ...prev, [catId]: data.data }));
      } else {
        setError(data.error || data.details || 'Acharya Arya could not complete this synthesis. Please tap Retry.');
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || err.message?.includes('timed out')) {
        setError('Astrological synthesis took too long. Please tap Retry to try again.');
      } else {
        setError(err.message || 'Unable to consult chart at this moment. Please try again.');
      }
    } finally {
      clearTimeout(clientTimeout);
      if (currentAbortRef.current === abortController) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCategoryReading(activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    return () => {
      if (currentAbortRef.current) {
        currentAbortRef.current.abort();
      }
    };
  }, []);

  const currentReading = readingsCache[activeCategory];

  return (
    <div className="space-y-6">
      {/* Category Tabs Header */}
      <div className="border-b border-[#1E2536] pb-4">
        <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#F4EFE6] mb-1">
          Life Dimensions Analysis
        </h2>
        <p className="text-xs text-[#8E97AB]">
          Deep Vedic synthesis across the fundamental houses of human experience
        </p>

        {/* Category Pills/Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#B89647] text-[#0A0D14] font-bold shadow-sm'
                    : 'bg-[#101420] text-[#8E97AB] hover:text-[#FFFFFF] border border-[#20283A] hover:border-[#38435C]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{cat.label}</span>
                <span className={`text-[10px] ${isActive ? 'text-[#0A0D14]/70' : 'text-[#646D82]'}`}>
                  ({cat.bhava})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-[#0C1019] border border-[#1E2536] rounded-xl p-12 text-center space-y-3">
          <Sparkles className="h-6 w-6 text-[#B89647] animate-spin mx-auto" />
          <h3 className="font-cinzel text-sm font-semibold text-[#E7EBF5]">
            Acharya Arya is synthesizing your chart...
          </h3>
          <p className="text-xs text-[#7B8497] max-w-sm mx-auto">
            Examining relevant Bhavas, planetary aspects, and active Vimshottari influences.
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-[#2D1619] border border-[#542127] rounded-lg p-5 text-center text-xs text-[#FF8E96]">
          <p>{error}</p>
          <button
            onClick={() => fetchCategoryReading(activeCategory)}
            className="mt-3 px-4 py-1.5 bg-[#B89647] text-[#0A0D14] font-semibold rounded"
          >
            Retry Reading
          </button>
        </div>
      )}

      {/* Reading Content */}
      {currentReading && !loading && (
        <div className="space-y-6">
          {/* Main Title & Astrologer Synthesis */}
          <div className="bg-[#0F1420] border border-[#222B3D] rounded-xl p-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1C2333] pb-4 mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#B89647] font-semibold">
                  Detailed Vedic Reading
                </span>
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#F4EFE6] mt-0.5">
                  {currentReading.title}
                </h3>
              </div>
              <button
                onClick={() => onSaveReading({
                  title: `${CATEGORIES.find(c => c.id === activeCategory)?.label}: ${currentReading.title}`,
                  category: activeCategory,
                  summary: currentReading.overview?.slice(0, 160) + '...',
                  fullContent: JSON.stringify(currentReading),
                })}
                className="flex items-center gap-1.5 text-xs text-[#B89647] hover:text-[#D8BC75] border border-[#2B354C] hover:border-[#B89647] px-3 py-1.5 rounded transition-all shrink-0"
              >
                <Bookmark className="h-3.5 w-3.5" />
                <span>Save to Collection</span>
              </button>
            </div>

            <p className="font-cormorant text-base sm:text-lg text-[#CCD6E8] leading-relaxed">
              "{currentReading.overview}"
            </p>
          </div>

          {/* Structured Insights with Astrological Factors and Practical Meanings */}
          <div className="space-y-4">
            <h4 className="font-cinzel text-sm font-bold text-[#E2E6EE] uppercase tracking-wider">
              Specific Patterns & Astrological Factors
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentReading.insights?.map((item: any, i: number) => (
                <div key={i} className="bg-[#0C1019] border border-[#1E2536] p-5 rounded-lg space-y-3">
                  <h5 className="font-cinzel text-sm font-bold text-[#F0E6D2]">
                    {item.heading}
                  </h5>

                  {/* Astrological Reasoning */}
                  <div className="bg-[#121622] p-2.5 rounded border border-[#1C2233] text-xs space-y-1">
                    <span className="text-[10px] text-[#B89647] uppercase tracking-wider font-semibold block">
                      Astrological Factors:
                    </span>
                    <span className="text-[#C2CAD9] italic">
                      {item.astrologicalReasoning}
                    </span>
                  </div>

                  {/* Practical Manifestation */}
                  <div className="text-xs text-[#8E97AB] leading-relaxed">
                    <strong className="text-[#D8DFEE]">How this manifests: </strong>
                    {item.practicalMeaning}
                  </div>

                  {/* Guidance */}
                  {item.guidance && (
                    <div className="text-xs text-[#DFCA93] pt-2 border-t border-[#181F2F]">
                      <strong>Astrologer’s Guidance: </strong>
                      {item.guidance}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Timing & Outlook Banner */}
          {currentReading.timingAndOutlook && (
            <div className="bg-[#0B0E17] border border-[#273248] rounded-lg p-5">
              <div className="flex items-center gap-2 text-xs text-[#B89647] font-semibold uppercase tracking-wider mb-2">
                <Clock className="h-4 w-4" />
                <span>Cosmic Timing & Outlook</span>
              </div>
              <p className="text-xs text-[#A2ACBF] leading-relaxed">
                {currentReading.timingAndOutlook}
              </p>
            </div>
          )}

          {/* Suggested Follow-up Questions */}
          {currentReading.suggestedNextQuestions && currentReading.suggestedNextQuestions.length > 0 && (
            <div className="bg-[#0F1420] border border-[#242D40] rounded-xl p-5">
              <h4 className="font-cinzel text-xs font-semibold uppercase tracking-wider text-[#B89647] mb-3">
                Ask {BRAND_CONFIG.ASTROLOGER_NAME} directly about this
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentReading.suggestedNextQuestions.map((q: string, i: number) => (
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
