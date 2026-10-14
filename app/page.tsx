import Link from 'next/link';

export const MASTER_TRADES = [
  { name: "General Contractor", slug: "general-contractor", icon: "🏗️", group: "Featured & Core Trades" },
  { name: "Handyman", slug: "handyman", icon: "🛠️", group: "Featured & Core Trades" },
  { name: "Electrician", slug: "electrician", icon: "⚡", group: "Featured & Core Trades" },
  { name: "Plumber", slug: "plumber", icon: "🚰", group: "Featured & Core Trades" },
  { name: "Mason", slug: "mason", icon: "🧱", group: "Featured & Core Trades" },
  { name: "Carpenter", slug: "carpenter", icon: "🪚", group: "Featured & Core Trades" },
  { name: "HVAC Technician", slug: "hvac", icon: "❄️", group: "Featured & Core Trades" },
  { name: "Landscaper", slug: "landscaper", icon: "🌲", group: "Featured & Core Trades" },
  { name: "Roofer", slug: "roofing", icon: "🏠", group: "Building & Construction" },
  { name: "Painter & Decorator", slug: "painter", icon: "🎨", group: "Building & Construction" },
  { name: "Drywall Installer", slug: "drywall", icon: "📏", group: "Building & Construction" },
  { name: "Flooring & Tiler", slug: "flooring", icon: "🪵", group: "Building & Construction" },
  { name: "Glazier & Glass", slug: "glass", icon: "🪟", group: "Building & Construction" },
  { name: "Plasterer & Stucco", slug: "stucco", icon: "🏛️", group: "Building & Construction" },
  { name: "Ironworker", slug: "ironworker", icon: "🔩", group: "Building & Construction" },
  { name: "Sheet Metal Worker", slug: "sheet-metal", icon: "🛡️", group: "Building & Construction" },
  { name: "Insulation Installer", slug: "insulation", icon: "🌡️", group: "Building & Construction" },
  { name: "Scaffolder", slug: "scaffolder", icon: "🪜", group: "Building & Construction" },
  { name: "Pile Driver", slug: "pile-driver", icon: "🔨", group: "Building & Construction" },
  { name: "Concrete & Foundations", slug: "concrete", icon: "🪨", group: "Building & Construction" },
  { name: "Siding & Exterior", slug: "siding", icon: "🏡", group: "Building & Construction" },
  { name: "Fencing", slug: "fencing", icon: "🚧", group: "Building & Construction" },
  { name: "Gutter Installation", slug: "gutter", icon: "🌧️", group: "Building & Construction" },
  { name: "Chimney & Fireplace", slug: "chimney", icon: "🔥", group: "Building & Construction" },
  { name: "Waterproofing", slug: "waterproofing", icon: "💧", group: "Building & Construction" },
  { name: "Epoxy Flooring", slug: "epoxy-flooring", icon: "✨", group: "Building & Construction" },
  { name: "Pipefitter & Steamfitter", slug: "pipefitter", icon: "🔧", group: "Mechanical & Industrial" },
  { name: "Boilermaker", slug: "boilermaker", icon: "♨️", group: "Mechanical & Industrial" },
  { name: "Welder", slug: "welder", icon: "👨‍🏭", group: "Mechanical & Industrial" },
  { name: "Elevator Mechanic", slug: "elevator-mechanic", icon: "🛗", group: "Mechanical & Industrial" },
  { name: "Millwright", slug: "millwright", icon: "⚙️", group: "Mechanical & Industrial" },
  { name: "Machinist", slug: "machinist", icon: "🔩", group: "Mechanical & Industrial" },
  { name: "Tool & Die Maker", slug: "tool-and-die", icon: "📐", group: "Mechanical & Industrial" },
  { name: "Locksmith & Safe", slug: "locksmith", icon: "🔐", group: "Mechanical & Industrial" },
  { name: "Auto & Diesel Mechanic", slug: "diesel-mechanic", icon: "🚛", group: "Mechanical & Industrial" },
  { name: "Solar Installation", slug: "solar", icon: "☀️", group: "Mechanical & Industrial" },
  { name: "Security & Low Voltage", slug: "security", icon: "📹", group: "Mechanical & Industrial" },
  { name: "Sewer & Septic", slug: "sewer", icon: "🕳️", group: "Mechanical & Industrial" },
  { name: "Heavy Equipment Operator", slug: "heavy-equipment", icon: "🚜", group: "Transport & Heavy Equipment" },
  { name: "Excavation & Grading", slug: "excavation", icon: "⛏️", group: "Transport & Heavy Equipment" },
  { name: "Demolition", slug: "demolition", icon: "💥", group: "Transport & Heavy Equipment" },
  { name: "Crane Operator", slug: "crane-operator", icon: "🏗️", group: "Transport & Heavy Equipment" },
  { name: "Commercial Truck Driver", slug: "truck-driver", icon: "🚚", group: "Transport & Heavy Equipment" },
  { name: "Lineman & Utility", slug: "lineman", icon: "🗼", group: "Transport & Heavy Equipment" },
  { name: "Pool Maintenance", slug: "pool-maintenance", icon: "🏊", group: "Outdoor, Property & Specialty" },
  { name: "Tennis Court Maintenance", slug: "tennis-court-maintenance", icon: "🎾", group: "Outdoor, Property & Specialty" },
  { name: "Exterminator & Pest", slug: "exterminator", icon: "🐜", group: "Outdoor, Property & Specialty" },
  { name: "Driveway Paving", slug: "driveway-paving", icon: "🛣️", group: "Outdoor, Property & Specialty" },
  { name: "Irrigation & Sprinklers", slug: "irrigation", icon: "💦", group: "Outdoor, Property & Specialty" },
  { name: "Tree Service & Arborist", slug: "tree-service", icon: "🌳", group: "Outdoor, Property & Specialty" },
  { name: "Disaster Cleanup", slug: "disaster-cleanup", icon: "🚨", group: "Outdoor, Property & Specialty" },
  { name: "Mold Remediation", slug: "mold-remediation", icon: "🧪", group: "Outdoor, Property & Specialty" },
  { name: "Pressure Washing", slug: "pressure-washing", icon: "🧼", group: "Outdoor, Property & Specialty" },
  { name: "Cleaning Services", slug: "cleaning", icon: "🧹", group: "Outdoor, Property & Specialty" },
  { name: "Moving & Hauling", slug: "moving-hauling", icon: "📦", group: "Outdoor, Property & Specialty" }
];

