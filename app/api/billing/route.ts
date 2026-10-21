import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, trade } = body;

    const origin = req.headers.get('origin') || 'https://joballies.com';

    // Create Stripe Checkout Session with all payment methods enabled
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'link', 'cashapp'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'JobAllies Pro Command Center',
              description: 'Unlimited local leads, voice quotes, supply house wholesale cart, and P2P referral escrow.',
            },
            unit_amount: 4900, // $49.00 / mo
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 14,
      },
      success_url: `${origin}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      customer_email: email || undefined,
      metadata: {
        contractorName: name || 'Pro Contractor',
        trade: trade || 'General Contractor',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe billing error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
