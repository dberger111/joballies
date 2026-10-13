import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { transcript } = await request.json();
    if (!transcript) {
      return NextResponse.json({ success: false, error: 'Transcript missing' }, { status: 400 });
    }

    const lower = transcript.toLowerCase();
    const mockMaterials: any[] = [];
    const laborBreakdown: any[] = [];

    // --- Material Extraction ---
    if (lower.includes('wood') || lower.includes('beam') || lower.includes('2x4')) {
      mockMaterials.push({ item: '4x4x10 Pressure Treated Wood Beams', qty: '6 pieces', vendor: 'Home Depot Pro' });
    }
    if (lower.includes('paver') || lower.includes('tile')) {
      mockMaterials.push({ item: 'Unilock Dublin Cobble Pavers / Tiles', qty: '14 units', vendor: 'SiteOne Supply' });
    }
    if (lower.includes('concrete') || lower.includes('cement')) {
      mockMaterials.push({ item: 'Quikrete 80lb High Early Concrete', qty: '2 tons (~50 bags)', vendor: 'SiteOne Supply' });
    }

    // --- Labor & Man-Hours Extraction ---
    const wordToNum: Record<string, number> = {
      one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10
    };

    const match = lower.match(/(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s*(man hours|man time|hours|hrs|time)/);
    if (match) {
      const rawVal = match[1];
      const hours = wordToNum[rawVal] || parseInt(rawVal, 10) || 2;
      
      if (lower.includes('senior') || lower.includes('lead') || lower.includes('supervisor')) {
        laborBreakdown.push({ id: 'l1', tier: 'Senior Lead Tech / Supervisor', hours, rate: 95 });
      } else if (lower.includes('junior') || lower.includes('apprentice')) {
        laborBreakdown.push({ id: 'l2', tier: 'Junior Field Apprentice', hours, rate: 45 });
      } else {
        laborBreakdown.push({ id: 'l3', tier: 'Standard Crew Tradesman', hours, rate: 65 });
      }
    } else if (lower.includes('labor') || lower.includes('crew') || lower.includes('hours') || lower.includes('man time')) {
      laborBreakdown.push({ id: 'l3', tier: 'Standard Crew Tradesman', hours: 2, rate: 65 });
    }

    // Fallback if nothing specific caught
    if (mockMaterials.length === 0 && laborBreakdown.length === 0) {
      mockMaterials.push({ item: transcript, qty: '1 job lot', vendor: 'Home Depot Pro' });
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
