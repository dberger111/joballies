import Link from 'next/link';
import SiteFooter from './components/SiteFooter';
import Logo from './components/Logo';

const MASTER_TRADES = [
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
        <header className="flex justify-between items-center border-b border-slate-800 pb-5">
          <Logo />
          <Link href="/post-project" className="text-xs font-bold text-blue-400 hover:text-blue-300">
            Homeowner? Post a Project →
          </Link>
        </header>

        <div className="text-center space-y-6 pt-6">
          <div className="inline-flex items-center gap-2 bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
            <span>🛡️</span> Verified State Licensing & Local Contractor Network
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Win More Local Jobs. Quote in Seconds. Build Your Trusted Network
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            The all-in-one operating platform for independent contractors. Capture high-intent homeowner leads, generate voice estimates on-site, and manage vetted trade referral networks with zero friction.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-8 py-4 rounded-2xl transition shadow-xl shadow-blue-600/30 text-sm">
              Launch Contractor Dashboard (Free)
            </Link>
          </div>
        </div>

        <div className="space-y-10 pt-8 border-t border-slate-800">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-white">Select Your Trade</h2>
            <p className="text-sm text-slate-400">Choose your industry to access dedicated local lead feeds and specialized workflow tools.</p>
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

      <SiteFooter />
    </main>
  );
}
