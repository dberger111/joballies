'use client';
import { useState } from 'react';
import Link from 'next/link';

interface ProSeed {
  businessName: string;
  trade: string;
  town: string;
  phone: string;
  slug: string;
  status: 'Ready' | 'Invited';
}

export default function MassInvitePage() {
  const [campaignType, setCampaignType] = useState<'lead' | 'yard-sign' | 'crew'>('lead');
  const [bulkText, setBulkText] = useState(
    `Mike's Stonework & Masonry, Mason, Westport CT, (203) 555-0192\nDan Sparks Electrical, Electrician, Fairfield CT, (203) 555-0144\nRidgefield Pro Plumbing, Plumber, Ridgefield CT, (203) 555-0188\nSoundview HVAC & Cooling, HVAC, Norwalk CT, (203) 555-0165`
  );

  const [seededPros, setSeededPros] = useState<ProSeed[]>([
    { businessName: "Mike's Stonework & Masonry", trade: "Mason", town: "Westport CT", phone: "(203) 555-0192", slug: "mikes-stonework-masonry", status: "Ready" },
    { businessName: "Dan Sparks Electrical", trade: "Electrician", town: "Fairfield CT", phone: "(203) 555-0144", slug: "dan-sparks-electrical", status: "Ready" },
    { businessName: "Ridgefield Pro Plumbing", trade: "Plumber", town: "Ridgefield CT", phone: "(203) 555-0188", slug: "ridgefield-pro-plumbing", status: "Ready" },
    { businessName: "Soundview HVAC & Cooling", trade: "HVAC", town: "Norwalk CT", phone: "(203) 555-0165", slug: "soundview-hvac-cooling", status: "Ready" }
  ]);

  const [blastCount, setBlastCount] = useState(0);

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
        phone: parts[3] || '(203) 555-0100',
        slug,
        status: 'Ready'
      };
    });
    setSeededPros(parsed);
  };

  const getInviteMessage = (pro: ProSeed) => {
    if (campaignType === 'lead') {
      return `Hey ${pro.businessName} — A homeowner near ${pro.town} just requested a ${pro.trade} quote on JobAllies. Claim this job for free & send a 30-second Talk-to-Quote from your truck: https://joballies.com/profile/${pro.slug}?claim=lead`;
    }
    if (campaignType === 'yard-sign') {
      return `Hey ${pro.businessName} — We already set up your ${pro.town} ${pro.trade} Digital Yard Sign & local referral page on JobAllies so neighbors and local pros can send you work. Tap here to claim it free: https://joballies.com/profile/${pro.slug}?claim=true`;
    }
    return `Hey ${pro.businessName} — Local contractors in ${pro.town} want to add you as their go-to ${pro.trade} for overflow jobs (10% finder's fee split). Tap here to join the local crew: https://joballies.com/invite/${pro.slug}`;
  };

  const handleBlastAll = async () => {
    const updated = seededPros.map(p => ({ ...p, status: 'Invited' as const }));
    setSeededPros(updated);
    setBlastCount(updated.length);
    try {
      await fetch('/api/mass-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pros: updated, campaignType })
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-5 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-6 gap-4">
          <div>
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">Viral Growth Engine</span>
            <h1 className="text-3xl font-extrabold text-white">🚀 Mass-Invite Local Tradespeople</h1>
            <p className="text-xs text-slate-400 mt-1">
              Pre-build Digital Yard Signs for local contractors in bulk and send high-converting "Waiting Job / Claim Your Page" texts.
            </p>
          </div>
          <Link href="/dashboard" className="bg-slate-900 border border-slate-800 hover:bg-slate-800 px-4 py-2.5 rounded-xl text-slate-300 text-xs font-bold transition">
            ← Back to Truck Cab
          </Link>
        </div>

        {/* Step 1: Choose High-Converting Hook */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Step 1: Pick the Hook That Gets Instant Replies</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => setCampaignType('lead')}
              className={`p-4 rounded-2xl border text-left transition space-y-1 ${campaignType === 'lead' ? 'bg-amber-500/15 border-amber-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
            >
              <div className="font-extrabold text-sm text-white">🔥 1. "Waiting Local Job" Alert</div>
              <p className="text-xs text-slate-400">Alerts them a homeowner in their town needs their exact trade right now.</p>
            </button>

            <button 
              onClick={() => setCampaignType('yard-sign')}
              className={`p-4 rounded-2xl border text-left transition space-y-1 ${campaignType === 'yard-sign' ? 'bg-amber-500/15 border-amber-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
            >
              <div className="font-extrabold text-sm text-white">🏆 2. "Claim Pre-Built Yard Sign"</div>
              <p className="text-xs text-slate-400">Pre-generates their public portfolio URL & map so they claim it in 1 tap.</p>
            </button>

            <button 
              onClick={() => setCampaignType('crew')}
              className={`p-4 rounded-2xl border text-left transition space-y-1 ${campaignType === 'crew' ? 'bg-amber-500/15 border-amber-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
            >
              <div className="font-extrabold text-sm text-white">🤝 3. "Local Sub Crew Invite"</div>
              <p className="text-xs text-slate-400">Invites them to receive overflow work from non-competing pros in their zip code.</p>
            </button>
          </div>
        </div>

        {/* Step 2: Paste List of Contractors from State License CSV / Google Maps */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Step 2: Paste Local Pros (CSV: Business Name, Trade, Town, Phone)</span>
              <h3 className="text-lg font-extrabold text-white">Bulk Contractor List</h3>
            </div>
            <button 
              onClick={handleParseBulkList}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition"
            >
              ⚡ Auto-Build Pre-Seeded Pages
            </button>
          </div>

          <textarea
            rows={4}
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-200 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Step 3: Preview Pre-Built Profiles & Blast */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Step 3: Launch En Masse</span>
              <h3 className="text-xl font-extrabold text-white">Pre-Built Contractor Profiles ({seededPros.length} Pros Ready)</h3>
            </div>
            <button 
              onClick={handleBlastAll}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm px-6 py-3.5 rounded-2xl transition shadow-xl shadow-amber-500/20"
            >
              🚀 Send Automated Invites to All {seededPros.length} Pros
            </button>
          </div>

          {blastCount > 0 && (
            <div className="bg-emerald-950/60 border border-emerald-500/50 p-4 rounded-2xl text-emerald-300 text-xs font-bold text-center">
              ✓ {blastCount} Pre-Built Contractor Pages Activated & SMS Invites Queued via Twilio! Click any "Preview Page" below to see their live custom link.
            </div>
          )}

          <div className="space-y-3">
            {seededPros.map((pro, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-sm">{pro.businessName}</span>
                    <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full">{pro.trade}</span>
                    <span className="text-xs text-slate-400">{pro.town} • {pro.phone}</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${pro.status === 'Invited' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {pro.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80">
                    {getInviteMessage(pro)}
                  </p>
                </div>
                <div className="flex items-center gap-2 self-end md:self-center">
                  <Link 
                    href={`/profile/${pro.slug}`} 
                    target="_blank"
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2.5 rounded-xl transition whitespace-nowrap"
                  >
                    Preview Page ↗
                  </Link>
                  <a 
                    href={`sms:${pro.phone.replace(/[^0-9]/g, '')}?&body=${encodeURIComponent(getInviteMessage(pro))}`}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition whitespace-nowrap"
                  >
                    📲 Text Direct
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="max-w-5xl mx-auto w-full text-center border-t border-slate-800/80 pt-8 mt-16 text-xs text-slate-500">
        © {new Date().getFullYear()} JobAllies — All rights reserved. (from UpLevel Labs, Inc.)
      </footer>
    </main>
  );
}
