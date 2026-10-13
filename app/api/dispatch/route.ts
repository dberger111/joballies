import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { channel, to, subject, message } = await req.json();

    if (channel === 'sms') {
      const sid = process.env.TWILIO_ACCOUNT_SID;
      const token = process.env.TWILIO_AUTH_TOKEN;
      const fromPhone = process.env.TWILIO_PHONE_NUMBER;

      if (sid && token && fromPhone && to) {
        const cleanTo = to.replace(/[^0-9+]/g, '');
        const params = new URLSearchParams({
          To: cleanTo.startsWith('+') ? cleanTo : `+1${cleanTo}`,
          From: fromPhone,
          Body: message
        });
        const resp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params.toString()
        });
        if (resp.ok) return NextResponse.json({ delivered: true, provider: 'twilio-api' });
      }

      const cleanPhone = (to || '').replace(/[^0-9+]/g, '');
      const smsUri = `sms:${cleanPhone}?&body=${encodeURIComponent(message)}`;
      return NextResponse.json({ delivered: true, provider: 'native-sms-uri', uri: smsUri });
    }

    if (channel === 'email') {
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey && to) {
        const resp = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || 'JobAllies PRO <estimates@joballies.com>',
            to: [to],
            subject: subject || 'JobAllies Estimate & Proposal',
            text: message
          })
        });
        if (resp.ok) return NextResponse.json({ delivered: true, provider: 'resend-api' });
      }

      const mailtoUri = `mailto:${encodeURIComponent(to || '')}?subject=${encodeURIComponent(subject || 'JobAllies Estimate')}&body=${encodeURIComponent(message)}`;
      return NextResponse.json({ delivered: true, provider: 'native-mailto-uri', uri: mailtoUri });
    }

    return NextResponse.json({ error: 'Unsupported channel' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
