import Link from 'next/link';
import SiteFooter from '../../components/SiteFooter';
import Navbar from '../../components/Navbar';
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
      <div className="max-w-5xl mx-auto w-full space-y-12 text-center">
        <Navbar />

        <div className="space-y-6 max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 bg-blue-950/90 border border-blue-800 text-blue-400 text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
            <span>{tradeIcon}</span> The #1 platform for {tradeName} pros
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            <span className="block text-white">Win More Local Jobs.</span>
            <span className="block text-blue-400">Compare Material Costs.</span>
            <span className="block text-emerald-400">Quote By Voice in Seconds.</span>
            <span className="block text-amber-400">Build Your Trusted Network.</span>
          </h1>
        </div>

        <QuickStartCard defaultTrade={tradeName} />
      </div>

      <SiteFooter />
    </main>
  );
}
