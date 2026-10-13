'use client';

import React, { useState, useRef } from 'react';
import { 
  Mic, MicOff, ShoppingCart, Send, Building2, MapPin, DollarSign, 
  Trash2, Plus, Users, Clock, FileText, Share2, ExternalLink, ShieldCheck, Filter, Search, CheckCircle2
} from 'lucide-react';

export default function ContractorDashboard() {
  const [activeTab, setActiveTab] = useState<'leads' | 'voice' | 'escrow' | 'integrations'>('voice');
  const [voiceLogs, setVoiceLogs] = useState<any[]>([]);
  const [transcribing, setTranscribing] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const [cardTabs, setCardTabs] = useState<Record<string, 'materials' | 'labor'>>({});
  const [activePoModal, setActivePoModal] = useState<any>(null);

  const recognitionRef = useRef<any>(null);
  const isRecordingRef = useRef<boolean>(false);
  const baseNoteRef = useRef<string>('');

  const startSpeechEngine = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice dictation requires Google Chrome, Edge, or Safari.');
      setIsRecording(false);
      isRecordingRef.current = false;
      return;
    }

    try {
      const recognition = new SpeechRecognition();
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

      recognition.onerror = () => {};

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

  const toggleRecording = () => {
    if (isRecording) {
      isRecordingRef.current = false;
      setIsRecording(false);
      if (recognitionRef.current) recognitionRef.current.stop();
      return;
    }

    baseNoteRef.current = noteInput ? noteInput.trim() + ' ' : '';
    isRecordingRef.current = true;
    startSpeechEngine();
  };

  const handleVoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput) return;
    setTranscribing(true);

    try {
      const res = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: noteInput }),
      });

      const json = await res.json();
      if (json.success && json.log) {
        setVoiceLogs((prev) => [json.log, ...prev]);
        setCardTabs((prev) => ({ ...prev, [json.log.id]: 'materials' }));
        setNoteInput('');
        baseNoteRef.current = '';
      } else {
        alert('Extraction failed: ' + (json.error || 'Server error'));
      }
    } catch (err) {
      alert('Network error while reaching /api/voice');
    }
    setTranscribing(false);
  };

  const handleGeneratePO = async (log: any) => {
    try {
      const res = await fetch('/api/po', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: log.extracted_materials || [],
          supplier: 'Home Depot Pro',
          jobName: 'Apex Jobsite #104'
        }),
      });
      const json = await res.json();
      if (json.success) {
        setActivePoModal(json.po);
      } else {
        alert('Failed to generate PO: ' + json.error);
      }
    } catch (err) {
      alert('Error connecting to PO Generation engine.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* BRANDING HEADER WITH CUSTOM ANIMATED LOGO & WORDMARK */}
      <header style={{ borderBottom: '1px solid #1e293b', backgroundColor: '#0f172a', padding: '0 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            
            {/* LOGO ICON */}
            <div style={{ position: 'relative', width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#090d16" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <polyline points="16 11 18 13 22 9" />
              </svg>
            </div>

            {/* BRAND WORDMARK */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '-0.5px', color: '#ffffff' }}>JobAllies</span>
                <span style={{ fontSize: '10px', fontWeight: 'bold', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid #10b981', padding: '2px 6px', borderRadius: '4px' }}>PRO OS</span>
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Contractor Operating System</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#1e293b', border: '1px solid #334155', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
            <Building2 style={{ width: '15px', height: '15px' }} />
            <span>Apex Landscaping & Field Trades</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* TAB NAVIGATION */}
        <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #1e293b', paddingBottom: '16px', marginBottom: '32px' }}>
          <button onClick={() => setActiveTab('leads')} style={{ padding: '12px 22px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', border: 'none', backgroundColor: activeTab === 'leads' ? '#10b981' : '#0f172a', color: activeTab === 'leads' ? '#090d16' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin style={{ width: '16px', height: '16px' }} /> Geofenced Leads & FB Scraper
          </button>
          <button onClick={() => setActiveTab('voice')} style={{ padding: '12px 22px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', border: 'none', backgroundColor: activeTab === 'voice' ? '#10b981' : '#0f172a', color: activeTab === 'voice' ? '#090d16' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mic style={{ width: '16px', height: '16px' }} /> TradeVoice & PO Carts
          </button>
          <button onClick={() => setActiveTab('escrow')} style={{ padding: '12px 22px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', border: 'none', backgroundColor: activeTab === 'escrow' ? '#10b981' : '#0f172a', color: activeTab === 'escrow' ? '#090d16' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign style={{ width: '16px', height: '16px' }} /> P2P Referral Escrow
          </button>
        </div>

        {/* TRADEVOICE & PO CARTS SECTION */}
        {activeTab === 'voice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mic style={{ width: '18px', height: '18px', color: '#10b981' }} />
                  <span>Field AI Voice Assistant</span>
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

              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px' }}>
                Dictate field materials and man-hours together (e.g. <i>"six pieces of wood, 14 tiles, 14 man hours, and 2 supervisor hours"</i>).
              </p>

              <form onSubmit={handleVoiceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <textarea
                  rows={3}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Speak or type field notes here..."
                  style={{ width: '100%', backgroundColor: '#090d16', border: isRecording ? '2px solid #ef4444' : '1px solid #1e293b', borderRadius: '12px', padding: '14px', color: '#ffffff', fontSize: '14px' }}
                />
                <button
                  type="submit"
                  disabled={transcribing || !noteInput}
                  style={{ backgroundColor: '#10b981', color: '#090d16', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: transcribing || !noteInput ? 0.6 : 1 }}
                >
                  <Send style={{ width: '14px', height: '14px' }} />
                  <span>{transcribing ? 'Extracting Materials & Labor...' : 'Generate Estimate & PO Cart'}</span>
                </button>
              </form>
            </div>

            {/* ESTIMATES LIST */}
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingCart style={{ width: '18px', height: '18px', color: '#10b981' }} />
                <span>Extracted Wholesale Carts & PO Builder</span>
              </h2>

              {voiceLogs.length === 0 ? (
                <div style={{ border: '1px dashed #1e293b', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                  No estimates recorded yet. Speak or type above to auto-generate material line items and labor hours.
                </div>
              ) : (
                voiceLogs.map((log) => (
                  <div key={log.id} style={{ backgroundColor: '#090d16', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
                    <p style={{ fontSize: '13px', color: '#cbd5e1', fontStyle: 'italic', margin: '0 0 16px', backgroundColor: '#0f172a', padding: '10px 14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                      "{log.raw_transcript}"
                    </p>

                    <button
                      onClick={() => handleGeneratePO(log)}
                      style={{ backgroundColor: '#38bdf8', color: '#090d16', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}
                    >
                      <FileText style={{ width: '14px', height: '14px' }} />
                      <span>Generate Merchant Purchase Order (PO)</span>
                    </button>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

      </main>

      {/* PO PREVIEW MODAL */}
      {activePoModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px', padding: '28px', maxWidth: '600px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#10b981' }}>{activePoModal.poNumber}</h3>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>{activePoModal.supplier} — {activePoModal.jobName}</span>
              </div>
              <button onClick={() => setActivePoModal(null)} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer' }}>Close</button>
            </div>

            <div style={{ backgroundColor: '#090d16', padding: '16px', borderRadius: '10px', marginBottom: '20px' }}>
              {activePoModal.items?.map((item: any, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid #1e293b' }}>
                  <span>{item.description} ({item.quantity})</span>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>${item.totalPrice}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '15px', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #334155' }}>
                <span>Total Estimated Cost:</span>
                <span style={{ color: '#38bdf8' }}>${activePoModal.total}</span>
              </div>
            </div>

            <a
              href={activePoModal.merchantCartUrl}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'block', width: '100%', textAlign: 'center', backgroundColor: '#10b981', color: '#090d16', padding: '12px', borderRadius: '10px', fontWeight: 'bold', textDecoration: 'none' }}
            >
              Transfer Cart to Merchant Checkout
            </a>
          </div>
        </div>
      )}

    </div>
  );
}
