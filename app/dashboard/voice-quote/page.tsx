'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function VoiceQuotePage() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [generated, setGenerated] = useState(false);

  const toggleRecording = () => {
    if (!recording) {
      setRecording(true);
      setTranscript("Listening... Speak your project scope out loud.");
      setTimeout(() => {
        setTranscript("50-amp subpanel installation in basement, 4 hours labor, $350 materials, client is Sarah Miller in Westport CT.");
        setRecording(false);
        setGenerated(true);
      }, 3500);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">JobAllies</span>
            <h1 className="text-3xl font-extrabold text-white">Voice-to-Estimate Field Assistant</h1>
          </div>
          <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm transition">
            ← Dashboard
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-6 shadow-2xl">
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Tap the microphone and speak your job notes from the truck. Our AI instantly parses your voice into a professional line-item quote.
          </p>

          <button 
            onClick={toggleRecording}
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto text-3xl transition shadow-xl ${recording ? 'bg-red-600 animate-pulse text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
          >
            {recording ? '🎙️' : '🎤'}
          </button>

          <p className="text-xs font-mono text-slate-400 bg-slate-950 p-4 rounded-xl border border-slate-800">
            {transcript || "Tap microphone to start voice recording..."}
          </p>
        </div>

        {generated && (
          <div className="bg-slate-900 border border-emerald-500/50 p-6 rounded-2xl space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Generated Estimate #8492</h3>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full">Ready to Text</span>
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              <p><strong>Client:</strong> Sarah Miller (Westport, CT)</p>
              <p><strong>Scope:</strong> 50-amp subpanel installation</p>
              <p><strong>Labor:</strong> 4 hours ($600)</p>
              <p><strong>Materials:</strong> Subpanel kit & breakers ($350)</p>
              <p className="text-emerald-400 font-bold pt-2">Total Estimate: $950.00</p>
            </div>
            <div className="pt-2 flex gap-4">
              <button onClick={() => alert("Estimate sent via SMS and Email!")} className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold w-full py-3 rounded-xl transition text-sm">
                Send Quote to Client via SMS
              </button>
            </div>
          </div>
        )}
      </div>
      <footer className="max-w-3xl mx-auto w-full text-center border-t border-slate-800/80 pt-8 mt-16 text-xs text-slate-500">
        JobAllies (from UpLevel Labs, Inc.) — All rights reserved.
      </footer>
    </main>
  );
}
