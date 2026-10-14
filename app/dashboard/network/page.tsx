'use client';
import Link from 'next/link';

export default function TradeNetworkPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">JobAllies</span>
            <h1 className="text-3xl font-extrabold text-white">Local Trade Ally Matcher & Escrow</h1>
          </div>
          <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm transition">
            ← Dashboard
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">Your Verified Local Allies (Fairfield County, CT)</h3>
            <p className="text-xs text-slate-400">Non-competing local pros matched to your zip code for safe referral handoffs and automated escrow commission splits.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-white text-sm">Precision Plumbing Co.</h4>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full">Trusted Ally</span>
              </div>
              <p className="text-xs text-slate-400">Primary Trade: Plumber • 2.4 miles away</p>
              <button onClick={() => alert("Referral split invite sent to Plumber ally!")} className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 px-4 rounded-lg transition w-full">
                Send Referral Handoff (10% Escrow Split)
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-white text-sm">Westport Stone & Masonry</h4>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full">Trusted Ally</span>
              </div>
              <p className="text-xs text-slate-400">Primary Trade: Mason • 4.1 miles away</p>
              <button onClick={() => alert("Referral split invite sent to Mason ally!")} className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 px-4 rounded-lg transition w-full">
                Send Referral Handoff (10% Escrow Split)
              </button>
            </div>
          </div>
        </div>
      </div>
      <footer className="max-w-4xl mx-auto w-full text-center border-t border-slate-800/80 pt-8 mt-16 text-xs text-slate-500">
        JobAllies (from UpLevel Labs, Inc.) — All rights reserved.
      </footer>
    </main>
  );
}
