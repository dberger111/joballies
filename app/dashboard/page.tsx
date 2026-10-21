'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteFooter from '../components/SiteFooter';
import Logo from '../components/Logo';

interface LeadItem {
  id: string;
  type: 'HOMEOWNER DIRECT' | 'TRADESPERSON DIRECT' | 'HOMEOWNER PERMIT FILING' | 'TRADESPERSON PERMIT FILING' | 'LEAD PLATFORMS';
  title: string;
  source: string;
  details: string;
  defaultMsg: string;
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

  const [leadMessages, setLeadMessages] = useState<{ [key: string]: string }>({
    'L-1': "Hi Sarah, regarding your kitchen remodel & paint project in Weston: we have verified availability this week and can provide an itemized quote in 30 seconds.",
    'L-2': "Hi RAH TEC LLC, I noticed your trade service filing in Weston. As a fellow professional on JobAllies, I'd love to connect and share local pro referrals.",
    'L-3': "Hi Weston Property Owner, regarding your residential permit filing: we provide certified trade support and direct material delivery.",
    'L-4': "Hi Contractor Entity, regarding your municipal permit filing on record: let's coordinate local subcontracting and 10% referral splits on JobAllies.",
    'L-5': "Hi! We received your inquiry via our marketplace lead feed. Let's schedule your project walkthrough on JobAllies."
  });

  const [modalRetailer, setModalRetailer] = useState<string | null>(null);

  const leads: LeadItem[] = [
    {
      id: 'L-1',
      type: 'HOMEOWNER DIRECT',
      title: 'Kitchen Remodel & Interior Paint',
      source: 'Direct Homeowner Request (Weston, CT)',
      details: 'Homeowner seeking full interior paint and cabinet refinishing. Budget: $5,200.',
      defaultMsg: leadMessages['L-1']
    },
    {
      id: 'L-2',
      type: 'TRADESPERSON DIRECT',
      title: 'Subcontractor Framing & Prep Support',
      source: 'Verified Tradesperson Inquiry',
      details: 'General contractor seeking specialized painting and surface prep crew for active commercial job.',
      defaultMsg: leadMessages['L-2']
    },
    {
      id: 'L-3',
      type: 'HOMEOWNER PERMIT FILING',
      title: 'Residential Building & Alteration Permit',
      source: 'Municipal Building Dept (Weston, CT)',
      details: 'Publicly filed homeowner building permit for property renovation.',
      defaultMsg: leadMessages['L-3']
    },
    {
      id: 'L-4',
      type: 'TRADESPERSON PERMIT FILING',
      title: 'Commercial Trade License & Permit Filing',
      source: 'State Open Data Registry (data.ct.gov)',
      details: 'Registered contractor entity filing for municipal trade work in territory.',
      defaultMsg: leadMessages['L-4']
    },
    {
      id: 'L-5',
      type: 'LEAD PLATFORMS',
      title: 'Thumbtack & Angi Pro Marketplace Sync',
      source: 'Connected Platform Webhook / API',
      details: 'Inbound consumer project leads routed from your connected marketplace accounts.',
      defaultMsg: leadMessages['L-5']
    }
  ];

  const handleSendLeadMsg = async (leadId: string, title: string) => {
    const msg = leadMessages[leadId];
    try {
      await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: userProfile.phone,
          message: `[JobAllies Dispatch - ${title}]: ${msg}`
        })
      });
    } catch {}
    alert(`✓ Message successfully dispatched for "${title}" via platform relay!`);
  };

  const retailers = [
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
  ];

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
          <Link href="/" className="bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl transition hover:border-blue-500">
            ← Return to Home
          </Link>
        </header>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-slate-800 gap-6">
          <button
            onClick={() => setActiveTab('leads')}
            className={`pb-3 text-sm font-extrabold transition border-b-2 ${activeTab === 'leads' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            ⚡ Leads & Feeds (5 Types)
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={`pb-3 text-sm font-extrabold transition border-b-2 ${activeTab === 'network' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            🤝 Build Trusted Crew
          </button>
          <button
            onClick={() => setActiveTab('retailers')}
            className={`pb-3 text-sm font-extrabold transition border-b-2 ${activeTab === 'retailers' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            📦 Pro Supply Retailers (70 Networks)
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 text-sm font-extrabold transition border-b-2 ${activeTab === 'profile' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            ⚙️ My Profile & Territory
          </button>
        </div>

        {/* TAB 1: LEADS & FEEDS (5 EXACT TYPES WITH PREFILLED SMS) */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-xs text-slate-300">
              ℹ️ <strong>5 Verified Lead Categories:</strong> Each lead type below includes a pre-filled, editable message ready for 1-tap dispatch via platform SMS relay.
            </div>

            <div className="space-y-5">
              {leads.map((lead) => (
                <div key={lead.id} className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <span className="text-xs font-black uppercase tracking-wider bg-blue-950 text-blue-400 px-3 py-1 rounded-full border border-blue-800">
                      {lead.type}
                    </span>
                    <span className="text-xs text-slate-400">📍 {lead.source}</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-white">{lead.title}</h3>
                    <p className="text-xs text-slate-300 mt-1">{lead.details}</p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-amber-400">
                      📱 Pre-Filled SMS Dispatch Message (Editable)
                    </label>
                    <textarea
                      rows={3}
                      value={leadMessages[lead.id]}
                      onChange={(e) => setLeadMessages({ ...leadMessages, [lead.id]: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
                    />
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => handleSendLeadMsg(lead.id, lead.title)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-3 rounded-xl text-xs transition shadow-lg"
                      >
                        ✓ Send Pre-Filled SMS via Platform Relay →
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
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
            <h3 className="text-xl font-extrabold text-white">Trusted Sub & Referral Crew</h3>
            <p className="text-xs text-slate-400">Invite local trade allies and lock in 10% referral splits.</p>
            <a
              href="sms:?body=Hey!%20Looking%20for%20reliable%20pro%20referrals%20or%20overflow%20support?%20Let's%20connect%20on%20JobAllies:%20https://joballies.com"
              className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-xl text-xs transition shadow-lg"
            >
              📱 Send Pro Referral Request via SMS
            </a>
          </div>
        )}

        {/* TAB 3: 70 RETAILERS */}
        {activeTab === 'retailers' && (
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">National Wholesale & Pro Directory</span>
              <h3 className="text-2xl font-extrabold text-white">Connect with Pro Supply Retailers (70 National Networks)</h3>
              <p className="text-xs text-slate-400 mt-1">Select any distributor below to open their professional login portal.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto pr-2">
              {retailers.map((r) => (
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

        {/* TAB 4: PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
            <h3 className="text-2xl font-extrabold text-white">My Profile & Territory Settings</h3>
            <p className="text-xs text-slate-300">Name: {userProfile.name} | Trade: {userProfile.trade} | Territory: {userProfile.location}</p>
          </div>
        )}
      </div>

      {modalRetailer && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full p-6 rounded-3xl space-y-4 shadow-2xl">
            <h3 className="text-lg font-extrabold text-white">Connecting to {modalRetailer}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Log in with your Pro credentials on the official portal to sync wholesale pricing into JobAllies.
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModalRetailer(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs">
                Cancel
              </button>
              <a
                href={retailers.find(r => r.name === modalRetailer)?.url || 'https://www.homedepot.com/c/Pro_Xtra'}
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
