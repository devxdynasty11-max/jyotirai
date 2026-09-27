import React, { useState } from 'react';
import { Compass, Sparkles, Moon, Sun, ArrowRight, ShieldCheck, HelpCircle, MessageSquare, ChevronDown, CheckCircle2, Star, Eye } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brand.ts';

interface LandingPageProps {
  onStartOnboarding: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartOnboarding }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const sampleQuestions = [
    { text: 'career mein kya karna chahiye?', tag: 'Vocation & Status' },
    { text: 'meri love life and marriage timing kaisi hai?', tag: 'Partnership' },
    { text: 'why do I constantly overthink?', tag: 'Moon & Mind' },
    { text: 'business mere liye sahi rahega ya job?', tag: 'Enterprise' },
    { text: 'what is the most defining strength in my chart?', tag: 'Core Soul' },
    { text: 'next year kaisa rahega dasha ke hisaab se?', tag: 'Timing Periods' },
  ];

  const revealCategories = [
    {
      title: 'Core Nature & Soul',
      bhava: 'Tanu Bhava (1st House)',
      description: 'Understand the temperament of your Lagna (Ascendant), your instinctive reactions, physical vitality, and underlying soul orientation.',
    },
    {
      title: 'Mind & Emotional Temperament',
      bhava: 'Chandra & Nakshatra',
      description: 'Your Moon placement reveals your internal emotional weather, subconscious needs, stress triggers, and instinctual empathy.',
    },
    {
      title: 'Career Tendencies & Legacy',
      bhava: 'Karma Bhava (10th House)',
      description: 'Discover your vocational inclinations, leadership qualities, suitable environments, and natural authority patterns.',
    },
    {
      title: 'Love & Partnerships',
      bhava: 'Yuvati Bhava (7th House)',
      description: 'Explore attraction patterns, relationship expectations, balance between freedom and commitment, and marital themes.',
    },
    {
      title: 'Wealth & Material Flow',
      bhava: 'Dhana & Labha (2nd & 11th)',
      description: 'Examine wealth accumulation tendencies, earning patterns, risk tolerance, and natural relationship with liquid abundance.',
    },
    {
      title: 'Vimshottari Life Periods',
      bhava: '120-Year Cosmic Clock',
      description: 'Pinpoint which planetary period (Mahadasha and Antardasha) is currently unfolding and the archetypal themes it awakens.',
    },
  ];

  const faqs = [
    {
      q: 'How is this different from a generic horoscope or standard AI chatbot?',
      a: 'Generic horoscopes only look at Sun signs. Furthermore, standard AI chatbots hallucinate celestial coordinates and have no astronomical calculation engine. In Jyotir, your exact planetary longitudes, Ascendant, 12 Bhavas, and Vimshottari Dashas are mathematically calculated using the ancient Sidereal Lahiri Ayanamsha before Acharya Arya speaks. Every single observation is grounded in verifiable astrological positions.',
    },
    {
      q: 'What if I don’t know my exact birth time?',
      a: 'You can check the "I don’t know my exact birth time" option. In this case, Acharya Arya calculates your Moon sign, Sun sign, and planetary aspects based on solar dawn charts, while respectfully explaining that house boundaries and Ascendant degrees become approximate.',
    },
    {
      q: 'Can I type questions in casual language or Hinglish?',
      a: 'Yes. Acharya Arya understands colloquial phrasing, casual English, typos, shorthand, and mixed Hindi/English (Hinglish) such as "career mein aage kya hoga?" or "meri shaadi kab tak ho sakti hai?". You don’t need to remember complex Sanskrit terms.',
    },
    {
      q: 'Does Acharya Arya remember our ongoing conversation?',
      a: 'Yes. During your consultation, contextual memory is maintained. If you discuss your career tendencies and then simply type "business?", Acharya understands you are asking whether your chart favors entrepreneurship versus salaried work.',
    },
    {
      q: 'Are my birth details kept confidential?',
      a: 'Absolutely. Your birth details (date, time, location) are used solely to compute your astrological chart coordinates and are never sold or shared with third-party advertisers.',
    },
    {
      q: 'Does astrology guarantee my future?',
      a: 'No. Authentic Vedic astrology is an art of understanding cosmic weather, karmic momentum, and personal tendencies—not a rigid fatalistic script. Free will, conscious awareness (Viveka), and ethical effort remain paramount in shaping your life.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 border-b border-[#1C2232]">
        {/* Subtle Celestial Glow Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#B89647]/10 via-[#2A3146]/20 to-transparent blur-3xl pointer-events-none rounded-full" />
        
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Subtle Astrologer Kicker */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs text-[#E1CA8E] bg-[#141A28] border border-[#2B354C] rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D6B25E]" />
            <span>Consultations guided by {BRAND_CONFIG.ASTROLOGER_NAME}</span>
          </div>

          <h1 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F7F2E7] leading-[1.15] mb-6">
            Your Birth Chart <br />
            <span className="bg-gradient-to-r from-[#F0DBA5] via-[#C9A654] to-[#99742B] bg-clip-text text-transparent">
              Has a Story.
            </span>
          </h1>

          <p className="font-cormorant text-lg sm:text-2xl text-[#B9C2D4] max-w-3xl mx-auto leading-relaxed mb-10">
            {BRAND_CONFIG.SUBTITLE} Converse with an intelligent digital astrologer who understands your exact Kundli, your planetary dashas, and your life questions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartOnboarding}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-[#D6B25E] to-[#B38D3C] hover:from-[#E3C375] hover:to-[#C69F4B] text-[#0A0D14] font-semibold text-sm rounded shadow-lg shadow-[#B89647]/10 transition-all hover:scale-[1.02]"
            >
              <Compass className="h-4 w-4" />
              <span>Discover My Chart</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 border border-[#2A3347] hover:border-[#4B5875] text-[#C5CEE0] hover:text-[#FFFFFF] text-sm font-medium rounded transition-all bg-[#0F1420]/60"
            >
              <span>Explore How It Works</span>
              <ChevronDown className="h-4 w-4" />
            </a>
          </div>

          {/* Quick Pillars */}
          <div className="mt-14 pt-8 border-t border-[#1C2333] grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-[#8E97AB]">
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#B89647]" />
              <span>Sidereal Lahiri Ayanamsha</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#B89647]" />
              <span>Full Vimshottari Dashas</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#B89647]" />
              <span>Hinglish & Casual Phrasing</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#B89647]" />
              <span>Zero Fabricated Coordinates</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-[#090D15] border-b border-[#1C2232]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-widest text-[#B89647] font-semibold">
              Deterministic Process
            </span>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#F4EFE6] mt-2">
              Three Steps to Deep Clarity
            </h2>
            <p className="text-sm text-[#8E97AB] mt-2 max-w-xl mx-auto">
              We never guess planetary positions. Calculation precedes interpretation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#0F1420] border border-[#202737] p-6 rounded-lg relative">
              <div className="text-3xl font-cinzel font-bold text-[#2A344A] mb-4">01</div>
              <h3 className="font-cinzel text-base font-semibold text-[#F0E6D2] mb-2">
                Enter Your Birth Data
              </h3>
              <p className="text-xs text-[#8E97AB] leading-relaxed">
                Provide your date, time, and city of birth. Our verified global database automatically resolves exact latitude, longitude, and historical timezone offsets.
              </p>
            </div>

            <div className="bg-[#0F1420] border border-[#202737] p-6 rounded-lg relative">
              <div className="text-3xl font-cinzel font-bold text-[#2A344A] mb-4">02</div>
              <h3 className="font-cinzel text-base font-semibold text-[#F0E6D2] mb-2">
                Your Kundli is Calculated
              </h3>
              <p className="text-xs text-[#8E97AB] leading-relaxed">
                Our astronomical engine maps your Ascendant, Sun, Moon, 9 Grahas, 27 Nakshatras, 12 Bhavas, and 120-year Vimshottari timeline with mathematical precision.
              </p>
            </div>

            <div className="bg-[#0F1420] border border-[#202737] p-6 rounded-lg relative">
              <div className="text-3xl font-cinzel font-bold text-[#2A344A] mb-4">03</div>
              <h3 className="font-cinzel text-base font-semibold text-[#F0E6D2] mb-2">
                Consult With Your Astrologer
              </h3>
              <p className="text-xs text-[#8E97AB] leading-relaxed">
                Receive an extensive initial breakdown across core life areas, then converse freely with Acharya Arya about career, marriage, or current challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: WHAT YOUR CHART REVEALS */}
      <section className="py-20 bg-[#07090E] border-b border-[#1C2232]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-widest text-[#B89647] font-semibold">
              The 12 Bhavas & Planets
            </span>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#F4EFE6] mt-2">
              What Your Chart Reveals
            </h2>
            <p className="text-sm text-[#8E97AB] mt-2 max-w-xl mx-auto">
              Astrology is not a single sign. It is a harmonious matrix of 12 distinct life dimensions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {revealCategories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-[#0C1019] border border-[#1E2638] hover:border-[#38435D] p-6 rounded-lg transition-all hover:-translate-y-0.5"
              >
                <div className="text-[11px] font-medium text-[#C4A35B] uppercase tracking-wider mb-1">
                  {cat.bhava}
                </div>
                <h3 className="font-cinzel text-base font-bold text-[#E7E9EE] mb-2.5">
                  {cat.title}
                </h3>
                <p className="text-xs text-[#8A93A7] leading-relaxed">
                  {cat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: MEET YOUR ASTROLOGER */}
      <section className="py-20 bg-[#0A0E18] border-b border-[#1C2232]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#111726] to-[#0A0D15] border border-[#252F44] rounded-xl p-8 sm:p-12 relative overflow-hidden">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-xs text-[#B89647] font-medium uppercase tracking-wider mb-3">
                <Star className="h-3.5 w-3.5 fill-[#B89647]" />
                <span>The Astrologer Persona</span>
              </div>
              <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#F4EFE6] mb-4">
                Meet {BRAND_CONFIG.ASTROLOGER_NAME}
              </h2>
              <p className="font-cormorant text-lg text-[#C7D0E2] leading-relaxed mb-6">
                "{BRAND_CONFIG.ASTROLOGER_BIO}"
              </p>
              <div className="space-y-2.5 text-xs text-[#959EAF] mb-8">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#B89647]" />
                  <span>Never repeats canned disclaimers or robotic generic pleasantries.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#B89647]" />
                  <span>Connects every conclusion directly back to specific Bhavas and Graha aspects.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#B89647]" />
                  <span>Empathetic to emotional distress, career confusion, and relational transitions.</span>
                </div>
              </div>
              <button
                onClick={onStartOnboarding}
                className="px-6 py-3 bg-[#B89647] hover:bg-[#C9A654] text-[#0A0D14] text-xs font-semibold uppercase tracking-wider rounded transition-all"
              >
                Begin Your Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: ASK ANYTHING */}
      <section className="py-20 bg-[#07090E] border-b border-[#1C2232]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-[#B89647] font-semibold">
              Natural Dialogue
            </span>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#F4EFE6] mt-2">
              Ask Anything. Converse Naturally.
            </h2>
            <p className="text-sm text-[#8E97AB] mt-2 max-w-xl mx-auto">
              No need to learn astrology jargon. Speak in everyday language, casual shorthand, or Hinglish.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {sampleQuestions.map((sq, i) => (
              <div
                key={i}
                className="bg-[#0F1420] border border-[#1E2536] p-4 rounded-lg flex flex-col justify-between"
              >
                <div className="flex items-start gap-2.5 mb-2">
                  <MessageSquare className="h-4 w-4 text-[#B89647] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#D8DFEE] font-medium italic">
                    "{sq.text}"
                  </span>
                </div>
                <div className="text-[10px] text-[#7E889D] uppercase tracking-wider">
                  Category: {sq.tag}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-xs text-[#7B8397]">
              Context-aware: If you ask about career and follow up with "business?", Acharya understands the connection immediately.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6: FAQ */}
      <section className="py-20 bg-[#090D15] border-b border-[#1C2232]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-[#B89647] font-semibold">
              Clarifications
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#F4EFE6] mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-[#1E2536] bg-[#0E121C] rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm font-medium text-[#E2E6EE] hover:text-[#F4E3B2] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#8A93A7] transition-transform duration-200 shrink-0 ml-4 ${
                      openFaq === idx ? 'rotate-180 text-[#B89647]' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-[#8E97AB] leading-relaxed border-t border-[#181F2E] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: FINAL CTA */}
      <section className="py-20 bg-[#06080E] text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#B89647]/10 text-[#B89647] mb-6">
            <Compass className="h-6 w-6" />
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#F4EFE6] mb-4">
            Your Chart is Unique. Start Discovering It.
          </h2>
          <p className="font-cormorant text-lg text-[#9EA7BC] max-w-xl mx-auto mb-8">
            Create your profile in 60 seconds. Experience an astrological consultation rooted in classical Vedic calculations and genuine conversational depth.
          </p>
          <button
            onClick={onStartOnboarding}
            className="px-8 py-4 bg-gradient-to-r from-[#D6B25E] to-[#B38D3C] hover:from-[#E3C375] hover:to-[#C69F4B] text-[#0A0D14] font-semibold text-sm rounded shadow-lg shadow-[#B89647]/10 transition-all hover:scale-[1.02]"
          >
            Discover My Chart Now
          </button>
        </div>
      </section>
    </div>
  );
};
