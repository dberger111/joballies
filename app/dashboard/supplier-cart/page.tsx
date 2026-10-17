'use client';
import { useState } from 'react';
import Link from 'next/link';
import SiteFooter from '../../components/SiteFooter';
import FeedbackWidget from '../../components/FeedbackWidget';

export default function SupplierCartPage() {
  const [items] = useState([
    { id: 1, name: 'PVC Schedule 40 Pipe (20ft)', qty: 6, unitPrice: 24.50, supplier: 'Home Depot Pro' },
    { id: 2, name: 'Waterproof Membrane Roll (300 sq ft)', qty: 2, unitPrice: 185.00, supplier: 'SiteOne / Local Supply' },
    { id: 3, name: 'Cement Backer Board (1/2 in)', qty: 15, unitPrice: 16.75, supplier: 'Home Depot Pro' },
  ]);
  const [proNumber, setProNumber] = useState('HD-PRO-948210');
  const [exported, setExported] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.qty * item.unitPrice, 0);

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-5 md:p-10 flex flex-col justify-between relative">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <header className="flex justify-between items-center border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">
              JA
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
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">📦 Active Order List</span>
              <h2 className="text-lg font-extrabold text-white">Materials Required for Current Leads</h2>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-400">Pro Account ID:</label>
              <input
                type="text"
                value={proNumber}
                onChange={(e) => setProNumber(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-emerald-400 w-36"
              />
            </div>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  <p className="text-xs text-slate-400">Supplier: <strong className="text-slate-200">{item.supplier}</strong></p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-300">Qty: <strong className="text-white">{item.qty}</strong></span>
                  <span className="text-xs font-black text-emerald-400">${(item.qty * item.unitPrice).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-400">Estimated Wholesale Total</p>
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
              <p className="text-xs font-extrabold text-emerald-400">✓ Wholesale order cart exported successfully with account #{proNumber}!</p>
            </div>
          )}
        </section>
      </div>

      <FeedbackWidget />
      <SiteFooter />
    </main>
  );
}
