import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-800/80 pb-4">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-600/30 border border-blue-400/30">
          JA
        </div>
        <div>
          <span className="text-xl font-black tracking-tight text-white">JobAllies</span>
          <span className="block text-[9px] font-bold uppercase tracking-widest text-blue-400">Trade Platform</span>
        </div>
      </Link>
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="text-xs font-extrabold text-white px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition shadow-lg shadow-blue-600/25"
        >
          Open Pro Workspace →
        </Link>
      </div>
    </header>
  );
}
