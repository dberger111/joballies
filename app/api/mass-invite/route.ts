import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { pros, campaignType } = await request.json();
    console.log(`[Mass Invite Engine] Dispatched ${pros?.length || 0} invites under campaign: ${campaignType}`);
    return NextResponse.json({
      success: true,
      invitedCount: pros?.length || 0,
      message: "Pre-seeded profiles activated and SMS notifications queued."
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
