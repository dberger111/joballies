import fs from 'fs';
import path from 'path';

const files = {};

// 1. Navbar & Logo Fix (Homeowner link removed entirely from header)
files['app/components/Navbar.tsx'] = `import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-800/80 pb-4">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-600/30 border border-blue-400/30">
          JA
        </div>
        <div>
          <span className="text-xl font-black tracking-tight text-white">JobAllies</span>
          <span className="block text-[9px] font-bold uppercase tracking-widest text-blue-400">Trade Platform</span>
        </div>
      </Link>
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="text-xs font-extrabold text-white px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition shadow-lg shadow-blue-600/25"
        >
          Open Pro Workspace →
        </Link>
      </div>
    </header>
  );
}
`;

// 2. Single One-Click Path Action Card (app/components/QuickStartCard.tsx)
files['app/components/QuickStartCard.tsx'] = `'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MASTER_TRADES } from './tradesData';

export default function QuickStartCard({ defaultTrade = 'General Contractor' }: { defaultTrade?: string }) {
  const router = useRouter();
  const [trade, setTrade] = useState(defaultTrade);
  const [location, setLocation] = useState('Weston, CT');
  const [contact, setContact] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [detecting, setDetecting] = useState(true);

  useEffect(() => {
    if (defaultTrade) {
      const match = MASTER_TRADES.find(
        (t) => t.name.toLowerCase() === defaultTrade.toLowerCase() || t.slug === defaultTrade.toLowerCase()
      );
      if (match) setTrade(match.name);
      else setTrade(defaultTrade);
    }
  }, [defaultTrade]);

  useEffect(() => {
    let cancelled = false;
    async function detectIP() {
      try {
        const res = await fetch('/api/geo');
        const data = await res.json();
        if (!cancelled && data?.location) {
          setLocation(data.location);
          setDetecting(false);
          return;
        }
      } catch {}
      try {
        const ipRes = await fetch('https://ipapi.co/json/');
        const ipData = await ipRes.json();
        if (!cancelled && ipData?.city && ipData?.region_code) {
          setLocation(\`\${ipData.city}, \${ipData.region_code}\`);
          setDetecting(false);
          return;
        }
      } catch {}
      if (!cancelled) setDetecting(false);
    }
    detectIP();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedName = businessName.trim() || \`Verified \${trade} Pro\`;
    const resolvedContact = contact.trim() || 'pro@joballies.com';

    const userObj = {
      name: resolvedName,
      phoneOrEmail: resolvedContact,
      trade,
      location,
      licenseNumber: 'State Verified',
    };

    localStorage.setItem('joballies_temp_user', JSON.stringify(userObj));
    localStorage.setItem('joballies_user', JSON.stringify(userObj));
    localStorage.setItem('joballies_authenticated', 'true');
    router.push('/dashboard');
  };

  return (
    <div className="bg-slate-900 border-2 border-blue-500/60 rounded-3xl p-6 md:p-8 shadow-2xl shadow-blue-950/40 text-left space-y-5">
      <div className="border-b border-slate-800 pb-3">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">
          ⚡ Pre-Filled for Your Area • Instant Access
        </span>
        <h2 className="text-xl font-black text-white mt-0.5">
          See Active {trade} Leads in {location}
        </h2>
      </div>

      <form onSubmit={handleLaunch} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-blue-400 mb-1">
              Your Trade (Editable)
            </label>
            <select
              value={trade}
              onChange={(e) => setTrade(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-xs font-extrabold text-white focus:border-blue-400 focus:outline-none"
            >
              {MASTER_TRADES.map((t) => (
                <option key={t.slug} value={t.name}>
                  {t.icon} {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 mb-1">
              Your Town ({detecting ? 'Detecting IP...' : 'Editable'})
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-xs font-extrabold text-white focus:border-emerald-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Business Name (Optional)"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-xs text-white"
          />
          <input
            type="text"
            required
            placeholder="Mobile Phone or Email *"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-xs text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl text-sm transition shadow-xl shadow-blue-600/30"
        >
          View Leads & Auto-Created Quotes →
        </button>
      </form>
    </div>
  );
}
`;

// 3. Homepage (app/page.tsx) — Exact Headline, Testimonials, Logo, and Footer Homeowner Link Only
files['app/page.tsx'] = `import Link from 'next/link';
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

        {/* Hero Section */}
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

            {/* Testimonials */}
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

        {/* 55 Trades Grid */}
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
                    href={\`/trades/\${t.slug}\`}
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
`;

// 4. Trade Landing Page (app/trades/[slug]/page.tsx)
files['app/trades/[slug]/page.tsx'] = `import Link from 'next/link';
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
  const tradeName = matched ? matched.name : slug.replace(/-/g, ' ').replace(/\\b\\w/g, (c) => c.toUpperCase());
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
`;

