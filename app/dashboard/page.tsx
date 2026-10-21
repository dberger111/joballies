'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteFooter from '../components/SiteFooter';
import Logo from '../components/Logo';

interface Lead {
  id: string;
  source: string;
  town: string;
  date: string;
  clientName: string;
  scope: string;
  phone: string;
  email: string;
  budget: string;
  tradeMessage?: string;
  autoQuote?: {
    laborHours: number;
    laborRate: number;
    materialsCost: number;
    total: number;
  };
}

interface TradeAlly {
  id: string;
  name: string;
  trade: string;
  phone: string;
}

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState({
    name: 'Buddy Bo',
    trade: 'Painter & Decorator',
    location: 'Weston, CT',
    radiusMiles: 25,
    phone: '+12035550199',
    email: 'buddy@contractor.com'
  });

  const [activeTab, setActiveTab] = useState<'leads' | 'network' | 'voice' | 'supply'>('leads');

  // Trusted Network Allies State
  const [allies, setAllies] = useState<TradeAlly[]>([
    { id: '1', name: 'Dan Berger', trade: 'Plumber', phone: '+19175730529' }
  ]);
  const [allyName, setAllyName] = useState('');
  const [allyTrade, setAllyTrade] = useState('Plumber');
  const [allyPhone, setAllyPhone] = useState('');

  // Leads State
  const [homeownerLeads, setHomeownerLeads] = useState<Lead[]>([
    {
      id: 'hl-1',
      source: 'Direct Homeowner Request',
      town: 'Weston, CT',
      date: 'Today at 11:30 AM',
      clientName: 'Sarah Jenkins',
      scope: 'Interior painting and cabinet refinishing in Weston home.',
      phone: '(203) 555-0144',
      email: 's.jenkins@example.com',
      budget: '$4,500',
      autoQuote: { laborHours: 18, laborRate: 120, materialsCost: 650, total: 2810 }
    }
  ]);

  const [tradespersonLeads, setTradespersonLeads] = useState<Lead[]>([
    {
      id: 'tl-1',
      source: 'State Open Data Registry (data.ct.gov)',
      town: 'Weston, CT',
      date: 'Yesterday at 4:00 PM',
      clientName: 'RAH TEC LLC',
      scope: 'Public service request and municipal permit filing for painting service in Weston, CT (25-mile radius).',
      phone: '(203) 555-9922',
      email: 'info@rahtec.example',
      budget: 'Municipal Permit',
      tradeMessage: 'Hi RAH TEC LLC, I noticed your registered project filing in Weston, CT. As a fellow professional doing this type of work, I would love to include you in my trusted network on JobAllies.com and be considered to assist on your project.'
    }
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('joballies_temp_user') || localStorage.getItem('joballies_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserProfile({
          name: parsed.name || 'Buddy Bo',
          trade: parsed.trade || 'Painter & Decorator',
          location: parsed.location || 'Weston, CT',
          radiusMiles: parsed.radiusMiles || 25,
          phone: parsed.phone || '+12035550199',
          email: parsed.email || 'buddy@contractor.com'
        });
      } catch {}
    }
  }, []);

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
      const personalInvite = `JobAllies: Hi ${newAlly.name}, it's ${userProfile.name} (${userProfile.trade}). I've added you to my trusted crew on JobAllies. Accept your invite and join my trusted network at https://joballies.com. Reply STOP to opt out.`;
      await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: allyPhone.trim(), message: personalInvite })
      });
    } catch {}

    setAllyName('');
    setAllyPhone('');
    alert(`✓ ${newAlly.name} (${newAlly.trade}) has been added to your trusted network and sent an SMS invite!`);
  };

  const handleSendTradeMsg = async (lead: Lead) => {
    try {
      await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: userProfile.phone,
          message: `JobAllies Intro sent to ${lead.clientName}: "${lead.tradeMessage}"`
        })
      });
    } catch {}
    alert(`✓ Trusted network introduction message successfully dispatched to ${lead.clientName}!`);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
          <div className="flex items-center gap-3">
            <Logo />
            <div>
              <h1 className="text-2xl font-black text-white">Welcome back, {userProfile.name}</h1>
              <p className="text-xs text-blue-400 font-bold">{userProfile.trade} • Territory: {userProfile.location} ({userProfile.radiusMiles}-mile radius)</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setActiveTab('leads')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'leads' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-900 text-slate-300 border border-slate-800'}`}
            >
              ⚡ Leads & Feeds
            </button>
            <button 
              onClick={() => setActiveTab('network')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'network' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-900 text-slate-300 border border-slate-800'}`}
            >
              🤝 Trusted Crew ({allies.length})
            </button>
            <Link 
              href="/dashboard/voice-quote"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
            >
              🎙️ Voice Estimate
            </Link>
            <Link 
              href="/dashboard/supplier-cart"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
            >
              📦 Supply List
            </Link>
          </div>
        </header>

        {/* TAB 1: LEADS & FEEDS */}
        {activeTab === 'leads' && (
          <div className="space-y-10">
            {/* Homeowner Direct Leads */}
            <div className="space-y-5">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <span>🏠</span> Homeowner Direct Leads
                </h2>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
                  {homeownerLeads.length} Active Request
                </span>
              </div>

              {homeownerLeads.map((lead) => (
                <div key={lead.id} className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-5 shadow-xl">
                  <div className="flex justify-between items-start text-xs text-slate-400">
                    <span className="bg-blue-950 text-blue-400 px-3 py-1 rounded-full border border-blue-800 font-bold">{lead.source}</span>
                    <span>📍 {lead.town} • {lead.date}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{lead.clientName} — Estimated Budget: {lead.budget}</h3>
                    <p className="text-sm text-slate-300 mt-1">{lead.scope}</p>
                  </div>

                  {lead.autoQuote && (
                    <div className="bg-slate-950 border border-blue-500/40 p-5 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-extrabold text-blue-400 uppercase">AI Auto-Created Quote Preview</span>
                        <span className="text-xl font-black text-emerald-400">${lead.autoQuote.total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-end pt-2">
                        <Link href={`/quote/${lead.id}`} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-3 rounded-xl text-xs transition shadow-lg">
                          ✓ Approve & Send Quote to Homeowner →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Tradesperson & Permit Leads */}
            <div className="space-y-5 pt-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <span>🤝</span> Tradesperson & State Registry Leads
                </h2>
                <span className="text-xs font-bold text-amber-400 bg-amber-950 px-3 py-1 rounded-full border border-amber-800">
                  {tradespersonLeads.length} Permit Filing
                </span>
              </div>

              {tradespersonLeads.map((lead) => (
                <div key={lead.id} className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-5 shadow-xl">
                  <div className="flex justify-between items-start text-xs text-slate-400">
                    <span className="bg-amber-950 text-amber-400 px-3 py-1 rounded-full border border-amber-800 font-bold">{lead.source}</span>
                    <span>📍 {lead.town} • {lead.date}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{lead.clientName}</h3>
                    <p className="text-sm text-slate-300 mt-1">{lead.scope}</p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-amber-400">
                      ✉️ Trusted Network Introduction Message (Editable)
                    </label>
                    <textarea
                      rows={3}
                      value={lead.tradeMessage}
                      onChange={(e) => {
                        const updated = tradespersonLeads.map(l => l.id === lead.id ? { ...l, tradeMessage: e.target.value } : l);
                        setTradespersonLeads(updated);
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-amber-500 font-medium"
                    />
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => handleSendTradeMsg(lead)}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3 rounded-xl text-xs transition shadow-lg"
                      >
                        ✓ Send Trusted Network Intro Message →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TRUSTED CREW */}
        {activeTab === 'network' && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-xl">
              <div>
                <h2 className="text-2xl font-black text-white">Your Trusted Sub & Referral Crew</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Invite trusted local trade allies. When you add a partner below, they receive a personal SMS invite from you to join your trusted network on JobAllies.com.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allies.map((a) => (
                  <div key={a.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex justify-between items-center">
                    <div>
                      <h4 className="font-extrabold text-white">{a.name}</h4>
                      <p className="text-xs text-blue-400">{a.trade} • {a.phone}</p>
                    </div>
                    <button 
                      onClick={() => setAllies(allies.filter(x => x.id !== a.id))}
                      className="text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-950/50 px-3 py-1.5 rounded-xl border border-rose-900"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddAlly} className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                  + Invite Trusted Trade Ally (Sends Personal SMS Invite)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Partner Name (e.g. John Smith)"
                    value={allyName}
                    onChange={(e) => setAllyName(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white"
                  />
                  <select
                    value={allyTrade}
                    onChange={(e) => setAllyTrade(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-bold"
                  >
                    <option value="Plumber">Plumber 🚰</option>
                    <option value="Electrician">Electrician ⚡</option>
                    <option value="Mason">Mason 🧱</option>
                    <option value="Carpenter">Carpenter 🪚</option>
                    <option value="HVAC Technician">HVAC Technician ❄️</option>
                    <option value="Painter">Painter 🎨</option>
                    <option value="Roofer">Roofer 🏠</option>
                    <option value="Handyman">Handyman 🛠️</option>
                  </select>
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Phone (+12035550199)"
                    value={allyPhone}
                    onChange={(e) => setAllyPhone(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3.5 rounded-xl text-xs transition shadow-lg"
                >
                  Send Personal SMS Invite & Add to Trusted Network →
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <SiteFooter />
    </main>
  );
}
