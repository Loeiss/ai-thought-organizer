import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'ClearMind AI Pro' },
          unit_amount: 900,
          recurring: { interval: 'month' },
        },
        quantity: 1,
      }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
    });
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
