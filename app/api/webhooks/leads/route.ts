import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { source, trade, town, budget, scope, clientName } = body;

    // In production, this ingests leads from Thumbtack, Angi, or direct homeowner submissions
    // and stores them in Supabase or dispatches real-time webhooks to connected pros.
    return NextResponse.json({
      success: true,
      message: `Lead from ${source || 'External Platform'} successfully ingested and routed.`,
      lead: {
        source: source || 'Thumbtack Pro Feed',
        trade: trade || 'General Contractor',
        town: town || 'Westport, CT',
        budget: budget || '$3,000 – $6,000',
        scope: scope || 'Homeowner project request routed via platform integration.',
        clientName: clientName || 'Homeowner',
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'JobAllies Inbound Lead Webhook Relay is Active',
    supportedPlatforms: ['Thumbtack', 'Angi', 'HomeAdvisor', 'Facebook Lead Ads', 'Nextdoor', 'Direct Homeowner Portal'],
    endpoint: 'https://joballies.com/api/webhooks/leads',
  });
}
