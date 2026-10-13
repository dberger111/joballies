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

    // Direct query on jobs table
    const { data: rawJobs, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (error || !rawJobs) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ success: false, error: error?.message || 'Failed to fetch jobs' }, { status: 500 });
    }

    // Format and calculate distances (fallback Haversine formula)
    const formattedLeads = rawJobs.map((job) => {
      let distanceMiles = 4.5; // default fallback

      if (job.location_point && Array.isArray(job.location_point.coordinates)) {
        const [lng, lat] = job.location_point.coordinates;
        // Haversine formula for distance in miles
        const R = 3958.8; // Radius of earth in miles
        const dLat = (lat - originLat) * (Math.PI / 180);
        const dLng = (lng - originLng) * (Math.PI / 180);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(originLat * (Math.PI / 180)) *
            Math.cos(lat * (Math.PI / 180)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        distanceMiles = Math.round(R * c * 10) / 10;
      }

      return {
        job_id: job.id,
        title: job.title,
        description: job.description,
        trade_category: job.trade_category,
        estimated_value: job.estimated_value,
        distance_miles: distanceMiles,
        location_address: job.location_address,
      };
    }).filter(lead => lead.distance_miles <= radiusMiles);

    return NextResponse.json({ success: true, leads: formattedLeads });
  } catch (err: any) {
    console.error('API /leads error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
