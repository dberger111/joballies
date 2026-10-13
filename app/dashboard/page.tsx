'use client';

import React, { useState, useEffect } from 'react';
import { Mic, ShoppingCart, Share2, Percent, Mail, Phone, FileText } from 'lucide-react';

export default function ContractorDashboard() {
  const [mounted, setMounted] = useState(false);
  const [markupPercent, setMarkupPercent] = useState(20);
  const [voiceLogs, setVoiceLogs] = useState<any[]>([]);
  const [noteInput, setNoteInput] = useState('');
  const [activeQuoteModal, setActiveQuoteModal] = useState<any>(null);
  const [activePoModal, setActivePoModal] = useState<any>(null);

  useEffect(() => { setMounted(true); }, []);

  const handleVoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;

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
        return;
      }
    } catch (err) {}

    const newLog = {
      id: 'log-' + Date.now(),
      raw_transcript: input,
      extracted_materials: [
        { item: '4x4x10 Pressure Treated Wood Beams', qty: 6, unitCost: 28.00 },
        { item: 'Unilock Dublin Cobble Pavers / Tiles', qty: 14, unitCost: 18.50 },
        { item: 'Quikrete 80lb High Early Concrete', qty: 14, unitCost: 7.25 }
      ],
      labor_breakdown: [
        { tier: 'Standard Crew Tradesman', hours: 14, rate: 65 },
        { tier: 'Senior Lead Tech / Supervisor', hours: 2, rate: 95 }
      ]
    };

    setVoiceLogs([newLog, ...voiceLogs]);
    setNoteInput('');
  };

  const handleGenerateClientQuote = (log: any) => {
    const rawMaterialsCost = log.extracted_materials.reduce((sum: number, m: any) => sum + (m.unitCost * m.qty), 0);
    const laborCost = log.labor_breakdown.reduce((sum: number, l: any) => sum + (l.hours * l.rate), 0);
    const markedUpMaterials = rawMaterialsCost * (1 + (markupPercent / 100));

    setActiveQuoteModal({
      quoteNumber: 'Q-JA-' + Math.floor(100000 + Math.random() * 900000),
      clientName: 'Prospective Client / Jobsite #104',
      items: log.extracted_materials,
      labor: log.labor_breakdown,
      markupPercent,
      markedUpMaterials,
      laborCost,
      total: (markedUpMaterials + laborCost) * 1.0635
    });
  };

  const handleGenerateVendorPO = (log: any) => {
    const items = log.extracted_materials.map((m: any, i: number) => ({
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
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#10b981', color: '#000', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>JA</div>
          <div>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>JobAllies</span>
            <span style={{ fontSize: '10px', color: '#10b981', border: '1px solid #10b981', padding: '2px 6px', marginLeft: '6px', borderRadius: '4px' }}>PRO OS</span>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: '#10b981', backgroundColor: '#1e293b', padding: '6px 14px', borderRadius: '20px' }}>Apex Landscaping & Field Trades</div>
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', margin: '0 0 12px', color: '#10b981' }}>TradeVoice AI Dictation & Quote Builder</h2>
          <form onSubmit={handleVoiceSubmit}>
            <textarea
              rows={3}
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Dictate field materials and labor hours here..."
              style={{ width: '100%', backgroundColor: '#090d16', border: '1px solid #334155', borderRadius: '10px', padding: '12px', color: '#fff', fontSize: '14px', marginBottom: '12px' }}
            />
            <button type="submit" style={{ backgroundColor: '#10b981', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              Extract Materials & Labor
            </button>
          </form>
        </div>

        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Estimates & Active Quotes</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
              <span>Material Markup:</span>
              <select value={markupPercent} onChange={(e) => setMarkupPercent(Number(e.target.value))} style={{ backgroundColor: '#090d16', color: '#10b981', border: '1px solid #334155', padding: '4px 8px', borderRadius: '6px' }}>
                <option value={0}>0% Markup</option>
                <option value={15}>15% Markup</option>
                <option value={20}>20% Markup</option>
                <option value={25}>25% Markup</option>
              </select>
            </div>
          </div>

          {voiceLogs.length === 0 ? (
            <div style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '30px' }}>No estimates created yet. Enter field notes above.</div>
          ) : (
            voiceLogs.map((log) => (
              <div key={log.id} style={{ backgroundColor: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                <p style={{ fontStyle: 'italic', fontSize: '13px', color: '#cbd5e1', margin: '0 0 12px' }}>"{log.raw_transcript}"</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleGenerateClientQuote(log)} style={{ flex: 1, backgroundColor: '#10b981', color: '#000', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                    1. Client Quote ({markupPercent}% Markup)
                  </button>
                  <button onClick={() => handleGenerateVendorPO(log)} style={{ backgroundColor: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                    2. Internal Supplier PO
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* CLIENT QUOTE MODAL */}
      {activeQuoteModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #10b981', borderRadius: '16px', padding: '24px', maxWidth: '500px', width: '100%' }}>
            <h3 style={{ margin: '0 0 8px', color: '#10b981' }}>Client Proposal ({activeQuoteModal.quoteNumber})</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px' }}>Prepared for: {activeQuoteModal.clientName}</p>
            <div style={{ backgroundColor: '#090d16', padding: '14px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Materials ({markupPercent}% Markup):</span>
                <span style={{ fontWeight: 'bold' }}>${activeQuoteModal.markedUpMaterials.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Labor & Trade Hours:</span>
                <span style={{ fontWeight: 'bold' }}>${activeQuoteModal.laborCost.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #334155', paddingTop: '8px', marginTop: '8px', fontWeight: 'bold', color: '#10b981' }}>
                <span>Total Client Proposal:</span>
                <span>${activeQuoteModal.total.toFixed(2)}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => alert('Quote link sent via SMS!')} style={{ flex: 1, backgroundColor: '#10b981', color: '#000', padding: '10px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Send SMS Link</button>
              <button onClick={() => setActiveQuoteModal(null)} style={{ backgroundColor: '#334155', color: '#fff', padding: '10px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* VENDOR PO MODAL */}
      {activePoModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #38bdf8', borderRadius: '16px', padding: '24px', maxWidth: '500px', width: '100%' }}>
            <h3 style={{ margin: '0 0 8px', color: '#38bdf8' }}>Wholesale Merchant PO ({activePoModal.poNumber})</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px' }}>Supplier: {activePoModal.supplier}</p>
            <div style={{ backgroundColor: '#090d16', padding: '14px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#38bdf8' }}>
                <span>Wholesale Subtotal:</span>
                <span>${activePoModal.subtotal.toFixed(2)}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a href="https://www.homedepot.com/c/pro_services" target="_blank" rel="noreferrer" style={{ flex: 1, backgroundColor: '#38bdf8', color: '#000', padding: '10px', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center', textDecoration: 'none' }}>Transfer Cart</a>
              <button onClick={() => setActivePoModal(null)} style={{ backgroundColor: '#334155', color: '#fff', padding: '10px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}