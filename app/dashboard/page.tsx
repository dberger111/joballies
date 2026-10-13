'use client';

import React, { useState, useRef } from 'react';
import { Mic, MicOff, ShoppingCart, Send, Building2, MapPin, DollarSign, Trash2, Plus, Users, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ContractorDashboard() {
  const [activeTab, setActiveTab] = useState<'leads' | 'voice' | 'escrow'>('voice');
  const [step, setStep] = useState<'materials' | 'labor'>('materials');
  const [voiceLogs, setVoiceLogs] = useState<any[]>([]);
  const [transcribing, setTranscribing] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  // Default Crew Seniority Tiers for Step 2
  const [crewTiers, setCrewTiers] = useState([
    { id: '1', role: 'General Laborer / Apprentice', hours: 8, rate: 45 },
    { id: '2', role: 'Journeyman Tradesman', hours: 6, rate: 65 },
    { id: '3', role: 'Senior Master / Supervisor', hours: 4, rate: 95 },
  ]);

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
        item: 'New Field Item',
        qty: '1 unit',
        vendor: 'Home Depot Pro',
      });
      return newLogs;
    });
  };

  const updateCrewTier = (id: string, field: 'hours' | 'rate' | 'role', val: any) => {
    setCrewTiers((prev) =>
      prev.map((tier) => (tier.id === id ? { ...tier, [field]: val } : tier))
    );
  };

  const addCrewTier = () => {
    setCrewTiers((prev) => [
      ...prev,
      { id: Date.now().toString(), role: 'Specialized Subcontractor', hours: 4, rate: 75 },
    ]);
  };

  const removeCrewTier = (id: string) => {
    setCrewTiers((prev) => prev.filter((tier) => tier.id !== id));
  };

  const totalLaborCost = crewTiers.reduce((acc, curr) => acc + curr.hours * curr.rate, 0);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ borderBottom: '1px solid #1e293b', backgroundColor: '#0f172a', padding: '0 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #1e293b', paddingBottom: '16px', marginBottom: '32px' }}>
          <button onClick={() => setActiveTab('leads')} style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: 600, border: 'none', backgroundColor: activeTab === 'leads' ? '#10b981' : '#0f172a', color: activeTab === 'leads' ? '#090d16' : '#94a3b8', cursor: 'pointer' }}>
            <MapPin style={{ width: '14px', height: '14px', display: 'inline', marginRight: '6px' }} /> Geofenced Leads
          </button>
          <button onClick={() => setActiveTab('voice')} style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: 600, border: 'none', backgroundColor: activeTab === 'voice' ? '#10b981' : '#0f172a', color: activeTab === 'voice' ? '#090d16' : '#94a3b8', cursor: 'pointer' }}>
            <Mic style={{ width: '14px', height: '14px', display: 'inline', marginRight: '6px' }} /> TradeVoice & Carts
          </button>
          <button onClick={() => setActiveTab('escrow')} style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: 600, border: 'none', backgroundColor: activeTab === 'escrow' ? '#10b981' : '#0f172a', color: activeTab === 'escrow' ? '#090d16' : '#94a3b8', cursor: 'pointer' }}>
            <DollarSign style={{ width: '14px', height: '14px', display: 'inline', marginRight: '6px' }} /> P2P Referral Escrow
          </button>
        </div>

        {activeTab === 'voice' && (
          <div>
            {/* Workflow Step Tracker Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '12px 20px', borderRadius: '12px' }}>
              <button
                onClick={() => setStep('materials')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: step === 'materials' ? '#10b981' : 'transparent',
                  color: step === 'materials' ? '#090d16' : '#94a3b8',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                <span>Step 1: Dictate Materials</span>
              </button>
              <ArrowRight style={{ width: '16px', height: '16px', color: '#475569' }} />
              <button
                onClick={() => setStep('labor')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: step === 'labor' ? '#38bdf8' : 'transparent',
                  color: step === 'labor' ? '#090d16' : '#94a3b8',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                <span>Step 2: Seniority Labor Estimate</span>
              </button>
            </div>

            {/* STEP 1: Dictate Materials */}
            {step === 'materials' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mic style={{ width: '18px', height: '18px', color: '#10b981' }} />
                      <span>Field Voice AI Assistant</span>
                    </h2>
                    <button
                      type="button"
                      onClick={toggleRecording}
                      style={{
                        backgroundColor: isRecording ? '#ef4444' : '#10b981',
                        color: '#ffffff',
                        border: 'none',
                        padding: '8px 14px',
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
                      <span>{isRecording ? 'Recording (Tap to Stop)' : 'Tap to Record'}</span>
                    </button>
                  </div>

                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px' }}>
                    Dictate field materials hands-free. GPT-4o will parse items into wholesale carts.
                  </p>

                  <form onSubmit={handleVoiceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <textarea
                      rows={5}
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="Need 6 pieces of wood, 14 tiles, and 2 tons of cement..."
                      style={{ width: '100%', backgroundColor: '#090d16', border: isRecording ? '2px solid #ef4444' : '1px solid #1e293b', borderRadius: '12px', padding: '12px', color: '#ffffff', fontSize: '14px' }}
                    />
                    <button
                      type="submit"
                      disabled={transcribing || !noteInput}
                      style={{ backgroundColor: '#10b981', color: '#090d16', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: transcribing || !noteInput ? 0.6 : 1 }}
                    >
                      <Send style={{ width: '14px', height: '14px' }} />
                      <span>{transcribing ? 'Extracting Cart...' : 'Extract Wholesale Cart'}</span>
                    </button>
                  </form>
                </div>

                <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShoppingCart style={{ width: '18px', height: '18px', color: '#10b981' }} />
                      <span>Generated Material Carts (Editable)</span>
                    </h2>

                    {voiceLogs.length === 0 ? (
                      <div style={{ border: '1px dashed #1e293b', borderRadius: '12px', padding: '32px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                        No materials extracted yet. Speak or type field notes, then click "Extract Wholesale Cart".
                      </div>
                    ) : (
                      voiceLogs.map((log, logIdx) => (
                        <div key={logIdx} style={{ backgroundColor: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                          <p style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', margin: '0 0 12px' }}>"{log.raw_transcript}"</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {log.extracted_materials?.map((item: any, itemIdx: number) => (
                              <div key={itemIdx} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '10px', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input
                                  type="text"
                                  value={item.item}
                                  onChange={(e) => updateMaterialItem(logIdx, itemIdx, 'item', e.target.value)}
                                  style={{ flex: 2, backgroundColor: '#090d16', border: '1px solid #334155', borderRadius: '6px', padding: '6px', color: '#ffffff', fontSize: '12px' }}
                                />
                                <input
                                  type="text"
                                  value={item.qty}
                                  onChange={(e) => updateMaterialItem(logIdx, itemIdx, 'qty', e.target.value)}
                                  style={{ flex: 1, backgroundColor: '#090d16', border: '1px solid #334155', borderRadius: '6px', padding: '6px', color: '#10b981', fontSize: '11px', fontWeight: 'bold' }}
                                />
                                <button
                                  onClick={() => deleteMaterialItem(logIdx, itemIdx)}
                                  style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                                >
                                  <Trash2 style={{ width: '14px', height: '14px' }} />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => addMaterialItem(logIdx)}
                              style={{ alignSelf: 'flex-start', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#10b981', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Plus style={{ width: '12px', height: '12px' }} /> Add Line Item
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <button
                    onClick={() => setStep('labor')}
                    style={{
                      marginTop: '20px',
                      backgroundColor: '#38bdf8',
                      color: '#090d16',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '10px',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>Proceed to Step 2: Seniority Labor Breakdown</span>
                    <ArrowRight style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Seniority Man Hours & Billing */}
            {step === 'labor' && (
              <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '28px', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8' }}>
                      <Users style={{ width: '20px', height: '20px' }} />
                      <span>Job Labor & Crew Seniority Breakdown</span>
                    </h2>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0' }}>
                      Configure billable man-hours and hourly rates per crew seniority level.
                    </p>
                  </div>
                  <div style={{ backgroundColor: '#090d16', border: '1px solid #334155', padding: '8px 16px', borderRadius: '10px', textAlign: 'right' }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>ESTIMATED LABOR TOTAL</span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#38bdf8' }}>${totalLaborCost.toLocaleString()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  {crewTiers.map((tier) => (
                    <div key={tier.id} style={{ backgroundColor: '#090d16', border: '1px solid #1e293b', padding: '14px', borderRadius: '10px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <Users style={{ width: '16px', height: '16px', color: '#38bdf8' }} />
                      <input
                        type="text"
                        value={tier.role}
                        onChange={(e) => updateCrewTier(tier.id, 'role', e.target.value)}
                        style={{ flex: 2, backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '8px', color: '#ffffff', fontSize: '13px' }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock style={{ width: '14px', height: '14px', color: '#94a3b8' }} />
                        <input
                          type="number"
                          value={tier.hours}
                          onChange={(e) => updateCrewTier(tier.id, 'hours', Number(e.target.value))}
                          style={{ width: '60px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '8px', color: '#38bdf8', fontSize: '13px', fontWeight: 'bold' }}
                        />
                        <span style={{ fontSize: '12px', color: '#64748b' }}>hrs</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>@ $</span>
                        <input
                          type="number"
                          value={tier.rate}
                          onChange={(e) => updateCrewTier(tier.id, 'rate', Number(e.target.value))}
                          style={{ width: '60px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '8px', color: '#10b981', fontSize: '13px', fontWeight: 'bold' }}
                        />
                        <span style={{ fontSize: '12px', color: '#64748b' }}>/hr</span>
                      </div>
                      <div style={{ width: '80px', textAlign: 'right', fontWeight: 'bold', fontSize: '13px', color: '#ffffff' }}>
                        ${(tier.hours * tier.rate).toLocaleString()}
                      </div>
                      <button
                        onClick={() => removeCrewTier(tier.id)}
                        style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                      >
                        <Trash2 style={{ width: '16px', height: '16px' }} />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={addCrewTier}
                    style={{ alignSelf: 'flex-start', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#38bdf8', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Plus style={{ width: '14px', height: '14px' }} /> Add Crew Seniority Tier
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', borderTop: '1px solid #1e293b', paddingTop: '20px' }}>
                  <button
                    onClick={() => setStep('materials')}
                    style={{ backgroundColor: '#1e293b', color: '#94a3b8', border: '1px solid #334155', padding: '12px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Back to Materials
                  </button>
                  <button
                    onClick={() => alert('Full Job Estimate (Materials + Labor) generated!')}
                    style={{ backgroundColor: '#10b981', color: '#090d16', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <CheckCircle2 style={{ width: '16px', height: '16px' }} /> Save & Complete Estimate
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
