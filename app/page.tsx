'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mic, MapPin, ShoppingCart, ArrowRight, Globe, Sparkles,
  MessageSquare, Hammer, Zap, Wrench, BrickWall, Home, Maximize2,
  Paintbrush, Layers, Shield, Flame, Wind, Thermometer, Cpu,
  Settings, Key, Truck, HardHat, Waves, Trophy, Trees, Bug, CheckCircle
} from 'lucide-react';

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

interface TradeDefinition {
  name: string;
  desc: string;
  icon: any;
}

interface TradeCategoryGroup {
  id: string;
  label: string;
  badge: string;
  trades: TradeDefinition[];
}

const TRADE_CATEGORIES: TradeCategoryGroup[] = [
  {
    id: 'building',
    label: 'Building & Construction Trades',
    badge: '15 Trades',
    trades: [
      { name: 'Carpenter', desc: 'Builds, installs, and repairs structures and fixtures made from wood, drywall, and other materials.', icon: Hammer },
      { name: 'Electrician', desc: 'Installs, maintains, and repairs electrical power, communications, and lighting wiring systems.', icon: Zap },
      { name: 'Plumber', desc: 'Assembles, installs, and repairs pipes, fittings, and fixtures for water, gas, and drainage systems.', icon: Wrench },
      { name: 'Mason', desc: 'Lays bricks, concrete blocks, stone, or tiles to build walls, chimneys, patios, and foundations.', icon: BrickWall },
      { name: 'Roofer', desc: 'Installs, repairs, and replaces waterproof and weather-resistant roofs.', icon: Home },
      { name: 'Glazier', desc: 'Cuts, fits, and installs glass in windows, skylights, storefronts, and displays.', icon: Maximize2 },
      { name: 'Painter and Decorator', desc: 'Applies paint, wallpaper, and other finishes to interior and exterior surfaces.', icon: Paintbrush },
      { name: 'Plasterer and Stucco Worker', desc: 'Applies interior plaster and exterior stucco to walls and ceilings.', icon: Layers },
      { name: 'Drywall Installer', desc: 'Hangs, tapes, and finishes gypsum panels on interior walls and ceilings.', icon: Layers },
      { name: 'Ironworker', desc: 'Erects and reinforces structural steel frameworks for buildings, bridges, and industrial plants.', icon: Shield },
      { name: 'Sheet Metal Worker', desc: 'Fabricates and installs thin metal products, including HVAC ductwork and metal roofs.', icon: Layers },
      { name: 'Insulation Installer', desc: 'Applies thermal, acoustic, and moisture insulation materials to buildings and equipment.', icon: Thermometer },
      { name: 'Flooring Installer / Tiler', desc: 'Lays carpet, hardwood, vinyl, or ceramic tiles on floors and walls.', icon: Maximize2 },
      { name: 'Scaffolder', desc: 'Erects temporary metal or wooden platforms and scaffolding for construction sites.', icon: HardHat },
      { name: 'Pile Driver', desc: 'Operates heavy equipment to drive deep structural piles into the ground for foundations.', icon: Hammer }
    ]
  },
  {
    id: 'mechanical',
    label: 'Mechanical & Industrial Trades',
    badge: '10 Trades',
    trades: [
      { name: 'HVAC Technician', desc: 'Installs, maintains, and repairs heating, ventilation, air conditioning, and refrigeration systems.', icon: Wind },
      { name: 'Pipefitter / Steamfitter', desc: 'Installs and maintains high-pressure piping systems for industrial and manufacturing plants.', icon: Wrench },
      { name: 'Boilermaker', desc: 'Builds, installs, and repairs large boilers, vats, and closed-vat pressure vessels.', icon: Flame },
      { name: 'Welder', desc: 'Joins, cuts, or repairs metal parts using high-heat welding equipment.', icon: Flame },
      { name: 'Elevator Mechanic', desc: 'Installs, services, and repairs elevators, escalators, and moving walkways.', icon: Settings },
      { name: 'Millwright', desc: 'Installs, aligns, and maintains heavy industrial machinery and factory equipment.', icon: Settings },
      { name: 'Machinist', desc: 'Operates precision machine tools to make or modify metal parts.', icon: Cpu },
      { name: 'Tool and Die Maker', desc: 'Creates specialized tools, dies, guides, and machine fixtures.', icon: Wrench },
      { name: 'Locksmith', desc: 'Installs, services, and repairs locks, safes, and security hardware.', icon: Key },
      { name: 'Automotive / Diesel Mechanic', desc: 'Diagnoses, maintains, and repairs cars, trucks, or heavy machinery.', icon: Truck }
    ]
  },
  {
    id: 'transport',
    label: 'Transport & Heavy Equipment Trades',
    badge: '4 Trades',
    trades: [
      { name: 'Heavy Equipment Operator', desc: 'Drives and controls bulldozers, backhoes, excavators, and loaders.', icon: Truck },
      { name: 'Crane Operator', desc: 'Operates heavy mobile or tower cranes to lift and move heavy construction materials.', icon: HardHat },
      { name: 'Commercial Truck Driver', desc: 'Transports freight and materials over regional or long-distance routes.', icon: Truck },
      { name: 'Lineman', desc: 'Installs and repairs electrical power lines, utility poles, and substation infrastructure.', icon: Zap }
    ]
  },
  {
    id: 'specialty',
    label: 'Outdoor, Property & Specialty Trades',
    badge: '4 Trades',
    trades: [
      { name: 'Landscaper', desc: 'Designs, grades, installs, and maintains lawns, gardens, drainage, and outdoor living spaces.', icon: Trees },
      { name: 'Pool Maintenance', desc: 'Opens, closes, balances chemistry, and repairs residential and commercial swimming pools & heaters.', icon: Waves },
      { name: 'Tennis Court Maintenance', desc: 'Resurfaces, lines, fences, and repairs Har-Tru clay, hardcourt, and pickleball facilities.', icon: Trophy },
      { name: 'Exterminator', desc: 'Inspects, treats, and prevents structural pests, termites, rodents, and wildlife intrusions.', icon: Bug }
    ]
  }
];

