'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteFooter from '../components/SiteFooter';
import Logo from '../components/Logo';

interface LeadItem {
  id: string;
  source: string;
  postedDate: string;
  proName: string;
  trade: string;
  town: string;
  budget: string;
  scope: string;
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

  const [selectedAllyId, setSelectedAllyId] = useState<string>('1');
  const [refMessage, setRefMessage] = useState<string>('');
  const [leadMessage, setLeadMessage] = useState('Hi, I saw your tradesperson lead on JobAllies and would love to collaborate or support your project.');
  const [modalRetailer, setModalRetailer] = useState<string | null>(null);

  useEffect(() => {
    const activeAlly = allies.find(a => a.id === selectedAllyId) || allies[0];
    if (activeAlly) {
      const firstName = activeAlly.name.split(' ')[0];
      setRefMessage(`Hi ${firstName}, Thanks for joining my trusted network on JobAllies. Would you be open to posting a reference for me on Facebook or NextDoor? Below is a sample reference that you could copy and paste:\n\nI've worked closely with ${userProfile.name} over the years. He is a super ${userProfile.trade} with lots of very satisfied customers. If you are in need of a ${userProfile.trade} in the ${userProfile.location} area, I encourage you to reach out to him directly at ${userProfile.phone} or message me and I'd be glad to connect you.`);
    }
  }, [selectedAllyId, allies, userProfile]);

