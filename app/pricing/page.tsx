'use client';
import Link from 'next/link';
import SiteFooter from '../components/SiteFooter';
import Logo from '../components/Logo';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full space-y-12">
        <header className="flex justify-between items-center border-b border-slate-800 pb-5">
          <Logo />
          <Link href="/" className="text-xs font-bold text-blue-400 hover:text-blue-300">
            ← Back to Home
          </Link>
        </header>

        <div className="text-center space-y-4 pt-6">
          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
            100% Free Until You Win
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Transparent Pricing. Zero Risk.
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            Use all leads, voice quotes, supply retailer price comparisons, and trusted crew networking completely free. You only pay a small fee when you actually win and close a job through JobAllies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">Standard Pro Access</span>
              <h3 className="text-3xl font-black text-white">$0 <span className="text-xs text-slate-400 font-normal">/ month</span></h3>
              <ul className="space-y-3 text-xs text-slate-300">
                <li>✓ Unlimited homeowner lead views</li>
                <li>✓ Angi & Thumbtack lead aggregator sync</li>
                <li>✓ Voice estimate generator</li>
                <li>✓ Multi-retailer price comparison (Lowe's, Home Depot, SiteOne)</li>
                <li>✓ Trusted crew job sharing & escrow</li>
              </ul>
            </div>
            <Link href="/dashboard" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3.5 rounded-xl text-xs text-center transition block">
              Get Started Free →
            </Link>
          </div>

          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 border border-blue-500/50 p-8 rounded-3xl space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Success-Based Fee</span>
              <h3 className="text-3xl font-black text-white">5% <span className="text-xs text-slate-400 font-normal">per closed job</span></h3>
              <ul className="space-y-3 text-xs text-slate-300">
                <li>✓ Zero upfront or monthly subscriptions</li>
                <li>✓ Active only upon verified job completion</li>
                <li>✓ Includes secure escrow & milestone protection</li>
                <li>✓ Dedicated priority support & dispute resolution</li>
              </ul>
            </div>
            <Link href="/dashboard" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-xl text-xs text-center transition block">
              Launch Your Pro Workspace →
            </Link>
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
