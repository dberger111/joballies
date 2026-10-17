export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';
  return (
    <div className="flex items-center gap-3">
      <div className={`${dim} rounded-2xl bg-[#0b1329] flex items-center justify-center relative overflow-hidden flex-shrink-0 border-2 border-emerald-400 shadow-xl shadow-emerald-950/40`}>
        <div className="absolute inset-1.5 border border-emerald-500 rounded-xl rotate-45 flex items-center justify-center"></div>
        <div className="absolute top-2 w-2 h-2 rounded-full bg-amber-400 shadow-sm"></div>
        <svg className="w-5 h-5 text-blue-400 relative z-10 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="leading-tight">
        <span className="text-xl font-black tracking-tight text-white block">JobAllies</span>
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-400 block">Trade Platform</span>
      </div>
    </div>
  );
}
