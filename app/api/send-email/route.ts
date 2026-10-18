import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const { to, subject, message, name, trade } = await request.json();
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.log(`[Simulated Email via Resend] To: ${to} | Subject: ${subject} | Message: ${message}`);
      return NextResponse.json({ success: true, simulated: true, message: "Simulated email dispatched (RESEND_API_KEY pending in Vercel env vars)." });
    }

    const resend = new Resend(apiKey);
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'JobAllies Relay <quotes@joballies.com>';

    const htmlBody = `
      <div style="font-family: sans-serif; background: #020617; color: #f8fafc; padding: 32px; border-radius: 24px;">
        <div style="max-width: 600px; margin: 0 auto; background: #0f172a; padding: 32px; border-radius: 20px; border: 1px solid #1e293b;">
          <div style="font-size: 14px; font-weight: 800; color: #3b82f6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
            JobAllies Pro Network (from UpLevel Labs, Inc.)
          </div>
          <h1 style="font-size: 24px; font-weight: 900; color: #ffffff; margin-top: 0; line-height: 1.3;">
            Welcome to JobAllies, ${name || 'Pro'}!
          </h1>
          <p style="font-size: 15px; color: #94a3b8; line-height: 1.6;">
            Your <strong style="color: #10b981;">${trade || 'Contractor'}</strong> workspace is now active and ready to capture local leads.
          </p>
          
          <div style="background: #1e293b; padding: 20px; border-radius: 14px; margin: 24px 0; border-left: 4px solid #3b82f6;">
            <p style="margin: 0; font-size: 14px; color: #e2e8f0; font-weight: 600;">
              ⚡ Quick Start Guide & Platform Tips:
            </p>
            <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #94a3b8; font-size: 14px; line-height: 1.5;">
              <li><strong>Set Your Drive Radius:</strong> Adjust your service territory from 5 to 50 miles in your dashboard.</li>
              <li><strong>Review Verified Leads:</strong> Instantly check official state open-data registries and municipal permits in your area.</li>
              <li><strong>Build Your Sub Crew:</strong> Invite trusted local trade allies to exchange qualified overflow work and earn 10% referral finder's fees.</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 32px 0;">
            <a href="https://joballies.com/dashboard" style="background: #2563eb; color: #ffffff; padding: 16px 32px; border-radius: 12px; font-weight: 800; text-decoration: none; display: inline-block; font-size: 15px; box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4);">
              Enter Your Pro Command Center →
            </a>
          </div>

          <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 32px; border-top: 1px solid #1e293b; padding-top: 16px;">
            JobAllies (from UpLevel Labs, Inc.) • Autonomous Contractor Field & Financial OS<br/>
            If you wish to stop receiving these notifications, reply STOP.
          </p>
        </div>
      </div>
    `;

    const res = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: subject || `Welcome to JobAllies - Your ${trade || 'Pro'} Workspace is Active`,
      html: htmlBody
    });

    return NextResponse.json({ success: true, res });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
