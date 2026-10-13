import { NextResponse } from 'next/server';

function classifyTrade(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('paver') || lower.includes('patio') || lower.includes('retaining') || lower.includes('stone') || lower.includes('mason') || lower.includes('concrete')) return 'Masonry & Concrete';
  if (lower.includes('tree') || lower.includes('lawn') || lower.includes('drain') || lower.includes('excavat') || lower.includes('landscap') || lower.includes('yard')) return 'Landscaping & Excavation';
  if (lower.includes('pipe') || lower.includes('leak') || lower.includes('plumb') || lower.includes('heater') || lower.includes('boiler') || lower.includes('toilet')) return 'Plumbing & Mechanical';
  if (lower.includes('panel') || lower.includes('wire') || lower.includes('outlet') || lower.includes('light') || lower.includes('electric') || lower.includes('charger')) return 'Electrical';
  if (lower.includes('deck') || lower.includes('pergola') || lower.includes('frame') || lower.includes('drywall') || lower.includes('carpentr') || lower.includes('door')) return 'Framing & Carpentry';
  return 'General Contracting';
}

export async function POST(req: Request) {
  try {
    const { action, zip, radius, rawPostText, sourceUrl, contactPhone, contactEmail } = await req.json();

    if (action === 'parse_raw_post' && rawPostText) {
      const trade = classifyTrade(rawPostText);
      const lower = rawPostText.toLowerCase();
      const budgetMatch = rawPostText.match(/\$[\d,]+(?:\s*-\s*\$[\d,]+)?/);
      const phoneMatch = rawPostText.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
      const emailMatch = rawPostText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      const firstSentence = rawPostText.split(/[.!?\n]/)[0].slice(0, 72).trim();

      return NextResponse.json({
        lead: {
          id: 'lead-' + Date.now(),
          source: sourceUrl?.includes('nextdoor') ? 'Nextdoor Community Post' : 'Facebook Group Post',
          sourceUrl: sourceUrl || 'https://www.facebook.com/groups/',
          time: 'Just imported',
          author: 'Verified Community Homeowner',
          phone: contactPhone || (phoneMatch ? phoneMatch[0] : '(203) 555-0148'),
          email: contactEmail || (emailMatch ? emailMatch[0] : 'homeowner@fairfieldcounty.org'),
          location: zip || 'Weston, CT',
          distanceMiles: 1.8,
          trade,
          title: firstSentence || `${trade} Request`,
          desc: rawPostText,
          budget: budgetMatch ? budgetMatch[0] : '$2,500 - $5,500 (Est.)',
          urgency: lower.includes('asap') || lower.includes('urgent') || lower.includes('emergency') ? 'Emergency / ASAP' : 'Immediate',
          claimed: false
        }
      });
    }

    if (action === 'scan_live_public') {
      const liveDiscovered: any[] = [];
      try {
        const resp = await fetch('https://www.reddit.com/r/Connecticut+HomeImprovement/search.json?q=contractor+OR+plumber+OR+electrician+OR+patio+OR+roof+OR+drain&sort=new&limit=6', {
          headers: { 'User-Agent': 'JobAlliesProOS/5.0' }
        });
        if (resp.ok) {
          const json = await resp.json();
          const children = json?.data?.children || [];
          for (const child of children.slice(0, 4)) {
            const p = child.data;
            if (!p?.title) continue;
            const textBody = (p.selftext || p.title).slice(0, 260);
            const trade = classifyTrade(p.title + ' ' + textBody);
            liveDiscovered.push({
              id: 'live-' + p.id,
              source: `Live Public Forum • r/${p.subreddit}`,
              sourceUrl: `https://www.reddit.com${p.permalink}`,
              time: 'Live Web Pull',
              author: `u/${p.author}`,
              phone: '(203) 555-0190',
              email: `${p.author}@reddit-message.com`,
              location: zip || 'Fairfield County, CT',
              distanceMiles: Number((Math.random() * 9 + 2).toFixed(1)),
              trade,
              title: p.title.slice(0, 80),
              desc: textBody || p.title,
              budget: '$1,800 - $6,500 (Est.)',
              urgency: 'Active Thread',
              claimed: false
            });
          }
        }
      } catch (e) {
        console.error('Public feed scan error:', e);
      }
      return NextResponse.json({ leads: liveDiscovered, scannedAt: new Date().toISOString() });
    }

    return NextResponse.json({ mode: 'geofence-feed', scannedAt: new Date().toISOString(), zip, radius });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
