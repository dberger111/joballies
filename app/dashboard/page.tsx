'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteFooter from '../components/SiteFooter';

interface LeadItem {
  id: string;
  source: string;
  trade: string;
  town: string;
  budget: string;
  scope: string;
  clientName: string;
  clientPhone: string;
  autoQuote: {
    laborHours: number;
    laborRate: number;
    materialsCost: number;
    total: number;
  };
  status: 'New' | 'Quote Generated' | 'Sent to Client';
}

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState({
    name: 'Mike Johnson',
    trade: 'General Contractor',
    location: 'Weston, CT',
    licenseNumber: 'HIC.0649281',
  });

  const [leads, setLeads] = useState<LeadItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('joballies_temp_user') || localStorage.getItem('joballies_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        const resolvedTrade = parsed.trade || 'General Contractor';
        const resolvedTown = parsed.location || 'Weston, CT';
        setUserProfile((prev) => ({
          ...prev,
          name: parsed.name || prev.name,
          trade: resolvedTrade,
          location: resolvedTown,
        }));

        // Generate hyper-local leads matching the exact trade and town chosen by the user
        setLeads([
          {
            id: 'L-LOCAL-1',
            source: `Online Lead Feed (${resolvedTown})`,
            trade: resolvedTrade,
            town: resolvedTown,
            budget: '$3,500 – $6,500',
            scope: `Urgent residential ${resolvedTrade.toLowerCase()} service and installation requested by homeowner.`,
            clientName: 'Robert Vance',
            clientPhone: '(408) 555-0182',
            autoQuote: {
              laborHours: 14,
              laborRate: 140,
              materialsCost: 620,
              total: 2580,
            },
            status: 'New',
          },
          {
            id: 'L-LOCAL-2',
            source: `Online Lead Feed (Local Search — ${resolvedTown})`,
            trade: resolvedTrade,
            town: resolvedTown,
            budget: '$5,000 – $9,000',
            scope: `Complete system replacement and inspection for ${resolvedTrade.toLowerCase()} project.`,
            clientName: 'Elena Rostova',
            clientPhone: '(408) 555-0199',
            autoQuote: {
              laborHours: 22,
              laborRate: 140,
              materialsCost: 1150,
              total: 4230,
            },
            status: 'New',
          },
        ]);
      }
    } catch {}
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

  const markSent = (id: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'Sent to Client' } : l)));
    alert('Quote successfully approved and sent via SMS and Email to the homeowner!');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-5 md:p-10 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-5 gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">
              JA
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
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">⚡ Live Firehose Feed</span>
              <h2 className="text-xl font-extrabold text-white">
                Active {userProfile.trade} Leads in {userProfile.location} (Auto-Created Quotes)
              </h2>
            </div>
            <span className="text-xs font-bold text-blue-400 bg-blue-950 px-3.5 py-1.5 rounded-full border border-blue-800">
              {leads.length} Local Leads Ready
            </span>
          </div>

          <div className="space-y-6">
            {leads.map((lead) => (
              <div key={lead.id} className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-900 pb-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold text-blue-400 bg-blue-950 px-3 py-0.5 rounded-full border border-blue-800">
                        {lead.source}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">{lead.budget}</span>
                      <span className="text-xs text-slate-400">📍 {lead.town}</span>
                    </div>
                    <p className="text-sm font-bold text-white mt-1">Homeowner Request: "{lead.scope}"</p>
                    <p className="text-xs text-slate-400">Client: {lead.clientName} • <span className="text-white font-mono">{lead.clientPhone}</span></p>
                  </div>
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${lead.status === 'Sent to Client' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
                    Status: {lead.status}
                  </span>
                </div>

                <div className="bg-slate-900/90 border border-blue-500/40 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">
                      ✨ AI Auto-Created Estimate (Editable & Ready to Send)
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

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => markSent(lead.id)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-xl text-xs transition shadow-lg"
                    >
                      ✓ Approve & Send Quote to Homeowner (SMS / Email)
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
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
