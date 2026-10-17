import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const body = await request.json();
    const { to, subject, html, text } = body;

    if (!apiKey) {
      console.log('[Resend Simulated - No API Key Set]', { to, subject });
      return NextResponse.json({ success: true, simulated: true });
    }

    const resend = new Resend(apiKey);
    const data = await resend.emails.send({
      from: 'JobAllies <notifications@joballies.com>',
      to: Array.isArray(to) ? to : [to],
      subject: subject || 'New Notification from JobAllies',
      html: html || `<p>${text || ''}</p>`,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
