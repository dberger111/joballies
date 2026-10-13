import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const { contractor_id, transcript } = await request.json();

    if (!transcript) {
      return NextResponse.json({ success: false, error: "Transcript is required" }, { status: 400 });
    }

    // Mock/rule-based parsing fallback for fast response
    const mockMaterials = [];
    const lower = transcript.toLowerCase();

    if (lower.includes("beam") || lower.includes("2x4") || lower.includes("2 x 4") || lower.includes("lumber")) {
      mockMaterials.push({ item: "2x4x8 Wood Stud / Beam", qty: "3 units", category: "Lumber & Framing", vendor: "Home Depot Pro" });
    }
    if (lower.includes("concrete") || lower.includes("cement") || lower.includes("quickset")) {
      mockMaterials.push({ item: "Quikrete 80lb High Early Strength Concrete", qty: "5 bags", category: "Masonry & Hardscape", vendor: "SiteOne Landscape Supply" });
    }
    if (lower.includes("paver") || lower.includes("patio")) {
      mockMaterials.push({ item: "Unilock Dublin Cobble Pavers", qty: "250 sq ft", category: "Hardscape", vendor: "SiteOne Landscape Supply" });
    }
    if (lower.includes("pipe") || lower.includes("pvc") || lower.includes("irrigation")) {
      mockMaterials.push({ item: "1-inch PVC Schedule 40 Pipe (10ft)", qty: "10 lengths", category: "Plumbing & Irrigation", vendor: "Ferguson Wholesale" });
    }

    if (mockMaterials.length === 0) {
      mockMaterials.push({ item: transcript, qty: "1 job lot", category: "General Field Supplies", vendor: "Home Depot Pro" });
    }

    const newLog = {
      id: "log-" + Date.now(),
      contractor_id: contractor_id || "demo-contractor-uuid",
      raw_transcript: transcript,
      extracted_materials: mockMaterials,
      created_at: new Date().toISOString(),
    };

    // Attempt Supabase insert without blocking on error
    try {
      await supabase.from("voice_logs").insert([
        {
          contractor_id: newLog.contractor_id,
          raw_transcript: transcript,
          extracted_materials: mockMaterials,
        }
      ]);
    } catch (dbErr) {
      console.warn("Database log insert skipped:", dbErr);
    }

    return NextResponse.json({ success: true, log: newLog });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
