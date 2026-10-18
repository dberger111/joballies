'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SiteFooter from './components/SiteFooter';
import Logo from './components/Logo';

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [trade, setTrade] = useState('Architect');
  const [location, setLocation] = useState('Weston, CT');
  const [radiusMiles, setRadiusMiles] = useState(25);

  const trades = [
    'Architect',
    'Carpentry & Framing',
    'Chimney & Masonry',
    'Concrete & Foundation',
    'Drywall & Plastering',
    'Electrical & Lighting',
    'Elevator Mechanic',
    'Exterminator & Pest Control',
    'Fencing & Gate',
    'Flooring & Tile',
    'General Contractor',
    'Handyman Services',
    'HVAC & Mechanical',
    'Insulation & Weatherproofing',
    'Interior Designer',
    'Landscaping & Grounds',
    'Painter & Wallpaper',
    'Paving & Driveway',
    'Plumbing & Water Systems',
    'Pool Maintenance & Repair',
    'Property Management',
    'Remodeling & Additions',
    'Roofing & Siding',
    'Security & Smart Home',
    'Solar & Alternative Energy',
    'Structural Engineer',
    'Tennis Court Maintenance',
    'Tree Care & Arborist',
    'Waterproofing & Drainage',
    'Welding & Metalwork',
    'Window & Door Installation'
  ];

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter your name.');
      return;
    }
    const userData = { name, trade, location, radiusMiles };
    localStorage.setItem('joballies_temp_user', JSON.stringify(userData));
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
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
            Win Local Jobs. Zero Fluff.
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto text-sm leading-relaxed">
            Pulled directly from verified state registries and municipal permit filings. Enter your trade and territory to instantly launch your Pro workspace.
          </p>
        </div>

        <form onSubmit={handleStart} className="bg-slate-900 border border-slate-800 p-8 md:p-10 rounded-3xl space-y-6 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Your Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Mike Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-white font-bold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Select Your Trade (Alphabetical)</label>
              <select
                value={trade}
                onChange={(e) => setTrade(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-white font-bold focus:outline-none focus:border-blue-500"
              >
                {trades.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                className="w-full accent-amber-500 cursor-pointer mt-3"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl text-sm transition shadow-xl shadow-blue-600/30 tracking-wide"
          >
            Launch Pro Workspace →
          </button>
        </form>
      </div>

      <SiteFooter />
    </main>
  );
}
