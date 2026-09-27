import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { LandingPage } from './components/landing/LandingPage.tsx';
import { OnboardingModal } from './components/onboarding/OnboardingModal.tsx';
import { VedicChartKundli } from './components/chart/VedicChartKundli.tsx';
import { OverviewTab } from './components/dashboard/OverviewTab.tsx';
import { LifeAreaTab } from './components/dashboard/LifeAreaTab.tsx';
import { AskAstrologerChat } from './components/chat/AskAstrologerChat.tsx';
import { SavedReadingsTab } from './components/history/SavedReadingsTab.tsx';
import { SettingsModal } from './components/settings/SettingsModal.tsx';
import { AdminModal } from './components/admin/AdminModal.tsx';
import { LegalModal } from './components/legal/LegalModal.tsx';
import { CookieBanner } from './components/common/CookieBanner.tsx';
import { BirthDetails, VedicChartData, InitialReadingResult, AstrologerMessage } from './services/astrology/types.ts';
import { calculateVedicChart } from './services/astrology/engine.ts';
import { Check, Bookmark, Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [chartData, setChartData] = useState<VedicChartData | null>(null);
  const [initialReading, setInitialReading] = useState<InitialReadingResult | null>(null);
  const [chatMessages, setChatMessages] = useState<AstrologerMessage[]>([]);
  const [savedReadings, setSavedReadings] = useState<any[]>([]);
  const [pendingChatPrompt, setPendingChatPrompt] = useState<string>('');

  // Modals
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [legalModalState, setLegalModalState] = useState<{ isOpen: boolean; page: string }>({
    isOpen: false,
    page: 'privacy-policy',
  });
  const [forceCookiePrefs, setForceCookiePrefs] = useState<boolean>(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoadingChart, setIsLoadingChart] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Restore saved state from local storage
  useEffect(() => {
    try {
      const savedChart = localStorage.getItem('jyotir_chart_data');
      const savedReadingsLocal = localStorage.getItem('jyotir_saved_readings');
      const savedReadingData = localStorage.getItem('jyotir_initial_reading');
      const savedChat = localStorage.getItem('jyotir_chat_messages');

      if (savedChart) {
        setChartData(JSON.parse(savedChart));
        setCurrentTab('overview');
      }
      if (savedReadingsLocal) {
        setSavedReadings(JSON.parse(savedReadingsLocal));
      }
      if (savedReadingData) {
        setInitialReading(JSON.parse(savedReadingData));
      }
      if (savedChat) {
        setChatMessages(JSON.parse(savedChat));
      }
    } catch (e) {
      console.error('Error restoring session:', e);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (chartData) {
      localStorage.setItem('jyotir_chart_data', JSON.stringify(chartData));
    }
  }, [chartData]);

  useEffect(() => {
    localStorage.setItem('jyotir_saved_readings', JSON.stringify(savedReadings));
  }, [savedReadings]);

  useEffect(() => {
    if (initialReading) {
      localStorage.setItem('jyotir_initial_reading', JSON.stringify(initialReading));
    }
  }, [initialReading]);

  useEffect(() => {
    if (chatMessages.length > 0) {
      localStorage.setItem('jyotir_chat_messages', JSON.stringify(chatMessages));
    }
  }, [chatMessages]);

  // Handle Onboarding Completion
  const handleOnboardingComplete = async (details: BirthDetails) => {
    setIsLoadingChart(true);
    try {
      // 1. Calculate deterministic chart locally or via API
      let chart: VedicChartData;
      try {
        const res = await fetch('/api/chart/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(details),
        });
        const data = await res.json();
        chart = data.chart || calculateVedicChart(details);
      } catch (err) {
        chart = calculateVedicChart(details);
      }

      setChartData(chart);
      setIsOnboardingOpen(false);
      setCurrentTab('overview');
      showToast('Birth chart calculated successfully.');

      // 2. Fetch server-side Initial Reading from Acharya Arya
      try {
        const readingRes = await fetch('/api/astrology/initial-reading', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chart }),
        });
        const readingData = await readingRes.json();
        if (readingData.success && readingData.reading) {
          setInitialReading(readingData.reading);
          showToast(`Acharya Arya's reading is ready.`);
        }
      } catch (readingErr) {
        console.warn('Initial reading fallback:', readingErr);
      }
    } catch (err: any) {
      console.error(err);
      showToast('Error calculating birth chart. Please try again.');
    } finally {
      setIsLoadingChart(false);
    }
  };

  // Ask Question from elsewhere and jump to chat
  const handleAskQuestion = (question: string) => {
    setPendingChatPrompt(question);
    setCurrentTab('chat');
  };

  // Save Reading
  const handleSaveReading = (reading: any) => {
    const newEntry = {
      ...reading,
      id: `reading_${Date.now()}`,
      savedAt: new Date().toISOString(),
    };
    setSavedReadings((prev) => [newEntry, ...prev]);
    showToast('Reading saved to your collection.');

    // sync with backend
    fetch('/api/user/saved-readings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reading: newEntry }),
    }).catch(() => {});
  };

  // Delete Reading
  const handleDeleteReading = (id: string) => {
    setSavedReadings((prev) => prev.filter((r) => r.id !== id));
    showToast('Reading removed.');
    fetch(`/api/user/saved-readings/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  // Clear Chat History
  const handleClearHistory = () => {
    setChatMessages([]);
    localStorage.removeItem('jyotir_chat_messages');
    showToast('Conversation history cleared.');
  };

  // Delete Account & Reset Data
  const handleDeleteAccount = () => {
    localStorage.clear();
    setChartData(null);
    setInitialReading(null);
    setChatMessages([]);
    setSavedReadings([]);
    setCurrentTab('landing');
    showToast('All your birth data and account records have been permanently cleared.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-[#E2E6EE]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-[#121826] border border-[#B89647] text-[#F0E6D2] text-xs px-4 py-2.5 rounded-lg shadow-xl animate-fade-in">
          <Sparkles className="h-4 w-4 text-[#B89647]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        chartData={chartData}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        savedCount={savedReadings.length}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {/* If no chart exists or user chose landing */}
        {currentTab === 'landing' || !chartData ? (
          <LandingPage onStartOnboarding={() => setIsOnboardingOpen(true)} />
        ) : (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {currentTab === 'overview' && (
              <OverviewTab
                chart={chartData}
                initialReading={initialReading}
                onAskQuestion={handleAskQuestion}
                onSaveReading={handleSaveReading}
              />
            )}

            {currentTab === 'chart' && (
              <VedicChartKundli chart={chartData} />
            )}

            {currentTab === 'life-areas' && (
              <LifeAreaTab
                chart={chartData}
                onAskQuestion={handleAskQuestion}
                onSaveReading={handleSaveReading}
              />
            )}

            {currentTab === 'chat' && (
              <AskAstrologerChat
                chart={chartData}
                messages={chatMessages}
                setMessages={setChatMessages}
                initialPrompt={pendingChatPrompt}
                onSaveReading={handleSaveReading}
              />
            )}

            {currentTab === 'saved' && (
              <SavedReadingsTab
                savedReadings={savedReadings}
                onDeleteReading={handleDeleteReading}
                onNavigateToLifeArea={() => setCurrentTab('life-areas')}
                onNavigateToChat={() => setCurrentTab('chat')}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenLegal={(page) => setLegalModalState({ isOpen: true, page })}
      />

      {/* Onboarding Wizard Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={handleOnboardingComplete}
        isLoading={isLoadingChart}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        birthDetails={chartData?.birthDetails || null}
        onUpdateBirthDetails={() => {
          setIsSettingsOpen(false);
          setIsOnboardingOpen(true);
        }}
        onClearHistory={handleClearHistory}
        onDeleteAccount={handleDeleteAccount}
        onOpenCookiePreferences={() => setForceCookiePrefs(true)}
      />

      {/* Admin Operations Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Legal & Trust Modal */}
      <LegalModal
        isOpen={legalModalState.isOpen}
        onClose={() => setLegalModalState({ isOpen: false, page: 'privacy-policy' })}
        initialPage={legalModalState.page}
      />

      {/* Cookie Consent Banner */}
      <CookieBanner
        forceOpenPreferences={forceCookiePrefs}
        onClosePreferences={() => setForceCookiePrefs(false)}
      />
    </div>
  );
}
