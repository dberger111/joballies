'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  MapPin, Mic, DollarSign, ArrowRight, ShieldCheck, 
  ShoppingCart, RefreshCw, Send 
} from 'lucide-react';

export default function ContractorDashboard() {
  const [activeTab, setActiveTab] = useState<'leads' | 'voice' | 'escrow'>('leads');
  const [contractor, setContractor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Leads State
  const [leads, setLeads] = useState<any[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  // Voice AI State
  const [voiceLogs, setVoiceLogs] = useState<any[]>([]);
  const [transcribing, setTranscribing] = useState(false);
  const [noteInput, setNoteInput] = useState('');

  // Escrow State
  const [processingEscrow, setProcessingEscrow] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setContractor({
          id: 'demo-contractor-uuid',
          business_name: 'Apex Landscaping & Field Trades',
          primary_trade: 'landscaping',
          service_radius_miles: 25,
          primary_language: 'EN',
        });
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('contractor_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setContractor(profile);
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const loadLeads = async () => {
    if (!contractor) return;
    setLoadingLeads(true);
    try {
      const res = await fetch(`/api/leads?contractor_id=${contractor.id}`);
      const json = await res.json();
      if (json.success) {
        setLeads(json.leads);
      }
    } catch (e) {
      console.error('Failed to load leads:', e);
    }
    setLoadingLeads(false);
  };

  const handleVoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput || !contractor) return;
    setTranscribing(true);

    try {
      const res = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractor_id: contractor.id,
          transcript: noteInput,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setVoiceLogs([json.log, ...voiceLogs]);
        setNoteInput('');
      }
    } catch (e) {
      console.error('Voice processing error:', e);
    }
    setTranscribing(false);
  };

  const handleHoldEscrow = async (referralId: string) => {
    setProcessingEscrow(referralId);
    try {
      const res = await fetch('/api/escrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referral_id: referralId,
          action: 'hold_escrow',
          amount: 150.00,
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert('Escrow hold initiated successfully via Stripe!');
      }
    } catch (e) {
      console.error('Escrow error:', e);
    }
    setProcessingEscrow(null);
  };

  useEffect(() => {
    if (contractor) {
      loadLeads();
    }
  }, [contractor]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <header className="border-b border-slate-800 bg-slate-950/80 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
              JA
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">JobAllies</span>
              <span className="text-xs text-emerald-400 block -mt-1 font-medium">Dashboard</span>
            </div>
          </div>
          <span className="text-xs font-mono bg-slate-800 text-emerald-400 px-3 py-1 rounded-full border border-slate-700">
            {contractor?.business_name || 'Active Contractor'}
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-2 border-b border-slate-800 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition ${
              activeTab === 'leads' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Geofenced Leads</span>
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition ${
              activeTab === 'voice' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>TradeVoice & Carts</span>
          </button>
          <button
            onClick={() => setActiveTab('escrow')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition ${
              activeTab === 'escrow' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>P2P Referral Escrow</span>
          </button>
        </div>

        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-slate-950 border border-slate-800 p-6 rounded-2xl">
              <div>
                <h2 className="text-xl font-bold text-white">Matching Leads in Service Zone</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Filtered within your <span className="text-emerald-400 font-mono font-bold">{contractor?.service_radius_miles || 25} mile driving radius</span> via PostGIS spatial queries.
                </p>
              </div>
              <button
                onClick={loadLeads}
                className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingLeads ? 'animate-spin text-emerald-400' : ''}`} />
                <span>Refresh Leads</span>
              </button>
            </div>

            {leads.length === 0 ? (
              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-12 text-center">
                <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white">No active leads match your radius yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
                  When homeowners or allied contractors submit jobs within {contractor?.service_radius_miles || 25} miles, they will automatically appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {leads.map((lead: any) => (
                  <div key={lead.job_id} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase">
                          {lead.trade_category}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{lead.distance_miles} miles away</span>
                      </div>
                      <h3 className="font-bold text-lg text-white mb-2">{lead.title}</h3>
                      <p className="text-xs text-slate-400 mb-4">{lead.description}</p>
                    </div>
                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase text-slate-500 block">Est. Value</span>
                        <span className="font-bold font-mono text-emerald-400 text-sm">${lead.estimated_value || 'Quote'}</span>
                      </div>
                      <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-3 py-2 rounded-lg transition flex items-center space-x-1">
                        <span>Claim Lead</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'voice' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
                <Mic className="w-5 h-5 text-emerald-400" />
                <span>Field Voice Logging</span>
              </h2>
              <form onSubmit={handleVoiceSubmit} className="space-y-4">
                <textarea
                  rows={4}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="e.g. Need 200 sq ft paver patio stone and 4 bags polymeric sand."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
                />
                <button
                  type="submit"
                  disabled={transcribing || !noteInput}
                  className="w-full bg-emerald-500 text-slate-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{transcribing ? 'Processing...' : 'Generate Cart'}</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-emerald-400" />
                <span>Generated Supplier Carts</span>
              </h2>
              {voiceLogs.length === 0 ? (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-500">
                  No carts generated yet.
                </div>
              ) : (
                voiceLogs.map((log: any, idx: number) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                    <p className="text-xs text-slate-400 font-mono mb-2">"{log.raw_transcript}"</p>
                    {log.extracted_materials?.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center bg-slate-900 p-3 rounded-xl text-xs border border-slate-800 my-1">
                        <span className="text-white font-semibold">{item.item}</span>
                        <span className="font-mono text-emerald-400 font-bold">{item.qty}</span>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'escrow' && (
          <div className="space-y-6">
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">P2P Escrow Referral Contracts</h2>
                <p className="text-xs text-slate-400 mt-1">Pass out-of-zone jobs to allies and claim 10% referral splits.</p>
              </div>
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white text-sm">Weston Lawn & Paver Renovation</h3>
                <p className="text-xs text-slate-400">Referred to Allied Contractor • Est. Split: $150.00</p>
              </div>
              <button
                onClick={() => handleHoldEscrow('sample-ref-123')}
                disabled={!!processingEscrow}
                className="bg-emerald-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl"
              >
                {processingEscrow ? 'Connecting Stripe...' : 'Hold $150 in Escrow'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
