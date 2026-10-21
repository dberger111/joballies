'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteFooter from './components/SiteFooter';
import Logo from './components/Logo';
import QuickStartCard from './components/QuickStartCard';
import { MASTER_TRADES } from './components/tradesData';

export default function HomePage() {
  const [hasUser, setHasUser] = useState(false);

  useEffect(() => {
    try {
      const u = localStorage.getItem('joballies_user') || localStorage.getItem('joballies_temp_user');
      if (u) setHasUser(true);
    } catch {}
  }, []);

  const groups = [
    "Core Residential & Commercial",
    "Building & Exterior",
    "Mechanical & Industrial",
    "Heavy Equipment & Utility",
    "Property & Specialty Services",
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto w-full space-y-16">
        <header className="flex justify-between items-center border-b border-slate-800 pb-5">
          <Logo />
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block bg-amber-950/80 border border-amber-800 text-amber-400 text-xs font-bold px-4 py-2 rounded-xl">
              Pricing - Zero charge until you win a job through JobAllies!
            </span>
            {hasUser && (
              <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-5 py-2.5 rounded-xl transition shadow-lg">
                My Dashboard →
              </Link>
            )}
          </div>
        </header>

        <div className="text-center space-y-6 pt-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Win More Local Jobs.<br />
            Compare Material Costs.<br />
            Quote By Voice in Seconds.<br />
            Build Your Trusted Network.
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Speak 30-second quotes from your truck, copy 1-tap supply house order pads, and get paid 10% finder's fees for passing overflow jobs to local pros you trust.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <QuickStartCard defaultTrade="General Contractor" />
        </div>

        <div className="space-y-10 pt-8 border-t border-slate-800">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-white">Select Your Trade</h2>
            <p className="text-sm text-slate-400">Click any trade below to open its dedicated Command Center and local lead feed.</p>
          </div>

          {groups.map((groupName) => (
            <div key={groupName} className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-blue-400 border-b border-slate-800/80 pb-2">
                {groupName}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {MASTER_TRADES.filter((t) => t.group === groupName).map((t) => (
                  <Link
                    key={t.slug}
                    href={`/trades/${t.slug}`}
                    className="bg-slate-900 hover:bg-blue-600/20 border border-slate-800 hover:border-blue-500 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-bold transition text-slate-200 hover:text-white shadow-sm"
                  >
                    <span className="text-lg">{t.icon}</span>
                    <span>{t.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
