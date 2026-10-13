import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contractorId = searchParams.get('contractor_id');

    if (!contractorId) {
      return NextResponse.json(
        { error: 'Missing required query parameter: contractor_id' },
        { status: 400 }
      );
    }

    // Call the PostGIS spatial function created in Supabase SQL Editor
    const { data: leads, error } = await supabase.rpc(
      'get_matching_jobs_for_contractor',
      { contractor_uuid: contractorId }
    );

    if (error) {
      console.error('Supabase RPC Error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: leads ? leads.length : 0,
      leads: leads || []
    });
  } catch (error) {
    console.error('Leads Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching geofenced leads.' },
      { status: 500 }
    );
  }
}
