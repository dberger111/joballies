import Link from 'next/link';
import SiteFooter from '../../components/SiteFooter';
import QuickStartCard from '../../components/QuickStartCard';
import { MASTER_TRADES } from '../../components/tradesData';

export async function generateStaticParams() {
  return MASTER_TRADES.map((t) => ({ slug: t.slug }));
}

export default async function TradeLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const matched = MASTER_TRADES.find((t) => t.slug === slug);
  const tradeName = matched ? matched.name : slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const tradeIcon = matched ? matched.icon : '⚡';

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-5 md:p-10 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto w-full space-y-12">
        <header className="flex justify-between items-center border-b border-slate-800 pb-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">
              JA
            </span>
            <span className="font-black text-white text-lg">JobAllies</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <Link
              href={`/post-project?trade=${encodeURIComponent(tradeName)}`}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-950/60 border border-blue-800/60 px-3.5 py-2 rounded-xl"
            >
              Need a {tradeName}? Request Quote
            </Link>
            <Link
              href="/"
              className="text-xs font-bold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl transition"
            >
              All 55 Trades
            </Link>
          </div>
        </header>

        {/* 5-Second Above-the-Fold Split: Blunt Trade Value + Pre-Filled Trade & IP Intake Form */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 bg-blue-950/90 border border-blue-800 text-blue-400 text-xs font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
              <span>{tradeIcon}</span> Built for Busy {tradeName} Pros
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-[1.1]">
              More Local <span className="text-blue-500">{tradeName}</span> Jobs.<br />
              30-Second Voice Quotes.
            </h1>

            <ul className="space-y-3 text-sm md:text-base font-bold text-slate-200">
              <li className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center text-sm">📍</span>
                <span>Homeowner {tradeName.toLowerCase()} requests in your town ($0 lead fees)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-sm">🎙️</span>
                <span>Speak {tradeName.toLowerCase()} scope → text estimate in 30 seconds</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-amber-600/20 border border-amber-500/40 text-amber-400 flex items-center justify-center text-sm">💵</span>
                <span>Collect 10% referral fees from local GCs & allied subs</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center text-sm">📦</span>
                <span>1-tap {tradeName.toLowerCase()} material list for supply houses</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6">
            <QuickStartCard defaultTrade={tradeName} />
          </div>
        </section>

        {/* 3 Direct Action Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">📍</span>
              <h3 className="text-base font-extrabold text-white">Local {tradeName} Leads</h3>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5">
              <li>• Filtered strictly for {tradeName.toLowerCase()} jobs</li>
              <li>• Direct client phone & text unlocked</li>
              <li>• Keep 100% of your job margin</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🎙️</span>
              <h3 className="text-base font-extrabold text-white">30-Second Voice Quote</h3>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5">
              <li>• Speak labor hours & material costs</li>
              <li>• Instant clean SMS & email link</li>
              <li>• Client approves & funds online</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🤝</span>
              <h3 className="text-base font-extrabold text-white">10% Referral Network</h3>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5">
              <li>• Trade leads with vetted local pros</li>
              <li>• Automatic 10% referral fee split</li>
              <li>• Digital lien waiver included</li>
            </ul>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
