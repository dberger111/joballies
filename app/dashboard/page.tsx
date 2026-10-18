'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteFooter from '../components/SiteFooter';
import FeedbackWidget from '../components/FeedbackWidget';
import Logo from '../components/Logo';

interface CustomField {
  id: string;
  label: string;
  amount: number;
}

interface LeadItem {
  id: string;
  source: string;
  datePosted: string;
  timePosted: string;
  trade: string;
  town: string;
  budget: string;
  scope: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  isTradespersonLead: boolean;
  autoQuote: {
    laborHours: number;
    laborRate: number;
    materialsCost: number;
    customFields: CustomField[];
    total: number;
  };
  personalNote: string;
  tradeMessage: string; // Editable message for tradesperson leads
  status: 'New' | 'Quote Generated' | 'Sent via Platform' | 'Accepted by Prospect' | 'Message Dispatched';
  wizardStep: number;
}

interface SavedQuote {
  id: string;
  leadId: string;
  clientName: string;
  scope: string;
  total: number;
  dateSent: string;
  status: string;
}

interface TradeAlly {
  id: string;
  name: string;
  trade: string;
  phone: string;
}

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState({
    name: 'Mike Johnson',
    trade: 'General Contractor',
    location: 'Weston, CT',
    licenseNumber: 'HIC.0649281',
    email: 'mike@joballies.com',
    phone: '+12035550199'
  });

  const [homeownerLeads, setHomeownerLeads] = useState<LeadItem[]>([]);
  const [tradespersonLeads, setTradespersonLeads] = useState<LeadItem[]>([]);
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([]);
  const [loading, setLoading] = useState(true);

  const [allies, setAllies] = useState<TradeAlly[]>([]);
  const [allyName, setAllyName] = useState('');
  const [allyTrade, setAllyTrade] = useState('Plumber');
  const [allyPhone, setAllyPhone] = useState('');

  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldAmount, setNewFieldAmount] = useState<number>(150);

  useEffect(() => {
    let resolvedTrade = 'General Contractor';
    let resolvedTown = 'Weston, CT';

    try {
      const saved = localStorage.getItem('joballies_temp_user') || localStorage.getItem('joballies_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.trade) resolvedTrade = parsed.trade;
        if (parsed.location) resolvedTown = parsed.location;
        setUserProfile((prev) => ({
          ...prev,
          name: parsed.name || prev.name,
          trade: resolvedTrade,
          location: resolvedTown,
        }));
      }
    } catch {}

    async function fetchLeads() {
      try {
        const res = await fetch(`/api/leads?town=${encodeURIComponent(resolvedTown)}&trade=${encodeURIComponent(resolvedTrade)}`);
        const data = await res.json();
        if (data && data.leads) {
          const hLeads: LeadItem[] = [];
          const tLeads: LeadItem[] = [];

          data.leads.forEach((l: any, idx: number) => {
            const isTradeLead = l.source.includes('Registry') || l.source.includes('Permit') || idx % 2 === 1;
            const formatted: LeadItem = {
              ...l,
              clientEmail: `contact${idx + 1}@${isTradeLead ? 'trade-partner.org' : 'local-homeowner.net'}`,
              clientPhone: `+1 (203) 555-01${80 + idx}`,
              isTradespersonLead: isTradeLead,
              autoQuote: {
                laborHours: 16,
                laborRate: 150,
                materialsCost: 850,
                customFields: [],
                total: 3250
              },
              personalNote: `Licensed ${resolvedTrade} serving ${resolvedTown}. Fully insured and ready for prompt dispatch.`,
              tradeMessage: `Hi ${l.clientName}, I noticed your registered project filing in ${resolvedTown}. As a fellow professional doing this type of work, I would love to include you in my trusted network on JobAllies.com and be considered to assist on your project.`,
              status: 'New',
              wizardStep: 1
            };

            if (isTradeLead) {
              tLeads.push(formatted);
            } else {
              hLeads.push(formatted);
            }
          });

          setHomeownerLeads(hLeads);
          setTradespersonLeads(tLeads);
        }
      } catch (err) {
        console.error('Failed to fetch leads:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeads();
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
    alert(`✓ ${newAlly.name} (${newAlly.trade}) has been successfully added to your trusted referral network!`);
  };

  const removeAlly = (id: string) => {
    setAllies(allies.filter(a => a.id !== id));
  };

  const recalculateTotal = (quote: { laborHours: number; laborRate: number; materialsCost: number; customFields: CustomField[] }) => {
    const base = quote.laborHours * quote.laborRate + quote.materialsCost;
    const customSum = quote.customFields.reduce((acc, f) => acc + f.amount, 0);
    return base + customSum;
  };

  const updateQuoteField = (id: string, field: string, val: number, isHomeowner: boolean) => {
    const setter = isHomeowner ? setHomeownerLeads : setTradespersonLeads;
    setter((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const updatedQuote = { ...l.autoQuote, [field]: val };
        updatedQuote.total = recalculateTotal(updatedQuote);
        return { ...l, autoQuote: updatedQuote };
      })
    );
  };

  const addCustomField = (id: string) => {
    if (!newFieldLabel.trim()) return;
    setHomeownerLeads((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const newField: CustomField = {
          id: Date.now().toString(),
          label: newFieldLabel.trim(),
          amount: Number(newFieldAmount) || 0
        };
        const updatedFields = [...l.autoQuote.customFields, newField];
        const updatedQuote = { ...l.autoQuote, customFields: updatedFields };
        updatedQuote.total = recalculateTotal(updatedQuote);
        return { ...l, autoQuote: updatedQuote };
      })
    );
    setNewFieldLabel('');
    setNewFieldAmount(150);
  };

  const removeCustomField = (leadId: string, fieldId: string) => {
    setHomeownerLeads((prev) =>
      prev.map((l) => {
        if (l.id !== leadId) return l;
        const updatedFields = l.autoQuote.customFields.filter((f) => f.id !== fieldId);
        const updatedQuote = { ...l.autoQuote, customFields: updatedFields };
        updatedQuote.total = recalculateTotal(updatedQuote);
        return { ...l, autoQuote: updatedQuote };
      })
    );
  };

  const updateNote = (id: string, note: string) => {
    setHomeownerLeads((prev) => prev.map((l) => (l.id === id ? { ...l, personalNote: note } : l)));
  };

  const updateTradeMessage = (id: string, msg: string) => {
    setTradespersonLeads((prev) => prev.map((l) => (l.id === id ? { ...l, tradeMessage: msg } : l)));
  };

  const setWizardStep = (id: string, step: number) => {
    setHomeownerLeads((prev) => prev.map((l) => (l.id === id ? { ...l, wizardStep: step } : l)));
  };

  const sendQuote = (lead: LeadItem) => {
    setHomeownerLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: 'Sent via Platform' } : l)));
    
    const newQuote: SavedQuote = {
      id: `Q-${Date.now().toString().slice(-4)}`,
      leadId: lead.id,
      clientName: lead.clientName,
      scope: lead.scope,
      total: lead.autoQuote.total,
      dateSent: new Date().toLocaleString(),
      status: 'Sent (Pending Prospect Review)'
    };
    setSavedQuotes([newQuote, ...savedQuotes]);

    alert(`✓ Quote successfully dispatched to ${lead.clientName} via SMS & Email! A copy has been saved to your dashboard.`);
  };

  const sendTradeMessage = (lead: LeadItem) => {
    setTradespersonLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: 'Message Dispatched' } : l)));
    alert(`✓ Trusted network intro message successfully sent to ${lead.clientName} via JobAllies.com!`);
  };

  const simulateProspectAcceptance = (leadId: string) => {
    setHomeownerLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: 'Accepted by Prospect' } : l))
    );
    setSavedQuotes((prev) =>
      prev.map((q) => (q.leadId === leadId ? { ...q, status: 'Accepted 🎉 (Contact Info Unlocked)' } : q))
    );
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-5 md:p-10 flex flex-col justify-between relative">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-5 gap-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Logo size="sm" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">{userProfile.name}</h1>
                <span className="text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                  {userProfile.trade}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Territory: <strong className="text-slate-200">{userProfile.location}</strong> • License: {userProfile.licenseNumber}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/dashboard/supplier-cart"
              className="bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 px-4 py-2.5 rounded-xl transition"
            >
              📦 Supply House List
            </Link>
          </div>
        </header>

        {/* TRUSTED REFERRAL NETWORK SECTION */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">🤝 Trusted Referral Network</span>
              <h2 className="text-lg font-extrabold text-white">Your Sub & Referral Crew</h2>
            </div>
            <p className="text-xs text-slate-400">Invite your trusted network below to exchange qualified overflow referrals.</p>
          </div>

          {allies.length === 0 ? (
            <div className="bg-slate-950 border border-dashed border-slate-800 p-6 rounded-2xl text-center space-y-3">
              <p className="text-xs text-slate-400">
                You haven't added any trusted trade allies to your network yet. Invite your go-to plumber, electrician, or mason below to start passing and receiving referral leads.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allies.map((ally) => (
                <div key={ally.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-white">{ally.name}</h4>
                    <p className="text-[11px] text-blue-400">{ally.trade} • {ally.phone}</p>
                  </div>
                  <button
                    onClick={() => removeAlly(ally.id)}
                    className="text-xs text-rose-400 hover:text-rose-300 font-bold px-3 py-1 bg-slate-900 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAddAlly} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider">+ Invite Trusted Trade Ally</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <input
                type="text"
                required
                placeholder="Partner Name (e.g. John Smith)"
                value={allyName}
                onChange={(e) => setAllyName(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
              <select
                value={allyTrade}
                onChange={(e) => setAllyTrade(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white"
              >
                <option value="Plumber">Plumber</option>
                <option value="Electrician">Electrician</option>
                <option value="Mason">Mason</option>
                <option value="HVAC Tech">HVAC Tech</option>
                <option value="Painter">Painter</option>
                <option value="Roofing Pro">Roofing Pro</option>
              </select>
              <input
                type="text"
                required
                placeholder="Mobile Phone Number"
                value={allyPhone}
                onChange={(e) => setAllyPhone(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-2.5 rounded-xl text-xs transition"
            >
              Send Invite & Add to Network
            </button>
          </form>
        </section>

        {/* SAVED QUOTES REFERENCE SECTION */}
        {savedQuotes.length > 0 && (
          <section className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400">📋 Sent Quotes Reference Hub</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {savedQuotes.map((q) => (
                <div key={q.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-white">{q.clientName} ({q.id})</p>
                    <p className="text-[11px] text-slate-400 truncate max-w-[280px]">"{q.scope}"</p>
                    <p className="text-xs font-extrabold text-emerald-400 mt-1">${q.total.toLocaleString()} • Sent: {q.dateSent}</p>
                  </div>
                  <span className="text-[11px] font-bold bg-blue-950 text-blue-400 border border-blue-800 px-3 py-1 rounded-full">
                    {q.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* BOX 1: HOMEOWNER DIRECT LEADS */}
        <section className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">🏠 Homeowner Direct Leads Box</span>
              <h2 className="text-xl font-extrabold text-white">
                Direct Homeowner Inquiries in {userProfile.location} ({homeownerLeads.length} Available)
              </h2>
            </div>
            <span className="text-xs font-bold text-blue-400 bg-blue-950 px-3.5 py-1.5 rounded-full border border-blue-800">
              {loading ? 'Scanning...' : `${homeownerLeads.length} active leads`}
            </span>
          </div>

          {!loading && homeownerLeads.length === 0 ? (
            <div className="bg-slate-950 border border-amber-500/50 p-6 rounded-2xl text-center space-y-3">
              <p className="text-xs text-slate-300">No direct homeowner requests currently active in {userProfile.location}.</p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <a href="https://pro.thumbtack.com" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs">🛠️ Connect Thumbtack Pro</a>
                <a href="https://pro.angi.com" target="_blank" rel="noopener noreferrer" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs">🏡 Connect Angi Leads</a>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {homeownerLeads.map((lead) => (
                <div key={lead.id} className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-5">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-900 pb-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-extrabold text-blue-400 bg-blue-950 px-3 py-0.5 rounded-full border border-blue-800">
                          Source: {lead.source}
                        </span>
                        <span className="text-xs font-bold text-emerald-400">Est. Budget: {lead.budget}</span>
                        <span className="text-xs text-slate-400">📍 {lead.town}</span>
                        <span className="text-xs font-bold text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-800">
                          🕒 Posted: {lead.datePosted} at {lead.timePosted}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-white mt-1">Project Request: "{lead.scope}"</p>
                      <p className="text-xs text-slate-400">Client: <strong className="text-slate-200">{lead.clientName}</strong></p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${lead.status === 'Accepted by Prospect' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 animate-pulse' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
                        Status: {lead.status}
                      </span>
                      {lead.status === 'Sent via Platform' && (
                        <button onClick={() => simulateProspectAcceptance(lead.id)} className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                          Simulate Prospect Accept ↗
                        </button>
                      )}
                    </div>
                  </div>

                  {lead.status === 'Accepted by Prospect' && (
                    <div className="bg-emerald-950/80 border border-emerald-500 p-5 rounded-2xl space-y-2">
                      <h4 className="text-xs font-black text-emerald-400 uppercase">🎉 Prospect Accepted Quote! Contact Info Unlocked:</h4>
                      <p className="text-xs text-slate-200">📞 Phone: <strong className="text-white font-mono">{lead.clientPhone}</strong> | ✉️ Email: <strong className="text-white font-mono">{lead.clientEmail}</strong></p>
                    </div>
                  )}

                  {/* QUOTE WIZARD */}
                  <div className="bg-slate-900/90 border border-blue-500/40 p-5 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <span className="text-xs font-extrabold text-blue-400 uppercase">✨ Lead-Specific Quote Wizard (Step {lead.wizardStep} of 3)</span>
                      <div className="flex gap-1.5">
                        <button onClick={() => setWizardStep(lead.id, 1)} className={`px-2 py-1 rounded text-[10px] font-bold ${lead.wizardStep === 1 ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-400'}`}>1. Scope</button>
                        <button onClick={() => setWizardStep(lead.id, 2)} className={`px-2 py-1 rounded text-[10px] font-bold ${lead.wizardStep === 2 ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-400'}`}>2. Pricing</button>
                        <button onClick={() => setWizardStep(lead.id, 3)} className={`px-2 py-1 rounded text-[10px] font-bold ${lead.wizardStep === 3 ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-400'}`}>3. Note</button>
                      </div>
                    </div>

                    {lead.wizardStep === 1 && (
                      <div className="space-y-3 py-2">
                        <p className="text-xs text-slate-300">Review project scope for <strong className="text-white">{lead.clientName}</strong>:</p>
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-white font-medium">"{lead.scope}"</div>
                        <div className="flex justify-end pt-2">
                          <button onClick={() => setWizardStep(lead.id, 2)} className="bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs">Next: Pricing →</button>
                        </div>
                      </div>
                    )}

                    {lead.wizardStep === 2 && (
                      <div className="space-y-4 py-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-300">Edit pricing and add custom fields:</span>
                          <span className="text-lg font-black text-emerald-400">${lead.autoQuote.total.toLocaleString()}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-400 mb-1">Labor Hours</label>
                            <input type="number" value={lead.autoQuote.laborHours} onChange={(e) => updateQuoteField(lead.id, 'laborHours', Number(e.target.value), true)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white" />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-400 mb-1">Hourly Rate ($)</label>
                            <input type="number" value={lead.autoQuote.laborRate} onChange={(e) => updateQuoteField(lead.id, 'laborRate', Number(e.target.value), true)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white" />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-400 mb-1">Materials ($)</label>
                            <input type="number" value={lead.autoQuote.materialsCost} onChange={(e) => updateQuoteField(lead.id, 'materialsCost', Number(e.target.value), true)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white" />
                          </div>
                        </div>

                        {/* Custom fields */}
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                          <span className="text-xs font-bold text-amber-400 uppercase">➕ Custom Line Items</span>
                          {lead.autoQuote.customFields.map(cf => (
                            <div key={cf.id} className="flex justify-between items-center text-xs bg-slate-900 px-3 py-1.5 rounded-lg">
                              <span>{cf.label}</span>
                              <div className="flex gap-3"><span className="text-emerald-400 font-bold">${cf.amount}</span><button onClick={() => removeCustomField(lead.id, cf.id)} className="text-rose-400">✕</button></div>
                            </div>
                          ))}
                          <div className="flex gap-2 pt-1">
                            <input type="text" placeholder="Line item name" value={newFieldLabel} onChange={(e) => setNewFieldLabel(e.target.value)} className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white" />
                            <input type="number" placeholder="Amount ($)" value={newFieldAmount} onChange={(e) => setNewFieldAmount(Number(e.target.value))} className="w-24 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white" />
                            <button type="button" onClick={() => addCustomField(lead.id)} className="bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs">+ Add</button>
                          </div>
                        </div>

                        <div className="flex justify-between pt-2">
                          <button onClick={() => setWizardStep(lead.id, 1)} className="text-xs text-slate-400">← Back</button>
                          <button onClick={() => setWizardStep(lead.id, 3)} className="bg-blue-600 text-white font-bold px-5 py-2 rounded-xl text-xs">Next: Note →</button>
                        </div>
                      </div>
                    )}

                    {lead.wizardStep === 3 && (
                      <div className="space-y-4 py-2">
                        <div className="bg-blue-950/40 border border-blue-500/60 p-4 rounded-2xl space-y-2">
                          <label className="block text-xs font-black text-blue-300 uppercase">✍️ Qualifications & Personal Note</label>
                          <textarea rows={3} value={lead.personalNote} onChange={(e) => updateNote(lead.id, e.target.value)} className="w-full bg-blue-950/80 border border-blue-400 rounded-xl p-3 text-xs text-white" />
                        </div>
                        <div className="flex justify-between pt-2">
                          <button onClick={() => setWizardStep(lead.id, 2)} className="text-xs text-slate-400">← Back</button>
                          <button onClick={() => sendQuote(lead)} className="flex-1 ml-3 bg-emerald-600 text-white font-bold py-3 rounded-xl text-xs shadow-lg">✓ Send Quote via SMS & Email</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* BOX 2: TRADESPERSON LEADS */}
        <section className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">🤝 Tradesperson Leads Box (State Registry & Permit Filings)</span>
              <h2 className="text-xl font-extrabold text-white">
                Tradesperson & Permit Filings in {userProfile.location} ({tradespersonLeads.length} Available)
              </h2>
            </div>
            <span className="text-xs font-bold text-blue-400 bg-blue-950 px-3.5 py-1.5 rounded-full border border-blue-800">
              {loading ? 'Scanning...' : `${tradespersonLeads.length} active trade leads`}
            </span>
          </div>

          {!loading && tradespersonLeads.length === 0 ? (
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl text-center">
              <p className="text-xs text-slate-400">No public tradesperson permit filings currently found for {userProfile.location}.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {tradespersonLeads.map((lead) => (
                <div key={lead.id} className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-5">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-900 pb-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-extrabold text-blue-400 bg-blue-950 px-3 py-0.5 rounded-full border border-blue-800">
                          Source: {lead.source}
                        </span>
                        <span className="text-xs text-slate-400">📍 {lead.town}</span>
                        <span className="text-xs font-bold text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-800">
                          🕒 Posted: {lead.datePosted} at {lead.timePosted}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-white mt-1">Filing Scope: "{lead.scope}"</p>
                      <p className="text-xs text-slate-400">Registered Entity: <strong className="text-slate-200">{lead.clientName}</strong></p>
                    </div>
                    <span className="text-xs font-bold bg-blue-950 text-blue-400 border border-blue-800 px-3 py-1 rounded-full">
                      Status: {lead.status}
                    </span>
                  </div>

                  {/* TRADESPERSON CONTACT MESSAGE BOX (Editable) */}
                  <div className="bg-slate-900/90 border border-blue-500/40 p-5 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">
                        ✉️ Trusted Network Introduction Message (Editable)
                      </span>
                      <span className="text-[10px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                        No financial quote required
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      This pre-filled message explains that you do this type of work, invites them to your trusted network on JobAllies.com, and requests to assist on the project. You can edit it freely before sending:
                    </p>

                    <textarea
                      rows={4}
                      value={lead.tradeMessage}
                      onChange={(e) => updateTradeMessage(lead.id, e.target.value)}
                      className="w-full bg-slate-950 border border-blue-400/80 rounded-xl p-3.5 text-xs text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner transition"
                    />

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => sendTradeMessage(lead)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3 px-6 rounded-xl text-xs transition shadow-lg"
                      >
                        ✓ Send Trusted Network Intro Message →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <FeedbackWidget />
      <SiteFooter />
    </main>
  );
}
