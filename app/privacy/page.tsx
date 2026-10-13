import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | JobAllies & JobAllies Scout Chrome Extension',
  description: 'Official Privacy Policy and Chrome Web Store Data Usage Disclosure for JobAllies.'
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans py-16 px-6">
      <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl">
        <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-emerald-400">Official Policy</span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">JobAllies Privacy Policy</h1>
            <p className="text-xs text-slate-400 mt-1">Effective Date: October 13, 2026</p>
          </div>
          <Link href="/" className="text-xs font-bold text-emerald-400 hover:underline">
            ← Back to JobAllies.com
          </Link>
        </div>

        <section className="space-y-2 text-sm leading-relaxed text-slate-300">
          <h2 className="text-base font-bold text-white">1. Overview & Single Purpose</h2>
          <p>
            JobAllies (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) operates the JobAllies web platform (https://joballies.com) and the optional <strong>JobAllies Scout — Facebook Group Co-Pilot &amp; Ally Vouch</strong> Chrome Extension. Our single purpose is to help licensed trade contractors discover homeowner service requests, generate project estimates, coordinate trade referrals, and copy pre-drafted responses to their clipboard.
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-slate-300">
          <h2 className="text-base font-bold text-white">2. Chrome Extension Data Collection &amp; Permissions</h2>
          <p>The JobAllies Scout Chrome Extension requests only the minimum permissions necessary to function:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300">
            <li><strong>activeTab &amp; Host Permissions (facebook.com/groups/* &amp; joballies.com):</strong> Used strictly to detect homeowner trade requests on the active page and, only when clicked by the user, send the selected post text and URL to the user&apos;s JobAllies Lead Radar.</li>
            <li><strong>storage:</strong> Used to locally store the contractor&apos;s company name, service town, and preferred trade ally name inside the browser&apos;s local storage (<code>chrome.storage.local</code>).</li>
            <li><strong>clipboardWrite:</strong> Used only when the user clicks &ldquo;Copy Peer Ally Vouch&rdquo; or &ldquo;Copy Direct Reply&rdquo; to place the drafted text onto their clipboard.</li>
          </ul>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-slate-300">
          <h2 className="text-base font-bold text-white">3. Google Chrome Web Store Limited Use Certification</h2>
          <p>
            Our use of information received from Google APIs and Chrome Extension permissions adheres strictly to the Chrome Web Store Developer Program Policies, including the Limited Use requirements:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300">
            <li>We do <strong>not</strong> sell, rent, or transfer user data to third parties.</li>
            <li>We do <strong>not</strong> use or transfer user data for purposes unrelated to the extension&apos;s single purpose.</li>
            <li>We do <strong>not</strong> use or transfer user data to determine creditworthiness or for lending purposes.</li>
            <li>We do <strong>not</strong> execute any remote code; all extension scripts are bundled locally within the extension package.</li>
          </ul>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-slate-300">
          <h2 className="text-base font-bold text-white">4. Contact Us</h2>
          <p>
            For privacy questions or data deletion requests, contact us via <Link href="/post-project" className="text-emerald-400 underline">https://joballies.com</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
