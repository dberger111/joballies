'use client';
import { useState } from 'react';
import Link from 'next/link';

interface ProSeed {
  businessName: string;
  trade: string;
  town: string;
  email: string;
  phone: string;
  slug: string;
  status: 'Seeded & Live' | 'Campaign Dispatched';
}

export default function FounderGrowthConsole() {
  const [unlocked, setUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState<'seeder' | 'campaigns' | 'qr' | 'webhooks'>('seeder');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [bulkText, setBulkText] = useState(
    `Mike's Stonework & Masonry, Mason, Westport CT, mike@westportmasonry.com, (203) 555-0192\nDan Sparks Electrical, Electrician, Fairfield CT, dan@sparkselectricct.com, (203) 555-0144\nRidgefield Pro Plumbing, Plumber, Ridgefield CT, info@ridgefieldplumbing.com, (203) 555-0188\nSoundview HVAC & Cooling, HVAC, Norwalk CT, service@soundviewhvac.com, (203) 555-0165\nNew Canaan Custom Carpentry, Carpenter, New Canaan CT, rob@nccarpentry.com, (203) 555-0177\nGreenwich Estate Landscaping, Landscaper, Greenwich CT, office@greenwichland.com, (203) 555-0131`
  );

  const [seededPros, setSeededPros] = useState<ProSeed[]>([
    { businessName: "Mike's Stonework & Masonry", trade: "Mason", town: "Westport CT", email: "mike@westportmasonry.com", phone: "(203) 555-0192", slug: "mikes-stonework-masonry", status: "Seeded & Live" },
    { businessName: "Dan Sparks Electrical", trade: "Electrician", town: "Fairfield CT", email: "dan@sparkselectricct.com", phone: "(203) 555-0144", slug: "dan-sparks-electrical", status: "Seeded & Live" },
    { businessName: "Ridgefield Pro Plumbing", trade: "Plumber", town: "Ridgefield CT", email: "info@ridgefieldplumbing.com", phone: "(203) 555-0188", slug: "ridgefield-pro-plumbing", status: "Seeded & Live" },
    { businessName: "Soundview HVAC & Cooling", trade: "HVAC", town: "Norwalk CT", email: "service@soundviewhvac.com", phone: "(203) 555-0165", slug: "soundview-hvac-cooling", status: "Seeded & Live" },
    { businessName: "New Canaan Custom Carpentry", trade: "Carpenter", town: "New Canaan CT", email: "rob@nccarpentry.com", phone: "(203) 555-0177", slug: "new-canaan-custom-carpentry", status: "Seeded & Live" },
    { businessName: "Greenwich Estate Landscaping", trade: "Landscaper", town: "Greenwich CT", email: "office@greenwichland.com", phone: "(203) 555-0131", slug: "greenwich-estate-landscaping", status: "Seeded & Live" }
  ]);

  const [dispatchedCount, setDispatchedCount] = useState(0);
  const [supplyHouseName, setSupplyHouseName] = useState("Ring's End / Ferguson Pro Counter - Fairfield County");
  const [qrCodeSlug, setQrCodeSlug] = useState("fairfield-pro-counter");

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'uplevel2026') {
      setUnlocked(true);
    } else {
      alert('Invalid Founder Passcode.');
    }
  };

  const handleParseBulkList = () => {
    const lines = bulkText.split('\n').filter(l => l.trim().length > 0);
    const parsed: ProSeed[] = lines.map((line) => {
      const parts = line.split(',').map(p => p.trim());
      const bName = parts[0] || 'Local Trade Pro';
      const slug = bName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return {
        businessName: bName,
        trade: parts[1] || 'Contractor',
        town: parts[2] || 'Fairfield County, CT',
        email: parts[3] || 'owner@contractor.com',
        phone: parts[4] || '(203) 555-0100',
        slug,
        status: 'Seeded & Live'
      };
    });
    setSeededPros(parsed);
  };

  const handleDownloadOutreachCSV = () => {
    const headers = ['Business Name', 'Trade', 'Town', 'Email', 'Phone', 'Pre-Built Profile URL', 'Claim URL with UTM', 'Suggested Email Subject', 'Suggested SMS/Email Body'];
    const rows = seededPros.map(p => {
      const profileUrl = `https://joballies.com/profile/${p.slug}`;
      const claimUrl = `https://joballies.com/profile/${p.slug}?claim=true&utm_source=founder_outreach&utm_campaign=directory_seed`;
      const subject = `Homeowner quote requests & your ${p.town} ${p.trade} page on JobAllies`;
      const body = `Hi ${p.businessName} — We pre-built your ${p.town} ${p.trade} Digital Yard Sign & local referral profile on JobAllies so local homeowners and allied contractors can send you overflow work. Claim your free page & test the 30-second Talk-to-Quote tool here: ${claimUrl}`;
      return [p.businessName, p.trade, p.town, p.email, p.phone, profileUrl, claimUrl, subject, body]
        .map(field => `"${String(field).replace(/"/g, '""')}"`)
        .join(',');
    });
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'joballies_mass_outreach_campaign.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePlatformBlast = async () => {
    const updated = seededPros.map(p => ({ ...p, status: 'Campaign Dispatched' as const }));
    setSeededPros(updated);
    setDispatchedCount(updated.length);
    await fetch('/api/mass-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pros: updated, campaignType: 'founder_directory_seed' })
    });
  };

  const utmLinks = [
    { label: "Contractor Cold Email / Directory Claim Link", url: "https://joballies.com/auth/signup?utm_source=cold_email&utm_medium=email&utm_campaign=claim_yard_sign" },
    { label: "Facebook & Instagram Contractor Ads (Talk-to-Quote Hook)", url: "https://joballies.com/auth/signup?utm_source=meta_ads&utm_medium=paid_social&utm_campaign=talk_to_quote_30s" },
    { label: "Homeowner Project Intake Link (For Local FB Town Groups)", url: "https://joballies.com/post-project?utm_source=fb_town_groups&utm_medium=organic&utm_campaign=local_homeowner_request" },
    { label: "Supply House Counter QR / VIP Fast-Pass Link", url: `https://joballies.com/invite/${qrCodeSlug}?utm_source=supply_house&utm_medium=qr_flyer` },
    { label: "Sample Public Digital Yard Sign (Demo Link for Investors/Pros)", url: "https://joballies.com/profile/sample-contractor?utm_source=founder_demo" }
  ];

  const marketingScripts = [
    {
      title: "1. Cold Email to State-Licensed Contractors (80%+ Open Rate Subject)",
      subject: "Quick question re: {{Business_Name}} / overflow {{Trade}} jobs in {{Town}}",
      body: `Hey {{First_Name}},

We just launched the Fairfield County trade network on JobAllies, and we already set up your pre-built Digital Yard Sign & local service radius page for {{Business_Name}} here:
https://joballies.com/profile/{{Slug}}?claim=true

Two reasons local pros are claiming their page (takes 20 seconds, $0 cost):
1. Local subs in other trades (plumbers, electricians, GCs) use JobAllies to pass out-of-scope homeowner leads and split a 10% finder's fee.
2. You get our "Talk-to-Quote" truck-cab tool—tap the mic, speak your job notes in 20 seconds, and text a clean estimate before you pull out of the driveway.

Tap here to verify your cell/email and lock in your {{Town}} territory:
https://joballies.com/profile/{{Slug}}?claim=true

Best,
JobAllies Local Trade Network (from UpLevel Labs, Inc.)`
    },
    {
      title: "2. Official Platform SMS Alert (Twilio A2P Compliant — Waiting Lead / Territory Claim)",
      subject: "SMS Campaign Copy (160 chars)",
      body: `JobAllies: Hi {{Business_Name}}, we set up your {{Town}} {{Trade}} page & Talk-to-Quote tool. Claim your free profile & local leads: https://joballies.com/profile/{{Slug}} Reply STOP to opt out.`
    },
    {
      title: "3. Local Town Facebook Group Seeding Post (Weston / Westport / Fairfield Moms & Neighbors)",
      subject: "Post in Local Homeowner Groups to Generate Free Inbound Leads",
      body: `Neighbors — if anyone is looking for a reliable local electrician, plumber, mason, or handyman around Fairfield County who actually shows up and gives clear upfront pricing, check out the local verified pros on JobAllies (https://joballies.com/post-project). You can post what you need in 30 seconds or browse local pros with verified neighbor reviews.`
    },
    {
      title: "4. Supply House Counter Manager Pitch (Ferguson / Ring's End / SiteOne)",
      subject: "Partner Pitch for Counter QR Stand",
      body: `Hey Manager — Our local contractors use JobAllies to turn their spoken jobsite notes into clean Home Depot / Supply House SKU order pads so they come to your counter with exact part numbers and quantities ready to go. Can we leave this free '30-Second Talk-to-Quote' QR pass on the Pro Counter for your regulars?`
    }
  ];

  if (!unlocked) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 flex items-center justify-center">
        <form onSubmit={handleUnlock} className="max-w-sm w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-5 shadow-2xl text-center">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Restricted Founder Portal</span>
          <h1 className="text-2xl font-extrabold text-white">UpLevel Labs Growth Console</h1>
          <p className="text-xs text-slate-400">Internal platform marketing, state license seeding, and acquisition hub. Hidden from regular users.</p>
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
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
          <div>
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">Founder / Admin Only • UpLevel Labs, Inc.</span>
            <h1 className="text-3xl font-extrabold text-white">Master Growth, Data & Acquisition Command Center</h1>
            <p className="text-xs text-slate-400 mt-1">
              Bulk-seed SEO contractor pages, export CRM outreach CSVs, grab tracked UTM links, and print Supply House QR flyers.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard" className="bg-slate-900 border border-slate-800 hover:bg-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300">
              View Contractor Dashboard ↗
            </Link>
            <Link href="/" className="bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-xl text-xs font-bold text-white">
              Public Home Page ↗
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
          <button onClick={() => setActiveTab('seeder')} className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition ${activeTab === 'seeder' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}>
            1. State License Seeder & CSV Exporter
          </button>
          <button onClick={() => setActiveTab('campaigns')} className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition ${activeTab === 'campaigns' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}>
            2. UTM Links & Cold Outreach Playbooks
          </button>
          <button onClick={() => setActiveTab('qr')} className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition ${activeTab === 'qr' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}>
            3. Supply House QR Flyer Generator
          </button>
          <button onClick={() => setActiveTab('webhooks')} className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition ${activeTab === 'webhooks' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}>
            4. Webhooks, Chrome Extension & SEO Links
          </button>
        </div>

        {/* TAB 1: STATE LICENSE SEEDER & CSV EXPORTER */}
        {activeTab === 'seeder' && (
          <div className="space-y-6">
            {/* Public Data Sources Box */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-base font-extrabold text-white">Public Contractor License Databases (Free Bulk Lead Sources)</h3>
              <p className="text-xs text-slate-400">
                Download public contractor rosters from these official state portals or Google Maps scrapers (Apify / Outscraper), then paste them below to pre-build their JobAllies pages and export your Mailchimp/Instantly outreach CSV.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <a href="https://www.elicense.ct.gov/Lookup/LicenseLookup.aspx" target="_blank" className="bg-slate-950 border border-slate-800 hover:border-amber-400 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-400">
                  CT DCP eLicense Roster (HIC / Electrical / Plumbing) ↗
                </a>
                <a href="https://data.ct.gov/" target="_blank" className="bg-slate-950 border border-slate-800 hover:border-amber-400 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-400">
                  CT Open Data Portal (Bulk CSV Export) ↗
                </a>
                <a href="https://appext20.dos.ny.gov/nydos/selSearchType.do" target="_blank" className="bg-slate-950 border border-slate-800 hover:border-blue-400 px-3.5 py-2 rounded-xl text-xs font-bold text-blue-400">
                  NY State License Lookup ↗
                </a>
                <a href="https://newjersey.mylicense.com/verification/" target="_blank" className="bg-slate-950 border border-slate-800 hover:border-blue-400 px-3.5 py-2 rounded-xl text-xs font-bold text-blue-400">
                  NJ DCA Contractor Roster ↗
                </a>
                <a href="https://www.google.com/maps/search/contractors+in+Fairfield+County+CT" target="_blank" className="bg-slate-950 border border-slate-800 hover:border-emerald-400 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-400">
                  Google Maps Fairfield County Pro Query ↗
                </a>
              </div>
            </div>

            {/* Bulk CSV Parser */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-white">Paste Contractor CSV (Business Name, Trade, Town, Email, Phone)</h3>
                  <p className="text-xs text-slate-400">Automatically generates SEO URLs (/profile/[slug]) and prepares personalized claim links.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleParseBulkList} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl">
                    ⚡ Generate Pre-Built Pages
                  </button>
                  <button onClick={handleDownloadOutreachCSV} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl">
                    📥 Export CSV for Instantly / Mailchimp
                  </button>
                </div>
              </div>
              <textarea
                rows={5}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-200"
              />
            </div>

            {/* Seeded Table & Blast */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-white">Pre-Seeded Contractor Profiles ({seededPros.length} Live Pages)</h3>
                  <p className="text-xs text-slate-400">Every contractor below now has a live landing page ready to claim.</p>
                </div>
                <button onClick={handlePlatformBlast} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-lg">
                  🚀 Queue Official Platform Claim Emails/SMS
                </button>
              </div>

              {dispatchedCount > 0 && (
                <div className="bg-emerald-950/60 border border-emerald-500/50 p-4 rounded-xl text-emerald-300 text-xs font-bold text-center">
                  ✓ {dispatchedCount} Contractor Pages Indexed & Official Platform Claim Campaign Queued!
                </div>
              )}

              <div className="space-y-2.5">
                {seededPros.map((pro, idx) => {
                  const claimUrl = `https://joballies.com/profile/${pro.slug}?claim=true`;
                  return (
                    <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{pro.businessName}</span>
                          <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">{pro.trade}</span>
                          <span className="text-xs text-emerald-400 font-bold">{pro.status}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{pro.town} • {pro.email} • {pro.phone}</p>
                        <p className="text-[11px] font-mono text-blue-400 mt-1">{claimUrl}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => copyText(`claim-${idx}`, claimUrl)}
                          className="bg-slate-800 hover:bg-slate-700 text-xs font-bold px-3 py-2 rounded-lg text-slate-200"
                        >
                          {copiedKey === `claim-${idx}` ? "✓ Link Copied" : "Copy Claim Link"}
                        </button>
                        <Link href={`/profile/${pro.slug}`} target="_blank" className="bg-blue-600/20 border border-blue-500/40 text-blue-300 hover:bg-blue-600/30 text-xs font-bold px-3 py-2 rounded-lg">
                          Preview Page ↗
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: UTM LINKS & COLD OUTREACH PLAYBOOKS */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-lg font-extrabold text-white">Tracked UTM Marketing Links (Ready for Ads, Emails & Social)</h3>
              <div className="space-y-3">
                {utmLinks.map((item, i) => (
                  <div key={i} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <p className="text-xs font-bold text-white">{item.label}</p>
                      <p className="text-xs font-mono text-amber-400 mt-1 break-all">{item.url}</p>
                    </div>
                    <button 
                      onClick={() => copyText(`utm-${i}`, item.url)}
                      className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap"
                    >
                      {copiedKey === `utm-${i}` ? "✓ Copied!" : "Copy Link"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {marketingScripts.map((script, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="text-sm font-extrabold text-amber-400">{script.title}</h4>
                    <p className="text-xs font-bold text-slate-300 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
                      Subject / Context: {script.subject}
                    </p>
                    <pre className="text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
                      {script.body}
                    </pre>
                  </div>
                  <button 
                    onClick={() => copyText(`script-${idx}`, script.body)}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold py-3 rounded-xl w-full transition"
                  >
                    {copiedKey === `script-${idx}` ? "✓ Script Copied to Clipboard!" : "📋 Copy Script Body"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SUPPLY HOUSE COUNTER QR FLYER GENERATOR */}
        {activeTab === 'qr' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-lg font-extrabold text-white">Customize Supply House Counter Flyer</h3>
              <p className="text-xs text-slate-400">
                Print this card or leave it on the Pro Desk counter at Ring's End, Ferguson, SiteOne, Gault Stone, or Home Depot Pro. Contractors waiting for materials scan the QR code and onboard in 30 seconds.
              </p>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Supply House / Branch Location Label</label>
                <input 
                  type="text" 
                  value={supplyHouseName} 
                  onChange={(e) => setSupplyHouseName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Invite Referral Tracking Code</label>
                <input 
                  type="text" 
                  value={qrCodeSlug} 
                  onChange={(e) => setQrCodeSlug(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono"
                />
              </div>
              <button 
                onClick={() => window.print()}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3.5 rounded-xl text-xs transition"
              >
                🖨️ Print Counter Card / Save as PDF
              </button>
            </div>

            {/* Printable Flyer Preview */}
            <div className="bg-white text-slate-950 p-8 rounded-3xl shadow-2xl space-y-6 text-center border-4 border-amber-400">
              <div className="inline-block bg-slate-950 text-amber-400 text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full">
                {supplyHouseName}
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
                Stop Typing Quotes at Night.
              </h2>
              <p className="text-sm text-slate-700 max-w-sm mx-auto font-medium">
                Speak your job notes from the front seat of your truck. Send a clean homeowner quote in 30 seconds & get paid 10% finder's fees for passing overflow jobs to local subs.
              </p>
              <div className="flex justify-center py-2">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://joballies.com/invite/${qrCodeSlug}`)}`} 
                  alt="JobAllies Pro Pass QR Code" 
                  className="w-44 h-44 rounded-2xl border-4 border-slate-900 p-2"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Scan Camera to Claim Free 30-Day Pro Pass</p>
                <p className="text-xs font-mono text-slate-600">joballies.com/invite/{qrCodeSlug}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: WEBHOOKS, CHROME EXTENSION & SEO DIRECTORY */}
        {activeTab === 'webhooks' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-lg font-extrabold text-white">Master Lead Ingestion Webhook Endpoints</h3>
              <p className="text-xs text-slate-400">
                Connect your master Facebook Lead Ads, Google Local Services Ads, Apify scrapers, or Zapier/Make flows to push leads into the JobAllies radar for all local pros:
              </p>
              <div className="space-y-2 font-mono text-xs">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-emerald-400">POST https://joballies.com/api/webhooks/leads?source=master_pool</span>
                  <button onClick={() => copyText('wh-1', 'https://joballies.com/api/webhooks/leads?source=master_pool')} className="bg-slate-800 px-3 py-1 rounded text-white font-sans font-bold">
                    {copiedKey === 'wh-1' ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-blue-400">POST https://joballies.com/api/webhooks/leads?source=thumbtack</span>
                  <button onClick={() => copyText('wh-2', 'https://joballies.com/api/webhooks/leads?source=thumbtack')} className="bg-slate-800 px-3 py-1 rounded text-white font-sans font-bold">
                    {copiedKey === 'wh-2' ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-orange-400">POST https://joballies.com/api/webhooks/leads?source=angi</span>
                  <button onClick={() => copyText('wh-3', 'https://joballies.com/api/webhooks/leads?source=angi')} className="bg-slate-800 px-3 py-1 rounded text-white font-sans font-bold">
                    {copiedKey === 'wh-3' ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-lg font-extrabold text-white">High-Intent SEO Trade Landing Pages (Shareable in Local Directories)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {['electrician', 'plumber', 'mason', 'hvac', 'carpenter', 'roofer', 'painter', 'landscaper', 'handyman', 'general-contractor', 'excavation', 'flooring'].map((trade) => (
                  <Link 
                    key={trade} 
                    href={`/trades/${trade}`} 
                    target="_blank"
                    className="bg-slate-950 border border-slate-800 hover:border-blue-500 p-3 rounded-xl font-bold text-slate-200 capitalize flex justify-between items-center"
                  >
                    <span>{trade.replace('-', ' ')}</span>
                    <span className="text-blue-400">↗</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="max-w-6xl mx-auto w-full text-center border-t border-slate-800/80 pt-8 mt-16 text-xs text-slate-500">
        © {new Date().getFullYear()} JobAllies — Internal Founder Growth Console (from UpLevel Labs, Inc.)
      </footer>
    </main>
  );
}
