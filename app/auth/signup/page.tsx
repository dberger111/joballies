'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [name, setName] = useState('');
  const [trade, setTrade] = useState('General Contractor / Handyman');
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail || !name) {
      alert("Please enter your name and phone/email.");
      return;
    }
    // Store user session temporarily and redirect to verification code screen
    localStorage.setItem('joballies_temp_user', JSON.stringify({ name, phoneOrEmail, trade }));
    router.push('/auth/verify');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 flex items-center justify-center">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">JobAllies</span>
          <h1 className="text-2xl font-extrabold text-white">Create Your Pro Account</h1>
          <p className="text-xs text-slate-400">Fast, secure access to your command center.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Your Full Name</label>
            <input 
              type="text" 
              required
              placeholder="Mike Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Mobile Phone or Email</label>
            <input 
              type="text" 
              required
              placeholder="(203) 555-0199 or mike@masonry.com"
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Primary Trade</label>
            <select 
              value={trade}
              onChange={(e) => setTrade(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option>General Contractor / Handyman</option>
              <option>Electrician</option>
              <option>Plumber</option>
              <option>Mason & Stonework</option>
              <option>HVAC Technician</option>
              <option>Landscaper & Irrigation</option>
            </select>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition text-sm shadow-lg shadow-blue-600/25"
          >
            Continue & Send Verification Code
          </button>
        </form>

        <footer className="text-center text-xs text-slate-500 pt-4 border-t border-slate-800">
          JobAllies — All rights reserved. (from UpLevel Labs, Inc.)
        </footer>
      </div>
    </main>
  );
}
