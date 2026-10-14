import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { phone, clientName, googleReviewLink } = await request.json();
    const smsText = `JobAllies (from UpLevel Labs, Inc.): Hi ${clientName || 'there'}, thanks for working with us! If you loved our work, please leave us a 5-star review here: ${googleReviewLink || 'https://google.com'}. Reply STOP to opt out.`;
    console.log(`[Review Request SMS Triggered] To ${phone}: ${smsText}`);
    return NextResponse.json({ success: true, message: "Review request text sent successfully via Twilio." });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
