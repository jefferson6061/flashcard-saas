import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export async function POST(req) {
  try {
    const { userId, amount, plan } = await req.json();

    console.log(`Creating checkout session for plan: ${plan}, amount: $${amount / 100}`);

    const params = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${plan.charAt(0).toUpperCase() + plan.slice(1)} subscription`, // e.g., "Pro subscription"
            },
            unit_amount: amount, // Use the amount passed from the client
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: String(userId),
        plan: plan,
      },
      success_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
    };

    const checkoutSession = await stripe.checkout.sessions.create(params);

    return NextResponse.json(checkoutSession, { status: 200 });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new NextResponse(JSON.stringify({ error: { message: error.message } }), {
      status: 500,
    });
  }
}
