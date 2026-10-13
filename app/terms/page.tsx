import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service & Escrow Agreement | JobAllies',
  description: 'Official Terms of Service, 14-Day Free Trial Billing Terms, and Peer Referral Escrow Rules for JobAllies.'
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans py-16 px-6">
      <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl">
        <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-emerald-400">Legal Agreement</span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Terms of Service &amp; Escrow Policy</h1>
            <p className="text-xs text-slate-400 mt-1">Effective Date: October 13, 2026</p>
          </div>
          <Link href="/" className="text-xs font-bold text-emerald-400 hover:underline">
            ← Back to JobAllies.com
          </Link>
        </div>

        <section className="space-y-2 text-sm leading-relaxed text-slate-300">
          <h2 className="text-base font-bold text-white">1. Platform Purpose &amp; Eligibility</h2>
          <p>
            JobAllies provides a software-as-a-service command center for trade contractors, specialty service professionals, and property owners. Contractors are solely responsible for maintaining all required state, provincial, or municipal trade licenses, insurance, and permits for work performed.
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-slate-300">
          <h2 className="text-base font-bold text-white">2. 14-Day Free Trial &amp; Subscription Billing</h2>
          <p>
            Browsing the Lead Radar and drafting estimates is free. Your 14-day free trial begins only when you accept your first lead or approve your first client quote. After the 14-day trial period concludes, Pro Membership is billed at $49.00/month via Stripe unless cancelled prior to the trial end date.
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-slate-300">
          <h2 className="text-base font-bold text-white">3. Retailer Pro Account Integrations</h2>
          <p>
            JobAllies allows users to link third-party wholesale or Pro accounts (including Home Depot Pro Xtra, Lowe&apos;s Pro, SiteOne Landscape Supply, and Ferguson) to generate Purchase Orders and Quick-Order CSV carts. All material purchases are governed by the respective retailer&apos;s terms of sale.
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-slate-300">
          <h2 className="text-base font-bold text-white">4. Peer-to-Peer (P2P) Referral Escrow</h2>
          <p>
            When contractors lock referral commission splits in JobAllies P2P Escrow, funds are held pending confirmation that the referred subcontractor has commenced or completed the contracted scope.
          </p>
        </section>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <Link href="/privacy" className="text-emerald-400 hover:underline font-bold">View Privacy Policy →</Link>
          <span>© 2026 JobAllies. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
}
