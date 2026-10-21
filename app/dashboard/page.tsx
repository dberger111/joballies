'use client';
import { useState } from 'react';
import Link from 'next/link';
import SiteFooter from '../components/SiteFooter';
import Logo from '../components/Logo';

interface LeadItem {
  id: string;
  source: string;
  trade: string;
  town: string;
  budget: string;
  scope: string;
  clientName: string;
  clientPhone: string;
  status: string;
}

interface TradeAlly {
  id: string;
  name: string;
  trade: string;
  phone: string;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'leads' | 'network' | 'retailers' | 'profile'>('leads');
  const [userProfile, setUserProfile] = useState({
    name: 'Mike Johnson',
    trade: 'General Contractor',
    location: 'Weston, CT',
    radiusMiles: 25,
    phone: '+12035550199',
    email: 'mike@joballies.com',
    license: 'HIC.0649281'
  });

  const [allies, setAllies] = useState<TradeAlly[]>([
    { id: '1', name: 'Dave Smith', trade: 'Electrician', phone: '+12035550144' },
    { id: '2', name: 'Carlos Gomez', trade: 'Plumber', phone: '+12035550188' }
  ]);
  const [allyName, setAllyName] = useState('');
  const [allyTrade, setAllyTrade] = useState('Electrician');
  const [allyPhone, setAllyPhone] = useState('');

  const [modalRetailer, setModalRetailer] = useState<string | null>(null);

  const leads: LeadItem[] = [
    {
      id: 'L-1',
      source: 'Municipal Permit Registry (Weston, CT)',
      trade: userProfile.trade,
      town: userProfile.location,
      budget: '$4,500 – $8,000',
      scope: 'Commercial electrical and framing reinforcement support requested.',
      clientName: 'Weston Building Dept / Pro Dispatch',
      clientPhone: '+12035550192',
      status: 'New'
    }
  ];

