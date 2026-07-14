import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import User from '@/models/User';
import mongoose from 'mongoose';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    console.log('WEBHOOK HIT - time:', new Date().toISOString());

    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    if (!sig) {
        console.log('No signature - returning 400');
        return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
        console.log('Event type:', event.type);
    } catch (err: any) {
        console.log('Signature verification failed:', err.message);
        return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
    }

    try {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI!);
        }

        // One-time payment completed — set plan to pro
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as any;
            console.log('checkout.session.completed - customer:', session.customer);
            console.log('payment_status:', session.payment_status);

            // Only upgrade if payment was successful
            if (session.payment_status === 'paid') {
                const updated = await User.findOneAndUpdate(
                    { stripeCustomerId: session.customer },
                    { $set: { plan: 'pro' } },
                    { returnDocument: 'after' }
                );
                console.log('Plan set to pro for:', updated?.username);
            }
        }

        // Payment intent succeeded — backup handler
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object as any;
            console.log('payment_intent.succeeded - customer:', paymentIntent.customer);

            if (paymentIntent.customer) {
                const updated = await User.findOneAndUpdate(
                    { stripeCustomerId: paymentIntent.customer },
                    { $set: { plan: 'pro' } },
                    { returnDocument: 'after' }
                );
                console.log('Backup handler - plan set to pro for:', updated?.username);
            }
        }

    } catch (err: any) {
        console.log('Database error:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}