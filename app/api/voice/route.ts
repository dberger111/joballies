import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contractor_id, transcript, job_id } = body;

    if (!contractor_id || !transcript) {
      return NextResponse.json(
        { error: 'Missing required parameters: contractor_id and transcript' },
        { status: 400 }
      );
    }

    // Mock AI material extraction logic (ready for OpenAI/Whisper integration)
    const lower = transcript.toLowerCase();
    const mockCart = [];
    const vendors = [];

    if (lower.includes('paver') || lower.includes('stone') || lower.includes('patio')) {
      mockCart.push({ item: 'Belgard Dublin Cobble Pavers', qty: '200 sq ft', category: 'Hardscape' });
      mockCart.push({ item: 'Polymeric Sand (50lb bag)', qty: '4 bags', category: 'Jointing' });
      vendors.push('SiteOne Landscape Supply');
    }

    if (lower.includes('irrigation') || lower.includes('pipe') || lower.includes('sprinkler')) {
      mockCart.push({ item: 'Hunter PGJ Pop-Up Rotors', qty: '12 units', category: 'Irrigation' });
      mockCart.push({ item: '1" Poly Pipe 100ft', qty: '2 rolls', category: 'Piping' });
      vendors.push('Home Depot Pro');
    }

    if (vendors.length === 0) {
      mockCart.push({ item: 'General Trade Materials Note', qty: '1 lot', category: 'Misc' });
      vendors.push('Ferguson Supply');
    }

    // Store log entry in Supabase trade_voice_logs table
    const { data, error } = await supabase
      .from('trade_voice_logs')
      .insert([
        {
          contractor_id,
          job_id: job_id || null,
          raw_transcript: transcript,
          extracted_materials: mockCart,
          vendor_targets: vendors
        }
      ])
      .select();

    if (error) {
      console.error('Supabase Voice Log Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      log: data[0],
      cartSummary: {
        itemCount: mockCart.length,
        vendors,
        materials: mockCart
      }
    });
  } catch (error) {
    console.error('Voice Route Error:', error);
    return NextResponse.json(
      { error: 'Failed to process voice transcript.' },
      { status: 500 }
    );
  }
}
