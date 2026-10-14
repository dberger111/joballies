'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PortfolioManager() {
  const [businessName, setBusinessName] = useState("Precision Stone & Masonry");
  const [trade, setTrade] = useState("Mason");
  const [serviceArea, setServiceArea] = useState("Fairfield County, CT");
  const [radius, setRadius] = useState("25");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('joballies_portfolio');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setBusinessName(parsed.businessName || businessName);
      setTrade(parsed.trade || trade);
      setServiceArea(parsed.serviceArea || serviceArea);
      setRadius(parsed.radius || radius);
    }
  }, []);

  const handleSave = () => {
    const data = { businessName, trade, serviceArea, radius };
    localStorage.setItem('joballies_portfolio', JSON.stringify(data));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-6 gap-4">
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">JobAllies Command Center</span>
            <h1 className="text-3xl font-extrabold text-white">Portfolio & Public Landing Page</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/verify" className="bg-emerald-600/20 border border-emerald-500/50 hover:bg-emerald-600/30 text-emerald-400 text-xs font-semibold px-4 py-2.5 rounded-xl transition">
              ✓ Get Verified (KYC)
            </Link>
            <Link href="/profile/sample-contractor" target="_blank" className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition">
              Preview Public Page ↗
            </Link>
          </div>
        </div>

        {/* Business Details */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-lg font-semibold text-white">Business Profile & Service Territory</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Business Name</label>
              <input 
                type="text" 
                value={businessName} 
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Primary Trade</label>
              <input 
                type="text" 
                value={trade} 
                onChange={(e) => setTrade(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Base Location / Town</label>
              <input 
                type="text" 
                value={serviceArea} 
                onChange={(e) => setServiceArea(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Service Radius (Miles)</label>
              <input 
                type="text" 
                value={radius} 
                onChange={(e) => setRadius(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="pt-2 flex justify-end">
            <button 
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl transition text-sm shadow-lg shadow-blue-600/20"
            >
              Save Portfolio Settings
            </button>
          </div>
          {saved && <p className="text-emerald-400 text-xs text-right font-medium">Changes saved successfully!</p>}
        </div>

        {/* Quick Links to Advanced Tools */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/dashboard/voice-quote" className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-blue-500/50 transition group space-y-2">
            <div className="text-2xl">🎙️</div>
            <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition">Voice Estimate Tool</h4>
            <p className="text-xs text-slate-400">Speak job notes into instant line-item quotes.</p>
          </Link>
          <Link href="/dashboard/supplier-cart" className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-blue-500/50 transition group space-y-2">
            <div className="text-2xl">🛒</div>
            <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition">Wholesale SKU Copier</h4>
            <p className="text-xs text-slate-400">One-tap material list export for supply runs.</p>
          </Link>
          <Link href="/dashboard/network" className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-blue-500/50 transition group space-y-2">
            <div className="text-2xl">🤝</div>
            <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition">Trade Network & Escrow</h4>
            <p className="text-xs text-slate-400">Secure referral commission splits with local allies.</p>
          </Link>
        </div>
      </div>

      <footer className="max-w-4xl mx-auto w-full text-center border-t border-slate-800/80 pt-8 mt-16 text-xs text-slate-500">
        JobAllies — All rights reserved. (from UpLevel Labs, Inc.)
      </footer>
    </main>
  );
}
