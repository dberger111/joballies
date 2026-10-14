'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function PortfolioManager() {
  const [photos, setPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1541888946425-d0fbb18f2f2d?w=800&auto=format&fit=crop&q=60"
  ]);
  const [businessName, setBusinessName] = useState("Precision Stone & Masonry");
  const [trade, setTrade] = useState("Mason");
  const [saved, setSaved] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">JobAllies</span>
            <h1 className="text-3xl font-extrabold text-white">Portfolio & Public Landing Page</h1>
          </div>
          <Link href="/profile/sample-contractor" target="_blank" className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold px-4 py-2 rounded-xl transition">
            Preview Public Page ↗
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-lg font-semibold text-white">Business Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Business Name</label>
              <input 
                type="text" 
                value={businessName} 
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Primary Trade</label>
              <input 
                type="text" 
                value={trade} 
                onChange={(e) => setTrade(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-white">Project Photos</h3>
              <p className="text-xs text-slate-400">Upload photos of your best work for your public landing page.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {photos.map((url, idx) => (
              <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <img src={url} alt="Project work" className="object-cover w-full h-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-lg font-semibold text-white">Automated Review Request</h3>
          <p className="text-sm text-slate-400">
            Send an automated text to your client after a job is complete, prompting them to leave a 5-star review on Google or Yelp.
          </p>
          <button 
            onClick={() => alert("Review request text queued via Twilio!")}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-6 py-3 rounded-xl transition"
          >
            Send Test Review Request SMS
          </button>
        </div>

        <div className="flex justify-end gap-4">
          <button 
            onClick={() => setSaved(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition"
          >
            Save Portfolio
          </button>
        </div>
        {saved && <p className="text-emerald-400 text-sm text-center">Portfolio successfully updated and published live!</p>}
      </div>

      <footer className="max-w-4xl mx-auto w-full text-center border-t border-slate-800/80 pt-8 mt-16 text-xs text-slate-500">
        JobAllies (from UpLevel Labs, Inc.) — All rights reserved.
      </footer>
    </main>
  );
}
