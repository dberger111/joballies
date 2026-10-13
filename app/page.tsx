'use client';

import React, { useState } from 'react';
import { 
  Mic, MapPin, Share2, DollarSign, ShoppingCart, Globe, 
  CheckCircle, ArrowRight, ShieldCheck, Zap, Layers 
} from 'lucide-react';

export default function JobAlliesHome() {
  const [lang, setLang] = useState<'EN' | 'ES'>('EN');
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [radius, setRadius] = useState(15);

  const toggleVoice = () => {
    if (!voiceActive) {
      setVoiceActive(true);
      setVoiceText(lang === 'EN' 
        ? "Logged: 200 sq ft paver patio in Weston. Auto-cart generated for SiteOne." 
        : "Registrado: Patio de adoquines de 200 pies cuadrados. Carrito generado para SiteOne.");
    } else {
      setVoiceActive(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
              JA
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">JobAllies</span>
              <span className="text-xs text-emerald-400 block -mt-1 font-medium">.com</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setLang(lang === 'EN' ? 'ES' : 'EN')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'EN' ? 'ESPAÑOL' : 'ENGLISH'}</span>
            </button>
            <a 
              href="#demo" 
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-lg font-semibold text-sm transition shadow-md shadow-emerald-500/20"
            >
              {lang === 'EN' ? 'Launch App' : 'Iniciar App'}
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium mb-6">
          <Zap className="w-3.5 h-3.5" />
          <span>{lang === 'EN' ? 'AI-Powered Field Trade Network' : 'Red de Trabajos de Campo con IA'}</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6">
          {lang === 'EN' ? 'Win and share more work with less effort.' : 'Gana y comparte más trabajo con menos esfuerzo.'}
        </h1>
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          {lang === 'EN' 
            ? 'The bilingual SaaS platform for landscaping, pest control, pool care, and field trades. Voice logging, regional lead routing, and instant material carts.' 
            : 'La plataforma SaaS bilingüe para jardinería, control de plagas y mantenimiento. Registro de voz, enrutamiento local y carritos de materiales.'}
        </p>
      </section>

      {/* Interactive Demo Panel */}
      <section id="demo" className="max-w-6xl mx-auto px-4 pb-24">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Feature 1: TradeVoice AI */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-white flex items-center space-x-2">
                  <Mic className="w-5 h-5 text-emerald-400" />
                  <span>TradeVoice AI</span>
                </h3>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">Hands-Free</span>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                {lang === 'EN' ? 'Speak site notes directly from the field. Converts to quotes automatically.' : 'Habla notas desde el terreno. Convierte a cotizaciones automáticamente.'}
              </p>
              <button 
                onClick={toggleVoice}
                className={`w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center space-x-2 transition ${
                  voiceActive ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>{voiceActive ? (lang === 'EN' ? 'Listening...' : 'Escuchando...') : (lang === 'EN' ? 'Tap to Test Voice' : 'Presiona para Probar Voz')}</span>
              </button>
              {voiceText && (
                <div className="mt-4 p-3 bg-slate-950 border border-emerald-500/30 rounded-lg text-xs font-mono text-emerald-400">
                  {voiceText}
                </div>
              )}
            </div>

            {/* Feature 2: Geo Territory & Job Match */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-white flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <span>{lang === 'EN' ? 'Local Territory' : 'Territorio Local'}</span>
                </h3>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">{radius} Miles</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                {lang === 'EN' ? 'Filter Angi, Thumbtack, and direct P2P jobs strictly within your drive radius.' : 'Filtra trabajos de Angi, Thumbtack y P2P estrictamente dentro de tu radio.'}
              </p>
              <input 
                type="range" 
                min="5" 
                max="50" 
                value={radius} 
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer mb-4"
              />
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs text-slate-300">
                <span>{lang === 'EN' ? 'Matched Leads in Zone:' : 'Trabajos en la Zona:'}</span>
                <span className="font-bold text-emerald-400 font-mono">14 Jobs</span>
              </div>
            </div>

            {/* Feature 3: Multi-Retailer Cart */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-white flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-emerald-400" />
                  <span>{lang === 'EN' ? 'Material Carts' : 'Carritos de Material'}</span>
                </h3>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">Wholesale</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                {lang === 'EN' ? 'Auto-build wholesale supplier orders for Home Depot, Lowe’s, SiteOne & Ferguson.' : 'Genera pedidos al por mayor para Home Depot, Lowe’s, SiteOne y Ferguson.'}
              </p>
              <div className="space-y-2">
                {['SiteOne Landscape', 'Home Depot Pro', 'Ferguson Supply'].map((vendor, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 text-xs">
                    <span className="text-slate-300">{vendor}</span>
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        <p>© 2026 JobAllies.com. All rights reserved.</p>
      </footer>
    </div>
  );
}
