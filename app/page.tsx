import Link from 'next/link';
import SiteFooter from './components/SiteFooter';
import QuickStartCard from './components/QuickStartCard';
import { MASTER_TRADES } from './components/tradesData';

export default function HomePage() {
  const groups = [
    "Core Residential & Commercial",
    "Building & Exterior",
    "Mechanical & Industrial",
    "Heavy Equipment & Utility",
    "Property & Specialty Services",
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-5 md:p-10 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto w-full space-y-12">
        <header className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-800/80 pb-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-600/30">
              JA
            </span>
            <span className="text-xl font-black tracking-tight text-white">JobAllies</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/post-project"
              className="text-xs font-bold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 transition"
            >
              Homeowner? Request a Quote
            </Link>
            <Link
              href="/dashboard/voice-quote"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 px-3.5 py-2 rounded-xl border border-emerald-800/60 bg-emerald-950/40 transition"
            >
              🎙️ 30-Sec Voice Quote
            </Link>
            <Link
              href="/dashboard"
              className="text-xs font-extrabold text-white px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition"
            >
              Open Pro Workspace →
            </Link>
          </div>
        </header>

        {/* 5-Second Above-the-Fold Split: Blunt Value on Left, Pre-Filled Action Form on Right */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          <div className="lg:col-span-6 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 bg-blue-950/90 border border-blue-800 text-blue-400 text-xs font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
              <span>⚡</span> Built for Busy Contractors • 55 Trades
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-[1.1]">
              Get Local Jobs.<br />
              <span className="text-blue-500">Speak 30-Second Quotes.</span><br />
              Earn 10% Referral Fees.
            </h1>

            <ul className="space-y-3 text-sm md:text-base font-bold text-slate-200 pt-1">
              <li className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center text-sm">📍</span>
                <span>Direct homeowner leads in your town ($0 lead fees)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-sm">🎙️</span>
                <span>Speak job notes → text itemized quotes in 30 seconds</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-amber-600/20 border border-amber-500/40 text-amber-400 flex items-center justify-center text-sm">💵</span>
                <span>Pass overflow work to local pros → collect 10% fee</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center text-sm">📦</span>
                <span>1-tap material lists for Home Depot Pro & Lowe's</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6">
            <QuickStartCard defaultTrade="General Contractor" />
          </div>
        </section>

        {/* 4 Instant-Action Tool Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-2xl">📍</span>
                <span className="text-[11px] font-extrabold uppercase text-blue-400 bg-blue-950 px-2.5 py-0.5 rounded-full">Tool 1</span>
              </div>
              <h3 className="text-base font-extrabold text-white">Claim Local Jobs</h3>
              <ul className="text-xs text-slate-300 space-y-1.5">
                <li>• Homeowner requests in your zip</li>
                <li>• Direct phone & SMS unlocked</li>
                <li>• Zero pay-per-lead markups</li>
              </ul>
            </div>
            <Link href="/dashboard" className="block text-center bg-slate-950 hover:bg-blue-600 border border-slate-800 hover:border-blue-500 text-white text-xs font-extrabold py-2.5 rounded-xl transition">
              View Local Leads →
            </Link>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🎙️</span>
                <span className="text-[11px] font-extrabold uppercase text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full">Tool 2</span>
              </div>
              <h3 className="text-base font-extrabold text-white">Speak Your Quote</h3>
              <ul className="text-xs text-slate-300 space-y-1.5">
                <li>• Tap mic & speak hours + materials</li>
                <li>• Auto-builds itemized estimate</li>
                <li>• Texts link to client in 30 seconds</li>
              </ul>
            </div>
            <Link href="/dashboard/voice-quote" className="block text-center bg-slate-950 hover:bg-emerald-600 border border-slate-800 hover:border-emerald-500 text-white text-xs font-extrabold py-2.5 rounded-xl transition">
              Try Voice Quote →
            </Link>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🤝</span>
                <span className="text-[11px] font-extrabold uppercase text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full">Tool 3</span>
              </div>
              <h3 className="text-base font-extrabold text-white">10% Referral Pay</h3>
              <ul className="text-xs text-slate-300 space-y-1.5">
                <li>• Hand off jobs you don't do</li>
                <li>• Vetted local plumbers, sparkys, GCs</li>
                <li>• 10% finder's fee locked in escrow</li>
              </ul>
            </div>
            <Link href="/dashboard/network" className="block text-center bg-slate-950 hover:bg-amber-500 hover:text-slate-950 border border-slate-800 text-white text-xs font-extrabold py-2.5 rounded-xl transition">
              See Local Allies →
            </Link>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-2xl">📦</span>
                <span className="text-[11px] font-extrabold uppercase text-purple-400 bg-purple-950 px-2.5 py-0.5 rounded-full">Tool 4</span>
              </div>
              <h3 className="text-base font-extrabold text-white">1-Tap Supply List</h3>
              <ul className="text-xs text-slate-300 space-y-1.5">
                <li>• Turns quote into SKU order list</li>
                <li>• Home Depot Pro, Lowe's, Ferguson</li>
                <li>• Copy & paste to counter in 1 tap</li>
              </ul>
            </div>
            <Link href="/dashboard/supplier-cart" className="block text-center bg-slate-950 hover:bg-purple-600 border border-slate-800 hover:border-purple-500 text-white text-xs font-extrabold py-2.5 rounded-xl transition">
              Open Supply List →
            </Link>
          </div>
        </section>

        {/* 55 Trades Grid */}
        <section className="space-y-6 pt-4 border-t border-slate-800">
          <div>
            <h2 className="text-2xl font-black text-white">Tap Your Trade (Pre-Fills Your Local Setup)</h2>
            <p className="text-xs text-slate-400">55 licensed & independent trades supported nationwide.</p>
          </div>

          {groups.map((groupName) => (
            <div key={groupName} className="space-y-2.5">
              <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-blue-400">
                {groupName}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                {MASTER_TRADES.filter((t) => t.group === groupName).map((t) => (
                  <Link
                    key={t.slug}
                    href={`/trades/${t.slug}`}
                    className="bg-slate-900 hover:bg-blue-600/20 border border-slate-800 hover:border-blue-500 p-3 rounded-2xl flex items-center gap-2 text-xs font-bold transition text-slate-200 hover:text-white"
                  >
                    <span className="text-base">{t.icon}</span>
                    <span className="truncate">{t.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
