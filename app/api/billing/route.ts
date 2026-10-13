import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { action, amount, projectTitle, partnerName, originUrl } = await req.json();
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const baseUrl = originUrl || 'https://joballies.com';

    if (action === 'start_trial_subscription') {
      if (stripeKey) {
        const params = new URLSearchParams({
          'mode': 'subscription',
          'success_url': `${baseUrl}/dashboard?subscription=trial_active`,
          'cancel_url': `${baseUrl}/dashboard?subscription=cancelled`,
          'line_items[0][price_data][currency]': 'usd',
          'line_items[0][price_data][unit_amount]': '4900',
          'line_items[0][price_data][recurring][interval]': 'month',
          'line_items[0][price_data][product_data][name]': 'JobAllies PRO OS (14-Day Free Trial After 1st Lead Claim)',
          'subscription_data[trial_period_days]': '14'
        });
        const resp = await fetch('https://api.stripe.com/v1/checkout/sessions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${stripeKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params.toString()
        });
        if (resp.ok) {
          const session = await resp.json();
          return NextResponse.json({ url: session.url, mode: 'stripe-live' });
        }
      }
      return NextResponse.json({
        mode: 'local-trial-ledger',
        trialDays: 14,
        monthlyRate: 49.00,
        trialEndsAt: new Date(Date.now() + 14 * 86400000).toISOString()
      });
    }

    if (action === 'lock_escrow') {
      if (stripeKey && amount) {
        const cents = Math.round(Number(amount) * 100);
        const params = new URLSearchParams({
          'mode': 'payment',
          'success_url': `${baseUrl}/dashboard?escrow=locked`,
          'cancel_url': `${baseUrl}/dashboard?escrow=cancelled`,
          'line_items[0][price_data][currency]': 'usd',
          'line_items[0][price_data][unit_amount]': String(cents),
          'line_items[0][price_data][product_data][name]': `P2P Escrow Lock: ${projectTitle || 'Trade Referral'} (${partnerName || 'Partner'})`,
          'line_items[0][quantity]': '1'
        });
        const resp = await fetch('https://api.stripe.com/v1/checkout/sessions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${stripeKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params.toString()
        });
        if (resp.ok) {
          const session = await resp.json();
          return NextResponse.json({ url: session.url, mode: 'stripe-live' });
        }
      }
      return NextResponse.json({ mode: 'local-escrow-ledger', locked: true });
    }

    return NextResponse.json({ error: 'Unknown billing action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
