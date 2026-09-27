import React from 'react';
import { Compass, ShieldAlert, Heart, ExternalLink } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brand.ts';

interface FooterProps {
  onOpenLegal: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  return (
    <footer className="border-t border-[#1C2232] bg-[#06080E] text-[#8C94A7] text-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Astrologer */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-[#B89647] text-[#0A0D14]">
                <Compass className="h-4 w-4" />
              </div>
              <span className="font-cinzel text-lg font-bold tracking-wider text-[#F0E6D2]">
                {BRAND_CONFIG.BRAND_NAME}
              </span>
            </div>
            <p className="text-xs text-[#7B8397] max-w-md leading-relaxed">
              {BRAND_CONFIG.SUBTITLE} Digital Jyotish consultations led by {BRAND_CONFIG.ASTROLOGER_NAME}, uniting classical Parashari principles with conversational clarity.
            </p>
            <div className="text-xs text-[#A2AABF]">
              System: <span className="text-[#DFCA93]">{BRAND_CONFIG.ASTROLOGY_SYSTEM}</span>
            </div>
          </div>

          {/* Col 2: Life Dimensions */}
          <div>
            <h4 className="font-cinzel text-xs font-semibold uppercase tracking-wider text-[#E2E6EE] mb-3">
              Chart Explorations
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-[#F0E6D2] cursor-default">Tanu Bhava (Core Nature & Personality)</li>
              <li className="hover:text-[#F0E6D2] cursor-default">Karma Bhava (Vocation & Leadership)</li>
              <li className="hover:text-[#F0E6D2] cursor-default">Yuvati Bhava (Partnership & Marriage)</li>
              <li className="hover:text-[#F0E6D2] cursor-default">Dhana & Labha (Wealth & Prosperity)</li>
              <li className="hover:text-[#F0E6D2] cursor-default">Vimshottari Dashas (Planetary Epochs)</li>
            </ul>
          </div>

          {/* Col 3: Compliance & Trust */}
          <div>
            <h4 className="font-cinzel text-xs font-semibold uppercase tracking-wider text-[#E2E6EE] mb-3">
              Legal & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenLegal('privacy-policy')}
                  className="hover:text-[#F0E6D2] transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('terms-of-service')}
                  className="hover:text-[#F0E6D2] transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('disclaimer')}
                  className="hover:text-[#F0E6D2] transition-colors"
                >
                  Astrology Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('cookie-policy')}
                  className="hover:text-[#F0E6D2] transition-colors"
                >
                  Cookie Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('refund-policy')}
                  className="hover:text-[#F0E6D2] transition-colors"
                >
                  Refund Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('contact')}
                  className="hover:text-[#F0E6D2] transition-colors"
                >
                  Contact & Inquiries
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('about')}
                  className="hover:text-[#F0E6D2] transition-colors"
                >
                  About {BRAND_CONFIG.ASTROLOGER_NAME}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Ethical Astrology Notice */}
        <div className="border-t border-[#161C2A] pt-6 pb-6 text-xs text-[#6F778A] leading-relaxed">
          <div className="flex items-start gap-2 mb-2 text-[#9B8452]">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="font-medium text-[#D1B878]">Ethical Astrology & Guidance Notice:</span>
          </div>
          <p>
            Vedic astrology (Jyotish) is an ancient symbolic, interpretive discipline intended for self-understanding, psychological reflection, and contemplation of life seasons. It does not claim deterministic certainty and does not replace qualified medical, financial, investment, psychiatric, or legal counsel. We never fabricate chart positions or make absolute guarantees regarding future occurrences.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#161C2A] pt-6 text-xs text-[#636B7E]">
          <div>
            © {BRAND_CONFIG.YEAR} {BRAND_CONFIG.BRAND_NAME}. All rights reserved.
          </div>
          <div className="mt-2 sm:mt-0 flex items-center gap-1">
            <span>Calculations computed with Sidereal Lahiri Ayanamsha</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
