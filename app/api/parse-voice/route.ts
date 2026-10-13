import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();
    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    if (process.env.OPENAI_API_KEY) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            response_format: { type: 'json_object' },
            messages: [
              {
                role: 'system',
                content: 'You are an expert construction estimator AI. Parse the contractor field transcript into JSON: { clientName: string, materials: [{ item: string, qty: number, cost: number, vendor: "Home Depot Pro" | "Lowe\'s Pro" | "SiteOne Supply" | "Ferguson Pro", sku: string }], labor: [{ tier: string, hours: number, rate: number }] }. Infer realistic wholesale prices if not stated.'
              },
              { role: 'user', content: transcript }
            ]
          })
        });
        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({ ...JSON.parse(data.choices[0].message.content), mode: 'openai-live' });
        }
      } catch (err) {
        console.error('OpenAI fallback to deterministic NLP:', err);
      }
    }

    const materials: any[] = [];
    const labor: any[] = [];

    const detectVendor = (seg: string) => {
      const s = seg.toLowerCase();
      if (s.includes('siteone') || s.includes('paver') || s.includes('mulch') || s.includes('bluestone') || s.includes('gravel') || s.includes('stone')) return 'SiteOne Supply';
      if (s.includes('lowe')) return "Lowe's Pro";
      if (s.includes('ferguson') || s.includes('pipe') || s.includes('pvc') || s.includes('valve') || s.includes('boiler') || s.includes('navien')) return 'Ferguson Pro';
      return 'Home Depot Pro';
    };

    const inferUnitCost = (itemText: string) => {
      const s = itemText.toLowerCase();
      if (s.includes('panel') || s.includes('breaker')) return 285.00;
      if (s.includes('post') || s.includes('4x4') || s.includes('2x') || s.includes('lumber') || s.includes('board')) return 24.50;
      if (s.includes('concrete') || s.includes('quikrete') || s.includes('mortar')) return 7.85;
      if (s.includes('drywall') || s.includes('sheetrock') || s.includes('plywood')) return 18.25;
      if (s.includes('light') || s.includes('led') || s.includes('fixture')) return 29.00;
      if (s.includes('paver') || s.includes('bluestone')) return 19.50;
      if (s.includes('ton') || s.includes('gravel') || s.includes('mulch')) return 44.00;
      if (s.includes('sq ft') || s.includes('sqft')) return 3.25;
      return 32.00;
    };

    const clauses = transcript
      .split(/,|\band\b|\bplus\b|\balso\b|\.|;/i)
      .map(c => c.trim())
      .filter(Boolean);

    for (const clause of clauses) {
      const lower = clause.toLowerCase();
      const laborMatch = clause.match(/(\d+(?:\.\d+)?)\s*(?:man\s*)?(?:hours?|hrs?)/i);

      if (laborMatch && (lower.includes('hour') || lower.includes('hr') || lower.includes('labor') || lower.includes('crew'))) {
        const hours = parseFloat(laborMatch[1]) || 8;
        const rateMatch = clause.match(/(?:at|@)\s*\$?(\d+(?:\.\d+)?)|\$(\d+(?:\.\d+)?)\s*(?:\/|an?\s*)?(?:hr|hour)/i);
        const rate = rateMatch ? parseFloat(rateMatch[1] || rateMatch[2]) : 75;
        let tier = 'Skilled Trade Crew Labor';
        if (lower.includes('senior') || lower.includes('master')) tier = 'Senior Master Tradesman';
        else if (lower.includes('supervisor') || lower.includes('lead') || lower.includes('foreman')) tier = 'Site Supervisor / Lead Tech';
        else if (lower.includes('electrician') || lower.includes('plumber') || lower.includes('mason')) tier = 'Licensed Master Technician';
        labor.push({ tier, hours, rate });
        continue;
      }

      const matMatch = clause.match(/(?:need|get|install|replace|order|buy|supply)?\s*(\d+(?:\.\d+)?)\s+(.+?)(?:\s+(?:at|@|for)\s*\$(\d+(?:\.\d+)?)|\s+\$(\d+(?:\.\d+)?))/i);
      if (matMatch) {
        const qty = parseFloat(matMatch[1]) || 1;
        let rawItem = matMatch[2]
          .replace(/\b(from|at|each|per\s+unit|per\s+bag|per\s+sheet|per\s+ton|home\s+depot\s*pro?|lowe'?s\s*pro?|siteone\s*supply?|ferguson\s*pro?)\b/gi, '')
          .trim();
        if (!rawItem) rawItem = 'Field Trade Material';
        const cost = parseFloat(matMatch[3] || matMatch[4]) || inferUnitCost(rawItem);
        const vendor = detectVendor(clause);
        const prefix = vendor.startsWith('SiteOne') ? 'S1' : vendor.startsWith('Lowe') ? 'LW' : vendor.startsWith('Ferguson') ? 'FG' : 'HD';
        const sku = `${prefix}-${rawItem.replace(/[^a-zA-Z0-9]/g, '').slice(0, 5).toUpperCase()}-${Math.floor(100 + Math.random() * 899)}`;
        materials.push({ item: rawItem.charAt(0).toUpperCase() + rawItem.slice(1), qty, cost, vendor, sku });
        continue;
      }

      const qtyOnlyMatch = clause.match(/(?:need|install|replace|order|add)?\s*(\d+)\s+(?:sq\s*ft\s+of\s+|bags?\s+of\s+|sheets?\s+of\s+|tons?\s+of\s+|feet\s+of\s+)?([a-zA-Z0-9\s\-x/]{3,40})/i);
      if (qtyOnlyMatch && !lower.includes('hour') && !lower.includes('hr')) {
        const qty = parseFloat(qtyOnlyMatch[1]) || 1;
        const rawItem = qtyOnlyMatch[2].replace(/\b(in\s+the|for\s+.*|from\s+.*)\b/gi, '').trim();
        if (rawItem.length > 2) {
          const vendor = detectVendor(clause);
          const prefix = vendor.startsWith('SiteOne') ? 'S1' : vendor.startsWith('Lowe') ? 'LW' : vendor.startsWith('Ferguson') ? 'FG' : 'HD';
          materials.push({
            item: rawItem.charAt(0).toUpperCase() + rawItem.slice(1),
            qty,
            cost: inferUnitCost(rawItem),
            vendor,
            sku: `${prefix}-${rawItem.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 899)}`
          });
        }
      }
    }

    if (materials.length === 0) {
      materials.push({
        item: `Jobsite Materials (${transcript.slice(0, 30)})`,
        qty: 1,
        cost: 280.00,
        vendor: detectVendor(transcript),
        sku: 'HD-GEN-402'
      });
    }
    if (labor.length === 0) {
      labor.push({ tier: 'Standard Trade Crew Labor', hours: 8, rate: 75.00 });
    }

    const forMatch = transcript.match(/\b(?:for|client)\s+([A-Z][a-zA-Z\s•\-()]{2,42})$/);
    const clientName = forMatch ? forMatch[1].trim() : `Field Estimate • ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

    return NextResponse.json({ clientName, materials, labor, mode: 'deterministic-nlp' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Parse error' }, { status: 500 });
  }
}
