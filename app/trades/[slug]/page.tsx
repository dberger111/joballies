import Link from 'next/link';

const tradesMap: Record<string, string> = {
  "general-contractor": "General Contractor",
  "handyman": "Handyman",
  "electrician": "Electrician",
  "mason": "Mason",
  "plumber": "Plumber",
  "landscaper": "Landscaper",
  "carpenter": "Carpenter",
  "hvac": "HVAC Technician",
  "painter": "Painter & Decorator",
  "roofing": "Roofer",
  "roofer": "Roofer",
  "paving": "Driveway Paving",
  "driveway-paving": "Driveway Paving",
  "exterminator": "Exterminator & Pest Control",
  "pool-maintenance": "Pool Maintenance",
  "tennis-court-maintenance": "Tennis Court Maintenance",
  "drywall": "Drywall Installer",
  "flooring": "Flooring & Tiler",
  "siding": "Siding & Exterior",
  "fencing": "Fencing",
  "concrete": "Concrete & Foundations",
  "excavation": "Excavation & Grading",
  "demolition": "Demolition",
  "insulation": "Insulation Installer",
  "sewer": "Sewer & Septic",
  "solar": "Solar Installation",
  "security": "Security & Low Voltage",
  "locksmith": "Locksmith & Safe",
  "glass": "Glazier & Glass",
  "tile": "Flooring & Tiler",
  "stucco": "Plasterer & Stucco",
  "tree-service": "Tree Service & Arborist",
  "pressure-washing": "Pressure Washing",
  "gutter": "Gutter Installation",
  "chimney": "Chimney & Fireplace",
  "waterproofing": "Waterproofing",
  "disaster-cleanup": "Disaster Cleanup",
  "cleaning": "Cleaning Services",
  "irrigation": "Irrigation & Sprinklers",
  "epoxy-flooring": "Epoxy Flooring",
  "mold-remediation": "Mold Remediation",
  "moving-hauling": "Moving & Hauling",
  "ironworker": "Ironworker",
  "sheet-metal": "Sheet Metal Worker",
  "scaffolder": "Scaffolder",
  "pile-driver": "Pile Driver",
  "pipefitter": "Pipefitter & Steamfitter",
  "boilermaker": "Boilermaker",
  "welder": "Welder",
  "elevator-mechanic": "Elevator Mechanic",
  "millwright": "Millwright",
  "machinist": "Machinist",
  "tool-and-die": "Tool & Die Maker",
  "diesel-mechanic": "Auto & Diesel Mechanic",
  "heavy-equipment": "Heavy Equipment Operator",
  "crane-operator": "Crane Operator",
  "truck-driver": "Commercial Truck Driver",
  "lineman": "Lineman & Utility"
};

export async function generateStaticParams() {
  return Object.keys(tradesMap).map((slug) => ({ slug }));
}

export default async function TradeLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tradeName = tradesMap[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 flex flex-col justify-between">
      <div className="max-w-5xl mx-auto w-full space-y-12">
        <div className="text-center space-y-4 pt-6">
          <span className="bg-blue-900/50 text-blue-400 text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full border border-blue-700/50">
            JobAllies Trade Command Center
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            Win, Quote & Share More <span className="text-blue-500">{tradeName}</span> Jobs
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Built for independent {tradeName} pros: speak 30-second estimates from your truck, copy 1-tap supply house material lists, and lock in 10% referral finder's fees with local trade allies.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link href={`/auth/signup?trade=${encodeURIComponent(tradeName)}`} className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-8 py-4 rounded-2xl transition inline-block text-sm shadow-xl shadow-blue-600/25">
              Launch {tradeName} Command Center (Free)
            </Link>
            <Link href="/dashboard" className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold px-8 py-4 rounded-2xl transition inline-block text-sm">
              Open Truck-Cab Tools
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
            <h3 className="text-xl font-bold text-blue-400">🎙️ 30-Second Talk-to-Quote</h3>
            <p className="text-sm text-slate-400">Speak your {tradeName.toLowerCase()} job notes out loud and text a clean estimate before you leave the driveway.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
            <h3 className="text-xl font-bold text-emerald-400">🤝 10% Referral Finder's Fees</h3>
            <p className="text-sm text-slate-400">Partner with local General Contractors, Handymen, Plumbers, and Electricians to pass overflow work and split finder's fees.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
            <h3 className="text-xl font-bold text-orange-400">📦 Supply House Express</h3>
            <p className="text-sm text-slate-400">Grab a 1-tap material order pad from any quote to paste into Home Depot Pro, Lowe's, or text to your counter rep.</p>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-slate-800">
          <Link href="/" className="text-slate-400 hover:text-white text-sm font-bold transition">
            ← Back to All 55+ Trades & Homepage
          </Link>
        </div>
      </div>

      <footer className="max-w-5xl mx-auto w-full text-center border-t border-slate-800/80 pt-8 mt-16 text-xs text-slate-500">
        © {new Date().getFullYear()} JobAllies (from UpLevel Labs, Inc.) — All rights reserved.
      </footer>
    </main>
  );
}
