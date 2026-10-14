import Link from 'next/link';

export default async function PublicProfilePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full space-y-12">
        <div className="text-center space-y-4 pt-8">
          <span className="bg-blue-900/50 text-blue-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border border-blue-700/50">
            Verified Trade Professional
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white capitalize">
            Precision Stone & Masonry
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Expert masonry craftsmanship, stonework, and patio installations in Fairfield County, CT. Verified member of JobAllies.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition">
              Request a Quote
            </Link>
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
                <h4 className="font-bold text-white text-sm">Custom Bluestone Patio</h4>
                <p className="text-xs text-slate-400">Weston, CT • Completed in 4 days</p>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden space-y-2">
              <div className="aspect-video bg-slate-950 relative">
                <img src="https://images.unsplash.com/photo-1541888946425-d0fbb18f2f2d?w=800&auto=format&fit=crop&q=60" alt="Project 2" className="object-cover w-full h-full" />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-white text-sm">Retaining Wall & Walkway</h4>
                <p className="text-xs text-slate-400">Greenwich, CT • Completed in 3 days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white">Client Testimonials ★★★★★</h3>
          <p className="text-sm text-slate-300 italic">
            "Absolute perfection. Showed up on time, stayed on budget, and transformed our backyard. Highly recommend!"
          </p>
          <p className="text-xs text-slate-500">— Homeowner in Westport, CT</p>
        </div>
      </div>

      <footer className="max-w-4xl mx-auto w-full text-center border-t border-slate-800/80 pt-8 mt-16 text-xs text-slate-500">
        JobAllies (from UpLevel Labs, Inc.) — Powered by verified trade portfolios.
      </footer>
    </main>
  );
}
