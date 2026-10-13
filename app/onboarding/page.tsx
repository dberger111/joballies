'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { MapPin, Briefcase, Globe, Shield, CheckCircle } from 'lucide-react';

const TRADES = [
  { id: 'landscaping', label: 'Landscaping & Grounds' },
  { id: 'pest_control', label: 'Pest Control' },
  { id: 'pool_maintenance', label: 'Pool Maintenance' },
  { id: 'court_maintenance', label: 'Court & Sports Turf' },
  { id: 'hardscaping', label: 'Hardscaping & Pavers' },
  { id: 'tree_service', label: 'Tree Care & Removal' },
  { id: 'irrigation', label: 'Irrigation & Drainage' },
  { id: 'general_trade', label: 'General Field Trade' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState<'EN' | 'ES'>('EN');
  const [trade, setTrade] = useState('landscaping');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('41.1983'); // Default fallback coordinates
  const [lng, setLng] = useState('-73.3640');
  const [radius, setRadius] = useState(25);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('Authentication session expired. Please log in again.');
      router.push('/login');
      return;
    }

    // Insert or update contractor profile with PostGIS POINT geography
    const { error } = await supabase
      .from('contractor_profiles')
      .upsert({
        id: user.id,
        business_name: businessName,
        contact_name: contactName,
        phone: phone,
        email: user.email,
        primary_language: language,
        primary_trade: trade,
        base_address: address,
        // PostGIS geography WKT string format: POINT(lng lat)
        base_location: `POINT(${lng} ${lat})`,
        service_radius_miles: radius,
        updated_at: new Date().toISOString(),
      });

    setSaving(false);

    if (error) {
      console.error('Profile Onboarding Error:', error);
      alert(`Error saving profile: ${error.message}`);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
        <div className="mb-8">
          <span className="text-xs font-mono bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
            Step 1 of 1 — Contractor Profile
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-4">Set Your Service Territory</h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure your trade specialty and geographic radius so JobAllies routes local leads to your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Business Name
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Apex Landscaping LLC"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Contact Name
              </label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="David Berger"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(203) 555-0199"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Preferred Language
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage('EN')}
                  className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
                    language === 'EN' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 border border-slate-800 text-slate-400'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>English</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('ES')}
                  className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
                    language === 'ES' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 border border-slate-800 text-slate-400'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Español</span>
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Primary Field Trade
            </label>
            <select
              value={trade}
              onChange={(e) => setTrade(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              {TRADES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Base Yard Address / ZIP Code
            </label>
            <div className="relative">
              <MapPin className="w-5 h-5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="100 Main St, Weston, CT 06883"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Driving Service Radius
              </label>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                {radius} Miles Radius
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-900 rounded-lg cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 px-4 rounded-xl text-sm transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{saving ? 'Saving Profile...' : 'Save Profile & Start Receiving Leads'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
