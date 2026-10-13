import { NextResponse } from 'next/server';

const WHOLESALE_CATALOG = [
  { sku: 'HD-PT-4410', model: '253921', item: '4x4x10 #2 Pressure-Treated Ground Contact Timber Post', cost: 26.98, vendor: 'Home Depot Pro', url: 'https://www.homedepot.com/s/4x4x10%20pressure%20treated%20post' },
  { sku: 'HD-QK-80', model: '110180', item: 'Quikrete 80 lb. High-Early Strength Concrete Mix', cost: 7.48, vendor: 'Home Depot Pro', url: 'https://www.homedepot.com/s/quikrete%2080%20lb' },
  { sku: 'HD-SQD-200', model: 'QO140M200PC', item: 'Square D QO 200 Amp 40-Space 80-Circuit Main Breaker Plug-On Neutral Panel', cost: 339.00, vendor: 'Home Depot Pro', url: 'https://www.homedepot.com/s/Square%20D%20QO%20200%20Amp%2040%20Space' },
  { sku: 'HD-TREX-16', model: 'AT010616E2S', item: 'Trex Enhance Naturals 1x6x16 ft. Grooved Composite Decking Board', cost: 43.97, vendor: 'Home Depot Pro', url: 'https://www.homedepot.com/s/Trex%20Enhance%2016%20ft' },
  { sku: 'LW-CED-6612', model: '482910', item: '6x6x12 Rough Sawn Western Red Cedar Structural Timber Post', cost: 91.50, vendor: "Lowe's Pro", url: 'https://www.lowes.com/search?searchTerm=6x6x12+western+red+cedar' },
  { sku: 'LW-DRY-58', model: '129402', item: 'USG Sheetrock Firecode X 5/8-in x 4-ft x 8-ft Gypsum Board', cost: 16.88, vendor: "Lowe's Pro", url: 'https://www.lowes.com/search?searchTerm=5%2F8+drywall+4x8' },
  { sku: 'S1-BLU-350', model: 'BLU-TH-1824', item: 'Pennsylvania Natural Cleft & Thermal Bluestone Pavers (Per Sq Ft)', cost: 9.45, vendor: 'SiteOne Supply', url: 'https://www.siteone.com/en/search/?text=bluestone+pavers' },
  { sku: 'S1-UNI-DC', model: 'UNI-DUB-COB', item: 'Unilock Beacon Hill / Dublin Cobble Paver Stone (Per Sq Ft)', cost: 11.20, vendor: 'SiteOne Supply', url: 'https://www.siteone.com/en/search/?text=pavers' },
  { sku: 'S1-DRN-120', model: 'NDS-4PERF', item: '4 in. x 100 ft. Corrugated Perforated French Drain Pipe w/ Filter Sock', cost: 118.00, vendor: 'SiteOne Supply', url: 'https://www.siteone.com/en/search/?text=perforated+drain+pipe' },
  { sku: 'FG-NAV-240', model: 'NCB240130H', item: 'Navien NCB-240/130H Condensing Combi-Boiler (199,900 BTU)', cost: 2445.00, vendor: 'Ferguson Pro', url: 'https://www.ferguson.com/search/Navien%20NCB-240' }
];

export async function POST(req: Request) {
  try {
    const { query, vendor } = await req.json();
    const q = (query || '').toLowerCase();
    const v = (vendor || '').toLowerCase();

    const matches = WHOLESALE_CATALOG.filter(entry => {
      const matchesVendor = !v || v === 'all' || entry.vendor.toLowerCase().includes(v);
      const matchesQuery = !q || entry.item.toLowerCase().includes(q) || entry.sku.toLowerCase().includes(q);
      return matchesVendor && matchesQuery;
    });

    return NextResponse.json({
      items: matches.length > 0 ? matches : WHOLESALE_CATALOG,
      retailerPortals: {
        'Home Depot Pro': 'https://www.homedepot.com/mycart/home',
        "Lowe's Pro": 'https://www.lowes.com/l/Pro',
        'SiteOne Supply': 'https://www.siteone.com/en/quickorder',
        'Ferguson Pro': 'https://www.ferguson.com/'
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
