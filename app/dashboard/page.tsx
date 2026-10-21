'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const isAuth = localStorage.getItem('joballies_authenticated');
    const userData = localStorage.getItem('joballies_user');
    if (!isAuth) {
      router.push('/auth/signup');
    } else if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('joballies_authenticated');
    localStorage.removeItem('joballies_user');
    router.push('/auth/signup');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-6 gap-6">
          <div>
            <span className="text-xs md:text-sm font-extrabold text-blue-400 uppercase tracking-widest">JobAllies Command Center</span>
            <h1 className="text-3xl md:text-4xl font-black text-white mt-1">Welcome back, {user?.name || 'Pro Contractor'}</h1>
            <p className="text-sm md:text-base text-slate-300 mt-1">Primary Trade: <strong className="text-white">{user?.trade || 'General Contractor'}</strong></p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Link href="/dashboard/portfolio" className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm md:text-base font-bold px-6 py-4 rounded-2xl transition text-center shadow-lg">
              Edit Portfolio ⚙️
            </Link>
            <button 
              onClick={handleLogout}
              className="flex-1 sm:flex-none bg-red-950/50 hover:bg-red-900/50 border border-red-800 text-red-300 text-sm md:text-base font-bold px-6 py-4 rounded-2xl transition text-center shadow-lg"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Core Tool Grid - Large Touch Targets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/dashboard/voice-quote" className="bg-slate-900 border-2 border-slate-800 hover:border-blue-500 p-8 md:p-10 rounded-3xl space-y-4 transition shadow-2xl group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center text-3xl font-black border border-blue-500/40 group-hover:scale-110 transition shadow-inner">
                🎙️
              </div>
              <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition">Voice Estimate</h3>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed">Speak job notes from your truck into instant line-item quotes in 30 seconds.</p>
            </div>
            <span className="text-blue-400 font-extrabold text-sm md:text-base pt-2 inline-block">Launch Voice Tool →</span>
          </Link>

          <Link href="/dashboard/supplier-cart" className="bg-slate-900 border-2 border-slate-800 hover:border-blue-500 p-8 md:p-10 rounded-3xl space-y-4 transition shadow-2xl group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-emerald-600/20 text-emerald-400 rounded-2xl flex items-center justify-center text-3xl font-black border border-emerald-500/40 group-hover:scale-110 transition shadow-inner">
                🛒
              </div>
              <h3 className="text-2xl font-black text-white group-hover:text-emerald-400 transition">Wholesale Copier</h3>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed">One-tap SKU list export for Home Depot Pro and local supply house counters.</p>
            </div>
            <span className="text-emerald-400 font-extrabold text-sm md:text-base pt-2 inline-block">Open Supply List →</span>
          </Link>

          <Link href="/dashboard/network" className="bg-slate-900 border-2 border-slate-800 hover:border-blue-500 p-8 md:p-10 rounded-3xl space-y-4 transition shadow-2xl group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-amber-600/20 text-amber-400 rounded-2xl flex items-center justify-center text-3xl font-black border border-amber-500/40 group-hover:scale-110 transition shadow-inner">
                🤝
              </div>
              <h3 className="text-2xl font-black text-white group-hover:text-amber-400 transition">Trade Network</h3>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed">Safe referral handoffs and automated Stripe escrow splits with trusted crew members.</p>
            </div>
            <span className="text-amber-400 font-extrabold text-sm md:text-base pt-2 inline-block">View Referral Network →</span>
          </Link>

          <Link href="/profile/sample-contractor" target="_blank" className="bg-slate-900 border-2 border-slate-800 hover:border-blue-500 p-8 md:p-10 rounded-3xl space-y-4 transition shadow-2xl group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-purple-600/20 text-purple-400 rounded-2xl flex items-center justify-center text-3xl font-black border border-purple-500/40 group-hover:scale-110 transition shadow-inner">
                🌐
              </div>
              <h3 className="text-2xl font-black text-white group-hover:text-purple-400 transition">Public Landing Page</h3>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed">View your live portfolio, service radius map, and verified customer reviews.</p>
            </div>
            <span className="text-purple-400 font-extrabold text-sm md:text-base pt-2 inline-block">Open Public Page ↗</span>
          </Link>
        </div>

        {/* Quick Status Bar */}
        <div className="bg-slate-900 border-2 border-slate-800 p-8 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-6 shadow-2xl">
          <div className="space-y-1 text-left w-full sm:w-auto">
            <h4 className="font-black text-white text-base md:text-lg">Need to boost reviews on an active job?</h4>
            <p className="text-sm text-slate-300">Trigger an instant automated SMS request to your client's phone.</p>
          </div>
          <button 
            onClick={() => alert("Automated 5-star Google/Yelp review request SMS dispatched via Twilio!")} 
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm md:text-base px-8 py-4 rounded-2xl transition shadow-xl shadow-emerald-600/30 whitespace-nowrap text-center"
          >
            Send Review Request SMS 📱
          </button>
        </div>
      </div>

      <footer className="max-w-5xl mx-auto w-full text-center border-t border-slate-800/80 pt-8 mt-20 text-sm text-slate-400">
        JobAllies — All rights reserved. (from UpLevel Labs, Inc.)
      </footer>
    </main>
  );
}
