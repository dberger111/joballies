'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mic, MapPin, ShoppingCart, ArrowRight, Globe, Sparkles, MessageSquare } from 'lucide-react';

function BrandLogo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const dims = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  return (
    <div className={`${dims} rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-sky-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center`}>
      <div className="w-full h-full bg-slate-950/90 rounded-[10px] flex items-center justify-center">
        <svg viewBox="0 0 36 36" fill="none" className="w-6 h-6">
          <path d="M18 3L31 10.5V25.5L18 33L5 25.5V10.5L18 3Z" stroke="#10b981" strokeWidth="2.5" />
          <path d="M11 20.5L16 25L25.5 13.5" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="18" cy="9" r="2" fill="#fbbf24" />
        </svg>
      </div>
    </div>
  );
}

export default function JobAlliesLandingPage() {
  const [lang, setLang] = useState<'en' | 'es'>('en');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo />
          <div>
            <span className="text-xl font-black tracking-tight text-white">JobAllies</span>
            <span className="text-xs text-emerald-400 block font-bold leading-none">.com</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'en' ? 'ESPAÑOL' : 'ENGLISH'}</span>
          </button>
          <Link
            href="/dashboard"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <span>{lang === 'en' ? 'Enter Your Command Center (Free)' : 'Entrar al Centro de Comando (Gratis)'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col justify-center space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {lang === 'en'
                ? 'Free trial. See verified leads in minutes.'
                : 'Prueba gratis. Ve clientes verificados en minutos.'}
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            {lang === 'en'
              ? 'Discover, win and share more jobs'
              : 'Descubre, gana y comparte más trabajos'}
          </h1>

          <p className="text-base sm:text-xl text-slate-400 leading-relaxed">
            {lang === 'en'
              ? 'See every lead in your area. Instantly quote work. Fill material orders at major pro retailers. Refer out work to your trusted network.'
              : 'Ve cada cliente potencial en tu área. Cotiza al instante. Llena pedidos de materiales en tiendas Pro. Refiere trabajo a tu red de confianza.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-4 rounded-2xl text-sm sm:text-base shadow-xl shadow-emerald-500/20 flex items-center gap-2.5 transition-all"
            >
              <span>{lang === 'en' ? 'Enter Your Command Center (Free)' : 'Entrar a Tu Centro de Comando (Gratis)'}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-6 flex flex-col justify-between space-y-4 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-2 text-base">
                  <Mic className="w-5 h-5 text-emerald-400" />
                  {lang === 'en' ? 'Voice Quotes' : 'Cotizaciones por Voz'}
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Auto-Parsed
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Auto-generates editable line-item quotes from every lead request—or speak site notes hands-free from the truck.
              </p>
            </div>
            <Link href="/dashboard" className="block text-center bg-slate-950 hover:bg-slate-800 border border-slate-800 text-emerald-400 font-bold py-2.5 rounded-xl text-xs transition-all">
              Launch Voice Quotes →
            </Link>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-6 flex flex-col justify-between space-y-4 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-2 text-base">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  {lang === 'en' ? 'Lead Radar' : 'Radar de Clientes'}
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Geofenced
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter local leads by job type, drive distance, and project value—and connect your own Facebook Groups & lead platforms in 2 clicks.
              </p>
            </div>
            <Link href="/dashboard" className="block text-center bg-slate-950 hover:bg-slate-800 border border-slate-800 text-amber-400 font-bold py-2.5 rounded-xl text-xs transition-all">
              Open Lead Radar →
            </Link>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 rounded-2xl p-6 flex flex-col justify-between space-y-4 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-2 text-base">
                  <MessageSquare className="w-5 h-5 text-sky-400" />
                  {lang === 'en' ? 'Instant Follow Up' : 'Seguimiento Instantáneo'}
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
                  Platform Relay
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Approve and send quotes via text or email through the platform—and refer out-of-scope work to your trusted network with Stripe escrow.
              </p>
            </div>
            <Link href="/dashboard" className="block text-center bg-slate-950 hover:bg-slate-800 border border-slate-800 text-sky-400 font-bold py-2.5 rounded-xl text-xs transition-all">
              Instant Follow Up →
            </Link>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-6 flex flex-col justify-between space-y-4 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-2 text-base">
                  <ShoppingCart className="w-5 h-5 text-emerald-400" />
                  {lang === 'en' ? 'Retailer Integrations' : 'Integración con Tiendas'}
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Pro Accounts
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Link your Home Depot Pro Xtra, Lowe&apos;s Pro, SiteOne, and Ferguson accounts to turn approved quotes into wholesale orders immediately.
              </p>
            </div>
            <Link href="/dashboard" className="block text-center bg-slate-950 hover:bg-slate-800 border border-slate-800 text-emerald-400 font-bold py-2.5 rounded-xl text-xs transition-all">
              Explore Retailer Sync →
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-900/60 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <span>© 2026 JobAllies. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/post-project"
              className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-bold px-4 py-2 rounded-xl transition-all"
            >
              {lang === 'en' ? 'Homeowner? Post a project free →' : '¿Propietario? Publica un proyecto gratis →'}
            </Link>
            <Link href="/dashboard" className="hover:text-white font-semibold transition-colors">
              Enter Your Command Center (Free)
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
