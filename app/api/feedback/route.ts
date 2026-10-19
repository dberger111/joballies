import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const body = await request.json();
    const { name, email, message } = body;

    if (!email || !message) {
      return NextResponse.json({ success: false, error: 'Email and message are required.' }, { status: 400 });
    }

    if (!apiKey) {
      console.log('[Feedback Simulated - No API Key]', { name, email, message });
      return NextResponse.json({ success: true, simulated: true });
    }

    const resend = new Resend(apiKey);
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'JobAllies <quotes@joballies.com>';

    // 1. Send notification to founder
    await resend.emails.send({
      from: fromEmail,
      to: ['dberger111@gmail.com'],
      subject: `[JobAllies Feedback] New Submission from ${name || email}`,
      html: `
        <div style="font-family: sans-serif; background: #020617; color: #f8fafc; padding: 24px;">
          <h2>New JobAllies Feature Request / Feedback</h2>
          <p><strong>Name:</strong> ${name || 'Not provided'}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background: #1e293b; padding: 16px; border-left: 4px solid #3b82f6; border-radius: 8px;">
            ${message}
          </blockquote>
        </div>
      `
    });

    // 2. Send confirmation email to user
    await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: 'We received your JobAllies feedback!',
      html: `
        <div style="font-family: sans-serif; background: #020617; color: #f8fafc; padding: 32px;">
          <div style="max-width: 600px; margin: 0 auto; background: #0f172a; padding: 32px; border-radius: 20px; border: 1px solid #1e293b;">
            <div style="font-size: 14px; font-weight: 800; color: #3b82f6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
              JobAllies Pro Network
            </div>
            <h1 style="font-size: 24px; font-weight: 900; color: #ffffff; margin-top: 0;">
              Thank you for your feedback, ${name || 'Pro'}!
            </h1>
            <p style="font-size: 15px; color: #94a3b8; line-height: 1.6;">
              Your feedback is appreciated and will be considered as we continue development of the product.
            </p>
            <p style="font-size: 13px; color: #64748b; margin-top: 24px;">
              — The JobAllies Team (from UpLevel Labs, Inc.)
            </p>
          </div>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
