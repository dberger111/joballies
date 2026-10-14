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
  const [activeTab, setActiveTab] = useState<'live-ct' | 'all-states' | 'campaigns' | 'qr'>('live-ct');
  const [cityQuery, setCityQuery] = useState('WESTPORT');
  const [loadingRegistry, setLoadingRegistry] = useState(false);
  const [liveContractors, setLiveContractors] = useState<LiveContractor[]>([]);
  const [registrySource, setRegistrySource] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'uplevel2026') {
      setUnlocked(true);
      fetchCTContractors('WESTPORT');
    } else {
      alert('Invalid Founder Passcode.');
    }
  };

  const fetchCTContractors = async (targetCity: string) => {
    setLoadingRegistry(true);
    try {
      const res = await fetch(`/api/state-licenses?state=CT&city=${encodeURIComponent(targetCity)}&limit=50`);
      const data = await res.json();
      if (data.contractors) {
        setLiveContractors(data.contractors);
        setRegistrySource(data.source || 'State of Connecticut Open Data API');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRegistry(false);
    }
  };

  const handleExportCTCSV = () => {
    const headers = ['Business Name', 'License Holder Name', 'CT License Number', 'Trade', 'Town', 'Pre-Built Claim URL', 'Ready-to-Send Outreach Message'];
    const rows = liveContractors.map((c) => {
      const msg = `Hi ${c.contactName || c.businessName} — Because you hold active CT license ${c.licenseNumber} in ${c.town}, we pre-built your Digital Yard Sign & homeowner quote catcher on JobAllies. Claim your page free in 15 seconds: ${c.claimUrl}`;
      return [c.businessName, c.contactName, c.licenseNumber, c.trade, c.town, c.claimUrl, msg]
        .map(v => `"${String(v || '').replace(/"/g, '""')}"`)
        .join(',');
    });
    const csv = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', `CT_Licensed_Contractors_${cityQuery}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const ctTowns = ['WESTPORT', 'WESTON', 'FAIRFIELD', 'STAMFORD', 'NORWALK', 'GREENWICH', 'DARIEN', 'NEW CANAAN', 'RIDGEFIELD', 'WILTON', 'DANBURY', 'NEW HAVEN', 'HARTFORD'];

  const statePortals = [
    { state: 'Connecticut (CT)', status: 'Live Socrata API Connected', count: '135,000+ Licenses', url: 'https://data.ct.gov/Business/Home-Improvement-Contractor-Licenses-Includes-Acti/5r9m-qgni', notes: 'Live 1-click pull active in Tab 1 via data.ct.gov' },
    { state: 'New York (NY)', status: 'Open Data + County Registries', count: '95,000+ Licenses', url: 'https://data.ny.gov', notes: 'Westchester, Nassau, Suffolk & NYC DOB bulk CSVs available' },
    { state: 'California (CA)', status: 'CSLB Public Data Portal', count: '285,000+ Licenses', url: 'https://www.cslb.ca.gov/onlineservices/dataportal/', notes: 'Includes business phone numbers & bond status in bulk CSV/Excel download' },
    { state: 'Texas (TX)', status: 'TDLR Socrata Open Data API', count: '190,000+ Licenses', url: 'https://data.texas.gov', notes: 'Electricians, HVAC (ACR), and Plumbers available via REST API & CSV' },
    { state: 'Florida (FL)', status: 'DBPR Bulk License Roster', count: '240,000+ Licenses', url: 'https://www2.myfloridalicense.com/construction-industry/public-records/', notes: 'Free daily CSV download of all Certified General, Electrical & Plumbing pros' },
    { state: 'New Jersey (NJ)', status: 'NJ DCA Home Improvement Roster', count: '110,000+ Licenses', url: 'https://newjersey.mylicense.com/verification/', notes: 'Statewide HIC, Electrical & Master Plumber registry' }
  ];

  if (!unlocked) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 flex items-center justify-center">
        <form onSubmit={handleUnlock} className="max-w-sm w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-5 shadow-2xl text-center">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Restricted Founder Portal</span>
          <h1 className="text-2xl font-extrabold text-white">UpLevel Labs Growth Console</h1>
          <p className="text-xs text-slate-400">Live State License Auto-Seeder & First 2,000 Users Acquisition Engine.</p>
          <input 
            type="password" 
            placeholder="Enter Founder Passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white text-center"
          />
          <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl text-xs transition">
            Unlock Founder Growth Console
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
            <h1 className="text-3xl font-extrabold text-white">State License Auto-Seeder & 2,000-User Engine</h1>
            <p className="text-xs text-slate-400 mt-1">
              Connected live to the State of Connecticut eLicense Open Data API (`data.ct.gov`) + 50-State Bulk Seeder.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard" className="bg-slate-900 border border-slate-800 hover:bg-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300">
              Contractor Dashboard ↗
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
          <button onClick={() => setActiveTab('live-ct')} className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition ${activeTab === 'live-ct' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}>
            ⚡ 1. Live Connecticut State License Pull (data.ct.gov API)
          </button>
          <button onClick={() => setActiveTab('all-states')} className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition ${activeTab === 'all-states' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}>
            🌎 2. 50-State Bulk Registry Hubs (CA, FL, TX, NY, NJ)
          </button>
          <button onClick={() => setActiveTab('campaigns')} className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition ${activeTab === 'campaigns' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}>
            📣 3. UTM Links & Cold Outreach Scripts
          </button>
        </div>

        {/* TAB 1: LIVE CONNECTICUT SOCRATA API PULL */}
        {activeTab === 'live-ct' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Live Official Government Feed: {registrySource}</span>
                  <h3 className="text-xl font-extrabold text-white">Pull Active Licensed Contractors by Connecticut Town</h3>
                  <p className="text-xs text-slate-400">Click any town below (or type any CT municipality) to pull real active licensed pros and pre-build their live JobAllies pages.</p>
                </div>
                <button 
                  onClick={handleExportCTCSV}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold px-5 py-3 rounded-xl whitespace-nowrap shadow-lg"
                >
                  📥 Export {cityQuery} Pros CSV ({liveContractors.length})
                </button>
              </div>

              {/* Quick Town Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {ctTowns.map((town) => (
                  <button
                    key={town}
                    onClick={() => { setCityQuery(town); fetchCTContractors(town); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                      cityQuery === town 
                        ? 'bg-amber-500 text-slate-950 border-amber-400' 
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    {town}
                  </button>
                ))}
              </div>

              {/* Custom Town Input */}
              <div className="flex gap-3 pt-2">
                <input 
                  type="text" 
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value.toUpperCase())}
                  placeholder="Type any CT Town (e.g., TRUMBULL, MONROE, GREENWICH)..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono"
                />
                <button 
                  onClick={() => fetchCTContractors(cityQuery)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-6 py-3 rounded-xl text-xs"
                >
                  {loadingRegistry ? 'Pulling State API...' : '🔍 Pull Live CT Registry'}
                </button>
              </div>
            </div>

            {/* Results Table */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-base font-extrabold text-white">
                  Pre-Populated Contractor Pages in {cityQuery}, CT ({liveContractors.length} Active Pros Loaded)
                </h4>
                <span className="text-xs text-slate-400">Every page below has the Live Homeowner Quote Catcher active</span>
              </div>

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
                      <p className="text-xs text-slate-400">
                        License Holder: <strong className="text-slate-200">{pro.contactName}</strong> • Status: {pro.status}
                      </p>
                      <p className="text-[11px] font-mono text-blue-400 break-all">{pro.claimUrl}</p>
                    </div>
                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => copyText(`ct-${idx}`, pro.claimUrl)}
                        className="bg-slate-800 hover:bg-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl text-white whitespace-nowrap"
                      >
                        {copiedKey === `ct-${idx}` ? '✓ Claim URL Copied' : 'Copy Claim Link'}
                      </button>
                      <Link
                        href={`/profile/${pro.slug}?license=${encodeURIComponent(pro.licenseNumber)}&town=${encodeURIComponent(pro.town)}&claim=true`}
                        target="_blank"
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold px-4 py-2 rounded-xl whitespace-nowrap"
                      >
                        Open Pre-Built Page ↗
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 50-STATE BULK REGISTRY HUBS */}
        {activeTab === 'all-states' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-white">50-State Licensed Contractor Data Portals</h3>
              <p className="text-xs text-slate-400 mt-1">
                California (CSLB), Florida (DBPR), and Texas (TDLR) publish downloadable bulk CSVs that include phone numbers, addresses, and license classifications.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {statePortals.map((s, i) => (
                <div key={i} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-white text-base">{s.state}</span>
                      <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-700/40">{s.count}</span>
                    </div>
                    <p className="text-xs text-emerald-400 font-bold">{s.status}</p>
                    <p className="text-xs text-slate-400">{s.notes}</p>
                  </div>
                  <div className="pt-3">
                    <a href={s.url} target="_blank" className="text-xs font-extrabold text-blue-400 hover:underline">
                      Open Official State Data Portal ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CAMPAIGNS & SCRIPTS */}
        {activeTab === 'campaigns' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <h3 className="text-lg font-extrabold text-white">High-Converting "Claim Your Pre-Built License Page" Outreach Script</h3>
            <pre className="text-xs text-slate-200 bg-slate-950 p-5 rounded-2xl border border-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
{`Subject: Homeowner quote requests for {{Business_Name}} (CT License #{{License_Number}})

Hi {{Contact_Name}},

Because you hold active Connecticut license #{{License_Number}} in {{Town}}, we pre-built your verified Digital Yard Sign and local quote catcher on JobAllies:
{{Claim_URL}}

When homeowners or other local pros in {{Town}} need a contractor, they can send project requests straight to your page—and you can reply from your truck in 30 seconds using our Talk-to-Quote voice tool.

Tap here to verify your phone/email in 15 seconds and claim your free page:
{{Claim_URL}}

— JobAllies Local Trade Network (from UpLevel Labs, Inc.)`}
            </pre>
          </div>
        )}
      </div>

      <footer className="max-w-6xl mx-auto w-full text-center border-t border-slate-800/80 pt-8 mt-16 text-xs text-slate-500">
        © {new Date().getFullYear()} JobAllies — Internal Founder Growth Console (from UpLevel Labs, Inc.)
      </footer>
    </main>
  );
}
