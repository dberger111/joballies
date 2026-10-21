'use client';
import { useState } from 'react';
import Link from 'next/link';

interface LiveContractor {
  businessName: string;
  contactName: string;
  licenseNumber: string;
  trade: string;
  status: string;
  town: string;
  state: string;
  slug: string;
  claimUrl: string;
}

export default function FounderGrowthConsole() {
  const [unlocked, setUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState<'50-state' | 'email-builder' | 'analytics'>('50-state');
  
  const [selectedState, setSelectedState] = useState('CT');
  const [cityQuery, setCityQuery] = useState('WESTPORT');
  const [fetchLimit, setFetchLimit] = useState('2500');
  const [loadingRegistry, setLoadingRegistry] = useState(false);
  const [liveContractors, setLiveContractors] = useState<LiveContractor[]>([]);
  const [registrySource, setRegistrySource] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [dispatching, setDispatching] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<any>(null);

  const [testEmail, setTestEmail] = useState('');
  const [testStatus, setTestStatus] = useState('');

  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const samplePro = {
    businessName: "Mike's Stonework & Masonry",
    contactName: "Mike Johnson",
    licenseNumber: "HIC.0649281",
    town: "Westport, CT",
    trade: "Mason & Stonework",
    slug: "mikes-stonework-masonry"
  };

  const sampleClaimUrl = `https://joballies.com/profile/${samplePro.slug}?claim=true`;

  const sampleHtml = `
    <div style="font-family: sans-serif; background: #020617; color: #f8fafc; padding: 32px; border-radius: 24px;">
      <div style="max-width: 600px; margin: 0 auto; background: #0f172a; padding: 32px; border-radius: 20px; border: 1px solid #1e293b;">
        <div style="font-size: 14px; font-weight: 800; color: #3b82f6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
          JobAllies Pro Network (from UpLevel Labs, Inc.)
        </div>
        <h1 style="font-size: 24px; font-weight: 900; color: #ffffff; margin-top: 0; line-height: 1.3;">
          Active License Verification for ${samplePro.businessName}
        </h1>
        <p style="font-size: 15px; color: #94a3b8; line-height: 1.6;">
          Hi <strong style="color: #ffffff;">${samplePro.contactName}</strong>,
        </p>
        <p style="font-size: 15px; color: #94a3b8; line-height: 1.6;">
          Because you hold active state license <strong style="color: #10b981;">${samplePro.licenseNumber}</strong> in <strong style="color: #ffffff;">${samplePro.town}</strong>, we have pre-built your verified Digital Yard Sign and local homeowner quote catcher on JobAllies.
        </p>
        
        <div style="background: #1e293b; padding: 20px; border-radius: 14px; margin: 24px 0; border-left: 4px solid #3b82f6;">
          <p style="margin: 0; font-size: 14px; color: #e2e8f0; font-weight: 600;">
            ⚡ What you can do right now:
          </p>
          <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #94a3b8; font-size: 14px; line-height: 1.5;">
            <li>Receive homeowner project requests directly in your town.</li>
            <li>Use <strong>Talk-to-Quote</strong>: speak your job notes from the truck and text estimates in 30 seconds.</li>
            <li>Partner with local GCs and subs to lock in 10% referral finder's fees.</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${sampleClaimUrl}" style="background: #2563eb; color: #ffffff; padding: 16px 32px; border-radius: 12px; font-weight: 800; text-decoration: none; display: inline-block; font-size: 15px; box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4);">
            Claim Your Free Profile & Page →
          </a>
        </div>

        <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 32px; border-top: 1px solid #1e293b; padding-top: 16px;">
          JobAllies (from UpLevel Labs, Inc.) • 100% Free for Independent Tradespeople<br/>
          If you wish to stop receiving these notifications, reply STOP.
        </p>
      </div>
    </div>
  `;

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'uplevel2026') {
      setUnlocked(true);
      fetchContractors('CT', 'WESTPORT', '2500');
    } else {
      alert('Invalid Founder Passcode.');
    }
  };

  const fetchContractors = async (state: string, targetCity: string, limit: string) => {
    setLoadingRegistry(true);
    try {
      const res = await fetch(`/api/state-licenses?state=${state}&city=${encodeURIComponent(targetCity)}&limit=${limit}`);
      const data = await res.json();
      if (data.contractors) {
        setLiveContractors(data.contractors);
        setRegistrySource(data.source || `${state} State Licensing Board`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRegistry(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Business Name', 'License Holder Name', 'State License Number', 'Trade', 'Town', 'State', 'Pre-Built Claim URL'];
    const rows = liveContractors.map((c) => [c.businessName, c.contactName, c.licenseNumber, c.trade, c.town, c.state, c.claimUrl]
      .map(v => `"${String(v || '').replace(/"/g, '""')}"`)
      .join(',')
    );
    const csv = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', `${selectedState}_Contractors_${cityQuery || 'Statewide'}_${liveContractors.length}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExecuteResendCampaign = async () => {
    if (!confirm(`Are you sure you want to dispatch live emails via Resend to all ${liveContractors.length} contractors in ${cityQuery || 'Statewide'}, ${selectedState}?`)) return;
    setDispatching(true);
    setDispatchResult(null);
    try {
      const res = await fetch("/api/admin/dispatch-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractors: liveContractors,
          campaignSubject: `Homeowner quote requests & your contractor profile on JobAllies`,
          founderPasscode: "uplevel2026"
        })
      });
      const data = await res.json();
      setDispatchResult(data);
    } catch (err) {
      alert("Error dispatching campaign: " + String(err));
    } finally {
      setDispatching(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail) return;
    setTestStatus('Sending test email via Resend...');
    try {
      const res = await fetch('/api/admin/dispatch-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractors: [{ businessName: samplePro.businessName, contactName: samplePro.contactName, licenseNumber: samplePro.licenseNumber, town: samplePro.town, trade: samplePro.trade, slug: samplePro.slug, email: testEmail, claimUrl: sampleClaimUrl }],
          campaignSubject: '[TEST] Claim your JobAllies Pro Profile',
          founderPasscode: 'uplevel2026'
        })
      });
      const data = await res.json();
      if (data.success) {
        setTestStatus(`✓ Test email successfully sent to ${testEmail}! Check your inbox.`);
      } else {
        setTestStatus(`Error: ${data.error}`);
      }
    } catch (err) {
      setTestStatus(`Error: ${String(err)}`);
    }
  };

  if (!unlocked) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 flex items-center justify-center">
        <form onSubmit={handleUnlock} className="max-w-sm w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-5 shadow-2xl text-center">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Restricted Founder Portal</span>
          <h1 className="text-2xl font-extrabold text-white">UpLevel Labs Growth Console</h1>
          <p className="text-xs text-slate-400">50-State License Auto-Seeder & Campaign Hub.</p>
          <input 
            type="password" 
            placeholder="Enter Founder Passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white text-center"
          />
          <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl text-xs transition">
            Unlock Founder Console
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-5 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
          <div>
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">Founder / Admin Only • UpLevel Labs, Inc.</span>
            <h1 className="text-3xl font-extrabold text-white">50-State Contractor Registry Seeder & Campaign Hub</h1>
            <p className="text-xs text-slate-400 mt-1">
              Select any U.S. State and municipality (or leave blank for statewide) to auto-seed licensed contractors and monitor analytics.
            </p>
          </div>
          <Link href="/dashboard" className="bg-slate-900 border border-slate-800 hover:bg-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300">
            Contractor Dashboard ↗
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
          <button onClick={() => setActiveTab('50-state')} className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition ${activeTab === '50-state' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}>
            🌎 1. 50-State Contractor Registry Seeder
          </button>
          <button onClick={() => setActiveTab('email-builder')} className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition ${activeTab === 'email-builder' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}>
            📧 2. Visual Email Builder & Test Dispatcher
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition ${activeTab === 'analytics' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}>
            📈 3. Growth, Signups & Payment Analytics
          </button>
        </div>

        {/* TAB 1: 50-STATE CONTRACTOR REGISTRY SEEDER */}
        {activeTab === '50-state' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Active Source: {registrySource}</span>
                  <h3 className="text-xl font-extrabold text-white">Select Any U.S. State & Municipality</h3>
                  <p className="text-xs text-slate-400">Leave city blank to pull every licensed contractor across the entire state.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={handleExportCSV}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold px-4 py-3 rounded-xl whitespace-nowrap"
                  >
                    📥 Export CSV ({liveContractors.length})
                  </button>
                  <button 
                    onClick={handleExecuteResendCampaign}
                    disabled={dispatching}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold px-5 py-3 rounded-xl whitespace-nowrap shadow-lg"
                  >
                    {dispatching ? 'Dispatching via Resend...' : `🚀 Dispatch Resend Blast (${liveContractors.length} Pros)`}
                  </button>
                </div>
              </div>

              {dispatchResult && (
                <div className="bg-emerald-950/70 border border-emerald-500/50 p-4 rounded-xl text-emerald-300 text-xs font-bold text-center">
                  ✓ Successfully dispatched {dispatchResult.dispatchedCount} emails via Resend!
                </div>
              )}

              {/* State Selector Dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Select U.S. State</label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-bold"
                  >
                    {usStates.map(st => (
                      <option key={st} value={st}>{st} - State Licensing Board</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">City / Municipality (Leave blank for Statewide)</label>
                  <input 
                    type="text" 
                    value={cityQuery}
                    onChange={(e) => setCityQuery(e.target.value.toUpperCase())}
                    placeholder="Leave blank for Statewide..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Query Limit</label>
                  <div className="flex gap-2">
                    <select
                      value={fetchLimit}
                      onChange={(e) => setFetchLimit(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-bold"
                    >
                      <option value="250">250 Pros</option>
                      <option value="1000">1,000 Pros</option>
                      <option value="2500">2,500 Pros</option>
                      <option value="5000">5,000 Pros (Statewide)</option>
                    </select>
                    <button 
                      onClick={() => fetchContractors(selectedState, cityQuery, fetchLimit)}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-5 py-3 rounded-xl text-xs whitespace-nowrap"
                    >
                      {loadingRegistry ? 'Pulling...' : '🔍 Pull State Board'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Table */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h4 className="text-base font-extrabold text-white">
                Loaded Contractors in {cityQuery || `Statewide (${selectedState})`} ({liveContractors.length} Active Records)
              </h4>

              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {liveContractors.map((pro, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-white text-sm">{pro.businessName}</span>
                        <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-700/50 px-2.5 py-0.5 rounded-full font-mono">
                          {pro.licenseNumber}
                        </span>
                        <span className="text-xs text-slate-400">{pro.town}</span>
                      </div>
                      <p className="text-xs text-slate-400">Holder: {pro.contactName} • {pro.trade}</p>
                    </div>
                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => copyText(`st-${idx}`, pro.claimUrl)}
                        className="bg-slate-800 hover:bg-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl text-white whitespace-nowrap"
                      >
                        {copiedKey === `st-${idx}` ? '✓ Copied' : 'Copy Claim Link'}
                      </button>
                      <Link
                        href={`/profile/${pro.slug}?license=${encodeURIComponent(pro.licenseNumber)}&town=${encodeURIComponent(pro.town)}&claim=true`}
                        target="_blank"
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold px-4 py-2 rounded-xl whitespace-nowrap"
                      >
                        View Page ↗
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VISUAL EMAIL BUILDER & TEST DISPATCHER */}
        {activeTab === 'email-builder' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-lg font-extrabold text-white">Visual Email Builder & Test Dispatcher</h3>
              <p className="text-xs text-slate-400">Send a live test email to your own inbox to inspect the rendered design before blasting state database records.</p>
              
              <form onSubmit={handleSendTestEmail} className="flex flex-col sm:flex-row gap-3 pt-2">
                <input 
                  type="email" 
                  required
                  placeholder="Enter your email address to test..."
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white"
                />
                <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-xs transition whitespace-nowrap">
                  Send Test Email to Me 🚀
                </button>
              </form>

              {testStatus && (
                <div className="bg-slate-950 border border-blue-500/50 p-3 rounded-xl text-xs font-bold text-blue-300 text-center">
                  {testStatus}
                </div>
              )}
            </div>

            {/* Live Render Preview */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Live Inbox Visual Render</h3>
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 overflow-x-auto">
                <div dangerouslySetInnerHTML={{ __html: sampleHtml }} />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GROWTH, SIGNUPS & PAYMENT ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2 shadow-xl">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Registered Pros</span>
                <h3 className="text-3xl font-black text-white">0</h3>
                <p className="text-xs text-slate-500 font-bold">Waiting for first signup</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2 shadow-xl">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Daily Visitors (Today)</span>
                <h3 className="text-3xl font-black text-white">1</h3>
                <p className="text-xs text-blue-400 font-bold">Active Founder Session</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2 shadow-xl">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Active Pro Subscriptions</span>
                <h3 className="text-3xl font-black text-white">$0 <span className="text-xs text-slate-400 font-normal">/ mo</span></h3>
                <p className="text-xs text-slate-500 font-bold">Connected to Stripe Live</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2 shadow-xl">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Escrow Volume & Fees</span>
                <h3 className="text-3xl font-black text-white">$0</h3>
                <p className="text-xs text-emerald-400 font-bold">0% Direct Commission • 10% P2P Splits</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-white">Real-Time Contractor Signups & Utilization Ledger</h3>
                  <p className="text-xs text-slate-400">Live feed of verified contractors who complete onboarding on the homepage.</p>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
                  Awaiting First Live User
                </span>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl text-center text-slate-500 text-xs font-bold space-y-2">
                <p>No contractor signups recorded yet.</p>
                <p className="text-slate-400">When contractors submit the quick-start form on <Link href="/" className="text-blue-400 underline" target="_blank">joballies.com</Link>, their profile, business name, plan tier, and tool utilization will populate here instantly.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="max-w-6xl mx-auto w-full text-center border-t border-slate-800/80 pt-8 mt-16 text-xs text-slate-500">
        © {new Date().getFullYear()} JobAllies — Founder Growth Console (from UpLevel Labs, Inc.)
      </footer>
    </main>
  );
}
