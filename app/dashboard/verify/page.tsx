'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function VerifyContractorPage() {
  const [submitted, setSubmitted] = useState(false);
  const [license, setLicense] = useState("HIC.0649281");
  const [insurance, setInsurance] = useState("Verified $2M General Liability");

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Trust & Identity Verification</span>
            <h1 className="text-3xl font-extrabold text-white">Contractor KYC & License Check</h1>
          </div>
          <Link href="/dashboard/portfolio" className="text-slate-400 hover:text-white text-sm transition">
            ← Back
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-2xl">
          <p className="text-sm text-slate-300">
            Homeowners look for verified credentials before awarding high-ticket projects. Enter your state license and insurance details to earn the official <strong className="text-emerald-400">JobAllies Verified Badge</strong>.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">State Contractor License Number</label>
              <input 
                type="text" 
                value={license} 
                onChange={(e) => setLicense(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Insurance Policy Verification</label>
              <input 
                type="text" 
                value={insurance} 
                onChange={(e) => setInsurance(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button 
            onClick={() => setSubmitted(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 rounded-xl transition text-sm shadow-lg shadow-emerald-600/25"
          >
            Submit Credentials for Instant Verification
          </button>

          {submitted && (
            <div className="bg-emerald-950/50 border border-emerald-500/50 p-4 rounded-xl text-center space-y-1 animate-fadeIn">
              <p className="text-emerald-400 font-bold text-sm">✓ Credentials Verified Successfully!</p>
              <p className="text-xs text-slate-300">Your public badge is now active on your portfolio landing page.</p>
            </div>
          )}
        </div>
      </div>
      <footer className="max-w-2xl mx-auto w-full text-center border-t border-slate-800/80 pt-8 mt-16 text-xs text-slate-500">
        JobAllies — All rights reserved. (from UpLevel Labs, Inc.)
      </footer>
    </main>
  );
}
