'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteFooter from '../../components/SiteFooter';
import Logo from '../../components/Logo';

export default function ContractorLandingPage() {
  const [contractor, setContractor] = useState({
    name: 'Mike Johnson',
    trade: 'General Contractor',
    location: 'Weston, CT',
    phone: '(203) 555-0199',
    license: 'HIC.0649281',
    radiusMiles: 25
  });

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientBudget, setClientBudget] = useState('$2,500 - $5,000');
  const [clientScope, setClientScope] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('joballies_user') || localStorage.getItem('joballies_temp_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setContractor(prev => ({
          ...prev,
          name: parsed.name || parsed.businessName || prev.name,
          trade: parsed.trade || prev.trade,
          location: parsed.location || prev.location,
          phone: parsed.phoneOrEmail || prev.phone,
          license: parsed.licenseNumber || prev.license
        }));
      }
    } catch {}
  }, []);

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !clientScope.trim()) {
      alert('Please fill out all required fields.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full space-y-10">
        
        {/* Header */}
        <header className="flex justify-between items-center border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <Link href="/dashboard"><Logo size="sm" /></Link>
            <span className="text-xs font-bold text-slate-400">JobAllies Verified Contractor Network</span>
          </div>
          <Link href="/dashboard" className="bg-slate-900 border border-slate-800 hover:border-blue-500 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl transition">
            ← Pro Command Center
          </Link>
        </header>

        {/* Hero Badge & Name */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-extrabold px-4 py-1.5 rounded-full">
            <span>🛡️</span> ACTIVE LICENSE: {contractor.license} • {contractor.location.toUpperCase()}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">{contractor.name}</h1>
          <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto">
            Licensed {contractor.trade} serving {contractor.location} and surrounding towns. Request a fast estimate below or pass a trade referral.
          </p>
        </div>

        {/* Interactive Request Form Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 md:p-10 rounded-3xl shadow-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">Fast Local Estimate</span>
              <h3 className="text-xl font-black text-white">Request A Quote From {contractor.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Your request goes directly to this contractor's mobile command center.</p>
            </div>
            <span className="hidden sm:inline-block bg-blue-950 border border-blue-800 text-blue-400 text-xs font-bold px-3.5 py-1.5 rounded-full">
              ⚡ Typical Reply: Under 1 Hour
            </span>
          </div>

          {submitted ? (
            <div className="bg-emerald-950/40 border border-emerald-500/50 p-8 rounded-2xl text-center space-y-3">
              <h4 className="text-lg font-black text-emerald-400">✓ Request Successfully Dispatched!</h4>
              <p className="text-xs text-slate-300">
                Your project details have been sent instantly to {contractor.name} at {contractor.phone}. You will receive a response shortly.
              </p>
              <button onClick={() => setSubmitted(false)} className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition mt-2">
                Send Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitQuote} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Your Name</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Your Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)}
                    placeholder="(203) 555-0199"
                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Estimated Budget</label>
                  <select
                    value={clientBudget}
                    onChange={e => setClientBudget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white font-bold"
                  >
                    <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                    <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                    <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                    <option value="$10,000+">$10,000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">What do you need done?</label>
                <textarea
                  required
                  rows={4}
                  value={clientScope}
                  onChange={e => setClientScope(e.target.value)}
                  placeholder="Describe your project or repair, town, and timing..."
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl text-sm transition shadow-lg shadow-blue-600/30 text-center"
              >
                📱 Send Project Request Directly to {contractor.name}
              </button>
            </form>
          )}
        </div>

        {/* Verified Territory Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-extrabold text-white text-base">Verified Service Territory</h4>
              <p className="text-xs text-slate-400">State Registry Address & Local Dispatch Zone for {contractor.name}</p>
            </div>
            <span className="bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
              Active • {contractor.radiusMiles}-Mile Local Radius
            </span>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl text-center space-y-2">
            <p className="text-sm font-bold text-white">Primary Operating Hub: <span className="text-blue-400">{contractor.location}</span></p>
            <p className="text-xs text-slate-400">Covering all properties within {contractor.radiusMiles} miles. Licensed & Insured.</p>
          </div>
        </div>

      </div>
      <SiteFooter />
    </main>
  );
}
