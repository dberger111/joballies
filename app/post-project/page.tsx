'use client';
import { useState } from 'react';
import Link from 'next/link';
import SiteFooter from '../components/SiteFooter';
import Logo from '../components/Logo';

export default function PostProjectPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [trade, setTrade] = useState('General Contractor');
  const [budget, setBudget] = useState('$2,500 - $5,000');
  const [headline, setHeadline] = useState('');
  const [urgency, setUrgency] = useState('Within 2-4 Weeks');
  const [scope, setScope] = useState('');

  const allTrades = [
    "General Contractor", "Handyman", "Electrician", "Plumber", "Mason", "Carpenter", 
    "HVAC Technician", "Landscaper", "Roofer", "Painter & Decorator", "Drywall Installer", 
    "Flooring & Tiler", "Glazier & Glass", "Plasterer & Stucco", "Ironworker", 
    "Sheet Metal Worker", "Insulation Installer", "Scaffolder", "Pile Driver", 
    "Concrete & Foundations", "Siding & Exterior", "Fencing", "Gutter Installation", 
    "Chimney & Fireplace", "Waterproofing", "Epoxy Flooring", "Pipefitter & Steamfitter", 
    "Boilermaker", "Welder", "Elevator Mechanic", "Millwright", "Machinist", 
    "Tool & Die Maker", "Locksmith & Safe", "Auto & Diesel Mechanic", "Solar Installation", 
    "Security & Low Voltage", "Sewer & Septic", "Heavy Equipment Operator", 
    "Excavation & Grading", "Demolition", "Crane Operator", "Commercial Truck Driver", 
    "Lineman & Utility", "Pool Maintenance", "Tennis Court Maintenance", "Exterminator & Pest", 
    "Driveway Paving", "Irrigation & Sprinklers", "Tree Service & Arborist", "Disaster Cleanup", 
    "Mold Remediation", "Pressure Washing", "Cleaning Services", "Moving & Hauling"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !scope) {
      alert('Please fill out all required fields.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full space-y-10">
        <header className="flex justify-between items-center border-b border-slate-800 pb-5">
          <Link href="/"><Logo size="sm"/></Link>
          <Link href="/" className="text-xs font-bold text-slate-400 hover:text-white transition">
            ← Back to Home
          </Link>
        </header>

        <div className="space-y-3 text-center">
          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full">
            100% Free Homeowner Intake
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white">Post a Project Free to Verified Local Pros</h1>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
            Describe your project once. It routes immediately into the Lead Radar for licensed local tradespeople in your area.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-950/60 border border-emerald-500/50 p-8 rounded-3xl text-center space-y-3">
            <h3 className="text-xl font-black text-emerald-400">✓ Project Successfully Posted!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Your project request has been broadcasted to verified local pros matching <strong className="text-white">{trade}</strong> in <strong className="text-white">{city || 'your area'}</strong>. Contractors will reach out to you shortly via text or call.
            </p>
            <button onClick={() => setSubmitted(false)} className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition mt-4">
              Post Another Project
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 md:p-10 rounded-3xl space-y-5 shadow-2xl text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="(203) 555-0199"
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="sarah@example.com"
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 font-bold mb-1">City / Postal Code *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Weston, CT"
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Trade Needed *</label>
                <select
                  value={trade}
                  onChange={e => setTrade(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white font-bold"
                >
                  {allTrades.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Budget Range *</label>
                <select
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white font-bold"
                >
                  <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                  <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                  <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                  <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                  <option value="$25,000+">$25,000+</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Project Headline *</label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={e => setHeadline(e.target.value)}
                  placeholder="e.g. Kitchen electrical rough-in needed"
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Urgency *</label>
                <select
                  value={urgency}
                  onChange={e => setUrgency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white font-bold"
                >
                  <option value="Emergency / ASAP">Emergency / ASAP</option>
                  <option value="Immediate (Within 1 Week)">Immediate (Within 1 Week)</option>
                  <option value="Within 2-4 Weeks">Within 2-4 Weeks</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Detailed Scope of Work *</label>
              <textarea
                required
                rows={4}
                value={scope}
                onChange={e => setScope(e.target.value)}
                placeholder="Describe your project, materials needed, and property access details..."
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl text-sm transition shadow-lg shadow-emerald-600/30 text-center"
            >
              🚀 Submit Project Free
            </button>
          </form>
        )}
      </div>

      <SiteFooter />
    </main>
  );
}
