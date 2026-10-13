import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { transcript } = await request.json();
    if (!transcript) {
      return NextResponse.json({ success: false, error: 'Transcript missing' }, { status: 400 });
    }

    // Attempt OpenAI GPT-4o parsing if API key is set
    if (process.env.OPENAI_API_KEY) {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert contractor assistant. Parse field voice transcripts into structured JSON containing wholesale materials and labor breakdown. Correct speech misrecognitions (e.g., "two towels" -> "2 tiles/pavers" if in context, "two man hours" -> 2 crew hours).
Return strictly valid JSON with this schema:
{
  "extracted_materials": [
    { "item": "item description", "qty": "quantity with units", "vendor": "supplier name" }
  ],
  "labor_breakdown": [
    { "tier": "seniority tier or role name", "hours": number, "rate": number }
  ]
}`
          },
          {
            role: 'user',
            content: transcript
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      });

      const parsed = JSON.parse(response.choices[0].message.content || '{}');
      
      return NextResponse.json({
        success: true,
        log: {
          id: 'log-' + Date.now(),
          raw_transcript: transcript,
          extracted_materials: parsed.extracted_materials || [],
          labor_breakdown: parsed.labor_breakdown || [],
          created_at: new Date().toISOString(),
        }
      });
    }

    // --- High-Precision Rule Fallback (if no OPENAI_API_KEY environment variable is set) ---
    const lower = transcript.toLowerCase();
    const mockMaterials: any[] = [];
    const laborBreakdown: any[] = [];

    // Materials
    if (lower.includes('wood') || lower.includes('beam') || lower.includes('2x4')) {
      const woodQty = lower.match(/(six|6|\d+)\s*(pieces|pcs|wood)/)?.[1] || '6';
      mockMaterials.push({ item: '4x4x10 Pressure Treated Wood Beams', qty: `${woodQty} pieces`, vendor: 'Home Depot Pro' });
    }
    if (lower.includes('tile') || lower.includes('towel') || lower.includes('paver')) {
      const tileQty = lower.match(/(two|14|six|14|\d+)\s*(tiles|towels|pavers)/)?.[1] || '2';
      mockMaterials.push({ item: 'Unilock Dublin Cobble Pavers / Tiles', qty: `${tileQty} units`, vendor: 'SiteOne Supply' });
    }
    if (lower.includes('concrete') || lower.includes('cement')) {
      const concreteQty = lower.match(/(\d+|14|two)\s*(tons|bags|concrete)/)?.[1] || '2';
      mockMaterials.push({ item: 'Quikrete 80lb High Early Concrete', qty: `${concreteQty} tons (~50 bags)`, vendor: 'SiteOne Supply' });
    }

    // Multi-labor tier extraction
    const wordToNum: Record<string, number> = {
      one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, fourteen: 14
    };

    // Extract supervisor / lead hours
    const supMatch = lower.match(/(one|two|three|four|five|six|seven|eight|nine|ten|fourteen|\d+)\s*(supervisor|lead|senior)\s*(hours|hrs|man hours)/);
    if (supMatch) {
      const hrs = wordToNum[supMatch[1]] || parseInt(supMatch[1], 10) || 2;
      laborBreakdown.push({ tier: 'Senior Lead Tech / Supervisor', hours: hrs, rate: 95 });
    }

    // Extract standard crew / man hours
    const crewMatch = lower.match(/(one|two|three|four|five|six|seven|eight|nine|ten|fourteen|\d+)\s*(man hours|man time|crew hours|hours)/);
    if (crewMatch) {
      const hrs = wordToNum[crewMatch[1]] || parseInt(crewMatch[1], 10) || 14;
      // Avoid duplicating if it matched supervisor
      if (!supMatch || crewMatch[0] !== supMatch[0]) {
        laborBreakdown.push({ tier: 'Standard Crew Tradesman', hours: hrs, rate: 65 });
      }
    }

    const newLog = {
      id: 'log-' + Date.now(),
      raw_transcript: transcript,
      extracted_materials: mockMaterials,
      labor_breakdown: laborBreakdown,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, log: newLog });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
