'use client';
import { useState } from 'react';
import Link from 'next/link';
import SiteFooter from '../../components/SiteFooter';
import Logo from '../../components/Logo';

export default function QuoteWizardPage() {
  const [laborHours, setLaborHours] = useState(12);
  const [seniority, setSeniority] = useState('Skilled Trade');
  const [markup, setMarkup] = useState(20);
  const [selectedRetailer, setSelectedRetailer] = useState<'homedepot' | 'lowes' | 'siteone'>('homedepot');

  // Seniority rate mapping
  const seniorityRates: Record<string, number> = {
    'Senior Supervisor': 165,
    'Supervisor': 145,
    'Specialty Trade': 135,
    'Skilled Trade': 115,
    'Worker': 85
  };

  const hourlyRate = seniorityRates[seniority] || 115;

  const materials = [
    { id: 1, name: 'PVC Schedule 40 Pipe & Fittings', qty: 6, homedepot: 24.50, lowes: 23.80, siteone: 26.00 },
    { id: 2, name: 'Waterproof Membrane Roll (300 sq ft)', qty: 2, homedepot: 185.00, lowes: 189.00, siteone: 179.00 },
    { id: 3, name: 'Cement Backer Board (1/2 in)', qty: 15, homedepot: 16.75, lowes: 16.50, siteone: 17.25 },
  ];

  const rawMaterialsTotal = materials.reduce((acc, m) => acc + m.qty * m[selectedRetailer], 0);
  const markedUpMaterials = rawMaterialsTotal * (1 + markup / 100);
  const laborTotal = laborHours * hourlyRate;
  const grandTotal = laborTotal + markedUpMaterials;

  const handleApprove = () => {
    alert(`✓ Quote approved and successfully dispatched to homeowner! Grand Total: $${grandTotal.toFixed(2)} (Sourced from ${selectedRetailer.toUpperCase()} with ${markup}% markup).`);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <header className="flex justify-between items-center border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <Link href="/dashboard"><Logo size="sm" /></Link>
            <div>
              <h1 className="text-xl font-extrabold text-white">Interactive Quote Wizard #SAMPLE-QUOTE</h1>
              <p className="text-xs text-slate-400">Select Retailers, Set Seniority Level & Apply Custom Markups</p>
            </div>
          </div>
          <Link href="/dashboard" className="bg-slate-900 border border-slate-800 hover:border-blue-500 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl transition">
            ← Return to Dashboard
          </Link>
        </header>

        <section className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">📦 Material Sourcing & Retailer Pricing</span>
              <h3 className="text-lg font-extrabold text-white">Compare & Select Supplier</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setSelectedRetailer('homedepot')} className={`px-3.5 py-2 rounded-xl text-xs font-bold transition border ${selectedRetailer === 'homedepot' ? 'bg-orange-600 border-orange-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>Home Depot Pro</button>
              <button onClick={() => setSelectedRetailer('lowes')} className={`px-3.5 py-2 rounded-xl text-xs font-bold transition border ${selectedRetailer === 'lowes' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>Lowe's Pro</button>
              <button onClick={() => setSelectedRetailer('siteone')} className={`px-3.5 py-2 rounded-xl text-xs font-bold transition border ${selectedRetailer === 'siteone' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>SiteOne Supply</button>
            </div>
          </div>

          <div className="space-y-3">
            {materials.map((m) => {
              const unitPrice = m[selectedRetailer];
              const lineTotal = m.qty * unitPrice * (1 + markup / 100);
              return (
                <div key={m.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-white">{m.name} (Qty: {m.qty})</p>
                    <p className="text-slate-400">Base Sourced from {selectedRetailer.toUpperCase()}: ${unitPrice.toFixed(2)} / unit</p>
                  </div>
                  <span className="text-emerald-400 font-black text-sm">${lineTotal.toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800 pt-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Seniority Level</label>
              <select
                value={seniority}
                onChange={(e) => setSeniority(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-amber-400"
              >
                <option value="Senior Supervisor">Senior Supervisor (${seniorityRates['Senior Supervisor']}/hr)</option>
                <option value="Supervisor">Supervisor (${seniorityRates['Supervisor']}/hr)</option>
                <option value="Specialty Trade">Specialty Trade (${seniorityRates['Specialty Trade']}/hr)</option>
                <option value="Skilled Trade">Skilled Trade (${seniorityRates['Skilled Trade']}/hr)</option>
                <option value="Worker">Worker (${seniorityRates['Worker']}/hr)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Man Hours</label>
              <input
                type="number"
                value={laborHours}
                onChange={(e) => setLaborHours(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Material Markup (%)</label>
              <input
                type="number"
                value={markup}
                onChange={(e) => setMarkup(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-amber-400"
              />
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-xs text-slate-400">Calculated Final Estimate Total (Rate: ${hourlyRate}/hr)</p>
              <p className="text-3xl font-black text-white">${grandTotal.toFixed(2)}</p>
            </div>
            <button
              onClick={handleApprove}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-8 py-4 rounded-xl text-xs transition shadow-lg shadow-emerald-600/30 w-full sm:w-auto text-center"
            >
              ✓ Approve Quote & Lock In Schedule (${grandTotal.toFixed(2)})
            </button>
          </div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
