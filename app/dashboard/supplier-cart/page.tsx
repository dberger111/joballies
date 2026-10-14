'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function SupplierCartPage() {
  const [copied, setCopied] = useState(false);
  const [proAccountId, setProAccountId] = useState("HD-PRO-99420");
  const [items, setItems] = useState([
    { name: "Square D 100A Outdoor Load Center Subpanel Kit", sku: "100-294-392", qty: 1, price: 240 },
    { name: "Southwire 50ft THHN 6-AWG Copper Wire Roll", sku: "492-102-383", qty: 1, price: 110 },
    { name: "3/4-in Schedule 40 PVC Conduit & Fittings Pack", sku: "218-884-109", qty: 2, price: 35 }
  ]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState(1);

  const formattedOrderPad = `SUPPLY HOUSE WILL-CALL / PRO ORDER
Account ID: ${proAccountId}
----------------------------------------
${items.map((i) => `• [Qty: ${i.qty}]${i.name} (Part/SKU #${i.sku}) -$${i.price * i.qty}`).join('\n')}
----------------------------------------
Estimated Material Total: $${items.reduce((acc, i) => acc + i.price * i.qty, 0)}
Prepared via JobAllies Supply House Express`;

  const handleCopyList = () => {
    navigator.clipboard.writeText(formattedOrderPad);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;
    setItems([...items, { name: newItemName, sku: "CUSTOM-PART", qty: newItemQty, price: 45 }]);
    setNewItemName("");
    setNewItemQty(1);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-5 md:p-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">JobAllies Field Tool</span>
            <h1 className="text-3xl font-extrabold text-white">📦 Supply House Express</h1>
            <p className="text-xs text-slate-400 mt-1">1-tap material list ready for the Pro Desk or your local counter rep.</p>
          </div>
          <Link href="/dashboard" className="bg-slate-900 border border-slate-800 hover:bg-slate-800 px-4 py-2.5 rounded-xl text-slate-300 text-xs font-bold transition">
            ← Back to Truck Cab
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-white">Jobsite Material Order Pad</h3>
              <p className="text-xs text-slate-400">Copy this list to paste into Home Depot Pro, Lowe's, or text to your supply house rep for Will-Call pickup.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Pro Account #:</span>
              <input 
                type="text" 
                value={proAccountId} 
                onChange={(e) => setProAccountId(e.target.value)}
                className="bg-slate-950 border border-orange-500/40 text-orange-400 font-mono text-xs px-3 py-1.5 rounded-lg w-36"
              />
            </div>
          </div>

          {/* Add Part Form */}
          <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              placeholder="Add extra part (e.g., 2x4 Pressure Treated, 80lb Sakrete)..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white"
            />
            <input 
              type="number" 
              min={1}
              value={newItemQty}
              onChange={(e) => setNewItemQty(Number(e.target.value))}
              className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-bold"
            />
            <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-3 rounded-xl text-xs whitespace-nowrap">
              + Add to List
            </button>
          </form>

          {/* Clean Order Pad Preview */}
          <div className="font-mono text-xs bg-slate-950 p-5 rounded-2xl border border-slate-800 text-slate-200 whitespace-pre-line leading-relaxed">
            {formattedOrderPad}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button 
              onClick={handleCopyList} 
              className="bg-orange-600 hover:bg-orange-500 text-white font-extrabold py-4 px-4 rounded-2xl transition text-xs shadow-lg shadow-orange-600/25 sm:col-span-2"
            >
              {copied ? "✓ Copied! Ready to Paste in Supplier App or Text" : "📋 Copy Order Pad to Clipboard"}
            </button>
            <a 
              href={`sms:?&body=${encodeURIComponent(formattedOrderPad)}`}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-4 rounded-2xl transition text-xs text-center flex items-center justify-center"
            >
              📲 Text to Counter Rep
            </a>
          </div>

          {/* Direct Quick-Search Retailer Links */}
          <div className="border-t border-slate-800 pt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <span>Jump straight to supplier desk:</span>
            <div className="flex flex-wrap gap-3">
              <a href="https://www.homedepot.com" target="_blank" className="text-orange-400 hover:underline font-bold">Home Depot Pro ↗</a>
              <a href="https://www.lowes.com" target="_blank" className="text-blue-400 hover:underline font-bold">Lowe's Pro ↗</a>
              <a href="https://www.ferguson.com" target="_blank" className="text-emerald-400 hover:underline font-bold">Ferguson ↗</a>
              <a href="https://www.siteone.com" target="_blank" className="text-amber-400 hover:underline font-bold">SiteOne ↗</a>
            </div>
          </div>
        </div>
      </div>

      <footer className="max-w-3xl mx-auto w-full text-center border-t border-slate-800/80 pt-8 mt-16 text-xs text-slate-500">
        © {new Date().getFullYear()} JobAllies — All rights reserved. (from UpLevel Labs, Inc.)
      </footer>
    </main>
  );
}
