import React, { useState, useRef, useEffect } from 'react';
import { VedicChartData, AstrologerMessage } from '../../services/astrology/types.ts';
import { BRAND_CONFIG } from '../../config/brand.ts';
import { Send, Sparkles, RefreshCw, Volume2, VolumeX, Bookmark, ChevronDown, ChevronUp, Compass, MessageSquare, User, ArrowRight } from 'lucide-react';

interface AskAstrologerChatProps {
  chart: VedicChartData;
  messages: AstrologerMessage[];
  setMessages: React.Dispatch<React.SetStateAction<AstrologerMessage[]>>;
  initialPrompt?: string;
  onSaveReading: (reading: any) => void;
}

export const AskAstrologerChat: React.FC<AskAstrologerChatProps> = ({
  chart,
  messages,
  setMessages,
  initialPrompt,
  onSaveReading,
}) => {
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedReasoning, setExpandedReasoning] = useState<Record<string, boolean>>({});
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested starter prompts based on actual chart
  const defaultStarters = [
    `Meri career life aur profession ke liye kaunsa path best rahega?`,
    `What does my ${chart.ascendant.sign.split(' ')[0]} Lagna say about my core challenges?`,
    `How does my current ${chart.dashas.currentMahadasha.planet} Mahadasha influence my relationships?`,
    `Business mere liye sahi rahega ya salaried job?`,
    `Why do I feel restless or prone to overthinking?`,
    `Meri marriage timing aur partner personality chart mein kaisi dikhti hai?`,
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: AstrologerMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch('/api/astrology/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chart,
          message: textToSend,
          history: historyPayload,
        }),
      });

      const data = await res.json();
      if (data.success && data.astrologerAnswer) {
        setMessages((prev) => [...prev, data.astrologerAnswer]);
      } else {
        const errorMsg: AstrologerMessage = {
          id: `msg_err_${Date.now()}`,
          sender: 'astrologer',
          text: 'The celestial patterns require a moment of contemplation. Please share your inquiry once more.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err) {
      const errorMsg: AstrologerMessage = {
        id: `msg_err_${Date.now()}`,
        sender: 'astrologer',
        text: 'Something went wrong while reading your chart. Your information is safe. Please ask again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const toggleReasoning = (id: string) => {
    setExpandedReasoning((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const clearChat = () => {
    if (window.confirm('Do you wish to conclude this consultation session and start fresh?')) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setMessages([]);
    }
  };

  return (
    <div className="flex flex-col h-[750px] max-h-[85vh] bg-[#0A0D15] border border-[#1E2536] rounded-xl overflow-hidden shadow-2xl">
      {/* Consultation Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#0E131E] border-b border-[#1E2536]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#B89647] to-[#785B24] text-[#0A0D14] shadow-sm">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-cinzel text-sm font-bold text-[#F4EFE6]">
                {BRAND_CONFIG.ASTROLOGER_NAME}
              </h3>
              <span className="text-[10px] text-[#B89647] border border-[#B89647]/30 px-1.5 py-0.2 rounded font-medium">
                Active Consultation
              </span>
            </div>
            <p className="text-[11px] text-[#7E889D]">
              Context: {chart.ascendant.sign.split(' ')[0]} Lagna · {chart.moonSign.sign.split(' ')[0]} Moon · {chart.dashas.currentMahadasha.planet} Dasha
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="flex items-center gap-1 text-xs text-[#8A93A6] hover:text-[#FFFFFF] border border-[#232B3C] hover:border-[#38435C] px-2.5 py-1.5 rounded transition-colors"
            title="Start new consultation"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Consultation</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto py-10">
            <div className="h-12 w-12 rounded-full bg-[#B89647]/10 flex items-center justify-center text-[#B89647] mb-4">
              <Compass className="h-6 w-6" />
            </div>
            <h4 className="font-cinzel text-lg font-bold text-[#F0E6D2] mb-2">
              Welcome to Your Personal Consultation
            </h4>
            <p className="font-cormorant text-base text-[#9FA8BC] mb-6 leading-relaxed">
              "Ask me anything regarding your vocation, relationships, inner patterns, or upcoming timing periods. Feel free to speak in plain English or casual Hinglish."
            </p>

            {/* Quick Starters */}
            <div className="w-full space-y-2 text-left">
              <span className="text-[11px] uppercase tracking-wider text-[#B89647] font-semibold block text-center mb-1">
                Suggested Questions Based on Your Chart:
              </span>
              {defaultStarters.map((starter, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(starter)}
                  className="w-full p-2.5 text-xs text-[#C6CFDE] hover:text-[#FFFFFF] bg-[#121622] hover:bg-[#1A2030] border border-[#202738] rounded-lg transition-colors flex items-center justify-between"
                >
                  <span className="truncate mr-2">"{starter}"</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#B89647] shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isAstrologer = msg.sender === 'astrologer';
            const isReasoningOpen = expandedReasoning[msg.id];

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAstrologer ? 'items-start' : 'items-end justify-end'}`}
              >
                {isAstrologer && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#B89647] text-[#0A0D14] text-xs font-bold font-cinzel">
                    AA
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[78%] space-y-2`}>
                  {/* Message Bubble */}
                  <div
                    className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                      isAstrologer
                        ? 'bg-[#121724] border border-[#222B3D] text-[#D8DFEE]'
                        : 'bg-gradient-to-r from-[#B89647] to-[#A07F37] text-[#0A0D14] font-medium'
                    }`}
                  >
                    <div className="space-y-2 whitespace-pre-wrap">
                      {msg.text}
                    </div>

                    {/* Timestamp */}
                    <div
                      className={`text-[10px] mt-2 text-right ${
                        isAstrologer ? 'text-[#6A7488]' : 'text-[#0A0D14]/70'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {/* Astrologer Actions & Reasoning Drawer */}
                  {isAstrologer && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-xs text-[#7B8599] pl-1">
                        {/* Audio readout button */}
                        <button
                          onClick={() => handleSpeak(msg.text)}
                          className="flex items-center gap-1 hover:text-[#B89647] transition-colors"
                          title="Listen to response"
                        >
                          {isSpeaking ? (
                            <>
                              <VolumeX className="h-3.5 w-3.5 text-[#B89647]" />
                              <span>Stop Audio</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="h-3.5 w-3.5" />
                              <span>Read Aloud</span>
                            </>
                          )}
                        </button>

                        <span>·</span>

                        {/* Save Reading */}
                        <button
                          onClick={() => onSaveReading({
                            title: `Inquiry with Acharya Arya`,
                            category: 'consultation',
                            summary: msg.text.slice(0, 160) + '...',
                            fullContent: msg.text,
                            astrologicalFactors: msg.astrologicalFactors,
                          })}
                          className="flex items-center gap-1 hover:text-[#B89647] transition-colors"
                        >
                          <Bookmark className="h-3.5 w-3.5" />
                          <span>Bookmark</span>
                        </button>

                        {/* Expand Reasoning */}
                        {msg.reasoning && msg.reasoning.length > 0 && (
                          <>
                            <span>·</span>
                            <button
                              onClick={() => toggleReasoning(msg.id)}
                              className="flex items-center gap-1 text-[#B89647] hover:text-[#D8BC75] font-medium"
                            >
                              <span>Astrological Factors</span>
                              {isReasoningOpen ? (
                                <ChevronUp className="h-3 w-3" />
                              ) : (
                                <ChevronDown className="h-3 w-3" />
                              )}
                            </button>
                          </>
                        )}
                      </div>

                      {/* Expandable Reasoning Panel */}
                      {isReasoningOpen && msg.reasoning && (
                        <div className="bg-[#0B0E16] border border-[#202738] rounded-lg p-3 text-xs space-y-2">
                          <span className="text-[10px] uppercase tracking-wider text-[#B89647] font-semibold block">
                            Chart Placements & Factors Cited:
                          </span>
                          <div className="space-y-1.5">
                            {msg.reasoning.map((r, rIdx) => (
                              <div key={rIdx} className="bg-[#101420] p-2 rounded border border-[#1A2130]">
                                <strong className="text-[#E7EBF5] block">{r.factor}</strong>
                                <span className="text-[#8E97AB]">{r.explanation}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Suggested Follow-ups */}
                      {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                        <div className="pt-1 flex flex-wrap gap-1.5">
                          {msg.suggestedQuestions.map((q, qIdx) => (
                            <button
                              key={qIdx}
                              onClick={() => handleSend(q)}
                              className="text-[11px] text-[#A6B2C8] bg-[#101420] hover:bg-[#1A2234] hover:text-[#FFFFFF] border border-[#20293B] px-2.5 py-1 rounded transition-colors"
                            >
                              "{q}"
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {!isAstrologer && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#182030] text-[#E7EBF5] text-xs">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Loading Spinner during consultation */}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#B89647] text-[#0A0D14] text-xs font-bold font-cinzel">
              AA
            </div>
            <div className="bg-[#121724] border border-[#222B3D] p-4 rounded-xl text-xs text-[#8E97AB] flex items-center gap-2">
              <Sparkles className="h-4 w-4 animate-spin text-[#B89647]" />
              <span>Acharya Arya is examining your Kundli placements...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-[#0E131E] border-t border-[#1E2536]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Acharya Arya anything (in English or Hinglish)..."
            className="flex-1 bg-[#141A28] border border-[#273146] focus:border-[#B89647] rounded-lg px-4 py-3 text-xs sm:text-sm text-[#F0E6D2] focus:outline-none transition-colors placeholder:text-[#646E82]"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-[#D6B25E] to-[#B38D3C] hover:from-[#E3C375] hover:to-[#C69F4B] text-[#0A0D14] transition-all disabled:opacity-40 disabled:hover:scale-100 hover:scale-105"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <div className="mt-2 text-[10px] text-[#636C80] flex items-center justify-between">
          <span>Accepts casual queries, typos, and Hinglish. Maintains conversation context.</span>
          <span>Sidereal Lahiri Ayanamsha</span>
        </div>
      </div>
    </div>
  );
};
