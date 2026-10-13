'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, ShoppingCart, Send, Building2, MapPin, DollarSign, 
  FileText, Share2, Percent, Mail, Phone, Search, ExternalLink 
} from 'lucide-react';

export default function ContractorDashboard() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'leads' | 'voice' | 'escrow'>('voice');
  const [markupPercent, setMarkupPercent] = useState(20);
  const [voiceLogs, setVoiceLogs] = useState<any[]>([]);
  const [noteInput, setNoteInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  
  const [activeQuoteModal, setActiveQuoteModal] = useState<any>(null);
  const [activePoModal, setActivePoModal] = useState<any>(null);

  const recognitionRef = useRef<any>(null);
  const isRecordingRef = useRef(false);
  const baseNoteRef = useRef('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const startSpeechEngine = () => {
    if (typeof window === 'undefined') return;
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      alert('Voice dictation requires Google Chrome, Edge, or Safari.');
      setIsRecording(false);
      isRecordingRef.current = false;
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        isRecordingRef.current = true;
      };

      recognition.onresult = (event: any) => {
        let sessionTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          sessionTranscript += event.results[i][0].transcript;
        }
        setNoteInput(baseNoteRef.current + sessionTranscript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
        isRecordingRef.current = false;
      };

      recognition.onend = () => {
        if (isRecordingRef.current) {
          try { recognition.start(); } catch (err) {}
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsRecording(false);
      isRecordingRef.current = false;
    }
  };

  const toggleRecording = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (isRecording) {
      isRecordingRef.current = false;
      setIsRecording(false);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (err) {}
      }
      return;
    }

    baseNoteRef.current = noteInput ? noteInput.trim() + ' ' : '';
    isRecordingRef.current = true;
    startSpeechEngine();
  };

  const handleVoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    setTranscribing(true);

    const input = noteInput.trim();

    try {
      const res = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: input }),
      });
      const json = await res.json();
      if (json.success && json.log) {
        setVoiceLogs([json.log, ...voiceLogs]);
        setNoteInput('');
        baseNoteRef.current = '';
        setTranscribing(false);
        return;
      }
    } catch (err) {}

    const lower = input.toLowerCase();
    const mockMaterials: any[] = [];
    const mockLabor: any[] = [];

    if (lower.includes('wood') || lower.includes('beam') || lower.includes('piece')) {
      mockMaterials.push({ item: '4x4x10 Pressure Treated Wood Beams', qty: 6, unitCost: 28.00, vendor: 'Home Depot Pro' });
    }
    if (lower.includes('tile') || lower.includes('paver') || lower.includes('towel')) {
      mockMaterials.push({ item: 'Unilock Dublin Cobble Pavers / Tiles', qty: 14, unitCost: 18.50, vendor: 'SiteOne Supply' });
    }
    if (lower.includes('cement') || lower.includes('concrete')) {
      mockMaterials.push({ item: 'Quikrete 80lb High Early Concrete', qty: 14, unitCost: 7.25, vendor: 'Home Depot Pro' });
    }
    if (mockMaterials.length === 0) {
      mockMaterials.push({ item: input, qty: 1, unitCost: 120.00, vendor: 'Home Depot Pro' });
    }

    if (lower.includes('man hours') || lower.includes('hours') || lower.includes('crew')) {
      mockLabor.push({ tier: 'Standard Crew Tradesman', hours: 14, rate: 65 });
    }
    if (lower.includes('supervisor') || lower.includes('lead')) {
      mockLabor.push({ tier: 'Senior Lead Tech / Supervisor', hours: 2, rate: 95 });
    }
    if (mockLabor.length === 0) {
      mockLabor.push({ tier: 'Standard Crew Tradesman', hours: 8, rate: 65 });
    }

    const newLog = {
      id: 'log-' + Date.now(),
      raw_transcript: input,
      extracted_materials: mockMaterials,
      labor_breakdown: mockLabor,
      created_at: new Date().toISOString(),
    };

    setVoiceLogs([newLog, ...voiceLogs]);
    setNoteInput('');
    baseNoteRef.current = '';
    setTranscribing(false);
  };

  const handleGenerateClientQuote = (log: any) => {
    const rawMaterialsCost = (log.extracted_materials || []).reduce((sum: number, m: any) => sum + (m.unitCost * m.qty), 0);
    const laborCost = (log.labor_breakdown || []).reduce((sum: number, l: any) => sum + (l.hours * l.rate), 0);
    const markedUpMaterials = rawMaterialsCost * (1 + (markupPercent / 100));

    setActiveQuoteModal({
      quoteNumber: 'Q-JA-' + Math.floor(100000 + Math.random() * 900000),
      clientName: 'Prospective Client / Jobsite #104',
      items: log.extracted_materials || [],
      labor: log.labor_breakdown || [],
      markupPercent,
      markedUpMaterials,
      laborCost,
      total: (markedUpMaterials + laborCost) * 1.0635
    });
  };

  const handleGenerateVendorPO = (log: any) => {
    const items = (log.extracted_materials || []).map((m: any, i: number) => ({
      line: i + 1,
      description: m.item,
      quantity: m.qty,
      totalPrice: m.unitCost * m.qty
    }));
    const subtotal = items.reduce((sum: number, x: any) => sum + x.totalPrice, 0);

    setActivePoModal({
      poNumber: 'PO-JA-' + Math.floor(100000 + Math.random() * 900000),
      supplier: 'Home Depot Pro / SiteOne Sync',
      items,
      subtotal,
      total: subtotal * 1.0635
    });
  };

  if (!mounted) return null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ borderBottom: '1px solid #1e293b', backgroundColor: '#0f172a', padding: '0 24px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#090d16', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>JA</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>JobAllies</span>
              <span style={{ fontSize: '10px', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>PRO OS</span>
            </div>
            <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Contractor Operating System</span>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: '#10b981', backgroundColor: '#1e293b', border: '1px solid #334155', padding: '6px 14px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
          <Building2 style={{ width: '14px', height: '14px' }} />
          <span>Apex Landscaping & Field Trades</span>
        </div>
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
        
        <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #1e293b', paddingBottom: '16px', marginBottom: '32px' }}>
          <button 
            onClick={() => setActiveTab('leads')} 
            style={{ padding: '10px 20px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', border: 'none', backgroundColor: activeTab === 'leads' ? '#10b981' : '#0f172a', color: activeTab === 'leads' ? '#090d16' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <MapPin style={{ width: '15px', height: '15px' }} />
            <span>Geofenced Leads & FB Scraper</span>
          </button>

          <button 
            onClick={() => setActiveTab('voice')} 
            style={{ padding: '10px 20px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', border: 'none', backgroundColor: activeTab === 'voice' ? '#10b981' : '#0f172a', color: activeTab === 'voice' ? '#090d16' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Mic style={{ width: '15px', height: '15px' }} />
            <span>TradeVoice & Quotes</span>
          </button>

          <button 
            onClick={() => setActiveTab('escrow')} 
            style={{ padding: '10px 20px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', border: 'none', backgroundColor: activeTab === 'escrow' ? '#10b981' : '#0f172a', color: activeTab === 'escrow' ? '#090d16' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <DollarSign style={{ width: '15px', height: '15px' }} />
            <span>P2P Referral Escrow</span>
          </button>
        </div>

        {activeTab === 'leads' && (
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', margin: '0 0 16px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin style={{ width: '18px', height: '18px' }} />
              <span>Geofenced Local Lead Radar</span>
            </h2>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <input type="text" placeholder="Enter Zip Code or Radius (e.g. 06883 - 15 miles)" style={{ flex: 1, backgroundColor: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px' }} />
              <button style={{ backgroundColor: '#10b981', color: '#090d16', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Search style={{ width: '14px', height: '14px' }} />
                <span>Scan Area</span>
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ backgroundColor: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 'bold', backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>FB Community Group Lead</span>
                  <p style={{ margin: '4px 0 2px', fontSize: '13px', fontWeight: 'bold' }}>"Looking for landscaping contractor for 400 sq ft stone patio installation"</p>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Weston Local Trades • Posted 18 mins ago</span>
                </div>
                <button style={{ backgroundColor: '#1e293b', color: '#10b981', border: '1px solid #10b981', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Claim Lead</span>
                  <ExternalLink style={{ width: '12px', height: '12px' }} />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'voice' && (
          <>
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h2 style={{ fontSize: '16px', margin: 0, color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mic style={{ width: '18px', height: '18px' }} />
                  <span>TradeVoice AI Dictation & Quote Builder</span>
                </h2>
                <button
                  type="button"
                  onClick={toggleRecording}
                  style={{
                    backgroundColor: isRecording ? '#ef4444' : '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {isRecording ? <MicOff style={{ width: '14px', height: '14px' }} /> : <Mic style={{ width: '14px', height: '14px' }} />}
                  <span>{isRecording ? 'Recording (Tap to Stop)' : 'Tap to Record Voice'}</span>
                </button>
              </div>

              <form onSubmit={handleVoiceSubmit}>
                <textarea
                  rows={3}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Dictate field materials and labor hours here..."
                  style={{ width: '100%', backgroundColor: '#090d16', border: isRecording ? '2px solid #ef4444' : '1px solid #334155', borderRadius: '10px', padding: '12px', color: '#fff', fontSize: '14px', marginBottom: '12px' }}
                />
                <button 
                  type="submit" 
                  disabled={transcribing || !noteInput.trim()}
                  style={{ backgroundColor: '#10b981', color: '#090d16', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: transcribing || !noteInput.trim() ? 0.6 : 1 }}
                >
                  <Send style={{ width: '14px', height: '14px' }} />
                  <span>{transcribing ? 'Processing Dictation...' : 'Extract Materials & Labor'}</span>
                </button>
              </form>
            </div>

            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '16px' }}>Estimates & Active Quotes</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
                  <Percent style={{ width: '14px', height: '14px', color: '#10b981' }} />
                  <span>Material Markup:</span>
                  <select value={markupPercent} onChange={(e) => setMarkupPercent(Number(e.target.value))} style={{ backgroundColor: '#090d16', color: '#10b981', border: '1px solid #334155', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                    <option value={0}>0% Markup</option>
                    <option value={15}>15% Markup</option>
                    <option value={20}>20% Markup</option>
                    <option value={25}>25% Markup</option>
                  </select>
                </div>
              </div>

              {voiceLogs.length === 0 ? (
                <div style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '30px', border: '1px dashed #1e293b', borderRadius: '12px' }}>
                  No estimates created yet. Speak or type field notes above.
                </div>
              ) : (
                voiceLogs.map((log) => (
                  <div key={log.id} style={{ backgroundColor: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                    <p style={{ fontStyle: 'italic', fontSize: '13px', color: '#cbd5e1', margin: '0 0 12px', backgroundColor: '#0f172a', padding: '8px 12px', borderRadius: '6px', border: '1px solid #1e293b' }}>
                      "{log.raw_transcript}"
                    </p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => handleGenerateClientQuote(log)} style={{ flex: 1, backgroundColor: '#10b981', color: '#090d16', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <Share2 style={{ width: '14px', height: '14px' }} />
                        <span>1. Client Quote ({markupPercent}% Markup)</span>
                      </button>
                      <button onClick={() => handleGenerateVendorPO(log)} style={{ backgroundColor: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FileText style={{ width: '14px', height: '14px' }} />
                        <span>2. Internal Supplier PO</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeTab === 'escrow' && (
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', margin: '0 0 16px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign style={{ width: '18px', height: '18px' }} />
              <span>Peer-to-Peer Referral Fee Escrow</span>
            </h2>
            <div style={{ backgroundColor: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 12px' }}>Locked Referral Fee Escrow Balance</p>
              <h3 style={{ fontSize: '28px', color: '#10b981', margin: '0 0 16px' }}>$450.00 USD</h3>
              <button style={{ backgroundColor: '#10b981', color: '#090d16', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Release Escrow Funds to Trade Partner
              </button>
            </div>
          </div>
        )}

      </main>

      {activeQuoteModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #10b981', borderRadius: '16px', padding: '24px', maxWidth: '520px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 'bold', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid #10b981', padding: '2px 6px', borderRadius: '4px' }}>CLIENT PROPOSAL</span>
                <h3 style={{ margin: '4px 0 0', color: '#ffffff', fontSize: '18px' }}>Proposal {activeQuoteModal.quoteNumber}</h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0' }}>Prepared for: {activeQuoteModal.clientName}</p>
              </div>
              <button onClick={() => setActiveQuoteModal(null)} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer' }}>Close</button>
            </div>

            <div style={{ backgroundColor: '#090d16', padding: '14px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Materials ({markupPercent}% Markup Included):</span>
                <span style={{ fontWeight: 'bold', color: '#ffffff' }}>${activeQuoteModal.markedUpMaterials.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Labor & Trade Hours:</span>
                <span style={{ fontWeight: 'bold', color: '#ffffff' }}>${activeQuoteModal.laborCost.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #334155', paddingTop: '8px', marginTop: '8px', fontWeight: 'bold', color: '#10b981', fontSize: '15px' }}>
                <span>Total Client Investment:</span>
                <span>${activeQuoteModal.total.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => alert('Quote link sent via SMS!')} style={{ flex: 1, backgroundColor: '#10b981', color: '#090d16', padding: '10px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Phone style={{ width: '14px', height: '14px' }} />
                <span>Send SMS Link</span>
              </button>
              <button onClick={() => alert('Proposal PDF emailed to client!')} style={{ flex: 1, backgroundColor: '#38bdf8', color: '#090d16', padding: '10px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Mail style={{ width: '14px', height: '14px' }} />
                <span>Email PDF Proposal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activePoModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #38bdf8', borderRadius: '16px', padding: '24px', maxWidth: '520px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 'bold', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid #38bdf8', padding: '2px 6px', borderRadius: '4px' }}>INTERNAL MERCHANT PO</span>
                <h3 style={{ margin: '4px 0 0', color: '#38bdf8', fontSize: '18px' }}>{activePoModal.poNumber}</h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0' }}>Supplier: {activePoModal.supplier}</p>
              </div>
              <button onClick={() => setActivePoModal(null)} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer' }}>Close</button>
            </div>

            <div style={{ backgroundColor: '#090d16', padding: '14px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px' }}>
              {activePoModal.items?.map((item: any, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #1e293b' }}>
                  <span>{item.description} ({item.quantity})</span>
                  <span style={{ fontWeight: 'bold', color: '#10b981' }}>${item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#38bdf8', borderTop: '1px solid #334155', paddingTop: '8px', marginTop: '8px' }}>
                <span>Wholesale Subtotal:</span>
                <span>${activePoModal.subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <a href="https://www.homedepot.com/c/pro_services" target="_blank" rel="noreferrer" style={{ flex: 1, backgroundColor: '#38bdf8', color: '#090d16', padding: '10px', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center', textDecoration: 'none' }}>
                Transfer Cart to Home Depot / SiteOne Pro
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}