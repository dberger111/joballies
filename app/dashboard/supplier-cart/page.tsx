'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function SupplierCartPage() {
  const [copied, setCopied] = useState(false);

  const materialList = `JOBALLIES WHOLESALE ORDER:
- 50-Amp Outdoor Subpanel Kit (SKU: #100-294-392) | Qty: 1 | $240.00
- THHN Copper Wire 50ft Roll (SKU: #492-102-383) | Qty: 1 | $110.00
Account: Home Depot Pro Xtra #HD-99420`;

  const handleCopyList = () => {
    navigator.clipboard.writeText(materialList);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">JobAllies</span>
            <h1 className="text-3xl font-extrabold text-white">Wholesale SKU Clipboard & Exporter</h1>
          </div>
          <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm transition">
            ← Dashboard
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Active Quote #8492 Material List</h3>
            <span className="text-xs font-medium text-blue-400 bg-blue-950/50 px-3 py-1 rounded-full border border-blue-800/50">
              Pro Xtra #HD-99420
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Because major distributors do not allow third-party cart injection APIs, JobAllies instantly formats and copies your SKU list for quick-paste into Home Depot Pro, Lowe's, or regional supply portals.
          </p>

          <div className="space-y-3 pt-2 font-mono text-xs bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 whitespace-pre-line">
            {materialList}
          </div>

          <div className="pt-2 flex gap-4">
            <button 
              onClick={handleCopyList} 
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold w-full py-3 rounded-xl transition text-sm shadow-lg shadow-blue-600/25"
            >
              {copied ? "Copied to Clipboard! Ready to Paste in Supplier App ✓" : "Copy Formatted SKU List to Clipboard"}
            </button>
          </div>
        </div>
      </div>
      <footer className="max-w-3xl mx-auto w-full text-center border-t border-slate-800/80 pt-8 mt-16 text-xs text-slate-500">
        JobAllies (from UpLevel Labs, Inc.) — All rights reserved.
      </footer>
    </main>
  );
}
