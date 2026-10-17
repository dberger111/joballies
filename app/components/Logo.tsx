export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'sm' ? 'w-8 h-8 text-xs' : size === 'lg' ? 'w-12 h-12 text-lg' : 'w-10 h-10 text-sm';
  return (
    <div className="flex items-center gap-3">
      <div className={`${dim} rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center text-white font-black shadow-xl shadow-blue-600/30 border border-blue-400/40 relative overflow-hidden flex-shrink-0`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_50%)]"></div>
        <span className="relative z-10 tracking-tighter">JA</span>
      </div>
      <div className="leading-tight">
        <span className="text-xl font-black tracking-tight text-white block">JobAllies</span>
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-blue-400 block">Trade Platform</span>
      </div>
    </div>
  );
}
