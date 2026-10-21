'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MASTER_TRADES } from './tradesData';

export default function QuickStartCard({ defaultTrade = 'General Contractor' }: { defaultTrade?: string }) {
  const router = useRouter();
  const [trade, setTrade] = useState(defaultTrade);
  const [location, setLocation] = useState('Weston, CT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [detecting, setDetecting] = useState(true);

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

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      alert('Please fill in your name, email address, and mobile phone number.');
      return;
    }

    const userObj = {
      name: name.trim(),
      email: email.trim(),
      phoneOrEmail: phone.trim(),
      trade,
      location,
      licenseNumber: 'State Verified',
    };

    localStorage.setItem('joballies_temp_user', JSON.stringify(userObj));
    localStorage.setItem('joballies_user', JSON.stringify(userObj));
    localStorage.setItem('joballies_authenticated', 'true');
    router.push('/dashboard');
  };

  return (
    <div className="bg-slate-900 border-2 border-blue-500/60 rounded-3xl p-6 md:p-8 shadow-2xl shadow-blue-950/40 text-left space-y-5">
      <div className="border-b border-slate-800 pb-3">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">
          ⚡ Pre-Filled for Your Area • Instant Access
        </span>
        <h2 className="text-xl font-black text-white mt-0.5">
          See Active {trade} Leads in {location}
        </h2>
      </div>

      <form onSubmit={handleLaunch} className="space-y-4">
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
              Your Town ({detecting ? 'Detecting IP...' : 'Editable'})
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

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
              Your Name or Business Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mike Johnson Construction"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="mike@ contractor.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                Mobile Phone *
              </label>
              <input
                type="tel"
                required
                placeholder="(203) 555-0199"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-xs text-white"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl text-sm transition shadow-xl shadow-blue-600/30"
        >
          View Leads & Auto-Created Quotes →
        </button>
      </form>
    </div>
  );
}
