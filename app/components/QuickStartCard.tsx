'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MASTER_TRADES } from './tradesData';

export default function QuickStartCard({
  defaultTrade = 'General Contractor',
}: {
  defaultTrade?: string;
}) {
  const router = useRouter();
  const [trade, setTrade] = useState(defaultTrade);
  const [location, setLocation] = useState('Weston, CT');
  const [contact, setContact] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [detecting, setDetecting] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (defaultTrade) {
      const match = MASTER_TRADES.find(
        (t) => t.name.toLowerCase() === defaultTrade.toLowerCase() || t.slug === defaultTrade.toLowerCase()
      );
      if (match) setTrade(match.name);
      else setTrade(defaultTrade);
    }
  }, [defaultTrade]);

  useEffect(() => {
    let cancelled = false;
    async function detectIP() {
      try {
        const res = await fetch('/api/geo');
        const data = await res.json();
        if (!cancelled && data?.location) {
          setLocation(data.location);
          setDetecting(false);
          return;
        }
      } catch {}
      try {
        const ipRes = await fetch('https://ipapi.co/json/');
        const ipData = await ipRes.json();
        if (!cancelled && ipData?.city && ipData?.region_code) {
          setLocation(`${ipData.city}, ${ipData.region_code}`);
          setDetecting(false);
          return;
        }
      } catch {}
      if (!cancelled) setDetecting(false);
    }
    detectIP();
    return () => {
      cancelled = true;
    };
  }, []);

  const launchWorkspace = (providerName?: string) => {
    const resolvedName =
      businessName.trim() ||
      (providerName ? `${location.split(',')[0]} ${trade} Pro` : `Verified ${trade}`);
    const resolvedContact = contact.trim() || (providerName ? `${providerName} Account` : '');

    const userObj = {
      name: resolvedName,
      phoneOrEmail: resolvedContact,
      trade,
      location,
      licenseNumber: 'State Verified',
      provider: providerName || 'Direct',
    };

    localStorage.setItem('joballies_temp_user', JSON.stringify(userObj));
    localStorage.setItem('joballies_user', JSON.stringify(userObj));
    localStorage.setItem('joballies_authenticated', 'true');
    router.push('/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    launchWorkspace();
  };

  return (
    <div className="bg-slate-900 border-2 border-blue-500/60 rounded-3xl p-6 md:p-7 shadow-2xl shadow-blue-950/40 text-left space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">
            ⚡ Pre-Filled for Your Area • Ready in 1 Tap
          </span>
          <h2 className="text-lg md:text-xl font-black text-white">
            Get {trade} Jobs in {location}
          </h2>
        </div>
        <span className="text-xs font-extrabold bg-blue-950 text-blue-300 border border-blue-800 px-3 py-1 rounded-full">
          $0 Free Setup
        </span>
      </div>

      {/* 1-Tap Google / Apple Instant Entry */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => launchWorkspace('Google')}
          className="bg-white hover:bg-slate-100 text-slate-950 font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow"
        >
          <span>🌐</span>
          <span>Continue with Google</span>
        </button>
        <button
          type="button"
          onClick={() => launchWorkspace('Apple')}
          className="bg-slate-950 hover:bg-slate-800 border border-slate-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition"
        >
          <span>🍎</span>
          <span>Continue with Apple</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-blue-400 mb-1">
              Your Trade (Editable)
            </label>
            <select
              value={trade}
              onChange={(e) => setTrade(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-xs font-extrabold text-white focus:border-blue-400 focus:outline-none"
            >
              {MASTER_TRADES.map((t) => (
                <option key={t.slug} value={t.name}>
                  {t.icon} {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 mb-1">
              Your Town ({detecting ? 'IP Detecting...' : 'Editable'})
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-xs font-extrabold text-white focus:border-emerald-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Business or Your Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-xs text-white"
          />
          <input
            type="text"
            required
            placeholder="Mobile Phone or Email *"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-xs text-white"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl text-sm transition shadow-xl shadow-blue-600/30"
        >
          {submitting ? 'Opening Workspace...' : `Open My ${location} ${trade} Workspace →`}
        </button>
      </form>
    </div>
  );
}
