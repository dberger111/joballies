import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="max-w-6xl mx-auto w-full border-t border-slate-800/80 pt-8 pb-6 mt-16 text-xs text-slate-400">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2.5 text-slate-400 text-center md:text-left">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-blue-600 text-white font-black text-[11px]">
            JA
          </span>
          <span>
            © {new Date().getFullYear()} <strong className="text-slate-200">JobAllies</strong> (from UpLevel Labs, Inc.) — All rights reserved.
          </span>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-5 font-semibold">
          <Link href="/post-project" className="text-blue-400 hover:text-blue-300 transition">
            Homeowner? Post a Project
          </Link>
          <span className="text-slate-800">•</span>
          <Link href="/privacy" className="text-slate-400 hover:text-white transition">
            Privacy Policy
          </Link>
          <span className="text-slate-800">•</span>
          <Link href="/terms" className="text-slate-400 hover:text-white transition">
            Terms & Conditions
          </Link>
          <span className="text-slate-800">•</span>
          <Link href="/legal" className="text-slate-400 hover:text-white transition">
            Legal & Compliance
          </Link>
        </div>
      </div>
    </footer>
  );
}
