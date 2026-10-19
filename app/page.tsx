'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SiteFooter from './components/SiteFooter';
import Logo from './components/Logo';

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [trade, setTrade] = useState('General Contractor');
  const [location, setLocation] = useState('Weston, CT');
  const [radiusMiles, setRadiusMiles] = useState(25);
  const [notificationPref, setNotificationPref] = useState<'sms' | 'email'>('sms');

  const trades = [
    { name: 'Architect', icon: '📐' },
    { name: 'Auto & Diesel Mechanic', icon: '🚛' },
    { name: 'Boilermaker', icon: '♨️' },
    { name: 'Carpenter', icon: '🪚' },
    { name: 'Chimney & Fireplace', icon: '🔥' },
    { name: 'Cleaning Services', icon: '🧹' },
    { name: 'Commercial Truck Driver', icon: '🚚' },
    { name: 'Concrete & Foundations', icon: '🪨' },
    { name: 'Crane Operator', icon: '🏗️' },
    { name: 'Demolition', icon: '💥' },
    { name: 'Disaster Cleanup', icon: '🚨' },
    { name: 'Driveway Paving', icon: '🛣️' },
    { name: 'Drywall Installer', icon: '📏' },
    { name: 'Electrical & Lighting', icon: '⚡' },
    { name: 'Elevator Mechanic', icon: '🛗' },
    { name: 'Epoxy Flooring', icon: '✨' },
    { name: 'Excavation & Grading', icon: '⛏️' },
    { name: 'Exterminator & Pest', icon: '🐜' },
    { name: 'Fencing', icon: '🚧' },
    { name: 'Flooring & Tiler', icon: '🪵' },
    { name: 'General Contractor', icon: '🏗️' },
    { name: 'Glazier & Glass', icon: '🪟' },
    { name: 'Gutter Installation', icon: '🌧️' },
    { name: 'Handyman', icon: '🛠️' },
    { name: 'Heavy Equipment Operator', icon: '🚜' },
    { name: 'HVAC Technician', icon: '❄️' },
    { name: 'Insulation Installer', icon: '🌡️' },
    { name: 'Ironworker', icon: '🔩' },
    { name: 'Irrigation & Sprinklers', icon: '💦' },
    { name: 'Landscaper', icon: '🌲' },
    { name: 'Lineman & Utility', icon: '🗼' },
    { name: 'Locksmith & Safe', icon: '🔐' },
    { name: 'Machinist', icon: '🔩' },
    { name: 'Mason', icon: '🧱' },
    { name: 'Millwright', icon: '⚙️' },
    { name: 'Mold Remediation', icon: '🧪' },
    { name: 'Moving & Hauling', icon: '📦' },
    { name: 'Painter & Decorator', icon: '🎨' },
    { name: 'Pile Driver', icon: '🔨' },
    { name: 'Pipefitter & Steamfitter', icon: '🔧' },
    { name: 'Plasterer & Stucco', icon: '🏛️' },
    { name: 'Plumber', icon: '🚰' },
    { name: 'Pool Maintenance', icon: '🏊' },
    { name: 'Pressure Washing', icon: '🧼' },
    { name: 'Property Management', icon: '🏢' },
    { name: 'Roofer', icon: '🏠' },
    { name: 'Scaffolder', icon: '🪜' },
    { name: 'Security & Low Voltage', icon: '📹' },
    { name: 'Sewer & Septic', icon: '🕳️' },
    { name: 'Sheet Metal Worker', icon: '🛡️' },
    { name: 'Siding & Exterior', icon: '🏡' },
    { name: 'Solar Installation', icon: '☀️' },
    { name: 'Tennis Court Maintenance', icon: '🎾' },
    { name: 'Tool & Die Maker', icon: '📐' },
    { name: 'Tree Service & Arborist', icon: '🌳' },
    { name: 'Waterproofing', icon: '💧' },
    { name: 'Welder', icon: '👨‍🏭' }
  ];

  const formatPhoneNumber = (input: string) => {
    const digits = input.replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('1')) {
      return '+' + digits;
    }
    if (digits.length === 10) {
      return '+1' + digits;
    }
    return input.trim();
  };

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) {
      alert('Please fill in your name, mobile phone number, and email address.');
      return;
    }

    const formattedPhone = formatPhoneNumber(phone);
    if (!formattedPhone.startsWith('+1') || formattedPhone.length !== 12) {
      alert('Please enter a valid 10-digit U.S. mobile phone number (e.g. 2035550199).');
      return;
    }

    const userData = { name, phone: formattedPhone, email, trade, location, radiusMiles, notificationPref };
    localStorage.setItem('joballies_temp_user', JSON.stringify(userData));

    try {
      if (notificationPref === 'email') {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email,
            email,
            name,
            trade,
            location,
            subject: `Welcome to JobAllies - Your ${trade} Workspace in ${location} is Active`
          })
        });
      } else {
        const welcomeMessage = `JobAllies (from UpLevel Labs, Inc.): Welcome ${name}! Your ${trade} workspace for ${location} is active. Tips: 1. Set your ${radiusMiles}-mile radius. 2. Review verified public leads. 3. Invite your sub crew. Reply STOP to opt out.`;
        await fetch('/api/send-sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: formattedPhone,
            message: welcomeMessage
          })
        });
      }
    } catch (err) {
      console.error('Failed to send welcome confirmation:', err);
    }

    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full space-y-12">
        <header className="flex justify-between items-center border-b border-slate-800 pb-5">
          <Logo />
          <Link href="/post-project" className="text-xs font-bold text-blue-400 hover:text-blue-300">
            Homeowner? Post a Project →
          </Link>
        </header>

        <div className="text-center space-y-4 pt-6">
          <span className="bg-blue-950 text-blue-400 border border-blue-800 text-xs font-black uppercase tracking-widest px-3.5 py-1 rounded-full">
            Autonomous Contractor Field & Financial OS
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Win More Local Jobs. Quote in Seconds. <span className="text-blue-500">Build Your Trusted Network</span>
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto text-sm leading-relaxed">
            Pulled directly from verified state registries and municipal permit filings. Enter your trade and territory to instantly launch your Pro workspace.
          </p>
        </div>

        <form onSubmit={handleStart} className="bg-slate-900 border border-slate-800 p-8 md:p-10 rounded-3xl space-y-6 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Your Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Mike Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Mobile Phone</label>
              <input
                type="tel"
                required
                placeholder="203-555-0199"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
              <input
                type="email"
                required
                placeholder="mike@joballies.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Select Your Trade (Alphabetical with Icons)</label>
              <select
                value={trade}
                onChange={(e) => setTrade(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-white font-bold focus:outline-none focus:border-blue-500"
              >
                {trades.map((t) => (
                  <option key={t.name} value={t.name}>{t.icon} {t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Location / Territory</label>
              <input
                type="text"
                required
                placeholder="e.g. Weston, CT"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-white font-bold focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Trade Area Radius</label>
                <span className="text-xs font-black text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-md border border-amber-800">
                  {radiusMiles} Miles
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={radiusMiles}
                onChange={(e) => setRadiusMiles(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer mt-2"
              />
            </div>

            <div className="border-t border-slate-900 pt-3">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-amber-400 mb-2">
                🔔 Notification & Alert Preference (Opt-In)
              </label>
              <div className="flex gap-6 text-xs text-slate-200">
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="radio"
                    name="notificationPref"
                    checked={notificationPref === 'sms'}
                    onChange={() => setNotificationPref('sms')}
                    className="accent-amber-500"
                  />
                  Receive Instant SMS Text Alerts
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="radio"
                    name="notificationPref"
                    checked={notificationPref === 'email'}
                    onChange={() => setNotificationPref('email')}
                    className="accent-amber-500"
                  />
                  Receive Email Summaries
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl text-sm transition shadow-xl shadow-blue-600/30 tracking-wide"
          >
            Launch Pro Workspace & Send Welcome Guide →
          </button>
        </form>
      </div>

      <SiteFooter />
    </main>
  );
}
