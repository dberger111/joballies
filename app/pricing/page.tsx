'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SiteFooter from '../components/SiteFooter';
import Logo from '../components/Logo';

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem('joballies_user') || localStorage.getItem('joballies_temp_user');
      const user = userStr ? JSON.parse(userStr) : { name: 'Pro Contractor', email: '', trade: 'General Contractor' };

      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email || user.phoneOrEmail,
          name: user.name,
          trade: user.trade,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Could not initiate Stripe checkout. Please ensure STRIPE_SECRET_KEY is configured in Vercel.');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert('Network error connecting to payment gateway.');
      setLoading(false);
    }
  };

  const handleFreeAction = () => {
    try {
      const isAuth = localStorage.getItem('joballies_authenticated') || localStorage.getItem('joballies_user') || localStorage.getItem('joballies_temp_user');
      if (isAuth) {
        router.push('/dashboard');
      } else {
        router.push('/auth/signup');
      }
    } catch {
      router.push('/auth/signup');
    }
  };

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
            14-Day Free Trial • Cancel Anytime
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Transparent Pricing. Zero Risk.
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            Equip your truck with live permit radar, multi-distributor wholesale price sync, and P2P escrow protection. Try Pro free for 14 days.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">Standard Access</span>
              <h3 className="text-3xl font-black text-white">$0 <span className="text-xs text-slate-400 font-normal">/ forever</span></h3>
              <ul className="space-y-3 text-xs text-slate-300">
                <li>✓ Unlimited homeowner lead views</li>
                <li>✓ Angi & Thumbtack lead aggregator sync</li>
                <li>✓ Voice estimate generator</li>
                <li>✓ Supply house wholesale SKU copier</li>
              </ul>
            </div>
            <button 
              onClick={handleFreeAction}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black py-3.5 rounded-xl text-xs text-center transition block"
            >
              Use Free Tier →
            </button>
          </div>

          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/50 border border-blue-500/60 p-8 rounded-3xl space-y-6 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-bl-xl">
              Recommended
            </div>
            <div className="space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">Pro Command Center</span>
              <h3 className="text-3xl font-black text-white">$49 <span className="text-xs text-slate-400 font-normal">/ month (14 days free)</span></h3>
              <ul className="space-y-3 text-xs text-slate-300">
                <li>✓ Everything in Standard, plus:</li>
                <li>✓ Multi-state permit radar & early lead alerts</li>
                <li>✓ Multi-distributor wholesale price-lock sync</li>
                <li>✓ Automated 5-star review request SMS blaster</li>
                <li>✓ Secure P2P referral escrow vault & milestone splits</li>
              </ul>
            </div>
            <button 
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3.5 rounded-xl text-xs text-center transition block shadow-lg shadow-blue-600/30 disabled:opacity-50"
            >
              {loading ? 'Redirecting to Secure Checkout...' : 'Start 14-Day Free Trial →'}
            </button>
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
