import Link from 'next/link';

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contractorName = id.replace(/-/g, ' ');

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full space-y-12">
        <div className="text-center space-y-4 pt-8">
          <span className="bg-blue-900/50 text-blue-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border border-blue-700/50">
            Verified Trade Professional
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white capitalize">
            {contractorName}
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Expert craftsmanship, reliable service, and quality installations. Verified member of JobAllies.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link 
              href={`/post-project?contractor=${id}`} 
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl text-sm transition shadow-lg shadow-blue-600/25"
            >
              Request a Quote from {contractorName}
            </Link>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Service Radius & Territory</h3>
            <span className="text-xs font-medium text-emerald-400 bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-800/50">
              Active in 25-mile radius
            </span>
          </div>
          <div className="w-full h-48 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="relative z-10 space-y-2">
              <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center mx-auto border border-blue-500/40 text-xl font-bold">
                📍
              </div>
              <p className="text-sm font-semibold text-white">Serving Fairfield County & Surrounding Towns</p>
              <p className="text-xs text-slate-400">Weston • Westport • Greenwich • Stamford • Darien</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-3">Recent Project Gallery</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden space-y-2">
              <div className="aspect-video bg-slate-950 relative">
                <img src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&auto=format&fit=crop&q=60" alt="Project 1" className="object-cover w-full h-full" />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-white text-sm">Custom Installation & Setup</h4>
                <p className="text-xs text-slate-400">Completed with verified trade warranty</p>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden space-y-2">
              <div className="aspect-video bg-slate-950 relative">
                <img src="https://images.unsplash.com/photo-1541888946425-d0fbb18f2f2d?w=800&auto=format&fit=crop&q=60" alt="Project 2" className="object-cover w-full h-full" />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-white text-sm">Precision Renovation Project</h4>
                <p className="text-xs text-slate-400">Completed in 3 days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Google & Yelp Verified Reviews</h3>
            <span className="text-amber-400 font-bold text-sm">★★★★★ (5.0 / 5)</span>
          </div>
          <div className="space-y-3 pt-2">
            <div className="border-l-2 border-blue-500 pl-4 py-1 space-y-1">
              <p className="text-sm text-slate-300 italic">
                "Absolute perfection. Showed up on time, stayed on budget, and did immaculate work."
              </p>
              <p className="text-xs text-slate-500">— Verified Homeowner via Google Review</p>
            </div>
            <div className="border-l-2 border-blue-500 pl-4 py-1 space-y-1">
              <p className="text-sm text-slate-300 italic">
                "The easiest contractor experience we've ever had. Highly professional and clean."
              </p>
              <p className="text-xs text-slate-500">— Verified Homeowner via Yelp Review</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="max-w-4xl mx-auto w-full text-center border-t border-slate-800/80 pt-8 mt-16 text-xs text-slate-500">
        JobAllies (from UpLevel Labs, Inc.) — Powered by verified trade portfolios.
      </footer>
    </main>
  );
}
