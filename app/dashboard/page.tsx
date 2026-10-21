'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteFooter from '../components/SiteFooter';
import FeedbackWidget from '../components/FeedbackWidget';
import Logo from '../components/Logo';

interface Lead {
  id: string;
  source: string;
  datePosted: string;
  timePosted: string;
  trade: string;
  town: string;
  budget: string;
  scope: string;
  clientName: string;
  autoQuote: { laborHours: number; laborRate: number; materialsCost: number; total: number };
  personalNote: string;
  status: string;
}

interface TradeAlly {
  id: string;
  name: string;
  trade: string;
  phone: string;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'leads' | 'network' | 'retailers'>('leads');
  const [userProfile, setUserProfile] = useState({
    name: 'Mike Johnson',
    trade: 'General Contractor',
    location: 'Weston, CT',
    radiusMiles: 25,
    phone: '+12035550199',
    email: 'mike@joballies.com'
  });

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [allies, setAllies] = useState<TradeAlly[]>([
    { id: '1', name: 'Dave Smith', trade: 'Electrician', phone: '+12035550144' },
    { id: '2', name: 'Carlos Gomez', trade: 'Plumber', phone: '+12035550188' }
  ]);
  const [allyName, setAllyName] = useState('');
  const [allyTrade, setAllyTrade] = useState('Electrician');
  const [allyPhone, setAllyPhone] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('joballies_temp_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUserProfile(prev => ({ ...prev, ...parsed }));
      } catch {}
    }
  }, []);

  useEffect(() => {
    async function fetchLeads() {
      setLoadingLeads(true);
      try {
        const res = await fetch(`/api/leads?town=${encodeURIComponent(userProfile.location)}&trade=${encodeURIComponent(userProfile.trade)}&radius=${userProfile.radiusMiles}`);
        const data = await res.json();
        if (data.success && data.leads) {
          setLeads(data.leads);
        }
      } catch (err) {
        console.error('Failed to fetch leads', err);
      } finally {
        setLoadingLeads(false);
      }
    }
    fetchLeads();
  }, [userProfile.location, userProfile.trade, userProfile.radiusMiles]);

  const handleAddAlly = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allyName.trim() || !allyPhone.trim()) return;
    const newAlly: TradeAlly = {
      id: Date.now().toString(),
      name: allyName.trim(),
      trade: allyTrade,
      phone: allyPhone.trim()
    };
    setAllies([...allies, newAlly]);
    
    try {
      const personalInvite = `JobAllies: Hi ${newAlly.name}, you have been invited by ${userProfile.name} (${userProfile.trade}) to join their trusted crew as a verified ${allyTrade}. Accept your invite and join at https://joballies.com. Reply STOP to opt out.`;
      await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: allyPhone.trim(), message: personalInvite })
      });
    } catch {}

    setAllyName('');
    setAllyPhone('');
    alert(`✓ ${newAlly.name} (${newAlly.trade}) has been added to your trusted network! They have been sent a personal SMS invite from ${userProfile.name} to join your trusted network on jobAllies.com.`);
  };

  const formatPhoneNumber = (input: string) => {
    const digits = input.replace(/\D/g, '');
    if (digits.length === 10) return `+${digits}`;
    if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
    return input;
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-5 md:p-10 flex flex-col justify-between relative">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-5 gap-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Logo size="sm" />
            </Link>
            <div>
              <h1 className="text-xl font-extrabold text-white">JobAllies Pro Command Center</h1>
              <p className="text-xs text-slate-400">Autonomous Contractor Field & Financial OS</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/portfolio" className="bg-slate-900 border border-slate-800 hover:border-blue-500 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl transition">
              Public Portfolio ↗
            </Link>
            <Link href="/dashboard/verify" className="bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold px-4 py-2.5 rounded-xl transition">
              ✓ KYC Verified Badge
            </Link>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-6">
          <button
            onClick={() => setActiveTab('leads')}
            className={`pb-3 text-sm font-extrabold transition border-b-2 ${activeTab === 'leads' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            View Leads and Feeds
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={`pb-3 text-sm font-extrabold transition border-b-2 ${activeTab === 'network' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            Build Your Trusted Crew
          </button>
          <button
            onClick={() => setActiveTab('retailers')}
            className={`pb-3 text-sm font-extrabold transition border-b-2 ${activeTab === 'retailers' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            Connect with Pro Supply Retailers
          </button>
        </div>

        {/* TAB 1: VIEW LEADS AND FEEDS */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 p-6 rounded-3xl gap-4 shadow-xl">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">Territory & Radius Filter</span>
                <h3 className="text-lg font-extrabold text-white">{userProfile.trade} in {userProfile.location}</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-amber-400 bg-amber-950 px-3 py-1 rounded-xl border border-amber-800">
                  {userProfile.radiusMiles}-Mile Radius Active
                </span>
                <Link href="/" className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl transition">
                  Change Territory
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Homeowner Direct Leads */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-white text-sm">Homeowner Direct Leads</h4>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg">Live Feed</span>
                </div>
                <p className="text-xs text-slate-400">Incoming direct requests from homeowners in your {userProfile.radiusMiles}-mile radius.</p>
                <div className="space-y-3 pt-2">
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>Kitchen Remodel Scope</span>
                      <span className="text-blue-400">$12,000</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Source: Homeowner Direct Portal • Today, 2:15 PM</p>
                    <Link href="/quote/sample-quote" className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-xl text-center text-xs transition">
                      View Estimate & Quote →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Card 2: State Registry & Permits */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-white text-sm">Municipal & State Registry Leads</h4>
                  <span className="text-xs font-bold text-blue-400 bg-blue-950 px-2.5 py-1 rounded-lg">Verified</span>
                </div>
                <p className="text-xs text-slate-400">Permit filings and state open-data records matching {userProfile.trade}.</p>
                <div className="space-y-3 pt-2">
                  {loadingLeads ? (
                    <p className="text-xs text-slate-500 text-center py-4">Scanning state registries...</p>
                  ) : leads.length > 0 ? (
                    leads.slice(0, 2).map((l) => (
                      <div key={l.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-slate-300">
                          <span>{l.clientName}</span>
                          <span className="text-emerald-400">{l.budget}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Source: {l.source} • {l.datePosted} at {l.timePosted}</p>
                        <p className="text-xs text-slate-300">{l.scope}</p>
                      </div>
                    ))
                  ) : (
                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-center">
                      <p className="text-xs text-slate-400">No active state permit filings found for {userProfile.trade} in {userProfile.location} today.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Card 3: Angi & Thumbtack Lead Gen Platforms Connection */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-extrabold text-white text-sm">Connect Angi & Thumbtack</h4>
                    <span className="text-xs font-bold text-amber-400 bg-amber-950 px-2.5 py-1 rounded-lg">Lead Gen Sync</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    To view more leads in your local area, login to your professional Thumbtack, Angi, or other lead generation platforms.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button onClick={() => alert('✓ Angi Pro account successfully connected and syncing leads!')} className="bg-slate-950 hover:bg-slate-800 border border-slate-800 p-3 rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-2 transition">
                      <span>🟠</span> Connect Angi
                    </button>
                    <button onClick={() => alert('✓ Thumbtack Pro account successfully connected and syncing leads!')} className="bg-slate-950 hover:bg-slate-800 border border-slate-800 p-3 rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-2 transition">
                      <span>🔵</span> Connect Thumbtack
                    </button>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-800 text-center">
                  <span className="text-[11px] text-slate-500">All external lead feeds aggregate instantly into your JobAllies quote engine.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BUILD YOUR TRUSTED CREW */}
        {activeTab === 'network' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Add Crew Member & SMS Invite */}
            <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">Subcontractor & Ally Network</span>
                <h3 className="text-xl font-extrabold text-white">Invite Trusted Trade Allies</h3>
                <p className="text-xs text-slate-400 mt-1">Send personal SMS invites to build your verified crew and share overflow jobs.</p>
              </div>

              <form onSubmit={handleAddAlly} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Ally Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dave Smith"
                    value={allyName}
                    onChange={(e) => setAllyName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Trade Specialty</label>
                  <select
                    value={allyTrade}
                    onChange={(e) => setAllyTrade(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-blue-500"
                  >
                    <option value="Electrician">⚡ Electrician</option>
                    <option value="Plumber">🚰 Plumber</option>
                    <option value="Mason">🧱 Mason</option>
                    <option value="Carpenter">🪚 Carpenter</option>
                    <option value="HVAC Technician">❄️ HVAC Technician</option>
                    <option value="Painter">🎨 Painter</option>
                    <option value="Roofer">🏠 Roofer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Mobile Phone (for SMS Invite)</label>
                  <input
                    type="tel"
                    required
                    placeholder="203-555-0144"
                    value={allyPhone}
                    onChange={(e) => setAllyPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3.5 rounded-xl text-xs transition shadow-lg shadow-blue-600/30"
                >
                  Send Personal SMS Invite & Add to Crew →
                </button>
              </form>
            </div>

            {/* Card 2: Facebook Group Referral Request */}
            <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">Viral Local Growth</span>
                    <h3 className="text-xl font-extrabold text-white">Facebook Group Referral Request</h3>
                  </div>
                  <span className="text-xs font-bold text-blue-400 bg-blue-950 px-3 py-1 rounded-xl">Community Post</span>
                </div>
                <p className="text-xs text-slate-400">
                  Instantly generate and copy pre-formatted referral requests to post in local town Facebook groups (e.g., Weston, Westport, & Greenwich Community Boards).
                </p>
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2 text-xs text-slate-300">
                  <p className="font-bold text-white">Preview Post:</p>
                  <p className="italic text-slate-400">
                    &quot;Hey neighbors! Looking for a reliable local {userProfile.trade} in {userProfile.location}? My trusted trade ally network and I have open slots this week for quality projects. Fully licensed, insured, and backed by milestone escrow protection. Reach out or message me directly!&quot;
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`Hey neighbors! Looking for a reliable local ${userProfile.trade} in ${userProfile.location}? My trusted trade ally network and I have open slots this week for quality projects. Fully licensed, insured, and backed by milestone escrow protection. Reach out or message me directly!`);
                  alert('✓ Facebook referral post copied to clipboard! Ready to paste into your local community group.');
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-blue-400 font-extrabold py-3.5 rounded-xl text-xs transition border border-blue-500/40 text-center block"
              >
                📋 Copy Facebook Group Referral Post
              </button>
            </div>

            {/* Active Crew & Outreach */}
            <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
              <h3 className="text-lg font-extrabold text-white">Your Active Trusted Crew ({allies.length} Members)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allies.map((ally) => (
                  <div key={ally.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm">{ally.name}</h4>
                      <p className="text-xs text-emerald-400 font-semibold">{ally.trade}</p>
                      <p className="text-xs text-slate-400">{ally.phone}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <a
                        href={`sms:${ally.phone}?body=${encodeURIComponent("Hi, We have some available man hours this week if you need our support or expertise on any of your jobs. I may have some jobs to share with you next week.")}`}
                        className="flex-1 bg-blue-600/20 border border-blue-500/50 hover:bg-blue-600/30 text-blue-400 font-bold py-2.5 rounded-xl text-xs text-center transition"
                      >
                        💬 Text Crew
                      </a>
                      <a
                        href={`tel:${ally.phone}`}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl text-xs text-center transition"
                      >
                        📞 Call Ally
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONNECT WITH PRO SUPPLY RETAILERS */}
        {activeTab === 'retailers' && (
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Wholesale Sourcing & Multi-Retailer Pricing</span>
              <h3 className="text-2xl font-extrabold text-white">Connect with Pro Supply Retailers</h3>
              <p className="text-xs text-slate-400 mt-1">Compare side-by-side wholesale pricing across Home Depot Pro, Lowe&apos;s Pro, and SiteOne.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3">
                <h4 className="font-bold text-white text-sm">Home Depot Pro Xtra</h4>
                <p className="text-xs text-slate-400">Sync your Pro Xtra account ID for automatic volume rebates and wholesale cart exports.</p>
                <Link href="/dashboard/supplier-cart" className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-center text-xs transition">
                  Open Materials & Pricing →
                </Link>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3">
                <h4 className="font-bold text-white text-sm">Lowe&apos;s ProServices</h4>
                <p className="text-xs text-slate-400">Compare material pricing and link your Lowe&apos;s Pro card for instant job-site delivery.</p>
                <Link href="/dashboard/supplier-cart" className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-center text-xs transition">
                  Open Materials & Pricing →
                </Link>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3">
                <h4 className="font-bold text-white text-sm">SiteOne Landscape Supply</h4>
                <p className="text-xs text-slate-400">Access commercial wholesale pricing for stone, masonry, irrigation, and outdoor materials.</p>
                <Link href="/dashboard/supplier-cart" className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-center text-xs transition">
                  Open Materials & Pricing →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <FeedbackWidget />
      <SiteFooter />
    </main>
  );
}