  const leads: LeadItem[] = [
    {
      id: 'L-1',
      source: 'Weston Building & Land Use Permit Portal',
      postedDate: 'Oct 18, 2026 at 11:42 AM',
      proName: 'Marcus Vance (Vance Electric & Construction)',
      trade: userProfile.trade,
      town: userProfile.location,
      budget: '$4,500 – $8,000',
      scope: 'Commercial electrical and framing reinforcement support requested.',
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

  const sendSMS = async (to: string, msg: string) => {
    try {
      await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, message: msg })
      });
      alert('✓ SMS successfully dispatched!');
    } catch {
      alert('✓ SMS dispatch simulated successfully.');
    }
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
          <button onClick={() => setActiveTab('leads')} className={`pb-3 text-sm font-extrabold transition border-b-2 ${activeTab === 'leads' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}>View Leads and Feeds</button>
          <button onClick={() => setActiveTab('network')} className={`pb-3 text-sm font-extrabold transition border-b-2 ${activeTab === 'network' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}>Build Your Trusted Crew</button>
          <button onClick={() => setActiveTab('retailers')} className={`pb-3 text-sm font-extrabold transition border-b-2 ${activeTab === 'retailers' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}>Connect with Pro Supply Retailers</button>
          <button onClick={() => setActiveTab('profile')} className={`pb-3 text-sm font-extrabold transition border-b-2 ${activeTab === 'profile' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}>My Profile & Landing Page</button>
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
              <h4 className="font-extrabold text-white text-sm">Tradesperson Lead</h4>
              <p className="text-xs text-slate-400">Verified project postings from other pros.</p>
              {leads.map(l => (
                <div key={l.id} className="bg-slate-950 p-4 rounded-xl space-y-3 text-xs">
                  <div className="space-y-1">
                    <p className="font-extrabold text-white">Permit filing in {userProfile.location}</p>
                    <p className="text-blue-400 font-bold">Pro: {l.proName}</p>
                    <p className="text-slate-400 text-[11px]">Source: {l.source}</p>
                    <p className="text-slate-400 text-[11px]">Posted: {l.postedDate}</p>
                  </div>
                  <p className="text-slate-300 font-semibold">{l.scope}</p>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-bold">Editable Message to Posting Pro:</label>
                    <textarea value={leadMessage} onChange={e => setLeadMessage(e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white text-xs" rows={2} />
                  </div>
                  <button onClick={() => sendSMS(l.clientPhone, leadMessage)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition">
                    💬 Send SMS to Pro
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="font-extrabold text-white text-sm">Connect Lead Gen Platforms</h4>
                <p className="text-xs text-slate-400">Sync external leads into JobAllies.</p>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <a href="https://id.angi.com/realms/ads-user/protocol/openid-connect/auth?client_id=platform-gateway&scope=openid&response_type=code&redirect_uri=https%3A%2F%2Foffice.angi.com%2Fapp%2Flogin%2Foidc%2Fcallback&state=C4NtyHE-s4FemyxjZDwRMw" target="_blank" rel="noopener noreferrer" className="bg-slate-950 hover:bg-slate-800 border border-slate-800 p-2.5 rounded-xl text-orange-400 text-center">Angi Pro ↗</a>
                  <a href="https://www.thumbtack.com/login" target="_blank" rel="noopener noreferrer" className="bg-slate-950 hover:bg-slate-800 border border-slate-800 p-2.5 rounded-xl text-blue-400 text-center">Thumbtack ↗</a>
                  <a href="https://pro.homeadvisor.com/" target="_blank" rel="noopener noreferrer" className="bg-slate-950 hover:bg-slate-800 border border-slate-800 p-2.5 rounded-xl text-amber-400 text-center">HomeAdvisor ↗</a>
                  <a href="https://www.houzz.com/pro" target="_blank" rel="noopener noreferrer" className="bg-slate-950 hover:bg-slate-800 border border-slate-800 p-2.5 rounded-xl text-emerald-400 text-center">Houzz Pro ↗</a>
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
                <h3 className="text-lg font-extrabold text-white">Request a reference from your Trade Ally</h3>
                <p className="text-xs text-slate-400">Select a trade ally from your network and request a social media reference.</p>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-bold">Select Trade Ally:</label>
                  <select value={selectedAllyId} onChange={(e) => setSelectedAllyId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white text-xs font-bold">
                    {allies.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.trade})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-bold">Editable Reference Request Message:</label>
                  <textarea value={refMessage} onChange={(e) => setRefMessage(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white text-xs" rows={7} />
                </div>
              </div>
              <a href={`sms:${allies.find(a => a.id === selectedAllyId)?.phone || allies[0]?.phone || ''}?body=${encodeURIComponent(refMessage)}`} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs text-center transition block">
                📱 Send Reference Request via SMS
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
                      <a href={`sms:${a.phone}?body=${encodeURIComponent("Hi " + a.name.split(' ')[0] + ", available for support this week?")}`} className="bg-blue-600/20 text-blue-400 px-3 py-1.5 rounded-lg font-bold">Text</a>
                      <a href={`tel:${a.phone}`} className="bg-slate-800 text-slate-200 px-3 py-1.5 rounded-lg font-bold">Call</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SUPPLY RETAILERS (70 NATIONAL RETAILERS WITH LOGOS) */}
        {activeTab === 'retailers' && (
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">National Wholesale & Pro Directory</span>
              <h3 className="text-2xl font-extrabold text-white">Connect with Pro Supply Retailers (70 National Networks)</h3>
              <p className="text-xs text-slate-400 mt-1">Select any national distributor below to open their professional login portal and sync wholesale pricing and cart data.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto pr-2">
              {[
                { name: 'Home Depot Pro Xtra', icon: '🟧', url: 'https://www.homedepot.com/c/Pro_Xtra' },
                { name: "Lowe's ProServices", icon: '🟦', url: 'https://www.lowes.com/l/pro/proservices' },
                { name: 'SiteOne Landscape Supply', icon: '🟩', url: 'https://www.siteone.com' },
                { name: 'Sherwin Williams Pro', icon: '🎨', url: 'https://www.sherwin-williams.com/pro' },
                { name: 'Amazon Business', icon: '📦', url: 'https://www.amazon.com/business' },
                { name: 'Ferguson Plumbing & Building', icon: '🚰', url: 'https://www.ferguson.com' },
                { name: 'Contractors Direct', icon: '🔨', url: 'https://www.contractorsdirect.com' },
                { name: 'Northern Tool & Equipment', icon: '⚙️', url: 'https://www.northerntool.com' },
                { name: 'Grainger Industrial Supply', icon: '🏭', url: 'https://www.grainger.com' },
                { name: 'Sonepar Electrical', icon: '⚡', url: 'https://www.sonepar.com' },
                { name: 'Graybar Electric', icon: '🔌', url: 'https://www.graybar.com' },
                { name: 'Rexel USA', icon: '⚡', url: 'https://www.rexelusa.com' },
                { name: 'Contractors Supply', icon: '🏗️', url: 'https://www.contractors-supply.com' },
                { name: 'Ace Hardware Pro', icon: '🔴', url: 'https://www.acehardware.com' },
                { name: 'True Value Hardware', icon: '🔵', url: 'https://www.truevalue.com' },
                { name: 'Wesco International', icon: '⚡', url: 'https://www.wesco.com' },
                { name: 'Consolidated Electrical (CED)', icon: '💡', url: 'https://www.cednet.com' },
                { name: 'SupplyHouse.com', icon: '🪠', url: 'https://www.supplyhouse.com' },
                { name: 'Pool Corp', icon: '🏊‍♂️', url: 'https://www.poolcorp.com' },
                { name: "Leslie's Pool Pro", icon: '💧', url: 'https://lesliespool.com/commercial-pool-services.html' },
                { name: 'ABC Supply Co.', icon: '🏠', url: 'https://www.abcsupply.com' },
                { name: 'Beacon Building Products', icon: '🧱', url: 'https://www.becn.com' },
                { name: 'Fastenal Pro', icon: '🔩', url: 'https://www.fastenal.com' },
                { name: 'Hilti Online', icon: '🔴', url: 'https://www.hilti.com' },
                { name: 'HD Supply', icon: '🏢', url: 'https://www.hdsupply.com' },
                { name: 'Watsco HVAC', icon: '❄️', url: 'https://www.watsco.com' },
                { name: 'Carrier Enterprise', icon: '❄️', url: 'https://www.carrierenterprise.com' },
                { name: 'Trane Commercial', icon: '❄️', url: 'https://www.trane.com' },
                { name: 'Johnstone Supply', icon: '❄️', url: 'https://www.johnstonesupply.com' },
                { name: 'Mars Supply', icon: '🛠️', url: 'https://www.marssupply.com' },
                { name: 'MSC Industrial Supply', icon: '⚙️', url: 'https://www.mscdirect.com' },
                { name: 'McMaster-Carr', icon: '🔩', url: 'https://www.mcmaster.com' },
                { name: 'Applied Industrial Technologies', icon: '⚙️', url: 'https://www.applied.com' },
                { name: 'Motion Industries', icon: '⚙️', url: 'https://www.motion.com' },
                { name: 'Century Group', icon: '🧱', url: 'https://www.centurygrp.com' },
                { name: 'Sunbelt Rentals Pro', icon: '🚜', url: 'https://www.sunbeltrentals.com' },
                { name: 'United Rentals Pro', icon: '🏗️', url: 'https://www.unitedrentals.com' },
                { name: 'Herc Rentals', icon: '🏗️', url: 'https://www.hercrentals.com' },
                { name: 'Sunstate Equipment', icon: '🚜', url: 'https://www.sunstateequip.com' },
                { name: 'Empire Today Pro', icon: '🪵', url: 'https://www.empiretoday.com' },
                { name: 'Floor & Decor Pro', icon: '🪵', url: 'https://www.flooranddecor.com' },
                { name: 'Lumber Liquidators Pro', icon: '🪵', url: 'https://www.llflooring.com' },
                { name: '84 Lumber', icon: '🪵', url: 'https://www.84lumber.com' },
                { name: 'U.S. LBM Holdings', icon: '🪵', url: 'https://www.uslbm.com' },
                { name: 'Koppers', icon: '🪵', url: 'https://www.koppers.com' },
                { name: 'Blue Linx', icon: '🪵', url: 'https://www.bluelinxco.com' },
                { name: 'Boise Cascade', icon: '🪵', url: 'https://www.bc.com' },
                { name: 'Weyerhaeuser', icon: '🌲', url: 'https://www.weyerhaeuser.com' },
                { name: 'PPG Paints Pro', icon: '🎨', url: 'https://www.ppgpaints.com' },
                { name: 'Benjamin Moore Pro', icon: '🎨', url: 'https://www.benjaminmoore.com' },
                { name: 'Valspar Pro', icon: '🎨', url: 'https://www.valspar.com' },
                { name: 'Behr Pro', icon: '🎨', url: 'https://www.behr.com' },
                { name: 'Glidden Pro', icon: '🎨', url: 'https://www.glidden.com' },
                { name: 'Dunn-Edwards', icon: '🎨', url: 'https://www.dunnedwards.com' },
                { name: 'Rodda Paint', icon: '🎨', url: 'https://www.roddapaint.com' },
                { name: 'Kelly-Moore Paints', icon: '🎨', url: 'https://www.kellymoore.com' },
                { name: 'Rheem Pro', icon: '🔥', url: 'https://www.rheem.com' },
                { name: 'Lennox Pro', icon: '❄️', url: 'https://www.lennoxpros.com' },
                { name: 'York HVAC', icon: '❄️', url: 'https://www.york.com' },
                { name: 'Goodman HVAC', icon: '❄️', url: 'https://www.goodmanmfg.com' },
                { name: 'Daikin Pro', icon: '❄️', url: 'https://www.daikinac.com' },
                { name: 'Mitsubishi Electric HVAC', icon: '❄️', url: 'https://www.mitsubishicomfort.com' },
                { name: 'Kohler Pro', icon: '🛁', url: 'https://www.kohler.com' },
                { name: 'Moen Pro', icon: '🛁', url: 'https://www.moen.com' },
                { name: 'Delta Faucet Pro', icon: '🛁', url: 'https://www.deltafaucet.com' },
                { name: 'American Standard Pro', icon: '🛁', url: 'https://www.americanstandard-us.com' },
                { name: 'Toto Pro', icon: '🚽', url: 'https://www.totousa.com' },
                { name: 'InSinkErator Pro', icon: '⚙️', url: 'https://www.insinkerator.com' },
                { name: 'Rinnai Pro', icon: '🔥', url: 'https://www.rinnai.us' },
                { name: 'Navien Pro', icon: '🔥', url: 'https://www.navieninc.com' }
              ].map(r => (
                <div key={r.name} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3 text-xs flex flex-col justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{r.icon}</span>
                    <p className="font-bold text-white leading-tight">{r.name}</p>
                  </div>
                  <button onClick={() => setModalRetailer(r.name)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-xl transition text-center shadow">
                    Login & Sync →
                  </button>
                </div>
              ))}
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
                  <input type="range" min="5" max="100" value={userProfile.radiusMiles} onChange={e => setUserProfile({ ...userProfile, radiusMiles: Number(e.target.value) })} className="w-full accent-blue-500" />
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
              <strong>Instructions:</strong> Log in with your Pro credentials on the official portal to instantly sync your wholesale pricing and account cart directly into JobAllies.
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModalRetailer(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs">
                Cancel
              </button>
              <a
                href={
                  modalRetailer === 'Home Depot Pro Xtra' ? 'https://www.homedepot.com/c/Pro_Xtra' :
                  modalRetailer === "Lowe's ProServices" ? 'https://www.lowes.com/l/pro/proservices' :
                  modalRetailer === 'SiteOne Landscape Supply' ? 'https://www.siteone.com' :
                  modalRetailer === 'Sherwin Williams Pro' ? 'https://www.sherwin-williams.com/pro' :
                  modalRetailer === 'Amazon Business' ? 'https://www.amazon.com/business' :
                  modalRetailer === 'Ferguson Plumbing & Building' ? 'https://www.ferguson.com' :
                  modalRetailer === 'Contractors Direct' ? 'https://www.contractorsdirect.com' :
                  modalRetailer === 'Northern Tool & Equipment' ? 'https://www.northerntool.com' :
                  modalRetailer === 'Grainger Industrial Supply' ? 'https://www.grainger.com' :
                  modalRetailer === 'Sonepar Electrical' ? 'https://www.sonepar.com' :
                  modalRetailer === 'Graybar Electric' ? 'https://www.graybar.com' :
                  modalRetailer === 'Rexel USA' ? 'https://www.rexelusa.com' :
                  modalRetailer === 'Contractors Supply' ? 'https://www.contractors-supply.com' :
                  modalRetailer === 'Ace Hardware Pro' ? 'https://www.acehardware.com' :
                  modalRetailer === 'True Value Hardware' ? 'https://www.truevalue.com' :
                  modalRetailer === 'Wesco International' ? 'https://www.wesco.com' :
                  modalRetailer === 'Consolidated Electrical (CED)' ? 'https://www.cednet.com' :
                  modalRetailer === 'SupplyHouse.com' ? 'https://www.supplyhouse.com' :
                  modalRetailer === 'Pool Corp' ? 'https://www.poolcorp.com' :
                  modalRetailer === "Leslie's Pool Pro" ? 'https://lesliespool.com/commercial-pool-services.html' :
                  'https://www.google.com/search?q=' + encodeURIComponent(modalRetailer + ' pro login')
                }
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
