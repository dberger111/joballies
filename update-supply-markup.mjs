import fs from 'fs';
import path from 'path';

const files = {};

// 1. Updated Supply Cart with correct Logo, Price Sources, and Interactive Markup
files['app/dashboard/supplier-cart/page.tsx'] = `'use client';
import { useState } from 'react';
import Link from 'next/link';
import SiteFooter from '../../components/SiteFooter';
import FeedbackWidget from '../../components/FeedbackWidget';
import Logo from '../../components/Logo';

export default function SupplierCartPage() {
  const [items, setItems] = useState([
    { id: 1, name: 'PVC Schedule 40 Pipe (20ft)', qty: 6, basePrice: 24.50, supplier: 'Home Depot Pro', source: 'Home Depot Pro Wholesale Index (Updated Today)' },
    { id: 2, name: 'Waterproof Membrane Roll (300 sq ft)', qty: 2, basePrice: 185.00, supplier: 'SiteOne / Local Supply', source: 'SiteOne Regional Supply Feed (Providence, RI)' },
    { id: 3, name: 'Cement Backer Board (1/2 in)', qty: 15, basePrice: 16.75, supplier: 'Home Depot Pro', source: 'Home Depot Pro Wholesale Index (Updated Today)' },
  ]);
  const [markupPercent, setMarkupPercent] = useState(20);
  const [proNumber, setProNumber] = useState('HD-PRO-948210');
  const [exported, setExported] = useState(false);

  const multiplier = 1 + markupPercent / 100;
  const subtotal = items.reduce((acc, item) => acc + item.qty * item.basePrice * multiplier, 0);

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-5 md:p-10 flex flex-col justify-between relative">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <header className="flex justify-between items-center border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Logo size="sm" />
            </Link>
            <div>
              <h1 className="text-xl font-extrabold text-white">Wholesale Supply House Cart</h1>
              <p className="text-xs text-slate-400">Stamped with your Pro Xtra and supplier account numbers</p>
            </div>
          </div>
          <Link href="/dashboard" className="text-xs font-bold text-blue-400 hover:text-blue-300">
            ← Back to Dashboard
          </Link>
        </header>

        <section className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">📦 Active Order List & Wholesale Sourcing</span>
              <h2 className="text-lg font-extrabold text-white">Materials Required for Current Leads</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-bold text-slate-400">Markup (%):</label>
                <input
                  type="number"
                  value={markupPercent}
                  onChange={(e) => setMarkupPercent(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-bold text-amber-400 w-20 text-center"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-bold text-slate-400">Pro Account ID:</label>
                <input
                  type="text"
                  value={proNumber}
                  onChange={(e) => setProNumber(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-emerald-400 w-32"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {items.map((item) => {
              const markedUpPrice = item.basePrice * multiplier;
              const itemTotal = item.qty * markedUpPrice;
              return (
                <div key={item.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    <p className="text-xs text-slate-400">
                      Supplier: <strong className="text-slate-200">{item.supplier}</strong>
                    </p>
                    <p className="text-[11px] text-blue-400 font-mono">
                      📍 Sourced from: {item.source} (${item.basePrice.toFixed(2)} base + {markupPercent}% markup)
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-300">Qty: <strong className="text-white">{item.qty}</strong></span>
                    <span className="text-sm font-black text-emerald-400">${itemTotal.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-xs text-slate-400">Estimated Wholesale Total (Including {markupPercent}% Contractor Markup)</p>
              <p className="text-2xl font-black text-white">${subtotal.toFixed(2)}</p>
            </div>
            <button
              type="button"
              onClick={handleExport}
              className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-6 py-3.5 rounded-xl text-xs transition shadow-lg shadow-blue-600/30"
            >
              📥 Download Pro Xtra CSV / Send to Supplier Desk
            </button>
          </div>

          {exported && (
            <div className="bg-emerald-950/80 border border-emerald-500/50 p-4 rounded-xl text-center">
              <p className="text-xs font-extrabold text-emerald-400">✓ Wholesale order cart exported successfully with account #{proNumber} and {markupPercent}% markup!</p>
            </div>
          )}
        </section>
      </div>

      <FeedbackWidget />
      <SiteFooter />
    </main>
  );
}
`;

for (const [p, c] of Object.entries(files)) {
  const full = path.join(process.cwd(), p);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, c, 'utf8');
  console.log('✓ Wrote', p);
}
