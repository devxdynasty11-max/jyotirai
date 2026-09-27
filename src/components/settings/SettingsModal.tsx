import React, { useState } from 'react';
import { X, User, Shield, Cookie, Trash2, RefreshCw, Send, CheckCircle2 } from 'lucide-react';
import { BirthDetails } from '../../services/astrology/types.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  birthDetails: BirthDetails | null;
  onUpdateBirthDetails: () => void;
  onClearHistory: () => void;
  onDeleteAccount: () => void;
  onOpenCookiePreferences: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  birthDetails,
  onUpdateBirthDetails,
  onClearHistory,
  onDeleteAccount,
  onOpenCookiePreferences,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'privacy' | 'feedback'>('profile');
  const [rating, setRating] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment: feedbackText, category: 'astrology_consultation' }),
      });
      setFeedbackSent(true);
      setFeedbackText('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070B]/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#0E131E] border border-[#242D40] rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2536] bg-[#0A0D15]">
          <h3 className="font-cinzel text-sm font-bold text-[#F4EFE6]">
            Platform Preferences & Account
          </h3>
          <button
            onClick={onClose}
            className="text-[#788296] hover:text-[#FFFFFF]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex border-b border-[#1E2536] bg-[#0C1019] text-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 font-medium transition-colors ${
              activeTab === 'profile'
                ? 'text-[#F4E3B2] border-b-2 border-[#B89647]'
                : 'text-[#8A95AA] hover:text-[#FFFFFF]'
            }`}
          >
            Profile & Birth Data
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-3 font-medium transition-colors ${
              activeTab === 'privacy'
                ? 'text-[#F4E3B2] border-b-2 border-[#B89647]'
                : 'text-[#8A95AA] hover:text-[#FFFFFF]'
            }`}
          >
            Privacy & Data
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex-1 py-3 font-medium transition-colors ${
              activeTab === 'feedback'
                ? 'text-[#F4E3B2] border-b-2 border-[#B89647]'
                : 'text-[#8A95AA] hover:text-[#FFFFFF]'
            }`}
          >
            Feedback
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-4">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="bg-[#121724] border border-[#20283A] p-4 rounded-lg space-y-2 text-xs">
                <span className="text-[10px] uppercase tracking-wider text-[#B89647] font-semibold block">
                  Active Natal Coordinates
                </span>
                <div className="flex justify-between py-1 border-b border-[#181F2F]">
                  <span className="text-[#8E97AB]">Name:</span>
                  <span className="text-[#F0E6D2] font-medium">{birthDetails?.name || 'Not created'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#181F2F]">
                  <span className="text-[#8E97AB]">Date of Birth:</span>
                  <span className="text-[#F0E6D2] font-medium">{birthDetails?.birthDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#181F2F]">
                  <span className="text-[#8E97AB]">Time of Birth:</span>
                  <span className="text-[#F0E6D2] font-medium">
                    {birthDetails?.isTimeUnknown ? 'Time Unknown' : birthDetails?.birthTime}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#8E97AB]">Birthplace:</span>
                  <span className="text-[#F0E6D2] font-medium">
                    {birthDetails?.city}, {birthDetails?.country}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onUpdateBirthDetails();
                }}
                className="w-full py-2.5 bg-[#171E2D] hover:bg-[#20293D] border border-[#29344A] text-xs font-semibold text-[#F0E6D2] rounded transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-3.5 w-3.5 text-[#B89647]" />
                <span>Re-enter / Recalculate Birth Chart</span>
              </button>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4 text-xs">
              <div className="bg-[#121724] border border-[#20283A] p-4 rounded-lg space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#B89647] font-semibold block">
                  Data Governance & Security
                </span>
                <p className="text-[#8E97AB] leading-relaxed">
                  Your birth information is utilized exclusively for deterministic ephemeris calculations and personal consultations. We maintain strict zero-fabrication standards.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={onOpenCookiePreferences}
                  className="w-full py-2.5 px-3 bg-[#131926] hover:bg-[#1A2234] border border-[#232B3E] rounded text-left flex items-center justify-between text-[#C5CEE0]"
                >
                  <div className="flex items-center gap-2">
                    <Cookie className="h-4 w-4 text-[#B89647]" />
                    <span>Manage Cookie Preferences</span>
                  </div>
                  <span className="text-[10px] text-[#788296]">Adjust</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('Clear all conversation history with Acharya Arya?')) {
                      onClearHistory();
                    }
                  }}
                  className="w-full py-2.5 px-3 bg-[#131926] hover:bg-[#1A2234] border border-[#232B3E] rounded text-left flex items-center justify-between text-[#C5CEE0]"
                >
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-[#8A95AA]" />
                    <span>Clear Conversation Consultation History</span>
                  </div>
                  <span className="text-[10px] text-[#788296]">Clear</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to permanently delete your birth chart and account data?')) {
                      onDeleteAccount();
                      onClose();
                    }
                  }}
                  className="w-full py-2.5 px-3 bg-[#241315] hover:bg-[#34181B] border border-[#482025] rounded text-left flex items-center justify-between text-[#FF8E96]"
                >
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4 text-[#FF8E96]" />
                    <span>Delete All My Data & Account</span>
                  </div>
                  <span className="text-[10px] text-[#FF8E96]">Delete</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div>
              {feedbackSent ? (
                <div className="bg-[#121F1B] border border-[#204538] p-6 rounded-lg text-center space-y-2">
                  <CheckCircle2 className="h-8 w-8 text-[#48D597] mx-auto" />
                  <h4 className="font-cinzel text-sm font-bold text-[#E7EBF5]">
                    Thank You For Your Feedback
                  </h4>
                  <p className="text-xs text-[#8E97AB]">
                    Your insights help us refine Acharya Arya's consultations and chart precision.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-xs font-medium text-[#C0C8DA] mb-2">
                      How would you rate your consultation experience?
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`flex-1 py-2 text-xs font-bold rounded border ${
                            rating === star
                              ? 'bg-[#B89647] text-[#0A0D14] border-[#B89647]'
                              : 'bg-[#131926] text-[#8E97AB] border-[#222B3D]'
                          }`}
                        >
                          {star} ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#C0C8DA] mb-1">
                      Your Thoughts / Suggestions
                    </label>
                    <textarea
                      rows={3}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Tell us about the accuracy, persona, or any feature you'd like..."
                      className="w-full bg-[#131926] border border-[#273146] focus:border-[#B89647] rounded p-3 text-xs text-[#F0E6D2] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#B89647] hover:bg-[#C9A654] text-[#0A0D14] font-semibold text-xs rounded transition-colors"
                  >
                    Submit Feedback
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
