'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VoiceQuotePage() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [clientName, setClientName] = useState("Sarah Miller");
  const [clientPhone, setClientPhone] = useState("(203) 555-0148");
  const [laborHours, setLaborHours] = useState(4);
  const [hourlyRate, setHourlyRate] = useState(150);
  const [materialsCost, setMaterialsCost] = useState(350);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = false;
        reco.interimResults = true;
        reco.lang = 'en-US';

        reco.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);

          // Live smart extraction of hours & material dollars from spoken words
          const hoursMatch = text.match(/(\d+)\s*hour/i);
          if (hoursMatch) setLaborHours(parseInt(hoursMatch[1], 10));

          const dollarMatch = text.match(/\$?(\d+)\s*(?:in\s*)?material/i);
          if (dollarMatch) setMaterialsCost(parseInt(dollarMatch[1], 10));
        };

        reco.onerror = () => setRecording(false);
        reco.onend = () => setRecording(false);
        setRecognition(reco);
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition) {
      setTranscript("Replace corroded 50-amp outdoor subpanel and run new conduit, 4 hours labor, $350 materials.");
      return;
    }
    if (recording) {
      recognition.stop();
      setRecording(false);
    } else {
      setTranscript("");
      recognition.start();
      setRecording(true);
    }
  };

  const totalQuote = laborHours * hourlyRate + materialsCost;

  const handleSendTextQuote = () => {
    const body = encodeURIComponent(
      `Hi ${clientName}, here is your estimate from JobAllies:\nScope: ${transcript || '50-amp subpanel installation & materials'}\nTotal Price: $${totalQuote}\nApprove & lock in schedule here: https://joballies.com/quote/8492`
    );
    window.location.href = `sms:${clientPhone.replace(/[^0-9]/g, '')}?&body=${body}`;
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-5 md:p-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">JobAllies Field Tool</span>
            <h1 className="text-3xl font-extrabold text-white">🎙️ Talk-to-Quote</h1>
            <p className="text-xs text-slate-400 mt-1">Speak your job notes from the truck. Text a clean quote in 30 seconds.</p>
          </div>
          <Link href="/dashboard" className="bg-slate-900 border border-slate-800 hover:bg-slate-800 px-4 py-2.5 rounded-xl text-slate-300 text-xs font-bold transition">
            ← Back to Truck Cab
          </Link>
        </div>

        {/* Big Truck-Friendly Mic Card */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-6 shadow-2xl">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Step 1: Tap & Talk</span>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Say what you're doing, how many hours it'll take, and rough material cost.
            </p>
          </div>

          <button 
            onClick={toggleRecording}
            className={`w-28 h-28 rounded-full flex flex-col items-center justify-center mx-auto transition shadow-2xl border-4 ${
              recording 
                ? 'bg-red-600 border-red-400 animate-pulse text-white' 
                : 'bg-blue-600 hover:bg-blue-500 border-blue-400/40 text-white'
            }`}
          >
            <span className="text-4xl">{recording ? '🛑' : '🎤'}</span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider mt-1">
              {recording ? 'Stop' : 'Tap to Talk'}
            </span>
          </button>

          <div className="text-left space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Job Description (Speak or Type to Edit):</label>
            <textarea
              rows={3}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="e.g., Replace 50-amp subpanel in basement, 4 hours labor, $350 materials..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Live Editable Math & Homeowner Send Card */}
        <div className="bg-slate-900 border border-emerald-500/40 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Step 2: Check Your Numbers</span>
              <h3 className="text-xl font-extrabold text-white">Instant Homeowner Quote</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Total Price</span>
              <span className="text-3xl font-extrabold text-emerald-400">${totalQuote.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Homeowner Name</label>
              <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Homeowner Cell #</label>
              <input type="text" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Labor Hours</label>
              <input type="number" value={laborHours} onChange={(e) => setLaborHours(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm font-bold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Hourly Rate ($/hr)</label>
              <input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm font-bold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Materials ($)</label>
              <input type="number" value={materialsCost} onChange={(e) => setMaterialsCost(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm font-bold" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button 
              onClick={handleSendTextQuote}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold w-full py-4 rounded-2xl transition text-sm shadow-lg shadow-emerald-600/25"
            >
              📲 Text Quote to {clientName} (${totalQuote.toLocaleString()})
            </button>
            <Link 
              href="/quote/8492"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-4 px-6 rounded-2xl transition text-sm text-center whitespace-nowrap"
            >
              Preview Homeowner Link ↗
            </Link>
          </div>
        </div>
      </div>

      <footer className="max-w-3xl mx-auto w-full text-center border-t border-slate-800/80 pt-8 mt-16 text-xs text-slate-500">
        © {new Date().getFullYear()} JobAllies — All rights reserved. (from UpLevel Labs, Inc.)
      </footer>
    </main>
  );
}
