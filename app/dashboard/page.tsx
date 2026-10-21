'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteFooter from '../components/SiteFooter';
import Logo from '../components/Logo';

interface TradeAlly {
  id: string;
  name: string;
  trade: string;
  phone: string;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'leads' | 'network' | 'retailers' | 'profile'>('leads');
  const [userProfile, setUserProfile] = useState({
    name: 'Buddy Bo',
    trade: 'Painter & Decorator',
    location: 'Weston, CT',
    radiusMiles: 25,
    phone: '+12035550199',
    email: 'buddy@contractor.com',
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

  useEffect(() => {
    try {
      const saved = localStorage.getItem('joballies_temp_user') || localStorage.getItem('joballies_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        setUserProfile(prev => ({
          ...prev,
          name: parsed.name || prev.name,
          trade: parsed.trade || prev.trade,
          location: parsed.location || prev.location,
          email: parsed.email || prev.email,
          phone: parsed.phone || prev.phone
        }));
      }
    } catch {}
  }, []);

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

  const referralSmsBody = "Hey! Looking for reliable pro referrals or overflow support in " + userProfile.location + "? Let's connect on JobAllies: https://joballies.com";
  const referralSmsLink = "sms:?body=" + encodeURIComponent(referralSmsBody);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-5 md:p-10 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-5 gap-4">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div>
              <h1 className="text-xl font-black text-white">JobAllies Pro Dashboard</h1>
              <p className="text-xs text-slate-400">Welcome back, {userProfile.name} ({userProfile.trade} • {userProfile.location})</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl transition hover:border-blue-500">
              ← Return to Home
            </Link>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-slate-800 gap-6">
          <button
            onClick={() => setActiveTab('leads')}
            className={`pb-3 text-sm font-extrabold transition border-b-2 ${activeTab === 'leads' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            ⚡ Leads & Feeds
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={`pb-3 text-sm font-extrabold transition border-b-2 ${activeTab === 'network' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            🤝 Build Trusted Crew ({allies.length})
          </button>
          <button
            onClick={() => setActiveTab('retailers')}
            className={`pb-3 text-sm font-extrabold transition border-b-2 ${activeTab === 'retailers' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            📦 Pro Supply Retailers
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 text-sm font-extrabold transition border-b-2 ${activeTab === 'profile' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            ⚙️ My Profile & Territory
          </button>
        </div>

        {/* TAB 1: LEADS & FEEDS */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-xs text-slate-300">
              ℹ️ <strong>Transparent Lead Sourcing:</strong> Leads in your dashboard are dynamically sourced from verified homeowner-submitted project requests, public municipal building permits, and connected platform webhooks.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Homeowner Direct Requests */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">Homeowner Direct</span>
                    <span className="text-xs text-slate-400">Today</span>
                  </div>
                  <h4 className="font-extrabold text-white text-base">Kitchen Remodel & Paint</h4>
                  <p className="text-xs text-slate-300">Homeowner in {userProfile.location} requested full interior painting and cabinet prep. Budget: $5,200.</p>
                </div>
                <Link href="/dashboard/voice-quote" className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-center text-xs transition">
                  🎙️ Speak Estimate & Send Quote →
                </Link>
              </div>

              {/* Municipal & State Permit Registry */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-amber-400 bg-amber-950 px-2.5 py-1 rounded-full border border-amber-800">Municipal Permit</span>
                    <span className="text-xs text-slate-400">Active Filing</span>
                  </div>
                  <h4 className="font-extrabold text-white text-base">Commercial & Residential Filings</h4>
                  <p className="text-xs text-slate-300">Public registry permit filed in {userProfile.location} requiring verified {userProfile.trade} credential support.</p>
                </div>
                <a href="sms:?body=Hi,%20I%20saw%20your%20municipal%20permit%20filing%20on%20JobAllies%20and%20would%20love%20to%20connect." className="block w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-xl text-center text-xs transition">
                  💬 Message via Platform Relay
                </a>
              </div>

              {/* Connected Lead Platforms (Angi & Thumbtack) */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-400 bg-blue-950 px-2.5 py-1 rounded-full border border-blue-800">External Marketplaces</span>
                    <span className="text-xs text-slate-400">Optional Sync</span>
                  </div>
                  <h4 className="font-extrabold text-white text-base">Thumbtack & Angi Feeds</h4>
                  <p className="text-xs text-slate-300">Connect your professional accounts to automatically route external marketplace leads directly into JobAllies.</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <a href="https://pro.angi.com" target="_blank" rel="noopener noreferrer" className="bg-slate-950 hover:bg-slate-800 border border-slate-800 p-2.5 rounded-xl text-xs font-bold text-orange-400 text-center">
                    🟠 Angi Pro ↗
                  </a>
                  <a href="https://pro.thumbtack.com" target="_blank" rel="noopener noreferrer" className="bg-slate-950 hover:bg-slate-800 border border-slate-800 p-2.5 rounded-xl text-xs font-bold text-blue-400 text-center">
                    🔵 Thumbtack ↗
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
                  <input type="text" required value={allyName} onChange={e => setAllyName(e.target.value)} placeholder="e.g. Dave Smith" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white font-bold" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Trade Specialty</label>
                  <select value={allyTrade} onChange={e => setAllyTrade(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white font-bold">
                    <option value="Electrician">Electrician ⚡</option>
                    <option value="Plumber">Plumber 🚰</option>
                    <option value="Mason">Mason 🧱</option>
                    <option value="Carpenter">Carpenter 🪚</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Mobile Phone (SMS Invite)</label>
                  <input type="tel" required value={allyPhone} onChange={e => setAllyPhone(e.target.value)} placeholder="(203) 555-0144" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white font-bold" />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3.5 rounded-xl transition shadow-lg">
                  Send Personal SMS Invite →
                </button>
              </form>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-lg font-extrabold text-white">Pro-to-Pro Referral Request</h3>
                <p className="text-xs text-slate-400">Request referrals and share overflow jobs with verified trade allies in your area.</p>
                <div className="bg-slate-950 p-4 rounded-2xl text-xs text-slate-300 italic">
                  &quot;Hey! Looking for reliable pro referrals or overflow support in {userProfile.location}? Let's connect on JobAllies.&quot;
                </div>
              </div>
              <a
                href={referralSmsLink}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl text-xs text-center transition block shadow-lg"
              >
                📱 Send Pro Referral Request via SMS
              </a>
            </div>
          </div>
        )}

        {/* TAB 3: RETAILERS */}
        {activeTab === 'retailers' && (
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
            <h3 className="text-2xl font-extrabold text-white">Connect with Pro Supply Retailers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3 text-xs">
                <h4 className="font-bold text-white text-sm">Home Depot Pro Xtra</h4>
                <p className="text-slate-400">Compare wholesale pricing and sync Pro Xtra account.</p>
                <button onClick={() => setModalRetailer('Home Depot Pro')} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition">
                  Open Materials & Pricing →
                </button>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3 text-xs">
                <h4 className="font-bold text-white text-sm">Lowe's ProServices</h4>
                <p className="text-slate-400">Access contractor pricing and job-site delivery.</p>
                <button onClick={() => setModalRetailer("Lowe's Pro")} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition">
                  Open Materials & Pricing →
                </button>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3 text-xs">
                <h4 className="font-bold text-white text-sm">SiteOne Landscape Supply</h4>
                <p className="text-slate-400">Commercial wholesale stone, irrigation, and masonry.</p>
                <button onClick={() => setModalRetailer('SiteOne Supply')} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition">
                  Open Materials & Pricing →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-8 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">Pro Identity OS</span>
                <h3 className="text-2xl font-extrabold text-white">My Profile & Territory Settings</h3>
              </div>
              <Link href="/profile/sample-contractor" target="_blank" className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition">
                View Live Public Landing Page ↗
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h4 className="font-bold text-white text-sm">Service Territory Radius</h4>
                <div>
                  <label className="block text-slate-400 mb-1">Radius: <strong>{userProfile.radiusMiles} Miles</strong> around {userProfile.location}</label>
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
                <h4 className="font-bold text-white text-sm">Account Information</h4>
                <p className="text-slate-300">Name: <strong>{userProfile.name}</strong></p>
                <p className="text-slate-300">Trade: <strong>{userProfile.trade}</strong></p>
                <p className="text-slate-300">License: <strong className="text-emerald-400">{userProfile.license}</strong></p>
                <p className="text-slate-300">Email: {userProfile.email} | Phone: {userProfile.phone}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {modalRetailer && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full p-6 rounded-3xl space-y-4 shadow-2xl">
            <h3 className="text-lg font-extrabold text-white">Connecting to {modalRetailer}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Log in with your Pro credentials on the next page to instantly sync your wholesale material pricing and cart exports directly into JobAllies.
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

      <SiteFooter />
    </main>
  );
}
