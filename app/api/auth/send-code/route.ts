import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const { contact, name, trade, location } = await request.json();
    const cleanContact = String(contact || '').trim();
    const generatedCode = String(Math.floor(1000 + Math.random() * 9000));

    let channel = 'sms';
    let delivered = false;

    if (cleanContact.includes('@')) {
      channel = 'email';
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'JobAllies Relay <quotes@joballies.com>',
          to: [cleanContact],
          subject: `Your JobAllies Verification Code: ${generatedCode}`,
          html: `
            <div style="font-family: sans-serif; background: #020617; color: #f8fafc; padding: 28px; border-radius: 16px;">
              <div style="max-width: 480px; margin: 0 auto; background: #0f172a; padding: 28px; border-radius: 16px; border: 1px solid #1e293b; text-align: center;">
                <div style="font-size: 12px; font-weight: 800; color: #3b82f6; text-transform: uppercase; letter-spacing: 1px;">JobAllies Security</div>
                <h2 style="color: #ffffff; font-size: 20px; margin: 12px 0;">Your Verification Code</h2>
                <div style="font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #10b981; background: #020617; padding: 16px; border-radius: 12px; border: 1px solid #1e293b; margin: 20px 0;">
                  ${generatedCode}
                </div>
                <p style="font-size: 13px; color: #94a3b8;">Enter this 4-digit code to access your ${trade || 'Contractor'} workspace in ${location || 'your area'}.</p>
              </div>
            </div>
          `,
        });
        delivered = true;
      }
    } else {
      const sid = process.env.TWILIO_ACCOUNT_SID;
      const token = process.env.TWILIO_AUTH_TOKEN;
      const fromPhone = process.env.TWILIO_PHONE_NUMBER;
      const digits = cleanContact.replace(/[^0-9]/g, '');
      const toPhone = digits.length === 10 ? `+1${digits}` : `+${digits}`;

      if (sid && token && fromPhone && digits.length >= 10) {
        const params = new URLSearchParams();
        params.append('To', toPhone);
        params.append('From', fromPhone);
        params.append('Body', `JobAllies verification code: ${generatedCode}. Reply STOP to opt out.`);

        const twilioRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
          method: 'POST',
          headers: {
            Authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        });
        if (twilioRes.ok) delivered = true;
      }
    }

    return NextResponse.json({
      success: true,
      channel,
      delivered,
      codeHash: Buffer.from(generatedCode).toString('base64'),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
