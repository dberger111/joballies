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
      <div className="max-w-6xl mx-auto w-full space-y-12">
        <Navbar />

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-950/90 border border-blue-800 text-blue-400 text-xs font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
              <span>{tradeIcon}</span> The #1 platform for {tradeName} pros
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-[1.1]">
              Get more <span className="text-blue-500">{tradeName}</span> leads.<br />
              Quote more quickly.<br />
              Give and receive referrals.
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
            <QuickStartCard defaultTrade={tradeName} />
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
