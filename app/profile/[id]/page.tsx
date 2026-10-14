import Link from 'next/link';

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contractorName = id.replace(/-/g, ' ');

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full space-y-12">
        {/* Header & Verified Badge */}
        <div className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center gap-2 bg-emerald-950/80 text-emerald-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-700/50 shadow-inner">
            <span>✓</span> JobAllies Verified Trade Professional & Licensed Contractor
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white capitalize tracking-tight">
            {contractorName}
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            Expert craftsmanship, reliable service, and quality installations. Proudly serving local homeowners with full milestone payment protection.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link 
              href={`/post-project?contractor=${id}`} 
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition shadow-xl shadow-blue-600/30"
            >
              Request a Quote from {contractorName}
            </Link>
          </div>
        </div>

        {/* Interactive Territory & Service Map Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="text-lg font-bold text-white">Service Radius & Territory</h3>
              <p className="text-xs text-slate-400">Verified local coverage area and dispatch zone.</p>
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/50">
              Active • 25-Mile Radius
            </span>
          </div>
          <div className="w-full h-56 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden shadow-inner">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:20px_20px]"></div>
            <div className="relative z-10 space-y-3">
              <div className="w-14 h-14 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center mx-auto border border-blue-500/40 text-2xl shadow-lg">
                📍
              </div>
              <div>
                <p className="text-sm font-bold text-white">Fairfield County & Surrounding Towns</p>
                <p className="text-xs text-slate-400 mt-1">Weston • Westport • Greenwich • Stamford • Darien • Norwalk</p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Gallery Showcase */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-3">Recent Project Gallery</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden space-y-3 shadow-xl group">
              <div className="aspect-video bg-slate-950 relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&auto=format&fit=crop&q=60" alt="Project 1" className="object-cover w-full h-full group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-5">
                <h4 className="font-bold text-white text-sm">Custom Installation & Setup</h4>
                <p className="text-xs text-slate-400 mt-1">Completed with verified trade warranty & milestone escrow.</p>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden space-y-3 shadow-xl group">
              <div className="aspect-video bg-slate-950 relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1541888946425-d0fbb18f2f2d?w=800&auto=format&fit=crop&q=60" alt="Project 2" className="object-cover w-full h-full group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-5">
                <h4 className="font-bold text-white text-sm">Precision Renovation Project</h4>
                <p className="text-xs text-slate-400 mt-1">Completed on schedule with 5-star client review.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Reviews Section */}
        <div className="space-y-4 bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white">Google & Yelp Verified Reviews</h3>
              <p className="text-xs text-slate-400">Collected automatically via JobAllies review booster.</p>
            </div>
            <span className="text-amber-400 font-extrabold text-sm bg-amber-950/40 px-3 py-1 rounded-full border border-amber-800/40">★★★★★ (5.0 / 5)</span>
          </div>
          <div className="space-y-4 pt-2">
            <div className="border-l-2 border-blue-500 pl-4 py-1.5 space-y-1 bg-slate-950/40 rounded-r-xl p-3">
              <p className="text-sm text-slate-300 italic">
                "Absolute perfection. Showed up on time, stayed on budget, and did immaculate work."
              </p>
              <p className="text-xs text-slate-500">— Verified Homeowner via Google Review</p>
            </div>
            <div className="border-l-2 border-blue-500 pl-4 py-1.5 space-y-1 bg-slate-950/40 rounded-r-xl p-3">
              <p className="text-sm text-slate-300 italic">
                "The easiest contractor experience we've ever had. Highly professional and clean."
              </p>
              <p className="text-xs text-slate-500">— Verified Homeowner via Yelp Review</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="max-w-4xl mx-auto w-full text-center border-t border-slate-800/80 pt-8 mt-16 text-xs text-slate-500">
        JobAllies — All rights reserved. (from UpLevel Labs, Inc.)
      </footer>
    </main>
  );
}
