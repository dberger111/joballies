'use client';
import { useState, use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();

  const contractorName = id.replace(/-/g, ' ');
  const licenseParam = searchParams.get('license') || 'State Verified Credential';
  const townParam = searchParams.get('town') || 'Fairfield County, CT';
  const isClaimMode = searchParams.get('claim') === 'true';

  const [homeownerName, setHomeownerName] = useState('');
  const [homeownerPhone, setHomeownerPhone] = useState('');
  const [projectScope, setProjectScope] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('$2,500 - $5,000');
  const [leadCaptured, setLeadCaptured] = useState(false);

  const handleCaptureLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeownerName || !homeownerPhone) return;
    setLeadCaptured(true);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-5 md:p-12 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full space-y-10">
        {/* Claim Banner for Pre-Populated State License Profiles */}
        {isClaimMode && (
          <div className="bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-blue-500/20 border-2 border-amber-400 p-5 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-2xl">
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                ⚡ Pre-Built Official License Profile ({licenseParam})
              </span>
              <h2 className="text-lg font-extrabold text-white capitalize">
                Are you the owner of {contractorName}?
              </h2>
              <p className="text-xs text-slate-300">
                Verify your phone/email in 15 seconds to unlock waiting homeowner quote requests, customize your photos, and use Talk-to-Quote.
              </p>
            </div>
            <Link 
              href={`/auth/signup?claim=${id}&license=${encodeURIComponent(licenseParam)}`}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-6 py-3.5 rounded-xl transition whitespace-nowrap shadow-lg"
            >
              ✓ Claim My Free Page Now
            </Link>
          </div>
        )}

        {/* Header & State License Badge */}
        <div className="text-center space-y-4 pt-4">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-emerald-950/90 text-emerald-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-700/60">
            <span>🛡️</span> Active License: {licenseParam} • {townParam}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white capitalize tracking-tight">
            {contractorName}
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            Local trade professional serving {townParam} and surrounding towns. Request a fast estimate below or pass a trade referral.
          </p>
        </div>

        {/* PILLAR A: Active Lead Catcher (Captures Homeowner Quotes Before or After Claim) */}
        <div className="bg-slate-900 border-2 border-blue-500/50 p-6 md:p-8 rounded-3xl space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">Fast Local Estimate</span>
              <h3 className="text-xl font-extrabold text-white capitalize">Request a Quote from {contractorName}</h3>
              <p className="text-xs text-slate-400">Your request goes directly to this contractor's mobile command center.</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/50">
              ⚡ Typical Reply: Under 1 Hour
            </span>
          </div>

          {!leadCaptured ? (
            <form onSubmit={handleCaptureLead} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Your Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Sarah Jenkins"
                    value={homeownerName}
                    onChange={(e) => setHomeownerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Your Mobile Phone</label>
                  <input 
                    type="text" 
                    required
                    placeholder="(203) 555-0199"
                    value={homeownerPhone}
                    onChange={(e) => setHomeownerPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Estimated Budget</label>
                  <select 
                    value={estimatedBudget}
                    onChange={(e) => setEstimatedBudget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white"
                  >
                    <option>Under $1,000 (Repair / Service)</option>
                    <option>$1,000 - $2,500</option>
                    <option>$2,500 - $5,000</option>
                    <option>$5,000 - $15,000+</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">What do you need done?</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Describe your project or repair, town, and timing..."
                  value={projectScope}
                  onChange={(e) => setProjectScope(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-4 rounded-2xl text-sm transition shadow-xl shadow-blue-600/30"
              >
                📲 Send Project Request Directly to {contractorName}
              </button>
            </form>
          ) : (
            <div className="bg-emerald-950/60 border border-emerald-500/50 p-6 rounded-2xl text-center space-y-2">
              <p className="text-lg font-extrabold text-emerald-400">✓ Project Request Locked & Dispatched!</p>
              <p className="text-xs text-slate-300 max-w-lg mx-auto">
                We have alerted <strong className="capitalize">{contractorName}</strong> with your scope ({estimatedBudget}). You will receive their itemized quote directly via text message at {homeownerPhone}.
              </p>
            </div>
          )}
        </div>

        {/* Service Territory Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="text-lg font-bold text-white">Verified Service Territory</h3>
              <p className="text-xs text-slate-400">State Registry Address & Local Dispatch Zone</p>
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/50">
              Active • 25-Mile Local Radius
            </span>
          </div>
          <div className="w-full h-44 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:20px_20px]"></div>
            <div className="relative z-10 space-y-2">
              <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center mx-auto border border-blue-500/40 text-xl">
                📍
              </div>
              <p className="text-sm font-bold text-white">{townParam} & Surrounding Area</p>
              <p className="text-xs text-slate-400">Credential ID: {licenseParam} • Verified via State Open Data Registry</p>
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
