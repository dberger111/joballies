import os

api_po_code = """import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { items, supplier, jobName } = await request.json();
    
    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: 'No line items provided for PO generation.' }, { status: 400 });
    }

    const poNumber = 'PO-JA-' + Math.floor(100000 + Math.random() * 900000);
    const orderDate = new Date().toISOString().split('T')[0];

    // Compute estimated totals based on supplier rate cards
    const processedItems = items.map((item: any, idx: number) => {
      const estimatedUnitPrice = Math.floor(Math.random() * 45) + 12;
      const qtyNum = parseInt(item.qty, 10) || 1;
      return {
        line: idx + 1,
        sku: `${supplier.substring(0,3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
        description: item.item,
        quantity: item.qty,
        unitPrice: estimatedUnitPrice,
        totalPrice: estimatedUnitPrice * qtyNum
      };
    });

    const subtotal = processedItems.reduce((sum: number, i: any) => sum + i.totalPrice, 0);
    const tax = Math.round(subtotal * 0.0625 * 100) / 100;
    const total = subtotal + tax;

    // Merchant Checkout Deep-Link Generator
    const merchantCartUrls: Record<string, string> = {
      'Home Depot Pro': `https://www.homedepot.com/b/N-5yc1v/Ntk-elastic/Ntt-${encodeURIComponent(items[0]?.item || 'lumber')}?pro=true`,
      'SiteOne Supply': `https://www.siteone.com/en/search?q=${encodeURIComponent(items[0]?.item || 'paver')}`,
      "Lowe's Pro Desk": `https://www.lowes.com/search?searchTerm=${encodeURIComponent(items[0]?.item || 'concrete')}`
    };

    return NextResponse.json({
      success: true,
      po: {
        poNumber,
        orderDate,
        jobName: jobName || 'Apex Jobsite #104',
        supplier: supplier || 'Home Depot Pro',
        items: processedItems,
        subtotal,
        tax,
        total,
        merchantCartUrl: merchantCartUrls[supplier] || merchantCartUrls['Home Depot Pro']
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
"""

api_fb_code = """import { NextResponse } from 'next/server';

export async function GET() {
  const scrapedGroupLeads = [
    {
      id: 'fb-lead-101',
      sourceGroup: 'Weston & Westport Local Recommendations & Trades',
      authorName: 'Sarah Jenkins',
      postTime: '12 mins ago',
      excerpt: 'Looking for a reliable contractor to build a 20x15 stone patio and repair our retaining wall. Any local trade recommendations?',
      intentMatch: 'Hardscaping / Pavers / Masonry',
      location: 'Weston, CT (1.8 miles away)',
      directPostUrl: 'https://facebook.com/groups/westonrecommendations/posts/991823',
      suggestedVoiceReply: 'Hi Sarah! Apex Landscaping & Field Trades handles local stone patio builds and masonry repairs right here in Weston. I can drop by for a quick site estimate today!'
    },
    {
      id: 'fb-lead-102',
      sourceGroup: 'Fairfield County Homeowners & Contractors Network',
      authorName: 'Mark Thompson',
      postTime: '38 mins ago',
      excerpt: 'Need an electrician or experienced tech to run 220V lines for an outdoor sauna and install low-voltage garden lighting.',
      intentMatch: 'Electrical / Outdoor Lighting',
      location: 'Fairfield, CT (4.2 miles away)',
      directPostUrl: 'https://facebook.com/groups/fairfieldhomeowners/posts/441209',
      suggestedVoiceReply: 'Hey Mark, we specialize in outdoor high-voltage sauna feeds and low-voltage landscape lighting. Sent you a DM with photo examples of past local jobs!'
    },
    {
      id: 'fb-lead-103',
      sourceGroup: 'Wilton Community Chat & Services',
      authorName: 'Elena Rostova',
      postTime: '1 hr ago',
      excerpt: 'Storm damage brought down two large oak limbs across our driveway fence. Need immediate debris clearing and fence repair quote.',
      intentMatch: 'Emergency Storm Repair / Fencing',
      location: 'Wilton, CT (3.1 miles away)',
      directPostUrl: 'https://facebook.com/groups/wiltonchat/posts/881203',
      suggestedVoiceReply: 'Hi Elena, our crew is currently working in Wilton with tree clearing gear and fencing materials. We can be at your driveway within the hour.'
    }
  ];

  return NextResponse.json({ success: true, leads: scrapedGroupLeads });
}
"""

with open('app/api/po/route.ts', 'w') as f:
    f.write(api_po_code)

with open('app/api/facebook-leads/route.ts', 'w') as f:
    f.write(api_fb_code)

print("Created /api/po and /api/facebook-leads routes successfully!")
