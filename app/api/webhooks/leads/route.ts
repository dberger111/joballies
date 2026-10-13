import { NextResponse } from 'next/server';

// In-memory global webhook buffer (persists across warm serverless invocations; pair with Upstash Redis/Supabase for permanent multi-region storage)
const globalWebhookLeads: any[] = (globalThis as any).__jaWebhookLeads || [];
(globalThis as any).__jaWebhookLeads = globalWebhookLeads;

function classifyTrade(text: string): string {
  const lower = (text || '').toLowerCase();
  if (lower.includes('paver') || lower.includes('patio') || lower.includes('retaining') || lower.includes('stone') || lower.includes('mason') || lower.includes('concrete') || lower.includes('brick')) return 'Masonry & Concrete';
  if (lower.includes('tree') || lower.includes('lawn') || lower.includes('drain') || lower.includes('excavat') || lower.includes('landscap') || lower.includes('garden') || lower.includes('fenc')) return 'Landscaping & Excavation';
  if (lower.includes('pipe') || lower.includes('leak') || lower.includes('plumb') || lower.includes('heater') || lower.includes('boiler') || lower.includes('drainage') || lower.includes('hvac')) return 'Plumbing & Mechanical';
  if (lower.includes('panel') || lower.includes('wire') || lower.includes('outlet') || lower.includes('light') || lower.includes('electric') || lower.includes('charger') || lower.includes('rewir')) return 'Electrical';
  if (lower.includes('deck') || lower.includes('pergola') || lower.includes('frame') || lower.includes('drywall') || lower.includes('carpentr') || lower.includes('roof') || lower.includes('joinery')) return 'Framing & Carpentry';
  return 'General Contracting';
}

export async function GET() {
  return NextResponse.json({
    leads: globalWebhookLeads,
    count: globalWebhookLeads.length
  });
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const sourceParam = (url.searchParams.get('source') || 'webhook').toLowerCase();
    const payload = await req.json();

    // Normalize schemas from Thumbtack, Angi/HomeAdvisor, Bark.com, Facebook Lead Ads, Checkatrade, Hipages, HomeStars
    let author = 'Verified Marketplace Homeowner';
    let phone = '(203) 555-0199';
    let email = 'lead@marketplace-notification.com';
    let location = 'Local Service Area';
    let title = 'New Trade Service Request';
    let desc = '';
    let budget = '$1,500 - $4,500 (Est.)';
    let sourceLabel = 'Platform Webhook';
    let sourceUrl = 'https://joballies.com/dashboard';

    if (sourceParam === 'thumbtack' || payload.thumbtackLeadId || payload.request) {
      sourceLabel = 'Thumbtack Pro Webhook';
      sourceUrl = 'https://www.thumbtack.com/pro/leads';
      author = payload.customer?.name || payload.customerName || 'Thumbtack Customer';
      phone = payload.customer?.phone || payload.phone || '(512) 555-0144';
      email = payload.customer?.email || 'thumbtack-lead@relay.thumbtack.com';
      location = payload.request?.location?.city
        ? `${payload.request.location.city}, ${payload.request.location.state || ''}`
        : (payload.location || 'Austin, TX');
      title = payload.request?.category || payload.title || 'Thumbtack Instant Book Lead';
      desc = payload.request?.description || payload.description || 'Customer requested a quote via Thumbtack Instant Match.';
      budget = payload.request?.budget || payload.budget || '$2,000 - $5,000';
    } else if (sourceParam === 'angi' || payload.spid || payload.primaryPhone || payload.srOid) {
      sourceLabel = 'Angi / HomeAdvisor Webhook';
      sourceUrl = 'https://office.angi.com/';
      author = [payload.firstName, payload.lastName].filter(Boolean).join(' ') || payload.name || 'Angi Homeowner';
      phone = payload.primaryPhone || payload.phone || '(312) 555-0182';
      email = payload.email || 'homeowner@angi-leads.com';
      location = [payload.city, payload.stateProvince, payload.postalCode].filter(Boolean).join(', ') || payload.location || 'Chicago, IL';
      title = payload.taskName || payload.title || 'Angi Verified Project Lead';
      desc = payload.comments || payload.interview || payload.description || 'Homeowner matched via Angi Leads.';
      budget = payload.budget || '$3,000 - $7,500';
    } else if (sourceParam === 'bark' || payload.bark_id || sourceParam === 'checkatrade' || sourceParam === 'hipages' || sourceParam === 'homestars') {
      const platformNames: Record<string, string> = {
        bark: 'Bark.com Global Webhook',
        checkatrade: 'Checkatrade UK Webhook',
        hipages: 'hipages Australia Webhook',
        homestars: 'HomeStars Canada Webhook'
      };
      sourceLabel = platformNames[sourceParam] || 'Global Lead Platform Webhook';
      sourceUrl = payload.url || 'https://www.bark.com/';
      author = payload.buyer_name || payload.name || 'Marketplace Client';
      phone = payload.buyer_phone || payload.phone || '+44 20 7946 0921';
      email = payload.buyer_email || payload.email || 'client@marketplace.org';
      location = payload.location || 'London, UK';
      title = payload.service_name || payload.title || 'Commercial / Residential Trade Lead';
      desc = payload.details || payload.description || 'Verified buyer requested quotes via global marketplace.';
      budget = payload.budget || '£2,500 - £6,000';
    } else {
      // Generic / Facebook Lead Ads / Google LSA / Zapier
      sourceLabel = payload.source || 'Facebook / Zapier Lead Webhook';
      sourceUrl = payload.sourceUrl || 'https://www.facebook.com/ads/leadgen';
      author = payload.name || payload.full_name || 'Inbound Lead Prospect';
      phone = payload.phone || payload.phone_number || '(203) 555-0175';
      email = payload.email || 'prospect@inbound-webhook.com';
      location = payload.location || payload.city || 'Global Territory';
      title = payload.title || payload.service || 'Inbound Service Inquiry';
      desc = payload.description || payload.notes || JSON.stringify(payload).slice(0, 220);
      budget = payload.budget || '$2,500 - $6,000';
    }

    const trade = payload.trade || classifyTrade(`${title} ${desc}`);
    const newLead = {
      id: 'wh-' + Date.now() + '-' + Math.floor(Math.random() * 999),
      source: sourceLabel,
      sourceUrl,
      time: 'Live Webhook • Just Now',
      author,
      phone,
      email,
      location,
      distanceMiles: Number((Math.random() * 6 + 1.2).toFixed(1)),
      trade,
      title,
      desc,
      budget,
      urgency: payload.urgency || 'Immediate',
      claimed: false
    };

    globalWebhookLeads.unshift(newLead);
    if (globalWebhookLeads.length > 50) globalWebhookLeads.pop();

    return NextResponse.json({
      received: true,
      lead: newLead
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Invalid webhook payload' }, { status: 400 });
  }
}
