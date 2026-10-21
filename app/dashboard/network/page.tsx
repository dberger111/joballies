'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function NetworkPage() {
  const [allies, setAllies] = useState([
    { name: 'Dave Sparks', trade: 'Electrical & Lighting', phone: '(203) 555-0192', status: 'Active Partner (10% Split)' },
    { name: 'Robert Miller', trade: 'Plumber', phone: '(203) 555-0284', status: 'Active Partner (10% Split)' },
  ]);

  const [allyName, setAllyName] = useState('');
  const [allyPhone, setAllyPhone] = useState('');
  const [selectedTrade, setSelectedTrade] = useState('Plumber');

  const tradeCategories = [
    { name: 'Plumber', icon: '🚰', desc: 'Water heaters, repipes, drains' },
    { name: 'Electrical & Lighting', icon: '⚡', desc: 'Panels, EV chargers, wiring' },
    { name: 'HVAC Technician', icon: '❄️', desc: 'Mini-splits, furnaces, ducts' },
    { name: 'Roofing & Siding', icon: '🏠', desc: 'Shingles, gutters, flashing' },
    { name: 'Masonry & Concrete', icon: '🧱', desc: 'Patios, stonework, foundations' },
    { name: 'Painter & Decorator', icon: '🎨', desc: 'Interior/exterior, cabinets' },
    { name: 'Carpenter & Framing', icon: '🪚', desc: 'Decks, trim, framing, doors' },
    { name: 'Landscaper', icon: '🌲', desc: 'Hardscaping, plantings, turf' },
    { name: 'Handyman', icon: '🛠️', desc: 'General repairs & punch lists' },
    { name: 'Drywall Installer', icon: '📏', desc: 'Hang, tape, mud, texture' },
  ];

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allyName.trim() || !allyPhone.trim()) {
      alert('Please enter your ally\'s name and mobile phone number.');
      return;
    }

    const newAlly = {
      name: allyName.trim(),
      trade: selectedTrade,
      phone: allyPhone.trim(),
      status: 'Invitation Dispatched via SMS',
    };

    setAllies([newAlly, ...allies]);
    alert(`Success! A personalized SMS invitation was sent to ${allyName} (${allyPhone}) to join your JobAllies 10% referral crew.`);
    setAllyName('');
    setAllyPhone('');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 flex flex-col justify-between">
      <div className="max-w-5xl mx-auto w-full space-y-10">
        <header className="flex justify-between items-center border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">
              JA
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white">Trusted Trade Allies & Referral Network</h1>
              <p className="text-xs md:text-sm text-slate-400">Pass overflow work to trusted local pros and lock in your 10% finder's fee.</p>
            </div>
          </div>
          <Link href="/dashboard" className="bg-slate-900 border border-slate-800 hover:bg-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300">
            ← Return to Dashboard
          </Link>
        </header>

        {/* 1-Click Invitation Form */}
        <section className="bg-slate-900 border-2 border-blue-500/50 p-6 md:p-8 rounded-3xl space-y-6 shadow-2xl">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">🤝 Viral Crew Onboarding</span>
            <h2 className="text-xl md:text-2xl font-black text-white mt-1">Invite a Trusted Trade Ally</h2>
            <p className="text-xs md:text-sm text-slate-300">Who is the best plumber, electrician, or mason you trust on jobsites? Drop their details to lock in your 10% referral split.</p>
          </div>

          <form onSubmit={handleInvite} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">Ally Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dave Sparks"
                value={allyName}
                onChange={(e) => setAllyName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">Mobile Phone *</label>
              <input
                type="tel"
                required
                placeholder="(203) 555-0199"
                value={allyPhone}
                onChange={(e) => setAllyPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">Their Trade</label>
              <select
                value={selectedTrade}
                onChange={(e) => setSelectedTrade(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-bold"
              >
                {tradeCategories.map((t) => (
                  <option key={t.name} value={t.name}>{t.icon} {t.name}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-3">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl text-sm transition shadow-xl shadow-blue-600/30"
              >
                🚀 Send 1-Tap SMS Invitation & Lock In 10% Referral Split
              </button>
            </div>
          </form>
        </section>

        {/* Trade Type Cards Visualization */}
        <section className="space-y-4">
          <div>
            <h3 className="text-xl font-extrabold text-white">Think About Your Network by Trade</h3>
            <p className="text-xs md:text-sm text-slate-400">Tap any trade card below to instantly queue an invite for your go-to contractor in that specialty.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tradeCategories.map((cat) => (
              <div
                key={cat.name}
                onClick={() => setSelectedTrade(cat.name)}
                className={`bg-slate-900 border-2 p-5 rounded-2xl cursor-pointer transition flex items-center justify-between ${
                  selectedTrade === cat.name ? 'border-blue-500 bg-blue-950/30 shadow-lg' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{cat.icon}</span>
                    <h4 className="font-extrabold text-white text-sm md:text-base">{cat.name}</h4>
                  </div>
                  <p className="text-xs text-slate-400">{cat.desc}</p>
                </div>
                <span className="text-xs font-bold text-blue-400 bg-blue-950 px-2.5 py-1 rounded-xl border border-blue-800 whitespace-nowrap">
                  {selectedTrade === cat.name ? 'Selected ✓' : '+ Add Ally'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Current Active Crew Roster */}
        <section className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4 shadow-xl">
          <h3 className="text-lg font-extrabold text-white">Your Active Trade Allies ({allies.length})</h3>
          <div className="space-y-3">
            {allies.map((ally, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-sm">{ally.name}</span>
                    <span className="text-xs bg-blue-950 text-blue-400 border border-blue-800 px-2.5 py-0.5 rounded-full font-bold">
                      {ally.trade}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Mobile: <span className="text-slate-200 font-mono">{ally.phone}</span></p>
                </div>
                <span className="text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 rounded-full">
                  {ally.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="max-w-5xl mx-auto w-full text-center border-t border-slate-800/80 pt-8 mt-16 text-xs text-slate-500">
        © {new Date().getFullYear()} JobAllies — Trusted Trade Allies & Referral Network
      </footer>
    </main>
  );
}
