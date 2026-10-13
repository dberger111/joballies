'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, Mic, DollarSign, Users, Link2, Search, Filter, Plus, 
  CheckCircle, Clock, AlertTriangle, ShieldCheck, ArrowUpRight, 
  Sliders, RefreshCw, Send, Check, ChevronRight, Building, Sparkles, FileText
} from 'lucide-react';

export default function JobAlliesDashboard() {
  const [activeTab, setActiveTab] = useState<'leads' | 'tradevoice' | 'escrow' | 'integrations'>('leads');

  const [radius, setRadius] = useState<number>(15);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [leads, setLeads] = useState([
    { id: 1, name: 'Marcus Vance', address: '142 Maple Dr, Stamford, CT', distance: '3.2 miles', value: '$4,500', status: 'HOT', trade: 'Roofing & Siding', date: 'Today, 10:30 AM' },
    { id: 2, name: 'Sarah Jenkins', address: '88 Harbor Point Rd, Stamford, CT', distance: '5.8 miles', value: '$8,200', status: 'CONTACTED', trade: 'Kitchen Remodel', date: 'Yesterday' },
    { id: 3, name: 'David Miller', address: '12 Fox Run, Greenwich, CT', distance: '11.4 miles', value: '$14,000', status: 'WON', trade: 'Full Deck Build', date: '3 days ago' },
    { id: 4, name: 'Elena Rostova', address: '902 High Ridge Rd, Stamford, CT', distance: '8.1 miles', value: '$2,800', status: 'HOT', trade: 'Electrical Panel Upgrade', date: 'Today, 2:15 PM' }
  ]);
  const [selectedLeadForQuote, setSelectedLeadForQuote] = useState<any | null>(null);
  const [quoteItem, setQuoteItem] = useState({ description: 'Custom Trade Services', cost: '1200' });

  const [isRecording, setIsRecording] = useState(false);
  const [dictationTranscript, setDictationTranscript] = useState("Replaced 300 sq ft of drywall in the basement, installed 4 recessed LED lights, and spent 5 hours on framing and drywall mudding.");
  const [materialMarkup, setMaterialMarkup] = useState<number>(20);
  const [parsedData, setParsedData] = useState({
    materials: [
      { name: 'Drywall Sheets (300 sq ft)', baseCost: 450 },
      { name: 'Recessed LED Fixtures (4x)', baseCost: 120 }
    ],
    labor: [
      { name: 'Framing & Mudding Labor (5 hrs)', hours: 5, hourlyRate: 75, total: 375 }
    ]
  });

  const [escrowDeals, setEscrowDeals] = useState([
    { id: 'ESC-901', contractor: 'Apex Plumbing Solutions', client: 'Tom Henderson', amount: '$3,200', milestone: 'Job In Progress', status: 'LOCKED_IN_ESCROW', date: 'Oct 10, 2026' },
    { id: 'ESC-902', contractor: 'Precision Electric', client: 'Beacon Properties', amount: '$7,500', milestone: 'Completion & Handshake', status: 'RELEASED', date: 'Oct 02, 2026' },
    { id: 'ESC-903', contractor: 'Solid Foundation Masonry', client: 'Clara Oswald', amount: '$12,000', milestone: 'Deposit Verified', status: 'PENDING_VERIFICATION', date: 'Oct 12, 2026' }
  ]);

  const [integrations, setIntegrations] = useState([
    { id: 'quickbooks', name: 'QuickBooks Online', category: 'Accounting & Invoicing', connected: true, icon: 'DollarSign' },
    { id: 'procore', name: 'Procore Construction', category: 'Project Management', connected: false, icon: 'Building' },
    { id: 'yelp', name: 'Yelp Local Services', category: 'Lead Generation', connected: true, icon: 'MapPin' },
    { id: 'stripe', name: 'Stripe P2P Escrow', category: 'Payments & Escrow', connected: true, icon: 'ShieldCheck' }
  ]);

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(item => item.id === id ? { ...item, connected: !item.connected } : item));
  };

  const calculateTotalWithMarkup = () => {
    const totalMaterialsBase = parsedData.materials.reduce((acc, item) => acc + item.baseCost, 0);
    const totalMaterialsMarkedUp = totalMaterialsBase * (1 + materialMarkup / 100);
    const totalLabor = parsedData.labor.reduce((acc, item) => acc + item.total, 0);
    return {
      baseMat: totalMaterialsBase,
      markedUpMat: totalMaterialsMarkedUp,
      labor: totalLabor,
      grandTotal: totalMaterialsMarkedUp + totalLabor
    };
  };

  const totals = calculateTotalWithMarkup();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900/85 backdrop-blur sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-amber-500 p-2 rounded-xl text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">JA</div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              JobAllies PRO OS <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">v2.4 Live</span>
            </h1>
            <p className="text-xs text-slate-400">Autonomous Contractor Field & Financial Command Center</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 mr-2 bg-emerald-400 rounded-full animate-pulse"></span>
            Vercel Auto-Deploy Active
          </span>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-slate-900/50 border-r border-slate-800 p-4 space-y-2">
          <button onClick={() => setActiveTab('leads')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'leads' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>
            <MapPin className="w-5 h-5" /><span>Geofenced Leads</span>
          </button>
          <button onClick={() => setActiveTab('tradevoice')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'tradevoice' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>
            <Mic className="w-5 h-5" /><span>TradeVoice AI Dictation</span>
          </button>
          <button onClick={() => setActiveTab('escrow')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'escrow' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>
            <ShieldCheck className="w-5 h-5" /><span>P2P Referral Escrow</span>
          </button>
          <button onClick={() => setActiveTab('integrations')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'integrations' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>
            <Link2 className="w-5 h-5" /><span>Integration Hub</span>
          </button>
        </aside>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Geofenced Job Radar & Leads</h2>
                  <p className="text-slate-400 text-sm">Real-time local job drops prioritized by proximity and conversion potential.</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl flex items-center space-x-2">
                    <Sliders className="w-4 h-4 text-amber-500" />
                    <span className="text-xs text-slate-300">Radius: <strong>{radius} miles</strong></span>
                    <input type="range" min="1" max="50" value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="accent-amber-500 ml-2 cursor-pointer w-24" />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {['ALL', 'HOT', 'CONTACTED', 'WON'].map((status) => (
                  <button key={status} onClick={() => setStatusFilter(status)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === status ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'}`}>{status}</button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {leads.filter(l => statusFilter === 'ALL' || l.status === statusFilter).map((lead) => (
                    <div key={lead.id} className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 hover:border-amber-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${lead.status === 'HOT' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : lead.status === 'WON' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}>{lead.status}</span>
                          <span className="text-xs text-slate-400">{lead.date}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white">{lead.name}</h3>
                        <p className="text-sm text-slate-300 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-amber-500" /> {lead.address}</p>
                        <p className="text-xs text-amber-400 font-medium">{lead.trade} • {lead.distance} away</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2 w-full sm:w-auto">
                        <span className="text-xl font-black text-white">{lead.value}</span>
                        <button onClick={() => setSelectedLeadForQuote(lead)} className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/10">
                          <FileText className="w-4 h-4" /> Quick Quote
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between h-[420px] relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <h3 className="font-bold text-white flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-500" /> Live Geofence Map</h3>
                    <span className="text-xs bg-slate-800 px-2.5 py-1 rounded-lg text-amber-400">Stamford Hub</span>
                  </div>
                  <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-3 my-auto">
                    <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center animate-pulse">
                      <MapPin className="w-8 h-8 text-amber-400" />
                    </div>
                    <p className="text-sm text-slate-300 font-medium">Active Geofence Radius: <strong className="text-white">{radius} Miles</strong></p>
                    <p className="text-xs text-slate-500">Scanning for incoming project leads and permits in Fairfield County...</p>
                  </div>
                  <div className="relative z-10 bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-slate-400">Active High-Value Drops</span>
                    <span className="font-bold text-amber-400">4 Leads Ready</span>
                  </div>
                </div>
              </div>

              {selectedLeadForQuote && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white">Quick-Action Quote Generator</h3>
                      <button onClick={() => setSelectedLeadForQuote(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
                    </div>
                    <p className="text-xs text-slate-400">Generating rapid estimate for <strong className="text-white">{selectedLeadForQuote.name}</strong> ({selectedLeadForQuote.trade}).</p>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-slate-400 font-medium mb-1 block">Scope of Work</label>
                        <input type="text" value={quoteItem.description} onChange={(e) => setQuoteItem({...quoteItem, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 font-medium mb-1 block">Estimated Cost ($)</label>
                        <input type="number" value={quoteItem.cost} onChange={(e) => setQuoteItem({...quoteItem, cost: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500" />
                      </div>
                    </div>
                    <div className="pt-2 flex space-x-3">
                      <button onClick={() => { alert(`Quote sent to ${selectedLeadForQuote.name}!`); setSelectedLeadForQuote(null); }} className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition-all">Send SMS / Email Estimate</button>
                      <button onClick={() => setSelectedLeadForQuote(null)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-sm">Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tradevoice' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">TradeVoice AI Dictation & Auto-Markup</h2>
                <p className="text-slate-400 text-sm">Speak or paste your site notes. AI automatically categorizes materials, labor, and applies custom markups.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white flex items-center gap-2"><Mic className="w-5 h-5 text-amber-500" /> Audio Transcript & Notes</h3>
                      <button onClick={() => setIsRecording(!isRecording)} className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                        <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-white' : 'bg-rose-500'}`}></span>
                        {isRecording ? 'Recording Audio...' : 'Start Dictation'}
                      </button>
                    </div>
                    <textarea value={dictationTranscript} onChange={(e) => setDictationTranscript(e.target.value)} rows={5} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-amber-500" placeholder="Describe job materials and labor..." />
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Material Markup Rate</p>
                      <p className="text-lg font-black text-amber-400">{materialMarkup}%</p>
                    </div>
                    <input type="range" min="5" max="50" value={materialMarkup} onChange={(e) => setMaterialMarkup(Number(e.target.value))} className="accent-amber-500 cursor-pointer w-36" />
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-500" /> AI Parsed Estimates</h3>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">Auto-Categorized</span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Materials (Base + {materialMarkup}% Markup)</h4>
                    {parsedData.materials.map((mat, i) => (
                      <div key={i} className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between text-sm">
                        <span className="text-slate-200">{mat.name}</span>
                        <span className="font-mono text-amber-400">$${(mat.baseCost * (1 + materialMarkup / 100)).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Labor Breakdown</h4>
                    {parsedData.labor.map((lab, i) => (
                      <div key={i} className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between text-sm">
                        <span className="text-slate-200">{lab.name}</span>
                        <span className="font-mono text-emerald-400">$${lab.total}.00</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Total Project Estimate</p>
                      <p className="text-xs text-slate-400">Includes {materialMarkup}% material markup & labor</p>
                    </div>
                    <span className="text-2xl font-black text-amber-400">$${totals.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'escrow' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">P2P Referral Escrow Ledger</h2>
                  <p className="text-slate-400 text-sm">Secure milestone escrow tracking and automated payouts for verified contractor referrals.</p>
                </div>
                <button onClick={() => alert('New Escrow Contract creation wizard opened.')} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/10">
                  <Plus className="w-4 h-4" /> Create Escrow Deal
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/60 text-xs text-slate-400 uppercase tracking-wider">
                        <th className="p-4 font-bold">Deal ID</th>
                        <th className="p-4 font-bold">Trade Partner</th>
                        <th className="p-4 font-bold">Client</th>
                        <th className="p-4 font-bold">Amount</th>
                        <th className="p-4 font-bold">Milestone State</th>
                        <th className="p-4 font-bold">Escrow Status</th>
                        <th className="p-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-sm">
                      {escrowDeals.map((deal) => (
                        <tr key={deal.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4 font-mono text-xs font-bold text-amber-400">{deal.id}</td>
                          <td className="p-4 font-bold text-white">{deal.contractor}</td>
                          <td className="p-4 text-slate-300">{deal.client}</td>
                          <td className="p-4 font-black text-white">{deal.amount}</td>
                          <td className="p-4">
                            <span className="text-xs bg-slate-800 px-3 py-1 rounded-lg text-slate-300 border border-slate-700">{deal.milestone}</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${deal.status === 'RELEASED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : deal.status === 'LOCKED_IN_ESCROW' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'}`}>
                              {deal.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button onClick={() => alert(`Viewing audit log for ${deal.id}`)} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-all">View Ledger</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Integration Hub</h2>
                <p className="text-slate-400 text-sm">Connect your accounting, project management, and lead generation tools instantly.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {integrations.map((item) => (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between hover:border-slate-700 transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-bold text-white">{item.name}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${item.connected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
                          {item.connected ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{item.category}</p>
                    </div>
                    <button onClick={() => toggleIntegration(item.id)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${item.connected ? 'bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/40 border border-slate-700 text-slate-300' : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/10'}`}>
                      {item.connected ? 'Disconnect' : 'Connect OAuth'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
