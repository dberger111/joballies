'use client';
import { useState, use } from 'react';
import Link from 'next/link';

export default function QuoteApprovalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [approved, setApproved] = useState(false);
  const [extraTradeRequested, setExtraTradeRequested] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full space-y-8 pt-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-extrabold text-blue-400 uppercase tracking-widest">Official JobAllies Estimate</span>
            <h1 className="text-3xl font-extrabold text-white">Quote #{id.toUpperCase()}</h1>
          </div>
          <div className="text-right">
            <span className="text-3xl font-extrabold text-emerald-400">$950.00</span>
            <p className="text-xs text-slate-400">Milestone & Lien Waiver Protected</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-5 shadow-xl">
          <h3 className="text-lg font-extrabold text-white">Scope of Work & Materials</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Complete installation, code-compliant hardware and materials, site cleanup, and digital lien waiver receipt upon completion.
          </p>

          {!approved ? (
            <button 
              onClick={() => setApproved(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-6 py-4 rounded-2xl transition w-full text-sm shadow-xl shadow-emerald-600/25"
            >
              ✓ Approve Quote & Lock In Schedule ($950.00)
            </button>
          ) : (
            <div className="space-y-6 pt-2">
              <div className="bg-emerald-950/70 border border-emerald-500/50 p-5 rounded-2xl text-center space-y-1">
                <p className="text-base font-extrabold text-emerald-400">✓ Estimate Approved! Your Contractor Has Been Notified.</p>
                <p className="text-xs text-slate-300">Digital Receipt & Mechanic's Lien Waiver Protection #LW-{id.toUpperCase()} is now active.</p>
              </div>

              {/* PILLAR C: Reverse-Viral Homeowner Multi-Trade Multiplier */}
              <div className="bg-slate-950 border-2 border-blue-500/40 p-6 rounded-2xl space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">Need Another Trade on This Project?</span>
                  <h4 className="text-base font-extrabold text-white">
                    Tap any trade below and our contractor's trusted local ally will text you a fast quote:
                  </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {['Plumber', 'Electrician', 'Painter / Drywall', 'Mason / Patio', 'Carpenter', 'HVAC Tech', 'Landscaper', 'Handyman'].map((trade) => (
                    <button
                      key={trade}
                      onClick={() => setExtraTradeRequested(trade)}
                      className={`p-3 rounded-xl text-xs font-extrabold border transition ${
                        extraTradeRequested === trade
                          ? 'bg-emerald-600 border-emerald-400 text-white'
                          : 'bg-slate-900 border-slate-800 hover:border-blue-400 text-slate-200'
                      }`}
                    >
                      + {trade}
                    </button>
                  ))}
                </div>
                {extraTradeRequested && (
                  <p className="text-xs font-bold text-emerald-400 text-center pt-1">
                    ✓ Got it! We just alerted the top-rated local {extraTradeRequested} in your zip code to text you a quote.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="max-w-3xl mx-auto w-full text-center border-t border-slate-800/80 pt-8 mt-12 text-xs text-slate-500">
        © {new Date().getFullYear()} JobAllies — All rights reserved. (from UpLevel Labs, Inc.)
      </footer>
    </main>
  );
}
