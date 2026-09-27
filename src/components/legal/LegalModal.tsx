import React, { useState, useEffect } from 'react';
import { X, Shield, FileText, Compass, AlertCircle, Cookie, Mail, Info } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brand.ts';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPage?: string;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialPage = 'privacy-policy',
}) => {
  const [currentPage, setCurrentPage] = useState<string>(initialPage);

  useEffect(() => {
    if (initialPage) {
      setCurrentPage(initialPage);
    }
  }, [initialPage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070B]/85 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#0D121C] border border-[#242D40] rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2536] bg-[#0A0D15]">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-[#B89647]" />
            <h3 className="font-cinzel text-sm font-bold text-[#F4EFE6]">
              {BRAND_CONFIG.BRAND_NAME} Legal & Trust Center
            </h3>
          </div>
          <button onClick={onClose} className="text-[#788296] hover:text-[#FFFFFF]">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#1E2536] bg-[#0C1019] text-xs overflow-x-auto no-scrollbar">
          <button
            onClick={() => setCurrentPage('privacy-policy')}
            className={`px-4 py-3 whitespace-nowrap font-medium transition-colors ${
              currentPage === 'privacy-policy'
                ? 'text-[#F4E3B2] border-b-2 border-[#B89647]'
                : 'text-[#8A95AA] hover:text-[#FFFFFF]'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setCurrentPage('terms-of-service')}
            className={`px-4 py-3 whitespace-nowrap font-medium transition-colors ${
              currentPage === 'terms-of-service'
                ? 'text-[#F4E3B2] border-b-2 border-[#B89647]'
                : 'text-[#8A95AA] hover:text-[#FFFFFF]'
            }`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setCurrentPage('disclaimer')}
            className={`px-4 py-3 whitespace-nowrap font-medium transition-colors ${
              currentPage === 'disclaimer'
                ? 'text-[#F4E3B2] border-b-2 border-[#B89647]'
                : 'text-[#8A95AA] hover:text-[#FFFFFF]'
            }`}
          >
            Astrology Disclaimer
          </button>
          <button
            onClick={() => setCurrentPage('cookie-policy')}
            className={`px-4 py-3 whitespace-nowrap font-medium transition-colors ${
              currentPage === 'cookie-policy'
                ? 'text-[#F4E3B2] border-b-2 border-[#B89647]'
                : 'text-[#8A95AA] hover:text-[#FFFFFF]'
            }`}
          >
            Cookie Policy
          </button>
          <button
            onClick={() => setCurrentPage('refund-policy')}
            className={`px-4 py-3 whitespace-nowrap font-medium transition-colors ${
              currentPage === 'refund-policy'
                ? 'text-[#F4E3B2] border-b-2 border-[#B89647]'
                : 'text-[#8A95AA] hover:text-[#FFFFFF]'
            }`}
          >
            Refund Policy
          </button>
          <button
            onClick={() => setCurrentPage('contact')}
            className={`px-4 py-3 whitespace-nowrap font-medium transition-colors ${
              currentPage === 'contact'
                ? 'text-[#F4E3B2] border-b-2 border-[#B89647]'
                : 'text-[#8A95AA] hover:text-[#FFFFFF]'
            }`}
          >
            Contact
          </button>
          <button
            onClick={() => setCurrentPage('about')}
            className={`px-4 py-3 whitespace-nowrap font-medium transition-colors ${
              currentPage === 'about'
                ? 'text-[#F4E3B2] border-b-2 border-[#B89647]'
                : 'text-[#8A95AA] hover:text-[#FFFFFF]'
            }`}
          >
            About
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-[#C8D1E3] leading-relaxed flex-1">
          {/* PRIVACY POLICY */}
          {currentPage === 'privacy-policy' && (
            <div className="space-y-4">
              <h4 className="font-cinzel text-base font-bold text-[#F0E6D2]">
                Privacy & Data Governance Policy
              </h4>
              <p className="text-[11px] text-[#788296]">Last updated: September 2026</p>

              <h5 className="font-semibold text-[#E7EBF5] pt-2">1. Birth Information Collection</h5>
              <p>
                To generate your personalized Vedic astrology chart (Kundli), {BRAND_CONFIG.BRAND_NAME} collects your name, date of birth, time of birth, and birthplace. This information is required mathematically to calculate your Ascendant (Lagna), planetary degrees, and Vimshottari Dasha sequence.
              </p>

              <h5 className="font-semibold text-[#E7EBF5] pt-2">2. Processing & AI Architecture</h5>
              <p>
                Your astronomical coordinates are calculated deterministically on our server. During consultation sessions with Acharya Arya, your chart coordinates and recent conversational questions are passed securely to our server-side API. We never sell or license your birth details to third-party ad brokers.
              </p>

              <h5 className="font-semibold text-[#E7EBF5] pt-2">3. User Data Rights & Account Deletion</h5>
              <p>
                You retain complete ownership over your data. You may export your readings, clear your consultation history, or permanently delete your profile and calculated chart data at any time via Platform Settings.
              </p>
            </div>
          )}

          {/* TERMS OF SERVICE */}
          {currentPage === 'terms-of-service' && (
            <div className="space-y-4">
              <h4 className="font-cinzel text-base font-bold text-[#F0E6D2]">
                Terms of Service
              </h4>
              <p className="text-[11px] text-[#788296]">Last updated: September 2026</p>

              <h5 className="font-semibold text-[#E7EBF5] pt-2">1. Acceptance of Terms</h5>
              <p>
                By accessing {BRAND_CONFIG.BRAND_NAME}, you agree to utilize our digital astrology platform in a respectful, lawful manner for personal contemplation, psychological self-discovery, and spiritual insight.
              </p>

              <h5 className="font-semibold text-[#E7EBF5] pt-2">2. Nature of the Digital Astrologer</h5>
              <p>
                Acharya Arya is an intelligent digital astrologer trained in the classical canons of Vedic Jyotish (Parashara and Jaimini). The consultations offered are intended for exploratory, reflective, and educational purposes.
              </p>
            </div>
          )}

          {/* DISCLAIMER */}
          {currentPage === 'disclaimer' && (
            <div className="space-y-4">
              <h4 className="font-cinzel text-base font-bold text-[#F0E6D2]">
                Ethical Astrology & Guidance Disclaimer
              </h4>
              <div className="bg-[#1A1813] border border-[#483B1E] p-4 rounded-lg text-xs text-[#E5D099] leading-relaxed">
                <strong>Core Notice:</strong> Vedic astrology (Jyotish) is an interpretive tradition mapping astronomical rhythms with human experiences. It does not possess empirical scientific certainty and does not substitute for qualified professional services.
              </div>

              <h5 className="font-semibold text-[#E7EBF5] pt-2">1. Health & Medical Limitations</h5>
              <p>
                Under no circumstances should any chart reading or discussion regarding the 6th or 8th Bhavas be interpreted as medical diagnosis, psychiatric therapy, or clinical treatment advice. Always seek advice from licensed physicians.
              </p>

              <h5 className="font-semibold text-[#E7EBF5] pt-2">2. Financial & Investment Limitations</h5>
              <p>
                Discussions regarding wealth houses (2nd and 11th Bhavas) or Dhana yogas illustrate general karmic tendencies and material discipline. They are strictly not certified investment, stock market, tax, or legal guidance.
              </p>
            </div>
          )}

          {/* COOKIE POLICY */}
          {currentPage === 'cookie-policy' && (
            <div className="space-y-4">
              <h4 className="font-cinzel text-base font-bold text-[#F0E6D2]">
                Cookie & Storage Policy
              </h4>
              <p>
                {BRAND_CONFIG.BRAND_NAME} uses cookies and browser local storage to retain your active chart settings, selected chart visualization styles (North Indian vs South Indian), and session security.
              </p>
              <div className="space-y-2 pt-2 text-xs">
                <div><strong>Strictly Necessary:</strong> Essential session cookies for maintaining authentication and chart calculations.</div>
                <div><strong>Preferences:</strong> Stores your preference for beginner/advanced mode and sound toggle.</div>
                <div><strong>Analytics:</strong> Aggregated anonymous latency and error metrics to improve server uptime.</div>
              </div>
            </div>
          )}

          {/* REFUND POLICY */}
          {currentPage === 'refund-policy' && (
            <div className="space-y-4">
              <h4 className="font-cinzel text-base font-bold text-[#F0E6D2]">
                Refund & Satisfaction Policy
              </h4>
              <p>
                Our core platform calculations, initial chart snapshot, and interactive Kundli features are provided openly to help you explore your birth chart. Any future premium reports or consultations will carry a 14-day transparent refund policy if technical inaccuracies arise.
              </p>
            </div>
          )}

          {/* CONTACT */}
          {currentPage === 'contact' && (
            <div className="space-y-4">
              <h4 className="font-cinzel text-base font-bold text-[#F0E6D2]">
                Contact & Inquiries
              </h4>
              <p>
                We welcome inquiries, feedback, and astrological collaboration requests.
              </p>
              <div className="bg-[#121622] p-4 rounded-lg border border-[#20283A] space-y-2 text-xs">
                <div><strong>Email:</strong> {BRAND_CONFIG.CONTACT_EMAIL}</div>
                <div><strong>Platform:</strong> {BRAND_CONFIG.DOMAIN}</div>
                <div><strong>Inquiry Response Time:</strong> Within 24-48 business hours</div>
              </div>
            </div>
          )}

          {/* ABOUT */}
          {currentPage === 'about' && (
            <div className="space-y-4">
              <h4 className="font-cinzel text-base font-bold text-[#F0E6D2]">
                About {BRAND_CONFIG.BRAND_NAME} & {BRAND_CONFIG.ASTROLOGER_NAME}
              </h4>
              <p>
                {BRAND_CONFIG.ASTROLOGER_BIO}
              </p>
              <p>
                Our mission is to return digital astrology to its authentic roots: deterministic astronomical calculations, verifiable planetary longitudes, and compassionate, context-rich conversation that respects the intelligence and dignity of the querent.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