// 5. Contractor Dashboard (app/dashboard/page.tsx) — Leads Right Away + Auto-Created Quotes
files['app/dashboard/page.tsx'] = `'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteFooter from '../components/SiteFooter';

interface LeadItem {
  id: string;
  source: string;
  trade: string;
  town: string;
  budget: string;
  scope: string;
  clientName: string;
  clientPhone: string;
  autoQuote: {
    laborHours: number;
    laborRate: number;
    materialsCost: number;
    total: number;
    notes: string;
  };
  status: 'New' | 'Quote Generated' | 'Sent to Client';
}

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState({
    name: 'Mike Johnson',
    trade: 'General Contractor',
    location: 'Westport, CT',
    licenseNumber: 'HIC.0649281',
  });

  const [leads, setLeads] = useState<LeadItem[]>([
    {
      id: 'L-501',
      source: 'Online Lead Feed (Google / Local Search)',
      trade: 'General Contractor',
      town: 'Westport, CT',
      budget: '$4,500 – $7,000',
      scope: 'Primary bathroom framing, cement board backing, and tile prep.',
      clientName: 'Sarah Jenkins',
      clientPhone: '(203) 555-0148',
      autoQuote: {
        laborHours: 24,
        laborRate: 135,
        materialsCost: 850,
        total: 4090,
        notes: 'Includes bathroom framing, waterproof membrane, and cement board installation.',
      },
      status: 'New',
    },
    {
      id: 'L-502',
      source: 'Online Lead Feed (Homeowner Portal)',
      trade: 'General Contractor',
      town: 'Fairfield, CT',
      budget: '$2,800 – $4,500',
      scope: 'Kitchen backsplash tiling and custom pantry shelving setup.',
      clientName: 'David Markowitz',
      clientPhone: '(203) 555-0192',
      autoQuote: {
        laborHours: 16,
        laborRate: 135,
        materialsCost: 420,
        total: 2580,
        notes: 'Includes surface prep, tile setting, grout sealing, and custom shelving.',
      },
      status: 'New',
    },
  ]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('joballies_temp_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        setUserProfile((prev) => ({
          ...prev,
          name: parsed.name || prev.name,
          trade: parsed.trade || prev.trade,
          location: parsed.location || prev.location,
        }));
      }
    } catch {}
  }, []);

  const updateQuote = (id: string, field: string, val: number) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const updatedQuote = { ...l.autoQuote, [field]: val };
        updatedQuote.total = updatedQuote.laborHours * updatedQuote.laborRate + updatedQuote.materialsCost;
        return { ...l, autoQuote: updatedQuote };
      })
    );
  };

  const markSent = (id: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'Sent to Client' } : l)));
    alert('Quote successfully approved and sent via SMS and Email to the homeowner!');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-5 md:p-10 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        {/* Top Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-5 gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">
              JA
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">{userProfile.name}</h1>
                <span className="text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                  {userProfile.trade}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Active Territory: <strong className="text-slate-200">{userProfile.location}</strong> • License: {userProfile.licenseNumber}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/dashboard/supplier-cart"
              className="bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 px-4 py-2.5 rounded-xl transition"
            >
              📦 Supply House List
            </Link>
            <Link
              href="/dashboard/network"
              className="bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 px-4 py-2.5 rounded-xl transition"
            >
              🤝 10% Referral Splits
            </Link>
          </div>
        </header>

        {/* Live Leads & Auto-Created Quotes Section */}
        <section className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">⚡ Live Firehose Feed</span>
              <h2 className="text-xl font-extrabold text-white">Incoming Online Leads & Auto-Created Quotes</h2>
            </div>
            <span className="text-xs font-bold text-blue-400 bg-blue-950 px-3.5 py-1.5 rounded-full border border-blue-800">
              {leads.length} Leads Ready for Review & Send
            </span>
          </div>

          <div className="space-y-6">
            {leads.map((lead) => (
              <div key={lead.id} className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-900 pb-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold text-blue-400 bg-blue-950 px-3 py-0.5 rounded-full border border-blue-800">
                        {lead.source}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">{lead.budget}</span>
                      <span className="text-xs text-slate-400">📍 {lead.town}</span>
                    </div>
                    <p className="text-sm font-bold text-white mt-1">Homeowner Request: "{lead.scope}"</p>
                    <p className="text-xs text-slate-400">Client: {lead.clientName} • <span className="text-white font-mono">{lead.clientPhone}</span></p>
                  </div>
                  <span className={\`text-xs font-extrabold px-3 py-1 rounded-full \${lead.status === 'Sent to Client' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}\`}>
                    Status: {lead.status}
                  </span>
                </div>

                {/* Auto-Created Quote Editor */}
                <div className="bg-slate-900/90 border border-blue-500/40 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">
                      ✨ AI Auto-Created Estimate (Editable & Ready to Send)
                    </span>
                    <span className="text-xl font-black text-emerald-400">${lead.autoQuote.total.toLocaleString()}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Labor Hours</label>
                      <input
                        type="number"
                        value={lead.autoQuote.laborHours}
                        onChange={(e) => updateQuote(lead.id, 'laborHours', Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Hourly Rate ($)</label>
                      <input
                        type="number"
                        value={lead.autoQuote.laborRate}
                        onChange={(e) => updateQuote(lead.id, 'laborRate', Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Materials Cost ($)</label>
                      <input
                        type="number"
                        value={lead.autoQuote.materialsCost}
                        onChange={(e) => updateQuote(lead.id, 'materialsCost', Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => markSent(lead.id)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-xl text-xs transition shadow-lg"
                    >
                      ✓ Approve & Send Quote to Homeowner (SMS / Email)
                    </button>
                    <Link
                      href="/dashboard/supplier-cart"
                      className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold py-3.5 px-5 rounded-xl text-xs text-center transition"
                    >
                      📦 View Materials in Supply List
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
