import Link from 'next/link';
import SiteFooter from '../components/SiteFooter';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-extrabold text-blue-400 uppercase tracking-widest">UpLevel Labs, Inc.</span>
            <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
            <p className="text-xs text-slate-400 mt-1">Effective Date: October 2026</p>
          </div>
          <Link href="/" className="bg-slate-900 border border-slate-800 hover:bg-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300">
            ← Home
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-extrabold text-white">1. Information We Collect</h2>
            <p>
              JobAllies (operated by UpLevel Labs, Inc.) collects information provided directly by trade professionals and homeowners, including name, business name, state contractor license credentials, email address, mobile telephone number, service radius, and project estimate details.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-extrabold text-white">2. SMS & Mobile Communications Policy (A2P 10DLC Compliance)</h2>
            <p>
              By providing your mobile phone number on JobAllies, you consent to receive transactional text messages relating to account verification (OTP codes), homeowner quote requests, project updates, and escrow referral notifications. <strong>No mobile information will be shared with third parties or affiliates for marketing or promotional purposes.</strong> All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties. You may reply <strong>STOP</strong> at any time to opt out of SMS notifications.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-extrabold text-white">3. Voice-to-Quote & Browser Data</h2>
            <p>
              When you use Talk-to-Quote or our optional Chrome Extension, speech transcription and clipboard actions are processed strictly to generate your requested estimates and referral text. We do not sell personal data to third-party lead brokers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-extrabold text-white">4. Contact Us</h2>
            <p>
              For privacy inquiries or data removal requests, contact UpLevel Labs, Inc. at support@joballies.com.
            </p>
          </section>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
