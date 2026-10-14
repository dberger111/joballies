'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function TradeNetworkPage() {
  const [copiedVouch, setCopiedVouch] = useState(false);
  const [town, setTown] = useState("Westport");
  const [allyBusiness, setAllyBusiness] = useState("Precision Stone & Masonry");
  const [allyTrade, setAllyTrade] = useState("bluestone patio & stonework");

  const neighborVouchText = `Highly recommend ${allyBusiness} if you need ${allyTrade} around ${town}. We work alongside them on local jobsites all the time—shows up when they say they will, super clean work, and fair pricing. You can see their recent work and grab a quick quote here: https://joballies.com/profile/sample-contractor`;

  const copyNeighborVouch = () => {
    navigator.clipboard.writeText(neighborVouchText);
    setCopiedVouch(true);
    setTimeout(() => setCopiedVouch(false), 3000);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-5 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">JobAllies Field Tool</span>
            <h1 className="text-3xl font-extrabold text-white">🤝 Sub & Referral Crew</h1>
            <p className="text-xs text-slate-400 mt-1">Pass out-of-scope jobs for a 10% finder's fee, or drop 1-click neighbor vouches on Facebook.</p>
          </div>
          <Link href="/dashboard" className="bg-slate-900 border border-slate-800 hover:bg-slate-800 px-4 py-2.5 rounded-xl text-slate-300 text-xs font-bold transition">
            ← Back to Truck Cab
          </Link>
        </div>

        {/* Section 1: 1-Click Facebook Group Neighbor Vouch Builder */}
        <div className="bg-slate-900 border border-blue-500/40 p-6 md:p-8 rounded-3xl space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">💬 Neighbor Vouch Builder</span>
              <h3 className="text-xl font-extrabold text-white mt-0.5">1-Click Facebook Group Recommendation</h3>
              <p className="text-xs text-slate-400">When homeowners ask for a contractor in local town Facebook groups, a recommendation from another trade pro wins the job 5x faster.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Pro Business Name</label>
              <input type="text" value={allyBusiness} onChange={(e) => setAllyBusiness(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">What They Do Best</label>
              <input type="text" value={allyTrade} onChange={(e) => setAllyTrade(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Town Name</label>
              <input type="text" value={town} onChange={(e) => setTown(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white" />
            </div>
          </div>

          {/* Realistic Facebook Comment Preview Bubble */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">👍</div>
              <span className="text-xs font-bold text-slate-300">Ready-to-Paste Facebook Group Comment:</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed pl-9">
              "{neighborVouchText}"
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={copyNeighborVouch}
              className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3.5 px-6 rounded-2xl transition text-xs w-full shadow-lg shadow-blue-600/20"
            >
              {copiedVouch ? "✓ Copied! Open Facebook & Paste in Comments" : "📋 Copy Recommendation for Facebook Group"}
            </button>
            <a 
              href="https://www.facebook.com/groups/" 
              target="_blank"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3.5 px-6 rounded-2xl transition text-xs text-center whitespace-nowrap"
            >
              Open Facebook Groups ↗
            </a>
          </div>
        </div>

        {/* Section 2: Pass Overflow Work & Lock Finder's Fee */}
        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">💵 Cash for Overflow Leads</span>
              <h3 className="text-xl font-extrabold text-white mt-0.5">Your Local Sub & Referral Crew</h3>
              <p className="text-xs text-slate-400">Pass jobs outside your trade to trusted local allies and automatically lock in your 10% finder's fee.</p>
            </div>
            <Link href="/dashboard/mass-invite" className="bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-600/30 transition">
              + Invite More Local Pros
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-extrabold text-white text-base">Precision Plumbing & Heating</h4>
                  <p className="text-xs text-slate-400">Master Plumber • 2.4 miles away (Westport, CT)</p>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                  10% Finder's Fee
                </span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl flex justify-between text-xs">
                <span className="text-slate-400">On a $3,500 job handoff:</span>
                <span className="text-emerald-400 font-extrabold">You pocket $350 • They get $3,150</span>
              </div>
              <button 
                onClick={() => alert("Lead handoff texted to Precision Plumbing with 10% finder's fee locked!")} 
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold py-3 px-4 rounded-xl transition w-full"
              >
                📲 Pass a Job to Precision Plumbing
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-extrabold text-white text-base">Voltage Masters Electrical</h4>
                  <p className="text-xs text-slate-400">Licensed Electrician • 3.8 miles away (Fairfield, CT)</p>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                  10% Finder's Fee
                </span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl flex justify-between text-xs">
                <span className="text-slate-400">On a $2,800 panel upgrade:</span>
                <span className="text-emerald-400 font-extrabold">You pocket $280 • They get $2,520</span>
              </div>
              <button 
                onClick={() => alert("Lead handoff texted to Voltage Masters with 10% finder's fee locked!")} 
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold py-3 px-4 rounded-xl transition w-full"
              >
                📲 Pass a Job to Voltage Masters
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="max-w-4xl mx-auto w-full text-center border-t border-slate-800/80 pt-8 mt-16 text-xs text-slate-500">
        © {new Date().getFullYear()} JobAllies — All rights reserved. (from UpLevel Labs, Inc.)
      </footer>
    </main>
  );
}
