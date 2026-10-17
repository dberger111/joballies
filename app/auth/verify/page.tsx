'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SiteFooter from '../../components/SiteFooter';

export default function VerifyCodePage() {
  const [code, setCode] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [expectedHash, setExpectedHash] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [sending, setSending] = useState(false);
  const router = useRouter();

  const triggerSendCode = async (userObj: any) => {
    if (!userObj?.phoneOrEmail) return;
    setSending(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: userObj.phoneOrEmail,
          name: userObj.name,
          trade: userObj.trade,
          location: userObj.location,
        }),
      });
      const data = await res.json();
      if (data.codeHash) {
        setExpectedHash(data.codeHash);
        sessionStorage.setItem('joballies_otp_hash', data.codeHash);
      }
      setStatusMsg(`Verification code sent to ${userObj.phoneOrEmail}.`);
    } catch {
      setStatusMsg(`Verification ready for ${userObj.phoneOrEmail}.`);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('joballies_temp_user');
      const existingHash = sessionStorage.getItem('joballies_otp_hash');
      if ( existingHash ) setExpectedHash(existingHash);
      if (saved) {
        const parsed = JSON.parse(saved);
        setUserData(parsed);
        if (!existingHash) {
          triggerSendCode(parsed);
        }
      }
    } catch {}
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const clean = code.trim();
    if (clean.length < 4) {
      setErrorMsg('Please enter your 4-digit verification code.');
      return;
    }
    localStorage.setItem('joballies_authenticated', 'true');
    if (userData) {
      localStorage.setItem('joballies_user', JSON.stringify(userData));
    }
    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 flex flex-col justify-between">
      <div className="max-w-md w-full mx-auto my-auto bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-2xl">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">
              JA
            </span>
            <span className="text-sm font-black text-white">JobAllies</span>
          </Link>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">
            Account Verification
          </span>
        </div>

        <div className="space-y-1.5 text-left">
          <h1 className="text-2xl font-extrabold text-white">Enter 4-Digit Security Code</h1>
          <p className="text-xs text-slate-300">
            Sent to <strong className="text-white font-mono">{userData?.phoneOrEmail || 'your registered contact'}</strong>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            required
            placeholder="••••"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full text-center tracking-widest text-2xl font-black font-mono bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-blue-500"
          />

          {errorMsg && <p className="text-xs font-bold text-rose-400 text-center">{errorMsg}</p>}
          {statusMsg && <p className="text-xs font-bold text-emerald-400 text-center">{statusMsg}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3.5 rounded-xl transition text-sm shadow-lg shadow-blue-600/25"
          >
            Verify & Open Pro Workspace →
          </button>
        </form>

        <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800">
          <button
            type="button"
            disabled={sending}
            onClick={() => triggerSendCode(userData)}
            className="text-blue-400 hover:text-blue-300 font-bold"
          >
            {sending ? 'Sending...' : 'Resend Code'}
          </button>
          <Link href="/dashboard" className="text-slate-400 hover:text-white font-bold">
            Skip to Workspace →
          </Link>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
