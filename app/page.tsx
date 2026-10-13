'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mic, MapPin, ShoppingCart, ShieldCheck, ArrowRight,
  CheckCircle, Globe, Sparkles, Send, Users, Phone, Building
} from 'lucide-react';

export default function JobAlliesLandingPage() {
  const [lang, setLang] = useState<'en' | 'es'>('en');

  // Homeowner Direct Project Intake Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('Weston, CT');
  const [trade, setTrade] = useState('Masonry & Concrete');
  const [budget, setBudget] = useState('$5,000 - $10,000');
  const [urgency, setUrgency] = useState('Immediate (Within 1 Week)');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<any | null>(null);

  const handleHomeownerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !title || !description) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/webhooks/leads?source=direct_homeowner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          location,
          trade,
          budget,
          urgency,
          title,
          description
        })
      });
      const data = await res.json();
      if (data.lead) {
        // Also sync directly to localStorage so if testing on the same browser, it's immediately in the radar even across cold lambdas
        try {
          const existing = JSON.parse(localStorage.getItem('ja_leads_v5') || '[]');
          localStorage.setItem('ja_leads_v5', JSON.stringify([data.lead, ...existing]));
        } catch (err) {}
        setSubmittedLead(data.lead);
        setName(''); setPhone(''); setEmail(''); setTitle(''); setDescription('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-sky-400 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
            JA
          </div>
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
            <span>{lang === 'en' ? 'Launch PRO OS' : 'Abrir PRO OS'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {lang === 'en'
                ? '100% Free for Tradespeople Until You Accept Your 1st Lead (+ 14-Day Free Trial)'
                : '100% Gratis para Contratistas Hasta Aceptar tu 1er Cliente (+ 14 Días de Prueba)'}
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            {lang === 'en' ? 'Win and share more work with less effort.' : 'Gana y comparte más trabajo con menos esfuerzo.'}
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            {lang === 'en'
              ? 'The bilingual operating system for field trades worldwide. Automated geofenced lead discovery, voice-to-quote NLP estimation, live wholesale retailer carts, and P2P referral escrow.'
              : 'El sistema operativo bilingüe para contratistas en todo el mundo. Clientes potenciales geocercados, cotizaciones por voz con IA, carritos mayoristas y depósito en garantía P2P.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/dashboard"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-7 py-3.5 rounded-2xl text-sm shadow-xl shadow-emerald-500/20 flex items-center gap-2 transition-all"
            >
              <span>{lang === 'en' ? 'Enter Contractor Command Center (Free)' : 'Entrar al Panel de Contratistas (Gratis)'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#post-project"
              className="bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-bold px-6 py-3.5 rounded-2xl text-sm transition-all"
            >
              {lang === 'en' ? 'Homeowner? Post a Project Free ↓' : '¿Propietario? Publica un Proyecto Gratis ↓'}
            </a>
          </div>
        </div>

        {/* 3 Core Pillars Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-2">
                <Mic className="w-5 h-5 text-emerald-400" /> TradeVoice AI
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Hands-Free NLP
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Speak site notes directly from the field. Automatically splits into a marked-up Client Proposal (SMS/Email/PDF) and a 0%-markup Wholesale PO.
            </p>
            <Link href="/dashboard" className="block text-center bg-slate-950 hover:bg-slate-800 border border-slate-800 text-emerald-400 font-bold py-2.5 rounded-xl text-xs transition-all">
              Test Voice Quoting →
            </Link>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" /> Global Lead Radar
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Worldwide Geocode
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automatically receives homeowner project requests, public community threads, and Thumbtack/Angi/Bark webhook drops anywhere in the world.
            </p>
            <Link href="/dashboard" className="block text-center bg-slate-950 hover:bg-slate-800 border border-slate-800 text-amber-400 font-bold py-2.5 rounded-xl text-xs transition-all">
              Scan Your Zip / City →
            </Link>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-sky-400" /> Retailer Pro Carts
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
                Wholesale Sync
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant catalog deep-links and bulk CSV cart exports for Home Depot Pro Xtra, Lowe&apos;s Pro, SiteOne Landscape Supply, and Ferguson.
            </p>
            <Link href="/dashboard" className="block text-center bg-slate-950 hover:bg-slate-800 border border-slate-800 text-sky-400 font-bold py-2.5 rounded-xl text-xs transition-all">
              Build Material Cart →
            </Link>
          </div>
        </div>

        {/* DIRECT HOMEOWNER PROJECT INTAKE PORTAL -> FEEDS MASTER RADAR AUTOMATICALLY */}
        <section id="post-project" className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-emerald-500 text-slate-950">
                Direct Homeowner & Property Manager Portal • 100% Free
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                Post a Project to the Verified JobAllies Trade Network
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Submit your project below. It routes immediately into the Geofenced Lead Radar for licensed local tradespeople in your area—no middleman markups.
              </p>
            </div>
          </div>

          {submittedLead ? (
            <div className="bg-slate-950 border border-emerald-500 rounded-2xl p-6 text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-black text-white">
                Project Broadcasted to Local JobAllies Contractors!
              </h3>
              <p className="text-xs text-slate-300 max-w-lg mx-auto">
                Your project <strong>&ldquo;{submittedLead.title}&rdquo;</strong> in <strong>{submittedLead.location}</strong> is now live in the Master Lead Pool. Local verified pros can now claim your request and text/email you a formal proposal.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <Link
                  href="/dashboard"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5"
                >
                  <span>View Your Lead Live in the Contractor Radar</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setSubmittedLead(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs"
                >
                  Post Another Project
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleHomeownerSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Jordan Taylor"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Mobile Phone (for SMS Quotes) *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="(203) 555-0195"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@email.com"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">City, State/Province or Postal Code *</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  placeholder="e.g. Weston, CT or London, UK"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Trade Category Needed *</label>
                <select
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-white focus:outline-none"
                >
                  <option>Masonry & Concrete</option>
                  <option>Landscaping & Excavation</option>
                  <option>Framing & Carpentry</option>
                  <option>Electrical</option>
                  <option>Plumbing & Mechanical</option>
                  <option>General Contracting</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Estimated Budget Range *</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-white focus:outline-none"
                >
                  <option>$1,000 - $2,500</option>
                  <option>$2,500 - $5,000</option>
                  <option>$5,000 - $10,000</option>
                  <option>$10,000 - $25,000</option>
                  <option>$25,000+</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-300 mb-1">Project Headline *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. 400 sq ft Bluestone Patio & Retaining Wall Repair"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Timeline / Urgency *</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-white focus:outline-none"
                >
                  <option>Emergency / ASAP</option>
                  <option>Immediate (Within 1 Week)</option>
                  <option>Within 2-4 Weeks</option>
                  <option>Flexible / Planning</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="block font-bold text-slate-300 mb-1">Detailed Scope of Work *</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Describe measurements, materials, site access, or any specific requirements..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <div className="md:col-span-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Broadcasting Project to Local Pros...' : 'Submit Project to Verified Local Contractors (Free)'}</span>
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
