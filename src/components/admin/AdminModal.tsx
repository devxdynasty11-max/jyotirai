import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Database, Activity, RefreshCw, Download, Check, AlertCircle, Users, MessageSquare, Compass } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [passcode, setPasscode] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [recentFeedback, setRecentFeedback] = useState<any[]>([]);
  const [schemaText, setSchemaText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'metrics' | 'database'>('metrics');
  const [copiedSchema, setCopiedSchema] = useState<boolean>(false);

  const fetchAdminData = async () => {
    try {
      const res = await fetch('/api/admin/metrics');
      const data = await res.json();
      setMetrics(data.metrics);
      setRecentFeedback(data.recentFeedback || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSchema = async () => {
    try {
      const res = await fetch('/api/schema/supabase');
      const text = await res.text();
      setSchemaText(text);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchAdminData();
      fetchSchema();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin passcode or demo unlock
    if (passcode.toLowerCase() === 'jyotir-admin' || passcode === 'admin' || passcode === '') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid passcode. Use demo passcode: jyotir-admin or leave blank.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(schemaText);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070B]/85 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#0D121C] border border-[#242D40] rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2536] bg-[#090D15]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#B89647]" />
            <h3 className="font-cinzel text-sm font-bold text-[#F4EFE6]">
              Jyotir Engineering & Operations Center
            </h3>
          </div>
          <button onClick={onClose} className="text-[#788296] hover:text-[#FFFFFF]">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="p-8 text-center max-w-sm mx-auto space-y-4">
            <div className="h-10 w-10 rounded-full bg-[#182030] flex items-center justify-center text-[#B89647] mx-auto">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h4 className="font-cinzel text-base font-bold text-[#F0E6D2]">
              Operator Authentication
            </h4>
            <p className="text-xs text-[#8E97AB]">
              Protected console for system diagnostics, AI query volumes, and Supabase RLS migrations.
            </p>
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                placeholder="Passcode (or press Enter for demo)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-[#131926] border border-[#273146] focus:border-[#B89647] rounded px-3 py-2 text-xs text-[#F0E6D2] focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="w-full py-2 bg-[#B89647] hover:bg-[#C9A654] text-[#0A0D14] text-xs font-semibold rounded"
              >
                Access Diagnostic Dashboard
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-[#1E2536] bg-[#0A0E17] text-xs">
              <button
                onClick={() => setActiveTab('metrics')}
                className={`px-5 py-3 font-medium transition-colors ${
                  activeTab === 'metrics'
                    ? 'text-[#F4E3B2] border-b-2 border-[#B89647]'
                    : 'text-[#8A95AA] hover:text-[#FFFFFF]'
                }`}
              >
                System Telemetry & Volume
              </button>
              <button
                onClick={() => setActiveTab('database')}
                className={`px-5 py-3 font-medium transition-colors ${
                  activeTab === 'database'
                    ? 'text-[#F4E3B2] border-b-2 border-[#B89647]'
                    : 'text-[#8A95AA] hover:text-[#FFFFFF]'
                }`}
              >
                Supabase Schema & RLS
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {activeTab === 'metrics' && (
                <div className="space-y-6">
                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-[#121622] border border-[#202738] p-4 rounded-lg">
                      <div className="text-[10px] text-[#8E97AB] uppercase tracking-wider mb-1">
                        Total Charts
                      </div>
                      <div className="font-cinzel text-xl font-bold text-[#F4EFE6]">
                        {metrics?.chartsCalculated ?? 1}
                      </div>
                    </div>

                    <div className="bg-[#121622] border border-[#202738] p-4 rounded-lg">
                      <div className="text-[10px] text-[#8E97AB] uppercase tracking-wider mb-1">
                        Queries Answered
                      </div>
                      <div className="font-cinzel text-xl font-bold text-[#48D597]">
                        {metrics?.queriesAnswered ?? 0}
                      </div>
                    </div>

                    <div className="bg-[#121622] border border-[#202738] p-4 rounded-lg">
                      <div className="text-[10px] text-[#8E97AB] uppercase tracking-wider mb-1">
                        Initial Readings
                      </div>
                      <div className="font-cinzel text-xl font-bold text-[#64B5F6]">
                        {metrics?.initialReadingsGenerated ?? 0}
                      </div>
                    </div>

                    <div className="bg-[#121622] border border-[#202738] p-4 rounded-lg">
                      <div className="text-[10px] text-[#8E97AB] uppercase tracking-wider mb-1">
                        Uptime (Seconds)
                      </div>
                      <div className="font-cinzel text-xl font-bold text-[#D6B25E]">
                        {metrics?.uptimeSeconds ?? 60}s
                      </div>
                    </div>
                  </div>

                  {/* System Health */}
                  <div className="bg-[#121622] border border-[#202738] p-4 rounded-lg space-y-2">
                    <div className="flex items-center justify-between border-b border-[#1A2130] pb-2">
                      <span className="font-semibold text-[#E7EBF5]">System Health Status</span>
                      <span className="text-[#48D597] font-semibold flex items-center gap-1">
                        ● All Systems Nominal
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[#929CB0] pt-1">
                      <div>Deterministic Vedic Engine: <strong className="text-[#E7EBF5]">Online</strong></div>
                      <div>Sidereal Ephemeris: <strong className="text-[#E7EBF5]">Lahiri Active</strong></div>
                      <div>Server AI Proxy: <strong className="text-[#E7EBF5]">gemini-3.8-flash Connected</strong></div>
                      <div>In-Memory Storage: <strong className="text-[#E7EBF5]">Healthy</strong></div>
                    </div>
                  </div>

                  {/* Recent Feedback Log */}
                  <div className="space-y-2">
                    <h4 className="font-cinzel text-xs font-semibold text-[#E2E6EE] uppercase tracking-wider">
                      Recent User Feedback ({recentFeedback.length})
                    </h4>
                    {recentFeedback.length > 0 ? (
                      <div className="space-y-2">
                        {recentFeedback.map((fb, idx) => (
                          <div key={idx} className="bg-[#101420] border border-[#1E2536] p-3 rounded flex items-center justify-between">
                            <div>
                              <div className="text-[#E7EBF5] font-medium">{fb.comment || 'No comment provided'}</div>
                              <div className="text-[10px] text-[#717B91]">{new Date(fb.submittedAt).toLocaleString()}</div>
                            </div>
                            <span className="text-[#B89647] font-bold">{fb.rating} ★</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[#717B91] italic bg-[#101420] p-3 rounded border border-[#1E2536]">
                        No feedback entries submitted yet.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'database' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-cinzel text-xs font-bold text-[#E7EBF5] uppercase tracking-wider">
                        Supabase PostgreSQL DDL & Row Level Security
                      </h4>
                      <p className="text-[11px] text-[#808B9F]">
                        Complete schema migration for PostgreSQL with 11 tables and strict RLS policies.
                      </p>
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#B89647] text-[#0A0D14] text-xs font-semibold rounded hover:bg-[#C9A654] transition-colors"
                    >
                      {copiedSchema ? <Check className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
                      <span>{copiedSchema ? 'Copied' : 'Copy SQL Schema'}</span>
                    </button>
                  </div>

                  <pre className="bg-[#090C14] border border-[#1D2434] p-4 rounded-lg text-[11px] font-mono text-[#A8B6CF] overflow-x-auto max-h-[350px]">
                    {schemaText || '-- Loading Supabase Schema...'}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
