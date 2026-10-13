'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  MapPin, Mic, DollarSign, ArrowRight, ShieldCheck, 
  ShoppingCart, RefreshCw, Send, CheckCircle2, Building2
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
          primary_trade: 'Landscaping & Hardscape',
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
      <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <RefreshCw style={{ width: '32px', height: '32px', color: '#10b981', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* Header Bar */}
      <header style={{ borderBottom: '1px solid #1e293b', backgroundColor: '#0f172a', position: 'sticky', top: 0, zIndex: 50, padding: '0 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#10b981', color: '#090d16', fontWeight: 'bold', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              JA
            </div>
            <div>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff' }}>JobAllies</span>
              <span style={{ fontSize: '11px', color: '#10b981', display: 'block', marginTop: '-2px', fontWeight: 600 }}>PRO DASHBOARD</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
            <Building2 style={{ width: '14px', height: '14px' }} />
            <span>{contractor?.business_name || 'Apex Field Trades'}</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #1e293b', paddingBottom: '16px', marginBottom: '32px' }}>
          <button
            onClick={() => setActiveTab('leads')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              border: activeTab === 'leads' ? 'none' : '1px solid #1e293b',
              backgroundColor: activeTab === 'leads' ? '#10b981' : '#0f172a',
              color: activeTab === 'leads' ? '#090d16' : '#94a3b8',
              transition: 'all 0.2s',
            }}
          >
            <MapPin style={{ width: '16px', height: '16px' }} />
            <span>Geofenced Leads</span>
          </button>

          <button
            onClick={() => setActiveTab('voice')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              border: activeTab === 'voice' ? 'none' : '1px solid #1e293b',
              backgroundColor: activeTab === 'voice' ? '#10b981' : '#0f172a',
              color: activeTab === 'voice' ? '#090d16' : '#94a3b8',
              transition: 'all 0.2s',
            }}
          >
            <Mic style={{ width: '16px', height: '16px' }} />
            <span>TradeVoice & Carts</span>
          </button>

          <button
            onClick={() => setActiveTab('escrow')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              border: activeTab === 'escrow' ? 'none' : '1px solid #1e293b',
              backgroundColor: activeTab === 'escrow' ? '#10b981' : '#0f172a',
              color: activeTab === 'escrow' ? '#090d16' : '#94a3b8',
              transition: 'all 0.2s',
            }}
          >
            <DollarSign style={{ width: '16px', height: '16px' }} />
            <span>P2P Referral Escrow</span>
          </button>
        </div>

        {/* TAB 1: GEOFENCED LEADS */}
        {activeTab === 'leads' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>Matching Leads in Service Zone</h2>
                <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px', margin: 0 }}>
                  Geofenced within your <strong style={{ color: '#10b981' }}>{contractor?.service_radius_miles || 25} mile driving radius</strong> via PostGIS spatial engine.
                </p>
              </div>
              <button
                onClick={loadLeads}
                style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc', padding: '10px 18px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <RefreshCw style={{ width: '14px', height: '14px', color: '#10b981' }} />
                <span>Refresh Leads</span>
              </button>
            </div>

            {leads.length === 0 ? (
              <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '48px 24px', textAlign: 'center' }}>
                <MapPin style={{ width: '48px', height: '48px', color: '#334155', margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', margin: 0 }}>No active leads match your service zone right now</h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', maxWidth: '420px', margin: '8px auto 0' }}>
                  When homeowners or allied contractors post jobs within {contractor?.service_radius_miles || 25} miles, they will automatically appear here.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {leads.map((lead: any) => (
                  <div key={lead.job_id} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '11px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '2px 8px', borderRadius: '12px', textTransform: 'uppercase', fontWeight: 600 }}>
                          {lead.trade_category}
                        </span>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>{lead.distance_miles} miles away</span>
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 8px' }}>{lead.title}</h3>
                      <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 16px', lineHeight: '1.4' }}>{lead.description}</p>
                    </div>
                    <div style={{ paddingTop: '16px', borderTop: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Est. Value</span>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#10b981' }}>${lead.estimated_value || 'Quote'}</span>
                      </div>
                      <button style={{ backgroundColor: '#10b981', color: '#090d16', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>Claim Lead</span>
                        <ArrowRight style={{ width: '14px', height: '14px' }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TRADEVOICE AI & CARTS */}
        {activeTab === 'voice' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mic style={{ width: '18px', height: '18px', color: '#10b981' }} />
                <span>Field Voice AI Assistant</span>
              </h2>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 20px' }}>
                Type or dictate job site notes. OpenAI GPT-4o will parse items into wholesale supplier carts (SiteOne, Home Depot Pro, Ferguson).
              </p>

              <form onSubmit={handleVoiceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <textarea
                  rows={4}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="e.g. Need 250 sq ft Dublin Cobble pavers, 5 bags polymeric sand, and 10 PVC schedule 40 pipes."
                  style={{ width: '100%', backgroundColor: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px', fontSize: '13px', color: '#ffffff', resize: 'vertical' }}
                />
                <button
                  type="submit"
                  disabled={transcribing || !noteInput}
                  style={{ width: '100%', backgroundColor: '#10b981', color: '#090d16', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: transcribing || !noteInput ? 0.6 : 1 }}
                >
                  <Send style={{ width: '14px', height: '14px' }} />
                  <span>{transcribing ? 'Generating Supplier Cart...' : 'Extract Wholesale Cart'}</span>
                </button>
              </form>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingCart style={{ width: '18px', height: '18px', color: '#10b981' }} />
                <span>Generated Material Carts</span>
              </h2>

              {voiceLogs.length === 0 ? (
                <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '32px', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
                  No materials extracted yet. Submit field notes on the left to build wholesale supplier carts.
                </div>
              ) : (
                voiceLogs.map((log: any, idx: number) => (
                  <div key={idx} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 12px', fontStyle: 'italic' }}>"{log.raw_transcript}"</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {log.extracted_materials?.map((item: any, i: number) => (
                        <div key={i} style={{ backgroundColor: '#090d16', border: '1px solid #1e293b', padding: '12px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', display: 'block' }}>{item.item}</span>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>{item.category} • {item.vendor || 'Wholesale Supplier'}</span>
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            {item.qty}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: P2P REFERRAL ESCROW */}
        {activeTab === 'escrow' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>P2P Referral Escrow Hub</h2>
                <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px', margin: 0 }}>
                  Pass leads outside your driving zone to allied contractors and claim 10% referral payouts protected by Stripe Connect.
                </p>
              </div>
              <ShieldCheck style={{ width: '32px', height: '32px', color: '#10b981' }} />
            </div>

            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 4px' }}>Weston Lawn & Paver Renovation</h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Referred Contractor Split: <strong style={{ color: '#10b981' }}>$150.00 Fee</strong></p>
              </div>
              <button
                onClick={() => handleHoldEscrow('sample-ref-123')}
                disabled={!!processingEscrow}
                style={{ backgroundColor: '#10b981', color: '#090d16', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
              >
                {processingEscrow ? 'Connecting Stripe...' : 'Hold $150 in Escrow'}
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