const QUICK_TICKER_TRADES = [
  'Carpenter', 'Electrician', 'Plumber', 'Mason', 'Roofer', 'HVAC Technician',
  'Landscaper', 'Pool Maintenance', 'Tennis Court Maintenance', 'Exterminator',
  'Heavy Equipment Operator', 'Painter & Decorator', 'Flooring / Tiler', 'Welder', 'Drywall Installer'
];

export default function JobAlliesLandingPage() {
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const visibleGroups = selectedCategory === 'ALL'
    ? TRADE_CATEGORIES
    : TRADE_CATEGORIES.filter(g => g.id === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Audience Strip: Explicitly States Who JobAllies Is For */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-2 text-center text-[11px] sm:text-xs font-bold text-slate-300">
        <span className="text-emerald-400 uppercase tracking-wider mr-2">Built For Tradespeople:</span>
        <span>
          {lang === 'en'
            ? 'Construction, Mechanical, Heavy Equipment, Landscaping, Pool, Tennis Court & Pest Control Pros'
            : 'Profesionales de Construcción, Mecánica, Equipo Pesado, Paisajismo, Piscinas, Canchas de Tenis y Control de Plagas'}
        </span>
      </div>

      {/* Main Header */}
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

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-20">
        {/* Hero Section */}
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

          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <Link
              href="/dashboard"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-4 rounded-2xl text-sm sm:text-base shadow-xl shadow-emerald-500/20 flex items-center gap-2.5 transition-all"
            >
              <span>{lang === 'en' ? 'Enter Your Command Center (Free)' : 'Entrar a Tu Centro de Comando (Gratis)'}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#trades-directory"
              className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold px-6 py-4 rounded-2xl text-sm transition-all"
            >
              Explore All 33 Supported Trades ↓
            </a>
          </div>

          {/* Quick Trade Pill Strip Right Under Hero CTA */}
          <div className="pt-6">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
              Select Your Trade to Open Your Local Lead Radar:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {QUICK_TICKER_TRADES.map((t) => (
                <Link
                  key={t}
                  href={`/dashboard?trade=${encodeURIComponent(t)}`}
                  className="bg-slate-900/90 hover:bg-emerald-500/15 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Core Pillars */}
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
                Filter local leads by job type, drive distance, and project value—and connect your own Facebook Groups &amp; lead platforms in 2 clicks.
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

        {/* Interactive 33-Trade Icon Directory */}
        <section id="trades-directory" className="space-y-8 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                Built For Every Field &amp; Industrial Trade
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
                33 Specialized Trades. One Command Center.
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Click any trade below to launch your Lead Radar with trade-specific auto-quoting and wholesale material catalogs.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'ALL', label: 'All 33 Trades' },
                { id: 'building', label: 'Building & Construction (15)' },
                { id: 'mechanical', label: 'Mechanical & Industrial (10)' },
                { id: 'transport', label: 'Transport & Heavy Equip (4)' },
                { id: 'specialty', label: 'Pool, Tennis, Landscape & Pest (4)' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === tab.id
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            {visibleGroups.map(group => (
              <div key={group.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span>{group.label}</span>
                  </h3>
                  <span className="text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
                    {group.badge}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.trades.map(trade => {
                    const IconComponent = trade.icon;
                    return (
                      <Link
                        key={trade.name}
                        href={`/dashboard?trade=${encodeURIComponent(trade.name)}`}
                        className="group bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 flex items-start gap-3.5 transition-all"
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                              {trade.name}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition-colors shrink-0" />
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {trade.desc}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Complete Footer with Homeowner Intake, Privacy Policy & Terms of Service */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 px-6 py-10 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <div>
              <span className="font-bold text-white block">JobAllies</span>
              <span>© 2026 JobAllies. All rights reserved.</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/post-project"
              className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-bold px-4 py-2 rounded-xl transition-all"
            >
              {lang === 'en' ? 'Homeowner? Post a project free →' : '¿Propietario? Publica un proyecto gratis →'}
            </Link>
            <Link href="/dashboard" className="hover:text-white font-semibold transition-colors">
              Command Center
            </Link>
            <Link href="/privacy" className="hover:text-white font-semibold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white font-semibold transition-colors">
              Terms of Service &amp; Escrow
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
