import Link from 'next/link';
import SiteFooter from '../components/SiteFooter';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-extrabold text-blue-400 uppercase tracking-widest">UpLevel Labs, Inc.</span>
            <h1 className="text-3xl font-extrabold text-white">Terms & Conditions</h1>
            <p className="text-xs text-slate-400 mt-1">Platform Usage, Estimates & Referral Escrow Terms</p>
          </div>
          <Link href="/" className="bg-slate-900 border border-slate-800 hover:bg-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300">
            ← Home
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-extrabold text-white">1. Independent Contractor Relationship</h2>
            <p>
              JobAllies (from UpLevel Labs, Inc.) provides software command center tools, quote formatting, directory listings, and peer-to-peer referral tracking for independent trade professionals. JobAllies is not a general contractor, employer, or party to any construction contract between a homeowner and a trade professional.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-extrabold text-white">2. Estimates, Milestones & Finder's Fee Splits</h2>
            <p>
              Contractors are solely responsible for verifying the accuracy of their labor rates, material quantities, code compliance, and state or municipal licensing requirements. Referral commission splits (such as 10% finder's fees between allied trades) are governed by the terms agreed upon by the referring and receiving trade professionals at the time of handoff.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-extrabold text-white">3. Public Registry Profiles</h2>
            <p>
              Publicly seeded directory profiles use official public state licensing records (such as the State of Connecticut Department of Consumer Protection Open Data registry) to display active credential numbers and municipal coverage areas. Contractors may claim, update, or request removal of their profile at any time.
            </p>
          </section>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
