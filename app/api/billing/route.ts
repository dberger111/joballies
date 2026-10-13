import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { action, amount, projectTitle, partnerName, originUrl, userStripeSecretKey, customerEmail } = await req.json();
    const stripeKey = (userStripeSecretKey || process.env.STRIPE_SECRET_KEY || '').trim();
    const baseUrl = originUrl || 'https://joballies.com';

    // 1. Live Stripe 14-Day Free Trial Subscription Checkout ($0 today, $49/mo after 14 days)
    if (action === 'start_trial_subscription') {
      if (stripeKey && (stripeKey.startsWith('sk_live_') || stripeKey.startsWith('sk_test_') || stripeKey.startsWith('rk_'))) {
        const params = new URLSearchParams({
          'mode': 'subscription',
          'success_url': `${baseUrl}/dashboard?subscription=trial_active`,
          'cancel_url': `${baseUrl}/dashboard?subscription=cancelled`,
          'line_items[0][price_data][currency]': 'usd',
          'line_items[0][price_data][unit_amount]': '4900',
          'line_items[0][price_data][recurring][interval]': 'month',
          'line_items[0][price_data][product_data][name]': 'JobAllies Pro Membership (14-Day Free Trial)',
          'line_items[0][price_data][product_data][description]': 'Unlimited local lead claims, auto-quotes, retailer Pro carts, and P2P referral escrow.',
          'line_items[0][quantity]': '1',
          'subscription_data[trial_period_days]': '14',
          'payment_method_collection': 'always'
        });
        if (customerEmail) params.set('customer_email', customerEmail);

        const resp = await fetch('https://api.stripe.com/v1/checkout/sessions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${stripeKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params.toString()
        });
        const session = await resp.json();
        if (resp.ok && session.url) {
          return NextResponse.json({ url: session.url, mode: 'stripe-live', sessionId: session.id });
        }
        return NextResponse.json({ error: session?.error?.message || 'Stripe API error', mode: 'stripe-error' }, { status: 400 });
      }

      return NextResponse.json({
        mode: 'cardless-trial-started',
        trialDays: 14,
        monthlyRate: 49.00,
        trialEndsAt: new Date(Date.now() + 14 * 86400000).toISOString()
      });
    }

    // 2. Live Stripe P2P Referral Escrow Lock
    if (action === 'lock_escrow') {
      if (stripeKey && (stripeKey.startsWith('sk_live_') || stripeKey.startsWith('sk_test_') || stripeKey.startsWith('rk_')) && amount) {
        const cents = Math.max(100, Math.round(Number(amount) * 100));
        const params = new URLSearchParams({
          'mode': 'payment',
          'success_url': `${baseUrl}/dashboard?escrow=locked`,
          'cancel_url': `${baseUrl}/dashboard?escrow=cancelled`,
          'line_items[0][price_data][currency]': 'usd',
          'line_items[0][price_data][unit_amount]': String(cents),
          'line_items[0][price_data][product_data][name]': `JobAllies P2P Escrow Deposit: ${projectTitle || 'Trade Referral'}`,
          'line_items[0][price_data][product_data][description]': `Assigned Trade Partner: ${partnerName || 'Verified Subcontractor'}`,
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
        const session = await resp.json();
        if (resp.ok && session.url) {
          return NextResponse.json({ url: session.url, mode: 'stripe-live', sessionId: session.id });
        }
        return NextResponse.json({ error: session?.error?.message || 'Stripe API error' }, { status: 400 });
      }
      return NextResponse.json({ mode: 'local-escrow-ledger', locked: true });
    }

    return NextResponse.json({ error: 'Unknown billing action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
