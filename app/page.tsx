import Link from 'next/link';
import SiteFooter from './components/SiteFooter';
import Navbar from './components/Navbar';
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
      <div className="max-w-6xl mx-auto w-full space-y-14">
        <Navbar />

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-blue-950/90 border border-blue-800 text-blue-400 text-xs font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
              <span>⭐</span> The #1 platform for tradespeople
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Get more leads.<br />
              Quote more quickly.<br />
              <span className="text-blue-500">Give and receive referrals.</span>
            </h1>

            <div className="space-y-4 pt-2 border-l-2 border-blue-500 pl-5">
              <p className="text-base font-bold text-slate-100 italic">
                “It’s like drinking from a firehose. JobAllies ensures I always have plenty of work.”
              </p>
              <p className="text-xs md:text-sm font-medium text-slate-400 leading-relaxed">
                “I used to spend way too much time trying to win business. Now I have so much business that I refer most of it out (and get paid for those referrals.)”
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <QuickStartCard defaultTrade="General Contractor" />
          </div>
        </section>

        <section className="space-y-6 pt-6 border-t border-slate-800">
          <div>
            <h2 className="text-2xl font-black text-white">Tap Your Trade (Pre-Fills Your Local Workspace)</h2>
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
