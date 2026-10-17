'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteFooter from '../components/SiteFooter';
import FeedbackWidget from '../components/FeedbackWidget';
import Logo from '../components/Logo';

interface LeadItem {
  id: string;
  source: string;
  datePosted: string;
  timePosted: string;
  trade: string;
  town: string;
  budget: string;
  scope: string;
  clientName: string;
  autoQuote: {
    laborHours: number;
    laborRate: number;
    materialsCost: number;
    total: number;
  };
  personalNote: string;
  status: 'New' | 'Quote Generated' | 'Sent via Platform';
}

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState({
    name: 'Mike Johnson',
    trade: 'General Contractor',
    location: 'Baton Rouge, LA',
    licenseNumber: 'LSLBC.554210',
  });

  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let resolvedTrade = 'General Contractor';
    let resolvedTown = 'Baton Rouge, LA';

    try {
      const saved = localStorage.getItem('joballies_temp_user') || localStorage.getItem('joballies_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.trade) resolvedTrade = parsed.trade;
        if (parsed.location) resolvedTown = parsed.location;
        setUserProfile((prev) => ({
          ...prev,
          name: parsed.name || prev.name,
          trade: resolvedTrade,
          location: resolvedTown,
        }));
      }
    } catch {}

    async function fetchRealLeads() {
      try {
        const res = await fetch(`/api/leads?town=${encodeURIComponent(resolvedTown)}&trade=${encodeURIComponent(resolvedTrade)}`);
        const data = await res.json();
        if (data && data.leads) {
          setLeads(data.leads);
        }
      } catch (err) {
        console.error('Failed to fetch real leads:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRealLeads();
  }, []);

  const updateQuote = (id: string, field: string, val: number) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const updatedQuote = { ...l.autoQuote, [field]: val };
        updatedQuote.total = updatedQuote.laborHours * updatedQuote.laborRate + updatedQuote.materialsCost;
        return { ...l, autoQuote: updatedQuote };
      })
    );
  };

  const updateNote = (id: string, note: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, personalNote: note } : l)));
  };

  const markSentViaPlatform = (id: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'Sent via Platform' } : l)));
    alert('Quick Quote and personal qualification note successfully dispatched through the JobAllies platform relay to the homeowner!');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-5 md:p-10 flex flex-col justify-between relative">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-5 gap-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Logo size="sm" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">{userProfile.name}</h1>
                <span className="text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                  {userProfile.trade}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Active Territory: <strong className="text-slate-200">{userProfile.location}</strong> • License: {userProfile.licenseNumber}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/dashboard/supplier-cart"
              className="bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 px-4 py-2.5 rounded-xl transition"
            >
              📦 Supply House List
            </Link>
            <Link
              href="/dashboard/network"
              className="bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 px-4 py-2.5 rounded-xl transition"
            >
              🤝 10% Referral Splits
            </Link>
          </div>
        </header>

        <section className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">⚡ Live Verified State & Municipal Registry Feed</span>
              <h2 className="text-xl font-extrabold text-white">
                Active {userProfile.trade} Leads in {userProfile.location} ({leads.length} Available)
              </h2>
            </div>
            <span className="text-xs font-bold text-blue-400 bg-blue-950 px-3.5 py-1.5 rounded-full border border-blue-800">
              {loading ? 'Fetching all leads...' : `showing all ${leads.length} live leads`}
            </span>
          </div>

          <div className="space-y-6">
            {leads.map((lead) => (
              <div key={lead.id} className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-900 pb-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold text-blue-400 bg-blue-950 px-3 py-0.5 rounded-full border border-blue-800">
                        Source: {lead.source}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">{lead.budget}</span>
                      <span className="text-xs text-slate-400">📍 {lead.town}</span>
                      <span className="text-xs font-bold text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-800">
                        🕒 Posted: {lead.datePosted} at {lead.timePosted}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white mt-1">Project Request: "{lead.scope}"</p>
                    <p className="text-xs text-slate-400">
                      Client: <strong className="text-slate-200">{lead.clientName}</strong> • <span className="text-blue-400 font-bold">Secure Platform Relay</span>
                    </p>
                  </div>
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${lead.status === 'Sent via Platform' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
                    Status: {lead.status}
                  </span>
                </div>

                <div className="bg-slate-900/90 border border-blue-500/40 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">
                      ✨ Quick Estimate & Platform Dispatch
                    </span>
                    <span className="text-xl font-black text-emerald-400">${lead.autoQuote.total.toLocaleString()}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Labor Hours</label>
                      <input
                        type="number"
                        value={lead.autoQuote.laborHours}
                        onChange={(e) => updateQuote(lead.id, 'laborHours', Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Hourly Rate ($)</label>
                      <input
                        type="number"
                        value={lead.autoQuote.laborRate}
                        onChange={(e) => updateQuote(lead.id, 'laborRate', Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Materials Cost ($)</label>
                      <input
                        type="number"
                        value={lead.autoQuote.materialsCost}
                        onChange={(e) => updateQuote(lead.id, 'materialsCost', Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white"
                      />
                    </div>
                  </div>

                  {/* EDITABLE QUALIFICATION NOTE WITH DISTINCT SHADING & BORDER */}
                  <div className="bg-blue-950/40 border border-blue-500/60 p-4 rounded-2xl space-y-2 shadow-inner">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-black text-blue-300 uppercase tracking-wider">
                        ✍️ Editable Professional Qualification Note (Click to edit text)
                      </label>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded-md">
                        Shaded field is fully editable
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={lead.personalNote}
                      onChange={(e) => updateNote(lead.id, e.target.value)}
                      className="w-full bg-blue-950/80 border border-blue-400/80 rounded-xl p-3 text-xs text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition"
                      placeholder="Highlight your trade experience, license credentials, and project-specific qualifications..."
                    />
                    <p className="text-[11px] text-blue-300/80 italic">
                      This personalized qualification note accompanies your price estimate when dispatched through the platform relay to the homeowner.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => markSentViaPlatform(lead.id)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-xl text-xs transition shadow-lg"
                    >
                      ✓ Send Quick Quote & Qualifications via Platform Relay
                    </button>
                    <Link
                      href="/dashboard/supplier-cart"
                      className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold py-3.5 px-5 rounded-xl text-xs text-center transition"
                    >
                      📦 View Materials in Supply List
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* External Lead Platforms Integration Footer */}
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="text-xs font-black uppercase tracking-wider text-blue-400">🌐 Connect External Lead Networks</h4>
              <p className="text-xs text-slate-300">
                To view more leads in your local area, login to your professional Thumbtack, Angi, or other lead generation platforms:
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
              <a
                href="https://pro.thumbtack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-2 shadow-md"
              >
                <span>🛠️ Thumbtack Pro</span>
              </a>
              <a
                href="https://pro.angi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-2 shadow-md"
              >
                <span>🏡 Angi Leads</span>
              </a>
              <a
                href="https://www.houzz.com/pro"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-extrabold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-2 border border-slate-700 shadow-md"
              >
                <span>📐 Houzz Pro</span>
              </a>
            </div>
          </div>
        </section>
      </div>

      <FeedbackWidget />
      <SiteFooter />
    </main>
  );
}
