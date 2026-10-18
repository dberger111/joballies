import { NextResponse } from 'next/server';
import https from 'https';

export async function POST(request: Request) {
  try {
    const { to, message } = await request.json();
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!sid || !token || !fromPhone) {
      // Fallback if env vars aren't loaded in local preview
      console.log(`[Simulated SMS via Twilio] To: ${to} | Message: ${message}`);
      return NextResponse.json({ success: true, simulated: true, message: "Simulated SMS dispatched (Twilio credentials pending in Vercel env vars)." });
    }

    const data = new URLSearchParams();
    data.append('To', to || '+19175730529'); // Default destination or recipient
    data.append('From', fromPhone);
    data.append('Body', message);

    const auth = Buffer.from(sid + ':' + token).toString('base64');
    
    const result = await new Promise((resolve, reject) => {
      const req = https.request({
        hostname: 'api.twilio.com',
        path: `/2010-04-01/Accounts/${sid}/Messages.json`,
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + auth,
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(body));
          } else {
            reject(body);
          }
        });
      });

      req.on('error', err => reject(err));
      req.write(data.toString());
      req.end();
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
