'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/onboarding`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 text-slate-950 font-bold text-2xl shadow-lg shadow-emerald-500/20">
            JA
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome to JobAllies</h1>
          <p className="text-sm text-slate-400 mt-1">
            Sign in with your email to access field leads & referral networks.
          </p>
        </div>

        {sent ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-white">Check your inbox!</h2>
            <p className="text-xs text-slate-300 mt-2">
              We sent a magic login link to <span className="font-mono text-emerald-400">{email}</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contractor@joballies.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-sm transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              <span>{loading ? 'Sending link...' : 'Continue with Magic Link'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-center space-x-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Encrypted Passwordless Authentication</span>
        </div>
      </div>
    </div>
  );
}