export default function HomePage() {
  const groups = [
    "Featured & Core Trades",
    "Building & Construction",
    "Mechanical & Industrial",
    "Transport & Heavy Equipment",
    "Outdoor, Property & Specialty"
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto w-full space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 pt-6">
          <div className="inline-flex items-center gap-2 bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full">
            <span>⚡</span> Built for General Contractors, Handymen & 55+ Skilled Trades
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            JobAllies Command Center
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Speak 30-second quotes from your truck, copy 1-tap supply house order pads, and get paid 10% finder's fees for passing overflow jobs to local pros you trust.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-8 py-4 rounded-2xl transition shadow-xl shadow-blue-600/25 text-sm">
              Enter Truck-Cab Command Center (Free)
            </Link>
            <Link href="/auth/signup" className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold px-8 py-4 rounded-2xl transition text-sm">
              Create Verified Pro Account
            </Link>
          </div>
        </div>

        {/* 5 Core Value Proposition Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2.5">
            <div className="text-2xl">📍</div>
            <h3 className="text-lg font-extrabold text-white">Get Local Jobs</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              See homeowner project requests in your town—plus get recommended in local Facebook Groups by your trade allies.
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2.5">
            <div className="text-2xl">🎙️</div>
            <h3 className="text-lg font-extrabold text-white">Talk-to-Quote</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Speak your job notes from the front seat of your truck and text a clean estimate to the customer in 30 seconds.
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2.5">
            <div className="text-2xl">🤝</div>
            <h3 className="text-lg font-extrabold text-white">Sub & Referral Crew</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Partner with reliable local pros in other trades to vouch for each other and pass overflow work back and forth.
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2.5">
            <div className="text-2xl">💵</div>
            <h3 className="text-lg font-extrabold text-white">10% Finder's Fees</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manage your trusted local subcontractor network and lock in 10% referral commission splits automatically.
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2.5">
            <div className="text-2xl">📦</div>
            <h3 className="text-lg font-extrabold text-white">Supply House Express</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Turn any quote into a 1-tap material order list for Home Depot Pro, Lowe's, Ferguson, or your local counter rep.
            </p>
          </div>
        </div>

        {/* Complete Categorized 55-Trade Directory */}
        <div className="space-y-10 pt-8 border-t border-slate-800">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-white">Select Your Trade</h2>
            <p className="text-sm text-slate-400">Click any trade below to open its dedicated Command Center and local lead feed.</p>
          </div>

          {groups.map((groupName) => (
            <div key={groupName} className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-blue-400 border-b border-slate-800/80 pb-2">
                {groupName}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {MASTER_TRADES.filter(t => t.group === groupName).map((t) => (
                  <Link
                    key={t.slug}
                    href={`/trades/${t.slug}`}
                    className="bg-slate-900 hover:bg-blue-600/20 border border-slate-800 hover:border-blue-500 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-bold transition text-slate-200 hover:text-white shadow-sm"
                  >
                    <span className="text-lg">{t.icon}</span>
                    <span>{t.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="max-w-6xl mx-auto w-full text-center border-t border-slate-800/80 pt-8 mt-16 text-xs text-slate-500">
        © {new Date().getFullYear()} JobAllies (from UpLevel Labs, Inc.) — All rights reserved.
      </footer>
    </main>
  );
}
