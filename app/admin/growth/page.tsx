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
  email?: string;
}

export default function FounderGrowthConsole() {
  const [unlocked, setUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState<'seeder' | 'campaigns'>('seeder');
  
  const [selectedState, setSelectedState] = useState('CT');
  const [cityQuery, setCityQuery] = useState('WESTPORT');
  const [tradeFilter, setTradeFilter] = useState('ALL');
  const [fetchLimit, setFetchLimit] = useState('250');
  
  const [loadingRegistry, setLoadingRegistry] = useState(false);
  const [liveContractors, setLiveContractors] = useState<LiveContractor[]>([]);
  const [registrySource, setRegistrySource] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [campaignType, setCampaignType] = useState<'claim' | 'quote_request'>('claim');
  const [customScope, setCustomScope] = useState('Looking for a licensed professional for upcoming project work in the local area. Estimated budget: $3,500.');
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

  const tradesList = [
    "General Contractor", "Handyman", "Electrician", "Plumber", "Mason & Stonework", 
    "Carpenter", "HVAC Technician", "Landscaper", "Roofer", "Painter & Decorator", 
    "Drywall Installer", "Flooring & Tiler", "Driveway Paving", "Pool Maintenance"
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

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'uplevel2026') {
      setUnlocked(true);
      fetchContractors('CT', 'WESTPORT', 'ALL', '250');
    } else {
      alert('Invalid Founder Passcode.');
    }
  };

  const fetchContractors = async (state: string, targetCity: string, trade: string, limit: string) => {
    setLoadingRegistry(true);
    try {
      const res = await fetch(`/api/state-licenses?state=${state}&city=${encodeURIComponent(targetCity)}&limit=${limit}`);
      const data = await res.json();
      if (data.contractors) {
        let filtered = data.contractors;
        if (trade !== 'ALL') {
          filtered = filtered.filter((c: any) => c.trade.toLowerCase().includes(trade.toLowerCase()));
        }
        // Attach a mock test email if none exists so campaign dispatches work seamlessly
        const enhanced = filtered.map((c: any, idx: number) => ({
          ...c,
          email: c.email || `contractor_${idx}_${c.slug.substring(0, 8)}@example.com`
        }));
        setLiveContractors(enhanced);
        setRegistrySource(data.source || `${state} State Licensing Board`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRegistry(false);
    }
  };

  const handleExecuteCampaign = async () => {
    if (!confirm(`Are you sure you want to execute campaign "${campaignType}" for ${liveContractors.length} pros in ${cityQuery}, ${selectedState}?`)) return;
    setDispatching(true);
    setDispatchResult(null);
    try {
      const res = await fetch("/api/admin/dispatch-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractors: liveContractors,
          campaignType,
          customProjectScope: customScope,
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

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail) return;
    setTestStatus('Sending test email via Resend...');
    try {
      const res = await fetch('/api/admin/dispatch-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractors: [{ ...samplePro, email: testEmail, town: `${cityQuery}, ${selectedState}`, claimUrl: sampleClaimUrl }],
          campaignType,
          customProjectScope: customScope,
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
          <h1 className="text-2xl font-extrabold text-white">UpLevel Labs Marketing Hub</h1>
          <p className="text-xs text-slate-400">50-State Seeder & Targeted Trade Campaigns.</p>
          <input 
            type="password" 
            placeholder="Enter Founder Passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white text-center"
          />
          <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl text-xs transition">
            Unlock Marketing Hub
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
            <h1 className="text-3xl font-extrabold text-white">Targeted Trade Marketing & 50-State Seeder</h1>
            <p className="text-xs text-slate-400 mt-1">
              Filter by 50 U.S. States & specific trade types, test campaigns, and dispatch live Resend emails.
            </p>
          </div>
          <Link href="/dashboard" className="bg-slate-900 border border-slate-800 hover:bg-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300">
            Contractor Dashboard ↗
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
          <button onClick={() => setActiveTab('seeder')} className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition ${activeTab === 'seeder' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}>
            🌎 1. 50-State Seeder & Trade Filter
          </button>
          <button onClick={() => setActiveTab('campaigns')} className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition ${activeTab === 'campaigns' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}>
            🚀 2. Campaign Launcher & Visual Preview
          </button>
        </div>

        {/* TAB 1: 50-STATE SEEDER & TRADE FILTER */}
        {activeTab === 'seeder' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Active Source: {registrySource}</span>
                  <h3 className="text-xl font-extrabold text-white">Filter by State, Municipality & Trade</h3>
                </div>
                <span className="text-xs font-extrabold bg-blue-950 text-blue-400 px-3 py-1.5 rounded-xl border border-blue-800">
                  {liveContractors.length} Matching Pros Loaded
                </span>
              </div>

              {/* 50-State & Trade Filter Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Select U.S. State</label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-bold"
                  >
                    {usStates.map(st => (
                      <option key={st} value={st}>{st} - State Board</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">City / Town</label>
                  <input 
                    type="text" 
                    value={cityQuery}
                    onChange={(e) => setCityQuery(e.target.value.toUpperCase())}
                    placeholder="Enter City..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Specific Trade Type</label>
                  <select
                    value={tradeFilter}
                    onChange={(e) => setTradeFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-bold"
                  >
                    <option value="ALL">All Trades (Any)</option>
                    {tradesList.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={() => fetchContractors(selectedState, cityQuery, tradeFilter, fetchLimit)}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3 rounded-xl text-xs"
                  >
                    {loadingRegistry ? 'Filtering...' : '🔍 Pull & Filter Pros'}
                  </button>
                </div>
              </div>
            </div>

            {/* Results Table */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h4 className="text-base font-extrabold text-white">
                Filtered Results in {cityQuery}, {selectedState} ({liveContractors.length} Pros Ready)
              </h4>

              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {liveContractors.map((pro, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white text-sm">{pro.businessName}</span>
                        <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-700/50 px-2.5 py-0.5 rounded-full font-mono">
                          {pro.trade}
                        </span>
                        <span className="text-xs text-slate-400">{pro.town}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">License: {pro.licenseNumber} • Email: {pro.email}</p>
                    </div>
                    <Link
                      href={`/profile/${pro.slug}?license=${encodeURIComponent(pro.licenseNumber)}&town=${encodeURIComponent(pro.town)}&claim=true`}
                      target="_blank"
                      className="bg-slate-800 hover:bg-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl text-white whitespace-nowrap"
                    >
                      View Page ↗
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CAMPAIGN LAUNCHER & VISUAL PREVIEW */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-xl">
              <h3 className="text-xl font-extrabold text-white">Select & Launch Campaign</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setCampaignType('claim')}
                  className={`p-5 rounded-2xl border text-left transition space-y-2 ${campaignType === 'claim' ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                >
                  <div className="font-extrabold text-sm text-white">1. "Claim Your Profile Page & Digital Yard Sign"</div>
                  <p className="text-xs text-slate-300">Invites contractors to verify their state license and claim their pre-built local page.</p>
                </button>

                <button
                  onClick={() => setCampaignType('quote_request')}
                  className={`p-5 rounded-2xl border text-left transition space-y-2 ${campaignType === 'quote_request' ? 'bg-emerald-600/20 border-emerald-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                >
                  <div className="font-extrabold text-sm text-white">2. "There is a Local Quote Request for You"</div>
                  <p className="text-xs text-slate-300">Alerts pros in their exact trade that a homeowner in their town submitted a project.</p>
                </button>
              </div>

              {campaignType === 'quote_request' && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400">Homeowner Project Scope to Broadcast:</label>
                  <textarea
                    rows={3}
                    value={customScope}
                    onChange={(e) => setCustomScope(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white"
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleExecuteCampaign}
                  disabled={dispatching}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-8 py-4 rounded-2xl text-sm transition shadow-xl shadow-amber-500/25 flex-1"
                >
                  {dispatching ? 'Dispatching Campaign...' : `🚀 Blast Campaign to All ${liveContractors.length} Filtered Pros`}
                </button>
              </div>

              {dispatchResult && (
                <div className="bg-emerald-950/70 border border-emerald-500/50 p-4 rounded-xl text-emerald-300 text-xs font-bold text-center">
                  ✓ Successfully dispatched {dispatchResult.dispatchedCount} emails via Resend!
                </div>
              )}
            </div>

            {/* Test Dispatcher & Live Render */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-5">
              <h3 className="text-lg font-extrabold text-white">Test Send to Your Personal Email</h3>
              <form onSubmit={handleSendTest} className="flex gap-3">
                <input 
                  type="email" 
                  required
                  placeholder="Enter your email to test..."
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white"
                />
                <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-xl text-xs whitespace-nowrap">
                  Send Test 🚀
                </button>
              </form>
              {testStatus && <p className="text-xs font-bold text-blue-400 text-center">{testStatus}</p>}

              <div className="space-y-2 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Live Inbox Visual Preview</h4>
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 overflow-x-auto">
                  <div dangerouslySetInnerHTML={{ __html: campaignType === 'quote_request' ? `
                    <div style="font-family: sans-serif; background: #020617; color: #f8fafc; padding: 32px; border-radius: 24px;">
                      <div style="max-width: 600px; margin: 0 auto; background: #0f172a; padding: 32px; border-radius: 20px; border: 1px solid #1e293b;">
                        <div style="font-size: 14px; font-weight: 800; color: #3b82f6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                          JobAllies Instant Lead Radar (from UpLevel Labs, Inc.)
                        </div>
                        <h1 style="font-size: 24px; font-weight: 900; color: #ffffff; margin-top: 0; line-height: 1.3;">
                          New Local Quote Request for ${samplePro.businessName} (Mason)
                        </h1>
                        <p style="font-size: 15px; color: #94a3b8; line-height: 1.6;">Hi <strong>${samplePro.contactName}</strong>,</p>
                        <p style="font-size: 15px; color: #94a3b8; line-height: 1.6;">A homeowner in <strong>${samplePro.town}</strong> just submitted a project request matching your specialty (<strong>Mason</strong>):</p>
                        <div style="background: #1e293b; padding: 20px; border-radius: 14px; margin: 24px 0; border-left: 4px solid #10b981;">
                          <p style="margin: 0; font-size: 14px; color: #e2e8f0; font-weight: 600;">📋 Project Scope:</p>
                          <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 14px; line-height: 1.5;">"${customScope}"</p>
                        </div>
                        <div style="text-align: center; margin: 32px 0;">
                          <a href="${sampleClaimUrl}" style="background: #10b981; color: #020617; padding: 16px 32px; border-radius: 12px; font-weight: 800; text-decoration: none; display: inline-block; font-size: 15px;">Claim Lead & Send 30-Second Quote →</a>
                        </div>
                      </div>
                    </div>
                  ` : `
                    <div style="font-family: sans-serif; background: #020617; color: #f8fafc; padding: 32px; border-radius: 24px;">
                      <div style="max-width: 600px; margin: 0 auto; background: #0f172a; padding: 32px; border-radius: 20px; border: 1px solid #1e293b;">
                        <div style="font-size: 14px; font-weight: 800; color: #3b82f6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                          JobAllies Pro Network (from UpLevel Labs, Inc.)
                        </div>
                        <h1 style="font-size: 24px; font-weight: 900; color: #ffffff; margin-top: 0; line-height: 1.3;">
                          Active License Verification for ${samplePro.businessName}
                        </h1>
                        <p style="font-size: 15px; color: #94a3b8; line-height: 1.6;">Hi <strong>${samplePro.contactName}</strong>,</p>
                        <p style="font-size: 15px; color: #94a3b8; line-height: 1.6;">Because you hold active state license <strong>${samplePro.licenseNumber}</strong> in <strong>${samplePro.town}</strong>, we have pre-built your verified Digital Yard Sign.</p>
                        <div style="text-align: center; margin: 32px 0;">
                          <a href="${sampleClaimUrl}" style="background: #2563eb; color: #ffffff; padding: 16px 32px; border-radius: 12px; font-weight: 800; text-decoration: none; display: inline-block; font-size: 15px;">Claim Your Free Profile & Page →</a>
                        </div>
                      </div>
                    </div>
                  `}} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="max-w-6xl mx-auto w-full text-center border-t border-slate-800/80 pt-8 mt-16 text-xs text-slate-500">
        © {new Date().getFullYear()} JobAllies — Founder Marketing Hub (from UpLevel Labs, Inc.)
      </footer>
    </main>
  );
}
