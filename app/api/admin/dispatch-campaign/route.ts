import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const { contractors, campaignType, customProjectScope, founderPasscode } = await request.json();

    if (founderPasscode !== 'uplevel2026') {
      return NextResponse.json({ success: false, error: 'Unauthorized founder passcode.' }, { status: 401 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'RESEND_API_KEY is not configured.' }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const results = [];

    for (const pro of contractors) {
      if (!pro.email || !pro.email.includes('@')) continue;

      const claimUrl = pro.claimUrl || `https://joballies.com/profile/${pro.slug}?claim=true`;
      
      let subject = '';
      let htmlBody = '';

      if (campaignType === 'quote_request') {
        subject = `New Local ${pro.trade} Quote Request in ${pro.town}`;
        htmlBody = `
          <div style="font-family: sans-serif; background: #020617; color: #f8fafc; padding: 32px; border-radius: 24px;">
            <div style="max-width: 600px; margin: 0 auto; background: #0f172a; padding: 32px; border-radius: 20px; border: 1px solid #1e293b;">
              <div style="font-size: 14px; font-weight: 800; color: #3b82f6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                JobAllies Instant Lead Radar (from UpLevel Labs, Inc.)
              </div>
              <h1 style="font-size: 24px; font-weight: 900; color: #ffffff; margin-top: 0; line-height: 1.3;">
                New Local Quote Request for ${pro.businessName} (${pro.trade})
              </h1>
              <p style="font-size: 15px; color: #94a3b8; line-height: 1.6;">
                Hi <strong style="color: #ffffff;">${pro.contactName || pro.businessName}</strong>,
              </p>
              <p style="font-size: 15px; color: #94a3b8; line-height: 1.6;">
                A homeowner in <strong style="color: #ffffff;">${pro.town}</strong> just submitted a project request matching your specialty (<strong style="color: #10b981;">${pro.trade}</strong>):
              </p>

              <div style="background: #1e293b; padding: 20px; border-radius: 14px; margin: 24px 0; border-left: 4px solid #10b981;">
                <p style="margin: 0; font-size: 14px; color: #e2e8f0; font-weight: 600;">
                  📋 Project Scope:
                </p>
                <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 14px; line-height: 1.5;">
                  "${customProjectScope || `Looking for a licensed ${pro.trade} for upcoming project work in the local area. Estimated budget: $2,500 - $7,500.`}"
                </p>
              </div>

              <div style="text-align: center; margin: 32px 0;">
                <a href="${claimUrl}" style="background: #10b981; color: #020617; padding: 16px 32px; border-radius: 12px; font-weight: 800; text-decoration: none; display: inline-block; font-size: 15px; box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4);">
                  Claim Lead & Send 30-Second Quote →
                </a>
              </div>

              <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 32px; border-top: 1px solid #1e293b; padding-top: 16px;">
                JobAllies (from UpLevel Labs, Inc.) • Direct Homeowner Lead Relay<br/>
                Reply STOP to opt out of lead alerts.
              </p>
            </div>
          </div>
        `;
      } else {
        // Campaign 2: Claim Profile Page
        subject = `Claim your verified ${pro.town} ${pro.trade} profile on JobAllies`;
        htmlBody = `
          <div style="font-family: sans-serif; background: #020617; color: #f8fafc; padding: 32px; border-radius: 24px;">
            <div style="max-width: 600px; margin: 0 auto; background: #0f172a; padding: 32px; border-radius: 20px; border: 1px solid #1e293b;">
              <div style="font-size: 14px; font-weight: 800; color: #3b82f6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                JobAllies Pro Network (from UpLevel Labs, Inc.)
              </div>
              <h1 style="font-size: 24px; font-weight: 900; color: #ffffff; margin-top: 0; line-height: 1.3;">
                Active License Verification for ${pro.businessName}
              </h1>
              <p style="font-size: 15px; color: #94a3b8; line-height: 1.6;">
                Hi <strong style="color: #ffffff;">${pro.contactName || pro.businessName}</strong>,
              </p>
              <p style="font-size: 15px; color: #94a3b8; line-height: 1.6;">
                Because you hold active state license <strong style="color: #10b981;">${pro.licenseNumber}</strong> in <strong style="color: #ffffff;">${pro.town}</strong>, we have pre-built your verified Digital Yard Sign and local homeowner quote catcher.
              </p>
              
              <div style="background: #1e293b; padding: 20px; border-radius: 14px; margin: 24px 0; border-left: 4px solid #3b82f6;">
                <p style="margin: 0; font-size: 14px; color: #e2e8f0; font-weight: 600;">
                  ⚡ What you can do right now:
                </p>
                <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #94a3b8; font-size: 14px; line-height: 1.5;">
                  <li>Receive homeowner project requests directly in your town.</li>
                  <li>Use <strong>Talk-to-Quote</strong>: speak your job notes from the truck and text estimates in 30 seconds.</li>
                  <li>Partner with local GCs and subs to lock in 10% referral finder's fees.</li>
                </ul>
              </div>

              <div style="text-align: center; margin: 32px 0;">
                <a href="${claimUrl}" style="background: #2563eb; color: #ffffff; padding: 16px 32px; border-radius: 12px; font-weight: 800; text-decoration: none; display: inline-block; font-size: 15px; box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4);">
                  Claim Your Free Profile & Page →
                </a>
              </div>

              <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 32px; border-top: 1px solid #1e293b; padding-top: 16px;">
                JobAllies (from UpLevel Labs, Inc.) • 100% Free for Independent Tradespeople<br/>
                If you wish to stop receiving these notifications, reply STOP.
              </p>
            </div>
          </div>
        `;
      }

      try {
        const res = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'JobAllies Relay <quotes@joballies.com>',
          to: [pro.email],
          subject,
          html: htmlBody
        });
        results.push({ email: pro.email, success: true, data: res });
      } catch (err) {
        results.push({ email: pro.email, success: false, error: String(err) });
      }
    }

    return NextResponse.json({ success: true, dispatchedCount: results.length, results });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
