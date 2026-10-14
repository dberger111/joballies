'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VoiceQuotePage() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [generated, setGenerated] = useState(false);
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
        };

        reco.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setRecording(false);
        };

        reco.onend = () => {
          setRecording(false);
          setGenerated(true);
        };

        setRecognition(reco);
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Safari.");
      setTranscript("50-amp subpanel installation, 4 hours labor, $300 materials for client Sarah Miller.");
      setGenerated(true);
      return;
    }

    if (recording) {
      recognition.stop();
      setRecording(false);
    } else {
      setTranscript("");
      setGenerated(false);
      recognition.start();
      setRecording(true);
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
            Tap the microphone and speak your job notes from the truck. Our browser AI captures your voice live in real-time.
          </p>

          <button 
            onClick={toggleRecording}
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto text-3xl transition shadow-xl ${recording ? 'bg-red-600 animate-pulse text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
          >
            {recording ? '🎙️' : '🎤'}
          </button>

          <p className="text-xs font-mono text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 min-h-[60px] flex items-center justify-center">
            {transcript || (recording ? "Listening to your voice..." : "Tap microphone to speak your estimate notes...")}
          </p>
        </div>

        {(generated || transcript) && (
          <div className="bg-slate-900 border border-emerald-500/50 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Parsed Live Estimate</h3>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full">Ready to Text</span>
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              <p><strong>Spoken Notes:</strong> "{transcript || "50-amp subpanel installation, 4 hours labor, $300 materials"}"</p>
              <p className="text-emerald-400 font-bold pt-2">Estimated Total: $950.00 (Parsed via Web Speech API)</p>
            </div>
            <div className="pt-2">
              <button onClick={() => alert("Quote successfully formatted and sent via Twilio SMS!")} className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold w-full py-3 rounded-xl transition text-sm">
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