  const handleAddAlly = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allyName.trim() || !allyPhone.trim()) return;
    const newAlly: TradeAlly = {
      id: Date.now().toString(),
      name: allyName.trim(),
      trade: allyTrade,
      phone: allyPhone.trim()
    };
    setAllies([...allies, newAlly]);
    setAllyName('');
    setAllyPhone('');
    alert(`✓ ${newAlly.name} (${newAlly.trade}) added to your active trusted crew!`);
  };

  const openRetailerModal = (retailer: string) => {
    setModalRetailer(retailer);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-5 md:p-10 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-5 gap-4">
          <div className="flex items-center gap-3">
            <Link href="/"><Logo size="sm"/></Link>
            <div>
              <h1 className="text-xl font-extrabold text-white">JobAllies Pro Command Center</h1>
              <p className="text-xs text-slate-400">Autonomous Contractor OS • {userProfile.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link className="bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl transition hover:border-blue-500" href="/">
              ← Return to Dashboard
            </Link>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-slate-800 gap-6">
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
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 text-sm font-extrabold transition border-b-2 ${activeTab === 'profile' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            My Profile & Landing Page
          </button>
        </div>

        {/* TAB 1: LEADS & FEEDS */}
        {activeTab === 'leads' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
              <h4 className="font-extrabold text-white text-sm">Homeowner Direct Leads</h4>
              <p className="text-xs text-slate-400">Incoming requests in your {userProfile.radiusMiles}-mile territory.</p>
              <Link className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-center text-xs transition" href="/quote/sample-quote">
                Interactive Quote Wizard →
              </Link>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
              <h4 className="font-extrabold text-white text-sm">Municipal & State Registry Leads</h4>
              <p className="text-xs text-slate-400">Verified permit filings from other pros.</p>
              {leads.map(l => (
                <div key={l.id} className="bg-slate-950 p-3 rounded-xl space-y-2 text-xs">
                  <p className="font-bold text-slate-200">{l.source}</p>
                  <p className="text-slate-400">{l.scope}</p>
                  <a href={`sms:${l.clientPhone}?body=${encodeURIComponent("Hi, I saw your municipal filing on JobAllies and would love to support your project.")}`} className="block bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 py-2 text-center rounded-lg font-bold">
                    💬 Message Posting Pro
                  </a>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="font-extrabold text-white text-sm">Connect Angi & Thumbtack</h4>
                <p className="text-xs text-slate-400">Sync external lead gen feeds directly into JobAllies.</p>
                <div className="grid grid-cols-2 gap-2">
                  <a href="https://pro.angi.com" target="_blank" rel="noopener noreferrer" className="bg-slate-950 hover:bg-slate-800 border border-slate-800 p-3 rounded-xl text-xs font-bold text-orange-400 text-center">
                    🟠 Connect Angi ↗
                  </a>
                  <a href="https://pro.thumbtack.com" target="_blank" rel="noopener noreferrer" className="bg-slate-950 hover:bg-slate-800 border border-slate-800 p-3 rounded-xl text-xs font-bold text-blue-400 text-center">
                    🔵 Connect Thumbtack ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRUSTED CREW */}
        {activeTab === 'network' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
              <h3 className="text-lg font-extrabold text-white">Invite Trusted Trade Allies</h3>
              <form onSubmit={handleAddAlly} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Ally Name</label>
                  <input type="text" required value={allyName} onChange={e => setAllyName(e.target.value)} placeholder="e.g. Dave Smith" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white font-bold" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Trade Specialty</label>
                  <select value={allyTrade} onChange={e => setAllyTrade(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white font-bold">
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Mason">Mason</option>
                    <option value="Carpenter">Carpenter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Mobile Phone (SMS Invite)</label>
                  <input type="tel" required value={allyPhone} onChange={e => setAllyPhone(e.target.value)} placeholder="203-555-0144" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white font-bold" />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3 rounded-xl transition">
                  Send Personal SMS Invite →
                </button>
              </form>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-lg font-extrabold text-white">Pro-to-Pro Referral Request</h3>
                <p className="text-xs text-slate-400">Request referrals and share overflow jobs with verified trade allies.</p>
                <div className="bg-slate-950 p-4 rounded-2xl text-xs text-slate-300 italic">
                  {"Hey! Looking for reliable pro referrals or overflow support in " + userProfile.location + "? Let's connect on JobAllies."}
                </div>
              </div>
              <a
                href={"sms:?body=" + encodeURIComponent("Hey! Looking for reliable pro referrals or overflow support in " + userProfile.location + "? Let's connect on JobAllies.")}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs text-center transition block"
              >
                📱 Send Pro Referral Request via SMS
              </a>
            </div>

            <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-lg font-extrabold text-white">Your Active Trusted Crew ({allies.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allies.map(a => (
                  <div key={a.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-white">{a.name} ({a.trade})</p>
                      <p className="text-slate-400">{a.phone}</p>
                    </div>
                    <div className="flex gap-2">
                      <a href={"sms:" + a.phone + "?body=" + encodeURIComponent("Hi " + a.name + ", available for support this week?")} className="bg-blue-600/20 text-blue-400 px-3 py-1.5 rounded-lg font-bold">Text</a>
                      <a href={"tel:" + a.phone} className="bg-slate-800 text-slate-200 px-3 py-1.5 rounded-lg font-bold">Call</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SUPPLY RETAILERS */}
        {activeTab === 'retailers' && (
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
            <h3 className="text-2xl font-extrabold text-white">Connect with Pro Supply Retailers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3 text-xs">
                <h4 className="font-bold text-white text-sm">Home Depot Pro Xtra</h4>
                <p className="text-slate-400">Compare wholesale pricing and sync Pro Xtra account.</p>
                <button onClick={() => openRetailerModal('Home Depot Pro')} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition">
                  Open Materials & Pricing →
                </button>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3 text-xs">
                <h4 className="font-bold text-white text-sm">Lowe's ProServices</h4>
                <p className="text-slate-400">Access contractor pricing and job-site delivery.</p>
                <button onClick={() => openRetailerModal("Lowe's Pro")} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition">
                  Open Materials & Pricing →
                </button>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3 text-xs">
                <h4 className="font-bold text-white text-sm">SiteOne Landscape Supply</h4>
                <p className="text-slate-400">Commercial wholesale stone, irrigation, and masonry.</p>
                <button onClick={() => openRetailerModal('SiteOne Supply')} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition">
                  Open Materials & Pricing →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MY PROFILE & LANDING PAGE */}
        {activeTab === 'profile' && (
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-8 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">Pro Identity & Territory OS</span>
                <h3 className="text-2xl font-extrabold text-white">My Profile & Landing Page Builder</h3>
              </div>
              <Link className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition" href="/profile/sample-contractor" target="_blank">
                View Live Landing Page ↗
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h4 className="font-bold text-white text-sm">Territory & Radius Slider</h4>
                <div>
                  <label className="block text-slate-400 mb-1">Service Radius: <strong>{userProfile.radiusMiles} Miles</strong> around {userProfile.location}</label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={userProfile.radiusMiles}
                    onChange={e => setUserProfile({ ...userProfile, radiusMiles: Number(e.target.value) })}
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h4 className="font-bold text-white text-sm">JobAllies Account & License Info</h4>
                <p className="text-slate-300">Name: <strong>{userProfile.name}</strong></p>
                <p className="text-slate-300">Trade: <strong>{userProfile.trade}</strong></p>
                <p className="text-slate-300">License: <strong className="text-emerald-400">{userProfile.license}</strong></p>
                <p className="text-slate-300">Email: {userProfile.email} | Phone: {userProfile.phone}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RETAILER INSTRUCTION MODAL */}
      {modalRetailer && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full p-6 rounded-3xl space-y-4 shadow-2xl">
            <h3 className="text-lg font-extrabold text-white">Connecting to {modalRetailer} Pro</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Instructions:</strong> Log in with your Pro account credentials on the next page to instantly sync your wholesale material pricing and cart exports directly into JobAllies.
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModalRetailer(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs">
                Cancel
              </button>
              <a
                href={modalRetailer === 'Home Depot Pro' ? 'https://www.homedepot.com/c/Pro_Xtra' : modalRetailer === "Lowe's Pro" ? 'https://www.lowes.com/l/pro/proservices' : 'https://www.siteone.com'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setModalRetailer(null)}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs text-center"
              >
                Continue to Portal ↗
              </a>
            </div>
          </div>
        </div>
      )}

      <SiteFooter/>
    </main>
  );
}
