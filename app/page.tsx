'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteFooter from './components/SiteFooter';
import Logo from './components/Logo';
import QuickStartCard from './components/QuickStartCard';

export default function HomePage() {
  const [hasUser, setHasUser] = useState(false);

  useEffect(() => {
    try {
      const u = localStorage.getItem('joballies_user') || localStorage.getItem('joballies_temp_user');
      if (u) setHasUser(true);
    } catch {}
  }, []);

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
            <span className="text-white">Win More Local Jobs.</span><br />
            <span className="text-blue-500">Compare Material Costs.</span><br />
            <span className="text-emerald-400">Quote By Voice in Seconds.</span><br />
            <span className="text-amber-400">Build Your Trusted Network.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Speak 30-second quotes from your truck, copy 1-tap supply house order pads, and get paid 10% finder's fees for passing overflow jobs to local pros you trust.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <QuickStartCard defaultTrade="General Contractor" />
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
