import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'mock-key-for-build',
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData().catch(() => null);
    let transcript = '';
    let contractor_id = '';
    let job_id = '';

    if (formData) {
      contractor_id = formData.get('contractor_id') as string;
      job_id = formData.get('job_id') as string;
      const audioFile = formData.get('file') as File;

      if (audioFile && process.env.OPENAI_API_KEY) {
        // Transcribe audio file with OpenAI Whisper
        const transcription = await openai.audio.transcriptions.create({
          file: audioFile,
          model: 'whisper-1',
        });
        transcript = transcription.text;
      } else {
        transcript = (formData.get('transcript') as string) || '';
      }
    } else {
      const body = await request.json();
      contractor_id = body.contractor_id;
      job_id = body.job_id;
      transcript = body.transcript || '';
    }

    if (!contractor_id || !transcript) {
      return NextResponse.json(
        { error: 'Missing required parameters: contractor_id and transcript/audio file' },
        { status: 400 }
      );
    }

    // Use GPT to structure materials into wholesale cart line items
    let extractedCart = [];
    let vendors = [];

    if (process.env.OPENAI_API_KEY) {
      const gptResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI trade assistant for JobAllies. Extract required construction materials and categorize them for supplier ordering (SiteOne Landscape, Home Depot Pro, Ferguson Supply). Respond ONLY with valid JSON array of objects: [{"item": string, "qty": string, "category": string, "vendor": string}]`,
          },
          { role: 'user', content: transcript },
        ],
        response_format: { type: 'json_object' },
      });

      const parsed = JSON.parse(gptResponse.choices[0].message.content || '{}');
      extractedCart = parsed.materials || parsed.items || [];
      vendors = Array.from(new Set(extractedCart.map((i: any) => i.vendor).filter(Boolean)));
    } else {
      // Fallback structured extraction
      const lower = transcript.toLowerCase();
      if (lower.includes('paver') || lower.includes('patio') || lower.includes('stone')) {
        extractedCart.push({ item: 'Belgard Dublin Cobble Pavers', qty: '250 sq ft', category: 'Hardscape', vendor: 'SiteOne Landscape Supply' });
        extractedCart.push({ item: 'Polymeric Sand (50lb bag)', qty: '5 bags', category: 'Jointing', vendor: 'SiteOne Landscape Supply' });
        vendors.push('SiteOne Landscape Supply');
      }
      if (lower.includes('irrigation') || lower.includes('sprinkler') || lower.includes('pipe')) {
        extractedCart.push({ item: 'Hunter Pro-Spray Heads 4"', qty: '15 units', category: 'Irrigation', vendor: 'Home Depot Pro' });
        extractedCart.push({ item: '1" Schedule 40 PVC Pipe 20ft', qty: '10 lengths', category: 'Piping', vendor: 'Home Depot Pro' });
        vendors.push('Home Depot Pro');
      }
      if (vendors.length === 0) {
        extractedCart.push({ item: 'Custom Field Materials Quote', qty: '1 lot', category: 'General Supply', vendor: 'Ferguson Supply' });
        vendors.push('Ferguson Supply');
      }
    }

    // Record in Supabase trade_voice_logs
    const { data, error } = await supabase
      .from('trade_voice_logs')
      .insert([
        {
          contractor_id,
          job_id: job_id || null,
          raw_transcript: transcript,
          extracted_materials: extractedCart,
          vendor_targets: vendors,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase Voice Log Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      log: data[0],
      transcript,
      cartSummary: {
        itemCount: extractedCart.length,
        vendors,
        materials: extractedCart,
      },
    });
  } catch (error: any) {
    console.error('Voice Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process voice recording.' },
      { status: 500 }
    );
  }
}
