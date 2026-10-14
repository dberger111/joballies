'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ALL_SIGNUP_TRADES = [
  "General Contractor",
  "Handyman",
  "Electrician",
  "Plumber",
  "Mason & Stonework",
  "Carpenter",
  "HVAC Technician",
  "Landscaper",
  "Roofer",
  "Painter & Decorator",
  "Drywall Installer",
  "Flooring & Tiler",
  "Glazier & Glass",
  "Plasterer & Stucco",
  "Ironworker",
  "Sheet Metal Worker",
  "Insulation Installer",
  "Scaffolder",
  "Pile Driver",
  "Concrete & Foundations",
  "Siding & Exterior",
  "Fencing",
  "Gutter Installation",
  "Chimney & Fireplace",
  "Waterproofing",
  "Epoxy Flooring",
  "Pipefitter & Steamfitter",
  "Boilermaker",
  "Welder",
  "Elevator Mechanic",
  "Millwright",
  "Machinist",
  "Tool & Die Maker",
  "Locksmith & Safe",
  "Auto & Diesel Mechanic",
  "Solar Installation",
  "Security & Low Voltage",
  "Sewer & Septic",
  "Heavy Equipment Operator",
  "Excavation & Grading",
  "Demolition",
  "Crane Operator",
  "Commercial Truck Driver",
  "Lineman & Utility",
  "Pool Maintenance",
  "Tennis Court Maintenance",
  "Exterminator & Pest Control",
  "Driveway Paving",
  "Irrigation & Sprinklers",
  "Tree Service & Arborist",
  "Disaster Cleanup",
  "Mold Remediation",
  "Pressure Washing",
  "Cleaning Services",
  "Moving & Hauling"
];

export default function SignupPage() {
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [name, setName] = useState('');
  const [trade, setTrade] = useState('General Contractor');
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail || !name) {
      alert("Please enter your name and mobile phone or email.");
      return;
    }
    localStorage.setItem('joballies_temp_user', JSON.stringify({ name, phoneOrEmail, trade }));
    router.push('/auth/verify');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 flex items-center justify-center">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-blue-400 uppercase tracking-widest">JobAllies Pro Access</span>
          <h1 className="text-2xl font-extrabold text-white">Create Your Pro Account</h1>
          <p className="text-xs text-slate-400">Verify your phone or email in 15 seconds to unlock your Truck-Cab Command Center.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Your Name or Business Name</label>
            <input 
              type="text" 
              required
              placeholder="Mike Johnson / Precision Contracting"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Mobile Phone or Email</label>
            <input 
              type="text" 
              required
              placeholder="(203) 555-0199 or mike@contracting.com"
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Primary Trade (55+ Categories)</label>
            <select 
              value={trade}
              onChange={(e) => setTrade(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              {ALL_SIGNUP_TRADES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3.5 rounded-xl transition text-sm shadow-lg shadow-blue-600/25"
          >
            Continue & Send 4-Digit Code
          </button>
        </form>

        <footer className="text-center text-xs text-slate-500 pt-4 border-t border-slate-800">
          JobAllies (from UpLevel Labs, Inc.) — All rights reserved.
        </footer>
      </div>
    </main>
  );
}
