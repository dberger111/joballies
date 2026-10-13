"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Mic, MapPin, ShoppingCart, ArrowRight, Globe, Sparkles, MessageSquare } from "lucide-react";

export default function JobAlliesLandingPage() {
  const [lang, setLang] = useState<"en" | "es">("en");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-sky-400 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-emerald-500/20">JA</div>
          <div>
            <span className="text-xl font-black tracking-tight text-white">JobAllies</span>
            <span className="text-xs text-emerald-400 block font-bold leading-none">.com</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setLang(lang === "en" ? "es" : "en")} className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === "en" ? "ESPAÑOL" : "ENGLISH"}</span>
          </button>
          <Link href="/dashboard" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5">
            <span>{lang === "en" ? "Enter Your Command Center (Free)" : "Entrar al Centro de Comando (Gratis)"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col justify-center space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === "en" ? "Free trial. See verified leads in minutes." : "Prueba gratis. Ve clientes verificados en minutos."}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            {lang === "en" ? "Discover, win and share more jobs" : "Descubre, gana y comparte más trabajos"}
          </h1>

          <p className="text-base sm:text-xl text-slate-400 leading-relaxed">
            {lang === "en"
              ? "See every lead in your area. Instantly quote work. Fill material orders at major pro retailers. Refer out work to your trusted network."
              : "Ve cada cliente potencial en tu área. Cotiza al instante. Llena pedidos de materiales en tiendas Pro. Refiere trabajo a tu red de confianza."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/dashboard" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-4 rounded-2xl text-sm sm:text-base shadow-xl shadow-emerald-500/20 flex items-center gap-2.5 transition-all">
              <span>{lang === "en" ? "Enter Your Command Center (Free)" : "Entrar a Tu Centro de Comando (Gratis)"}</span>
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
                  {lang === "en" ? "Voice Quotes" : "Cotizaciones por Voz"}
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">AI NLP</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">Speak site notes from the field. Automatically extracts line-item materials, labor hours, and profit markups in seconds.</p>
            </div>
            <Link href="/dashboard" className="block text-center bg-slate-950 hover:bg-slate-800 border border-slate-800 text-emerald-400 font-bold py-2.5 rounded-xl text-xs transition-all">Launch Voice Quotes →</Link>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-6 flex flex-col justify-between space-y-4 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-2 text-base">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  {lang === "en" ? "Lead Radar" : "Radar de Clientes"}
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">Geofenced</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">See verified homeowner requests, community board drops, and marketplace leads strictly within your local drive radius.</p>
            </div>
            <Link href="/dashboard" className="block text-center bg-slate-950 hover:bg-slate-800 border border-slate-800 text-amber-400 font-bold py-2.5 rounded-xl text-xs transition-all">Open Lead Radar →</Link>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 rounded-2xl p-6 flex flex-col justify-between space-y-4 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-2 text-base">
                  <MessageSquare className="w-5 h-5 text-sky-400" />
                  {lang === "en" ? "Instant Follow Up" : "Seguimiento Instantáneo"}
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">SMS & Email</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">Dispatch estimates via SMS text, email, or direct message in one tap—and refer out-of-scope work to your trusted network.</p>
            </div>
            <Link href="/dashboard" className="block text-center bg-slate-950 hover:bg-slate-800 border border-slate-800 text-sky-400 font-bold py-2.5 rounded-xl text-xs transition-all">Instant Follow Up →</Link>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-6 flex flex-col justify-between space-y-4 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-2 text-base">
                  <ShoppingCart className="w-5 h-5 text-emerald-400" />
                  {lang === "en" ? "Retailer Integrations" : "Integración con Tiendas"}
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Wholesale PO</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">Auto-build 0%-markup wholesale material orders for Home Depot Pro Xtra, Lowe&apos;s Pro, SiteOne Landscape, and Ferguson.</p>
            </div>
            <Link href="/dashboard" className="block text-center bg-slate-950 hover:bg-slate-800 border border-slate-800 text-emerald-400 font-bold py-2.5 rounded-xl text-xs transition-all">Explore Retailer Sync →</Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-900/60 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-xs">JA</div>
            <span>© 2026 JobAllies PRO OS. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/post-project" className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-bold px-4 py-2 rounded-xl transition-all">
              {lang === "en" ? "Homeowner? Post a project free →" : "¿Propietario? Publica un proyecto gratis →"}
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
