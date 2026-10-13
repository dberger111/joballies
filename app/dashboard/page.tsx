'use client';

import React, { useState, useRef } from 'react';
import { Mic, MicOff, ShoppingCart, Send, Building2, MapPin, DollarSign, Trash2, Plus, Users, Clock } from 'lucide-react';

export default function ContractorDashboard() {
  const [activeTab, setActiveTab] = useState<'leads' | 'voice' | 'escrow'>('voice');
  const [voiceLogs, setVoiceLogs] = useState<any[]>([]);
  const [transcribing, setTranscribing] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const [cardTabs, setCardTabs] = useState<Record<string, 'materials' | 'labor'>>({});

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

  const updateMaterialItem = (logIndex: number, itemIndex: number, field: string, value: string) => {
    setVoiceLogs((prevLogs) => {
      const newLogs = [...prevLogs];
      const updatedMaterials = [...newLogs[logIndex].extracted_materials];
      updatedMaterials[itemIndex] = { ...updatedMaterials[itemIndex], [field]: value };
      newLogs[logIndex].extracted_materials = updatedMaterials;
      return newLogs;
    });
  };

  const deleteMaterialItem = (logIndex: number, itemIndex: number) => {
    setVoiceLogs((prevLogs) => {
      const newLogs = [...prevLogs];
      const updatedMaterials = newLogs[logIndex].extracted_materials.filter((_: any, i: number) => i !== itemIndex);
      newLogs[logIndex].extracted_materials = updatedMaterials;
      return newLogs;
    });
  };

  const addMaterialItem = (logIndex: number) => {
    setVoiceLogs((prevLogs) => {
      const newLogs = [...prevLogs];
      newLogs[logIndex].extracted_materials.push({
        item: 'New Line Item',
        qty: '1 unit',
        vendor: 'Home Depot Pro',
      });
      return newLogs;
    });
  };

  const updateLaborItem = (logIndex: number, laborIndex: number, field: string, value: any) => {
    setVoiceLogs((prevLogs) => {
      const newLogs = [...prevLogs];
      const updatedLabor = [...(newLogs[logIndex].labor_breakdown || [])];
      updatedLabor[laborIndex] = { ...updatedLabor[laborIndex], [field]: value };
      newLogs[logIndex].labor_breakdown = updatedLabor;
      return newLogs;
    });
  };

  const deleteLaborItem = (logIndex: number, laborIndex: number) => {
    setVoiceLogs((prevLogs) => {
      const newLogs = [...prevLogs];
      const updatedLabor = newLogs[logIndex].labor_breakdown.filter((_: any, i: number) => i !== laborIndex);
      newLogs[logIndex].labor_breakdown = updatedLabor;
      return newLogs;
    });
  };

  const addLaborItem = (logIndex: number) => {
    setVoiceLogs((prevLogs) => {
      const newLogs = [...prevLogs];
      if (!newLogs[logIndex].labor_breakdown) newLogs[logIndex].labor_breakdown = [];
      newLogs[logIndex].labor_breakdown.push({
        tier: 'Journeyman Tradesman',
        hours: 4,
        rate: 65,
      });
      return newLogs;
    });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ borderBottom: '1px solid #1e293b', backgroundColor: '#0f172a', padding: '0 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#10b981', color: '#090d16', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>JA</div>
            <div>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>JobAllies</span>
              <span style={{ fontSize: '11px', color: '#10b981', display: 'block' }}>PRO DASHBOARD</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', color: '#10b981' }}>
            <Building2 style={{ width: '14px', height: '14px' }} />
            <span>Apex Landscaping & Field Trades</span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #1e293b', paddingBottom: '16px', marginBottom: '32px' }}>
          <button onClick={() => setActiveTab('leads')} style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: 600, border: 'none', backgroundColor: activeTab === 'leads' ? '#10b981' : '#0f172a', color: activeTab === 'leads' ? '#090d16' : '#94a3b8', cursor: 'pointer' }}>
            <MapPin style={{ width: '14px', height: '14px', display: 'inline', marginRight: '6px' }} /> Geofenced Leads
          </button>
          <button onClick={() => setActiveTab('voice')} style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: 600, border: 'none', backgroundColor: activeTab === 'voice' ? '#10b981' : '#0f172a', color: activeTab === 'voice' ? '#090d16' : '#94a3b8', cursor: 'pointer' }}>
            <Mic style={{ width: '14px', height: '14px', display: 'inline', marginRight: '6px' }} /> TradeVoice & Estimates
          </button>
          <button onClick={() => setActiveTab('escrow')} style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: 600, border: 'none', backgroundColor: activeTab === 'escrow' ? '#10b981' : '#0f172a', color: activeTab === 'escrow' ? '#090d16' : '#94a3b8', cursor: 'pointer' }}>
            <DollarSign style={{ width: '14px', height: '14px', display: 'inline', marginRight: '6px' }} /> P2P Referral Escrow
          </button>
        </div>

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
                Dictate materials and crew man-hours together (e.g. <i>"Need 6 pieces of wood, 14 tiles, and 2 man hours"</i>).
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
                  <span>{transcribing ? 'Extracting Materials & Labor...' : 'Generate Estimate Breakdown'}</span>
                </button>
              </form>
            </div>

            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingCart style={{ width: '18px', height: '18px', color: '#10b981' }} />
                <span>Job Estimates & Extracted Carts</span>
              </h2>

              {voiceLogs.length === 0 ? (
                <div style={{ border: '1px dashed #1e293b', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                  No estimates recorded yet. Record or type a field note above to generate materials and crew hours.
                </div>
              ) : (
                voiceLogs.map((log, logIdx) => {
                  const currentCardTab = cardTabs[log.id] || 'materials';
                  const totalLaborHours = (log.labor_breakdown || []).reduce((sum: number, l: any) => sum + (Number(l.hours) || 0), 0);
                  const materialCount = log.extracted_materials?.length || 0;

                  return (
                    <div key={log.id} style={{ backgroundColor: '#090d16', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
                      <p style={{ fontSize: '13px', color: '#cbd5e1', fontStyle: 'italic', margin: '0 0 16px', backgroundColor: '#0f172a', padding: '10px 14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                        "{log.raw_transcript}"
                      </p>

                      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #1e293b', paddingBottom: '12px', marginBottom: '16px' }}>
                        <button
                          onClick={() => setCardTabs((prev) => ({ ...prev, [log.id]: 'materials' }))}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            border: 'none',
                            backgroundColor: currentCardTab === 'materials' ? '#10b981' : '#1e293b',
                            color: currentCardTab === 'materials' ? '#090d16' : '#94a3b8',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <ShoppingCart style={{ width: '14px', height: '14px' }} />
                          <span>Materials ({materialCount})</span>
                        </button>

                        <button
                          onClick={() => setCardTabs((prev) => ({ ...prev, [log.id]: 'labor' }))}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            border: 'none',
                            backgroundColor: currentCardTab === 'labor' ? '#38bdf8' : '#1e293b',
                            color: currentCardTab === 'labor' ? '#090d16' : '#94a3b8',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Users style={{ width: '14px', height: '14px' }} />
                          <span>Labor & Crew Hours ({totalLaborHours} hrs)</span>
                        </button>
                      </div>

                      {currentCardTab === 'materials' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {log.extracted_materials?.map((item: any, itemIdx: number) => (
                            <div key={itemIdx} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '10px 14px', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                              <input
                                type="text"
                                value={item.item}
                                onChange={(e) => updateMaterialItem(logIdx, itemIdx, 'item', e.target.value)}
                                style={{ flex: 3, backgroundColor: '#090d16', border: '1px solid #334155', borderRadius: '6px', padding: '8px', color: '#ffffff', fontSize: '13px' }}
                              />
                              <input
                                type="text"
                                value={item.qty}
                                onChange={(e) => updateMaterialItem(logIdx, itemIdx, 'qty', e.target.value)}
                                style={{ flex: 1, backgroundColor: '#090d16', border: '1px solid #334155', borderRadius: '6px', padding: '8px', color: '#10b981', fontSize: '12px', fontWeight: 'bold' }}
                              />
                              <button
                                onClick={() => deleteMaterialItem(logIdx, itemIdx)}
                                style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                              >
                                <Trash2 style={{ width: '16px', height: '16px' }} />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addMaterialItem(logIdx)}
                            style={{ alignSelf: 'flex-start', marginTop: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#10b981', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Plus style={{ width: '12px', height: '12px' }} /> Add Material Line Item
                          </button>
                        </div>
                      )}

                      {currentCardTab === 'labor' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {(log.labor_breakdown || []).length === 0 ? (
                            <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', margin: '4px 0 8px' }}>
                              No labor hours spoken in this note. Click below to add crew tiers manually.
                            </p>
                          ) : (
                            log.labor_breakdown.map((labor: any, laborIdx: number) => (
                              <div key={laborIdx} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '10px 14px', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <Users style={{ width: '16px', height: '16px', color: '#38bdf8' }} />
                                <input
                                  type="text"
                                  value={labor.tier}
                                  onChange={(e) => updateLaborItem(logIdx, laborIdx, 'tier', e.target.value)}
                                  style={{ flex: 3, backgroundColor: '#090d16', border: '1px solid #334155', borderRadius: '6px', padding: '8px', color: '#ffffff', fontSize: '13px' }}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                                  <Clock style={{ width: '14px', height: '14px', color: '#94a3b8' }} />
                                  <input
                                    type="number"
                                    value={labor.hours}
                                    onChange={(e) => updateLaborItem(logIdx, laborIdx, 'hours', Number(e.target.value))}
                                    style={{ width: '60px', backgroundColor: '#090d16', border: '1px solid #334155', borderRadius: '6px', padding: '8px', color: '#38bdf8', fontSize: '12px', fontWeight: 'bold' }}
                                  />
                                  <span style={{ fontSize: '12px', color: '#64748b' }}>hrs</span>
                                </div>
                                <button
                                  onClick={() => deleteLaborItem(logIdx, laborIdx)}
                                  style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                                >
                                  <Trash2 style={{ width: '16px', height: '16px' }} />
                                </button>
                              </div>
                            ))
                          )}
                          <button
                            onClick={() => addLaborItem(logIdx)}
                            style={{ alignSelf: 'flex-start', marginTop: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#38bdf8', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Plus style={{ width: '12px', height: '12px' }} /> Add Crew Seniority Tier
                          </button>
                        </div>
                      )}

                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
