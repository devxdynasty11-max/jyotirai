import React, { useState, useEffect } from 'react';
import { Cookie, Shield, Check, X, Settings } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brand.ts';

interface CookieBannerProps {
  forceOpenPreferences?: boolean;
  onClosePreferences?: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({
  forceOpenPreferences,
  onClosePreferences,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState<boolean>(false);

  const [preferences, setPreferences] = useState({
    necessary: true,
    preferences: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem('jyotir_cookie_consent');
    if (!savedConsent) {
      setIsVisible(true);
    } else {
      try {
        setPreferences(JSON.parse(savedConsent));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (forceOpenPreferences) {
      setIsPreferencesOpen(true);
    }
  }, [forceOpenPreferences]);

  const saveConsent = (prefs: typeof preferences) => {
    localStorage.setItem('jyotir_cookie_consent', JSON.stringify(prefs));
    setIsVisible(false);
    setIsPreferencesOpen(false);
    if (onClosePreferences) onClosePreferences();

    // Send to backend
    fetch('/api/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prefs),
    }).catch(() => {});
  };

  const handleAcceptAll = () => {
    const allOn = { necessary: true, preferences: true, analytics: true, marketing: true };
    setPreferences(allOn);
    saveConsent(allOn);
  };

  const handleRejectNonEssential = () => {
    const essentialOnly = { necessary: true, preferences: false, analytics: false, marketing: false };
    setPreferences(essentialOnly);
    saveConsent(essentialOnly);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  if (!isVisible && !isPreferencesOpen) return null;

  return (
    <>
      {/* Small Floating Cookie Banner at bottom */}
      {isVisible && !isPreferencesOpen && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[#0E131E] border border-[#273248] rounded-xl p-4 sm:p-5 shadow-2xl backdrop-blur-md">
          <div className="flex items-start gap-3">
            <Cookie className="h-5 w-5 text-[#B89647] shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-cinzel text-xs font-bold text-[#F0E6D2]">
                Cookie & Privacy Choices
              </h4>
              <p className="text-[11px] text-[#8E97AB] leading-relaxed">
                We use cookies and browser storage to preserve your birth chart configurations, visual preferences, and session state.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={handleAcceptAll}
                  className="px-3 py-1.5 bg-[#B89647] hover:bg-[#C9A654] text-[#0A0D14] text-xs font-semibold rounded transition-colors"
                >
                  Accept All
                </button>
                <button
                  onClick={handleRejectNonEssential}
                  className="px-3 py-1.5 bg-[#141926] hover:bg-[#1E2536] text-[#A2ACBF] hover:text-[#FFFFFF] border border-[#273146] text-xs rounded transition-colors"
                >
                  Necessary Only
                </button>
                <button
                  onClick={() => setIsPreferencesOpen(true)}
                  className="text-xs text-[#B89647] hover:underline ml-1"
                >
                  Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {isPreferencesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070B]/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0E131E] border border-[#242D40] rounded-xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E2536] pb-3">
              <div className="flex items-center gap-2">
                <Cookie className="h-5 w-5 text-[#B89647]" />
                <h3 className="font-cinzel text-sm font-bold text-[#F4EFE6]">
                  Cookie Consent Preferences
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsPreferencesOpen(false);
                  if (onClosePreferences) onClosePreferences();
                }}
                className="text-[#788296] hover:text-[#FFFFFF]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#121724] p-3 rounded border border-[#202738] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#E7EBF5]">Strictly Necessary</div>
                  <div className="text-[11px] text-[#7E889D]">Essential for chart rendering & security</div>
                </div>
                <span className="text-[10px] text-[#48D597] font-semibold">Always Active</span>
              </div>

              <div className="bg-[#121724] p-3 rounded border border-[#202738] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#E7EBF5]">Platform Preferences</div>
                  <div className="text-[11px] text-[#7E889D]">Remembers beginner/advanced view & chart styles</div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.preferences}
                  onChange={(e) => setPreferences({ ...preferences, preferences: e.target.checked })}
                  className="rounded border-[#2C364D] bg-[#141A28] text-[#B89647]"
                />
              </div>

              <div className="bg-[#121724] p-3 rounded border border-[#202738] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#E7EBF5]">Anonymous Telemetry</div>
                  <div className="text-[11px] text-[#7E889D]">Helps us evaluate calculation speed and error rates</div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="rounded border-[#2C364D] bg-[#141A28] text-[#B89647]"
                />
              </div>

              <div className="bg-[#121724] p-3 rounded border border-[#202738] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#E7EBF5]">Marketing & Social</div>
                  <div className="text-[11px] text-[#7E889D]">Optional personalized promotional features</div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  className="rounded border-[#2C364D] bg-[#141A28] text-[#B89647]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E2536]">
              <button
                onClick={handleSavePreferences}
                className="px-5 py-2 bg-[#B89647] hover:bg-[#C9A654] text-[#0A0D14] text-xs font-semibold rounded transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
