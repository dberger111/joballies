import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, html, text } = body;

    if (!to || !subject) {
      return NextResponse.json(
        { error: 'Missing required parameters: "to" and "subject"' },
        { status: 400 }
      );
    }

    const data = await resend.emails.send({
      from: 'JobAllies <support@joballies.com>',
      to: Array.isArray(to) ? to : [to],
      subject: subject,
      html: html || `<p>${text || 'Notification from JobAllies.com'}</p>`,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Resend Email Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to dispatch transactional email.' },
      { status: 500 }
    );
  }
}
