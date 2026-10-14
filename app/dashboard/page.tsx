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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-6 gap-4">
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">JobAllies Command Center</span>
            <h1 className="text-3xl font-extrabold text-white">Welcome back, {user?.name || 'Pro Contractor'}</h1>
            <p className="text-xs text-slate-400">Primary Trade: {user?.trade || 'General Contractor'}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/portfolio" className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition">
              Edit Portfolio ⚙️
            </Link>
            <button 
              onClick={handleLogout}
              className="bg-red-950/40 hover:bg-red-900/40 border border-red-800/50 text-red-400 text-xs font-semibold px-4 py-2.5 rounded-xl transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Core Tool Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/dashboard/voice-quote" className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-6 rounded-3xl space-y-3 transition shadow-xl group">
            <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center text-xl font-bold border border-blue-500/30 group-hover:scale-110 transition">
              🎙️
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition">Voice Estimate</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Speak job notes from your truck into instant line-item quotes.</p>
          </Link>

          <Link href="/dashboard/supplier-cart" className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-6 rounded-3xl space-y-3 transition shadow-xl group">
            <div className="w-12 h-12 bg-emerald-600/20 text-emerald-400 rounded-2xl flex items-center justify-center text-xl font-bold border border-emerald-500/30 group-hover:scale-110 transition">
              🛒
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">Wholesale Copier</h3>
            <p className="text-xs text-slate-400 leading-relaxed">One-tap SKU list export for Home Depot Pro and supply runs.</p>
          </Link>

          <Link href="/dashboard/network" className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-6 rounded-3xl space-y-3 transition shadow-xl group">
            <div className="w-12 h-12 bg-amber-600/20 text-amber-400 rounded-2xl flex items-center justify-center text-xl font-bold border border-amber-500/30 group-hover:scale-110 transition">
              🤝
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition">Trade Network</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Safe referral handoffs and automated Stripe escrow splits.</p>
          </Link>

          <Link href="/profile/sample-contractor" target="_blank" className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-6 rounded-3xl space-y-3 transition shadow-xl group">
            <div className="w-12 h-12 bg-purple-600/20 text-purple-400 rounded-2xl flex items-center justify-center text-xl font-bold border border-purple-500/30 group-hover:scale-110 transition">
              🌐
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition">Public Landing Page</h3>
            <p className="text-xs text-slate-400 leading-relaxed">View your live portfolio, service radius map, and verified reviews.</p>
          </Link>
        </div>

        {/* Quick Status Bar */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm">Need to boost reviews on an active job?</h4>
            <p className="text-xs text-slate-400">Trigger an instant automated SMS request to your client's phone.</p>
          </div>
          <button 
            onClick={() => alert("Automated 5-star Google/Yelp review request SMS dispatched via Twilio!")} 
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-5 py-3 rounded-xl transition shadow-lg shadow-emerald-600/20 whitespace-nowrap"
          >
            Send Review Request SMS
          </button>
        </div>
      </div>

      <footer className="max-w-5xl mx-auto w-full text-center border-t border-slate-800/80 pt-8 mt-20 text-xs text-slate-500">
        JobAllies — All rights reserved. (from UpLevel Labs, Inc.)
      </footer>
    </main>
  );
}
