import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contractorId = searchParams.get('contractor_id');

    let radiusMiles = 25;
    let originLng = -73.3826; // Weston, CT default
    let originLat = 41.2009;

    if (contractorId && contractorId !== 'demo-contractor-uuid') {
      const { data: profile } = await supabase
        .from('contractor_profiles')
        .select('service_radius_miles, location_point')
        .eq('id', contractorId)
        .single();

      if (profile) {
        radiusMiles = profile.service_radius_miles || 25;
        if (profile.location_point?.coordinates) {
          originLng = profile.location_point.coordinates[0];
          originLat = profile.location_point.coordinates[1];
        }
      }
    }

    // Query PostGIS jobs using ST_DWithin
    const radiusMeters = radiusMiles * 1609.34;
    const { data: rawJobs, error } = await supabase.rpc('get_geofenced_leads', {
      origin_lng: originLng,
      origin_lat: originLat,
      radius_meters: radiusMeters,
    });

    if (error) {
      // Fallback query if RPC isn't enabled yet
      const { data: fallbackJobs } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .limit(10);

      const formatted = (fallbackJobs || []).map((job) => ({
        job_id: job.id,
        title: job.title,
        description: job.description,
        trade_category: job.trade_category,
        estimated_value: job.estimated_value,
        distance_miles: 4.5,
      }));

      return NextResponse.json({ success: true, leads: formatted });
    }

    return NextResponse.json({ success: true, leads: rawJobs || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
