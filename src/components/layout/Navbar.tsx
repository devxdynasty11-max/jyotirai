import React from 'react';
import { Compass, Sparkles, Moon, Settings, ShieldCheck, Bookmark, MessageSquare, BookOpen, User, RefreshCw } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brand.ts';
import { VedicChartData } from '../../services/astrology/types.ts';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  chartData: VedicChartData | null;
  onOpenOnboarding: () => void;
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  chartData,
  onOpenOnboarding,
  onOpenSettings,
  onOpenAdmin,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#242A38]/60 bg-[#080B11]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCurrentTab(chartData ? 'overview' : 'landing')}
            className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#B89647] to-[#785B24] text-[#0A0D14] shadow-sm">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <span className="font-cinzel text-lg font-bold tracking-wider text-[#F0E6D2]">
                {BRAND_CONFIG.BRAND_NAME}
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-[#8E95A5] font-normal tracking-normal">
                Vedic Jyotish
              </span>
            </div>
          </button>

          {/* Astrologer Presence Badge */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-[#A1A8BA] border-l border-[#242A38] pl-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B89647] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B89647]"></span>
            </span>
            <span>Consulting with <strong className="text-[#E7CE8F] font-medium">{BRAND_CONFIG.ASTROLOGER_NAME}</strong></span>
          </div>
        </div>

        {/* Navigation Tabs (When Chart Exists) */}
        {chartData && (
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-[#9EABC0]">
            <button
              onClick={() => setCurrentTab('overview')}
              className={`px-3 py-1.5 transition-colors ${
                currentTab === 'overview'
                  ? 'text-[#F4E3B2] border-b-2 border-[#B89647]'
                  : 'hover:text-[#E2E6EE]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentTab('chart')}
              className={`px-3 py-1.5 transition-colors ${
                currentTab === 'chart'
                  ? 'text-[#F4E3B2] border-b-2 border-[#B89647]'
                  : 'hover:text-[#E2E6EE]'
              }`}
            >
              My Kundli
            </button>
            <button
              onClick={() => setCurrentTab('life-areas')}
              className={`px-3 py-1.5 transition-colors ${
                currentTab === 'life-areas'
                  ? 'text-[#F4E3B2] border-b-2 border-[#B89647]'
                  : 'hover:text-[#E2E6EE]'
              }`}
            >
              Life Dimensions
            </button>
            <button
              onClick={() => setCurrentTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
                currentTab === 'chat'
                  ? 'text-[#F4E3B2] border-b-2 border-[#B89647]'
                  : 'hover:text-[#E2E6EE]'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5 text-[#B89647]" />
              Ask Astrologer
            </button>
            <button
              onClick={() => setCurrentTab('saved')}
              className={`flex items-center gap-1 px-3 py-1.5 transition-colors ${
                currentTab === 'saved'
                  ? 'text-[#F4E3B2] border-b-2 border-[#B89647]'
                  : 'hover:text-[#E2E6EE]'
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span>Saved</span>
              {savedCount > 0 && (
                <span className="text-[11px] text-[#B89647] font-semibold">({savedCount})</span>
              )}
            </button>
          </nav>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {chartData ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenOnboarding}
                className="hidden sm:flex items-center gap-1.5 text-xs text-[#9EABC0] hover:text-[#F0E6D2] border border-[#242A38] hover:border-[#3D455A] rounded px-2.5 py-1.5 transition-all"
                title="Calculate new or switch birth chart"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Switch Chart</span>
              </button>
              <div className="flex items-center gap-1.5 text-xs bg-[#121622] border border-[#262D40] rounded px-3 py-1.5 text-[#F0E6D2]">
                <User className="h-3.5 w-3.5 text-[#B89647]" />
                <span className="font-medium truncate max-w-[100px]">{chartData.birthDetails.name}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenOnboarding}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0A0D14] bg-gradient-to-r from-[#D6B25E] to-[#B38D3C] hover:from-[#E3C375] hover:to-[#C69F4B] px-4 py-2 rounded shadow-sm transition-all"
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Discover My Chart</span>
            </button>
          )}

          {/* Settings & Admin Icons */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-[#8E95A5] hover:text-[#F0E6D2] hover:bg-[#151924] rounded transition-colors"
            title="Account & Chart Preferences"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={onOpenAdmin}
            className="p-2 text-[#8E95A5] hover:text-[#B89647] hover:bg-[#151924] rounded transition-colors"
            title="System & Supabase Database Metrics"
            aria-label="Admin Metrics"
          >
            <ShieldCheck className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar when chart is loaded */}
      {chartData && (
        <div className="md:hidden flex items-center justify-around border-t border-[#1C2232] bg-[#0A0E18] py-2 px-2 text-xs text-[#9EABC0]">
          <button
            onClick={() => setCurrentTab('overview')}
            className={`py-1 px-2 ${currentTab === 'overview' ? 'text-[#F4E3B2] font-semibold' : ''}`}
          >
            Overview
          </button>
          <button
            onClick={() => setCurrentTab('chart')}
            className={`py-1 px-2 ${currentTab === 'chart' ? 'text-[#F4E3B2] font-semibold' : ''}`}
          >
            Kundli
          </button>
          <button
            onClick={() => setCurrentTab('life-areas')}
            className={`py-1 px-2 ${currentTab === 'life-areas' ? 'text-[#F4E3B2] font-semibold' : ''}`}
          >
            Life
          </button>
          <button
            onClick={() => setCurrentTab('chat')}
            className={`py-1 px-2 flex items-center gap-1 ${currentTab === 'chat' ? 'text-[#F4E3B2] font-semibold' : ''}`}
          >
            <MessageSquare className="h-3 w-3 text-[#B89647]" />
            Ask
          </button>
          <button
            onClick={() => setCurrentTab('saved')}
            className={`py-1 px-2 ${currentTab === 'saved' ? 'text-[#F4E3B2] font-semibold' : ''}`}
          >
            Saved
          </button>
        </div>
      )}
    </header>
  );
};
