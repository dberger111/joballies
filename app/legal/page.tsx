import Link from 'next/link';
import SiteFooter from '../components/SiteFooter';

export default function LegalCompliancePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-extrabold text-blue-400 uppercase tracking-widest">UpLevel Labs, Inc.</span>
            <h1 className="text-3xl font-extrabold text-white">Legal, Licensing & Compliance</h1>
            <p className="text-xs text-slate-400 mt-1">Corporate Attribution, Trade Disclosures & Mechanic's Lien Notices</p>
          </div>
          <Link href="/" className="bg-slate-900 border border-slate-800 hover:bg-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300">
            ← Home
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-extrabold text-white">Corporate Ownership</h2>
            <p>
              JobAllies is a proprietary platform developed and owned by <strong>UpLevel Labs, Inc.</strong> All trademarks, trade dress, Talk-to-Quote workflows, and Supply House Express tools are the intellectual property of UpLevel Labs, Inc.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-extrabold text-white">Trade Licensing & Homeowner Verification</h2>
            <p>
              While JobAllies cross-references state open-data registries (including Connecticut DCP Home Improvement Contractor HIC and trade licenses) when available, homeowners are advised to verify active insurance certificates and local permits required for their specific municipality prior to commencing work.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-extrabold text-white">Digital Lien Waiver Receipts</h2>
            <p>
              Digital milestone receipts and lien waiver templates generated through JobAllies are provided for administrative convenience and do not constitute formal legal representation.
            </p>
          </section>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
