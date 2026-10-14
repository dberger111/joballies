'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyCodePage() {
  const [code, setCode] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem('joballies_temp_user');
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 4) {
      alert("Please enter the 4-digit code sent to your phone or email.");
      return;
    }
    // Finalize authentication state
    localStorage.setItem('joballies_authenticated', 'true');
    localStorage.setItem('joballies_user', JSON.stringify(userData));
    alert("Phone/Email verified successfully! Welcome to JobAllies.");
    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 flex items-center justify-center">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Security Check</span>
          <h1 className="text-2xl font-extrabold text-white">Enter Verification Code</h1>
          <p className="text-xs text-slate-400">
            We sent a quick confirmation code to <span className="text-white font-mono">{userData?.phoneOrEmail || 'your phone'}</span>. (For testing, enter any 4 digits like 4829).
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">4-Digit Code</label>
            <input 
              type="text" 
              maxLength={4}
              required
              placeholder="0000"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full text-center tracking-widest text-xl font-mono bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 rounded-xl transition text-sm shadow-lg shadow-emerald-600/25"
          >
            Verify & Enter Command Center
          </button>
        </form>

        <div className="text-center">
          <button onClick={() => alert("New verification code sent!")} className="text-xs text-blue-400 hover:underline">
            Didn't receive a code? Resend
          </button>
        </div>

        <footer className="text-center text-xs text-slate-500 pt-4 border-t border-slate-800">
          JobAllies — All rights reserved. (from UpLevel Labs, Inc.)
        </footer>
      </div>
    </main>
  );
}
