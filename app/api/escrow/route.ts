import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { referral_id, action, amount } = body;

    if (!referral_id || !action) {
      return NextResponse.json(
        { error: 'Missing required parameters: referral_id and action' },
        { status: 400 }
      );
    }

    const { data: contract, error: contractErr } = await supabase
      .from('referral_contracts')
      .select('*, referrer:contractor_profiles!referrer_id(stripe_connect_id), referee:contractor_profiles!referee_id(stripe_connect_id)')
      .eq('id', referral_id)
      .single();

    if (contractErr || !contract) {
      return NextResponse.json({ error: 'Referral contract not found.' }, { status: 404 });
    }

    if (action === 'hold_escrow') {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round((amount || contract.escrow_amount || 50) * 100),
        currency: 'usd',
        capture_method: 'manual',
        automatic_payment_methods: { enabled: true },
        metadata: { referral_id, job_id: contract.job_id },
      });

      await supabase
        .from('referral_contracts')
        .update({
          status: 'in_escrow',
          stripe_payment_intent_id: paymentIntent.id,
          escrow_amount: amount || contract.escrow_amount,
        })
        .eq('id', referral_id);

      return NextResponse.json({
        success: true,
        action: 'hold_escrow',
        clientSecret: paymentIntent.client_secret,
        status: 'in_escrow',
      });
    } else if (action === 'release_payout') {
      if (contract.stripe_payment_intent_id) {
        await stripe.paymentIntents.capture(contract.stripe_payment_intent_id);
      }

      await supabase
        .from('referral_contracts')
        .update({
          status: 'payout_completed',
          payout_transferred_at: new Date().toISOString(),
        })
        .eq('id', referral_id);

      return NextResponse.json({
        success: true,
        action: 'release_payout',
        status: 'payout_completed',
      });
    }

    return NextResponse.json({ error: 'Invalid action provided.' }, { status: 400 });
  } catch (error: any) {
    console.error('Escrow Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process escrow operation.' },
      { status: 500 }
    );
  }
}
