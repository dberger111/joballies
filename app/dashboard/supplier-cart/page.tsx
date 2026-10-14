'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function SupplierCartPage() {
  const [ordered, setOrdered] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">JobAllies</span>
            <h1 className="text-3xl font-extrabold text-white">Wholesale Supplier Cart Sync</h1>
          </div>
          <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm transition">
            ← Dashboard
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Active Quote #8492 Materials</h3>
            <span className="text-xs font-medium text-blue-400 bg-blue-950/50 px-3 py-1 rounded-full border border-blue-800/50">
              Home Depot Pro Xtra Connected (#HD-99420)
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <p className="text-sm font-bold text-white">50-Amp Outdoor Subpanel Kit</p>
                <p className="text-xs text-slate-400">SKU: #100-294-392 • Qty: 1</p>
              </div>
              <span className="text-emerald-400 font-semibold text-sm">$240.00</span>
            </div>
            <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <p className="text-sm font-bold text-white">THHN Copper Wire (50ft Roll)</p>
                <p className="text-xs text-slate-400">SKU: #492-102-383 • Qty: 1</p>
              </div>
              <span className="text-emerald-400 font-semibold text-sm">$110.00</span>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              onClick={() => setOrdered(true)} 
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold w-full py-3 rounded-xl transition text-sm shadow-lg shadow-blue-600/25"
            >
              Push Cart to Home Depot Pro Checkout
            </button>
          </div>
          {ordered && (
            <p className="text-emerald-400 text-sm text-center pt-2 font-medium">
              Cart successfully synced! Ready for local pickup or jobsite delivery.
            </p>
          )}
        </div>
      </div>
      <footer className="max-w-3xl mx-auto w-full text-center border-t border-slate-800/80 pt-8 mt-16 text-xs text-slate-500">
        JobAllies (from UpLevel Labs, Inc.) — All rights reserved.
      </footer>
    </main>
  );
}
