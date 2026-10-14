'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<any>({ name: 'Pro Contractor', trade: 'General Contractor' });
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('joballies_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('joballies_authenticated');
    localStorage.removeItem('joballies_user');
    router.push('/auth/signup');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-5 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
              <span>⚡</span> JobAllies Truck-Cab Command Center
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Hey, {user?.name || 'Pro'}
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {user?.trade || 'Licensed Trade Pro'} • Active Local Territory: Fairfield County, CT
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/dashboard/mass-invite" className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold px-4 py-3 rounded-xl transition shadow-lg shadow-amber-500/20">
              🚀 Mass-Invite Local Pros
            </Link>
            <Link href="/dashboard/verify" className="bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-700/60 text-emerald-300 text-xs font-bold px-4 py-3 rounded-xl transition">
              🛡️ Verified Pro Badge
            </Link>
            <button 
              onClick={handleLogout}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 text-xs font-semibold px-4 py-3 rounded-xl transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Cash-in-Pocket Snapshot */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Open Quotes Out</p>
              <p className="text-2xl font-extrabold text-white mt-1">$8,450</p>
              <p className="text-xs text-emerald-400 mt-0.5">3 waiting on homeowner tap</p>
            </div>
            <div className="text-3xl bg-blue-950/60 border border-blue-800/40 w-12 h-12 rounded-2xl flex items-center justify-center">📄</div>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Finder's Fees Locked</p>
              <p className="text-2xl font-extrabold text-emerald-400 mt-1">$620</p>
              <p className="text-xs text-slate-400 mt-0.5">From 2 jobs passed to your crew</p>
            </div>
            <div className="text-3xl bg-emerald-950/60 border border-emerald-800/40 w-12 h-12 rounded-2xl flex items-center justify-center">💵</div>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">5-Star Rating</p>
              <p className="text-2xl font-extrabold text-amber-400 mt-1">5.0 ★</p>
              <p className="text-xs text-slate-400 mt-0.5">Google & Yelp Auto-Synced</p>
            </div>
            <div className="text-3xl bg-amber-950/60 border border-amber-800/40 w-12 h-12 rounded-2xl flex items-center justify-center">⭐</div>
          </div>
        </div>

        {/* Main 4 Field Tools - Crisp Non-Technical Copy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/dashboard/voice-quote" className="bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 hover:border-blue-500 p-6 rounded-3xl space-y-4 transition shadow-xl group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="w-14 h-14 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center text-2xl border border-blue-500/30 group-hover:scale-105 transition">
                  🎙️
                </div>
                <span className="text-xs font-bold text-blue-400 bg-blue-950/60 px-3 py-1 rounded-full border border-blue-800/50">
                  30-Second Quotes
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-white group-hover:text-blue-400 transition">Talk-to-Quote</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Speak your job notes from the front seat of your truck. We turn your voice into a clean, itemized quote ready to text the homeowner before you turn the key.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-blue-400 flex items-center gap-1">
              Tap to Speak a Quote <span>→</span>
            </div>
          </Link>

          <Link href="/dashboard/supplier-cart" className="bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 hover:border-orange-500 p-6 rounded-3xl space-y-4 transition shadow-xl group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="w-14 h-14 bg-orange-600/20 text-orange-400 rounded-2xl flex items-center justify-center text-2xl border border-orange-500/30 group-hover:scale-105 transition">
                  📦
                </div>
                <span className="text-xs font-bold text-orange-400 bg-orange-950/60 px-3 py-1 rounded-full border border-orange-800/50">
                  Home Depot • Lowe's • Supply House
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-white group-hover:text-orange-400 transition">Supply House Express</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Done typing part numbers twice. Grab a 1-tap material list from any quote to paste straight into Home Depot Pro, Lowe's, or text to your local counter rep.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-orange-400 flex items-center gap-1">
              Open Material Order Pad <span>→</span>
            </div>
          </Link>

          <Link href="/dashboard/network" className="bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 hover:border-emerald-500 p-6 rounded-3xl space-y-4 transition shadow-xl group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="w-14 h-14 bg-emerald-600/20 text-emerald-400 rounded-2xl flex items-center justify-center text-2xl border border-emerald-500/30 group-hover:scale-105 transition">
                  🤝
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/50">
                  Get Paid for Referrals + FB Vouches
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-white group-hover:text-emerald-400 transition">Sub & Referral Crew</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Pass out-of-scope work to local pros you trust and lock in a 10% finder's fee—or have a trade buddy drop a 1-click recommendation for you in local Facebook groups.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-emerald-400 flex items-center gap-1">
              Manage Crew & Neighbor Vouches <span>→</span>
            </div>
          </Link>

          <Link href="/dashboard/portfolio" className="bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 hover:border-purple-500 p-6 rounded-3xl space-y-4 transition shadow-xl group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="w-14 h-14 bg-purple-600/20 text-purple-400 rounded-2xl flex items-center justify-center text-2xl border border-purple-500/30 group-hover:scale-105 transition">
                  🏆
                </div>
                <span className="text-xs font-bold text-purple-400 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-800/50">
                  Live Digital Yard Sign
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-white group-hover:text-purple-400 transition">My Work & Yard Sign</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Show off jobsite photos, the exact towns you cover, and your best Google & Yelp reviews on a clean link you can text to any homeowner.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-purple-400 flex items-center gap-1">
              Customize My Page & Reviews <span>→</span>
            </div>
          </Link>
        </div>

        {/* Fast Action Banner: 1-Tap 5-Star Review Booster + Mass Invite */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Just Finished a Job?</span>
              <h4 className="font-extrabold text-white text-base">Get a 5-Star Google or Yelp Review</h4>
              <p className="text-xs text-slate-400">Send a polite text to your customer's phone with your direct review link while you're still in the driveway.</p>
            </div>
            <button 
              onClick={() => alert("5-Star Review Request SMS sent to homeowner!")} 
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3.5 rounded-xl transition shadow-lg shadow-emerald-600/20 whitespace-nowrap"
            >
              📲 Text Customer for Review
            </button>
          </div>

          <div className="bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-700/40 p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Grow the Local Network</span>
              <h4 className="font-extrabold text-white text-base">Auto-Invite Local Tradespeople En Masse</h4>
              <p className="text-xs text-slate-300">Pre-build Digital Yard Signs for local contractors and blast "Waiting Lead / Crew Invite" texts automatically.</p>
            </div>
            <Link 
              href="/dashboard/mass-invite"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-5 py-3.5 rounded-xl transition shadow-lg shadow-amber-500/20 whitespace-nowrap"
            >
              ⚡ Open Mass Inviter
            </Link>
          </div>
        </div>
      </div>

      <footer className="max-w-6xl mx-auto w-full text-center border-t border-slate-800/80 pt-8 mt-16 text-xs text-slate-500">
        © {new Date().getFullYear()} JobAllies — All rights reserved. (from UpLevel Labs, Inc.)
      </footer>
    </main>
  );
}
