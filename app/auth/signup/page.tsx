'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SiteFooter from '../../components/SiteFooter';
import QuickStartCard from '../../components/QuickStartCard';

function SignupWrapper() {
  const searchParams = useSearchParams();
  const queryTrade = searchParams.get('trade') || 'General Contractor';

  return (
    <div className="max-w-xl mx-auto w-full space-y-6">
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">
            JA
          </span>
          <span className="text-lg font-black text-white">JobAllies</span>
        </Link>
        <Link href="/dashboard" className="text-xs font-bold text-slate-400 hover:text-white">
          Open Workspace Directly →
        </Link>
      </div>
      <QuickStartCard defaultTrade={queryTrade} />
    </div>
  );
}

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-5 md:p-10 flex flex-col justify-between">
      <div className="my-auto py-6">
        <Suspense fallback={<div className="text-center text-slate-400">Loading...</div>}>
          <SignupWrapper />
        </Suspense>
      </div>
      <SiteFooter />
    </main>
  );
}
