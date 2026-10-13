import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { transcript } = await request.json();

    if (!transcript) {
      return NextResponse.json({ success: false, error: 'Transcript missing' }, { status: 400 });
    }

    const lower = transcript.toLowerCase();
    const mockMaterials = [];

    if (lower.includes('concrete') || lower.includes('cement')) {
      mockMaterials.push({ item: 'Quikrete 80lb High Early Strength Concrete', qty: '2 tons (~50 bags)', category: 'Masonry & Concrete', vendor: 'SiteOne Supply' });
    }
    if (lower.includes('paver')) {
      mockMaterials.push({ item: 'Unilock Dublin Cobble Square Pavers', qty: '6 sq ft / units', category: 'Hardscape', vendor: 'SiteOne Supply' });
    }
    if (lower.includes('beam') || lower.includes('wood') || lower.includes('2x4')) {
      mockMaterials.push({ item: '4x4x10 Pressure Treated Wood Beams', qty: '7 pieces', category: 'Lumber & Framing', vendor: 'Home Depot Pro' });
    }

    if (mockMaterials.length === 0) {
      mockMaterials.push({ item: transcript, qty: '1 job lot', category: 'General Supplies', vendor: 'Wholesale Supplier' });
    }

    const newLog = {
      id: 'log-' + Date.now(),
      raw_transcript: transcript,
      extracted_materials: mockMaterials,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, log: newLog });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
