import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { connectDB } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import User from '@/models/User';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { hasHadTrial } = await req.json();
        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
        }

        if (user.plan === 'pro') {
            return NextResponse.json({ error: 'Already on Pro plan' }, { status: 400, headers: corsHeaders });
        }

        // Create or verify Stripe customer
        let customerId = user.stripeCustomerId;
        if (customerId) {
            try {
                await stripe.customers.retrieve(customerId);
            } catch {
                console.log('Customer not found in Stripe, creating new one');
                customerId = null;
            }
        }

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: { userId: user._id.toString() }
            });
            customerId = customer.id;
            await User.findByIdAndUpdate(user._id, { stripeCustomerId: customer.id });
        }

        const sessionConfig: any = {
            customer: customerId,
            line_items: [{
                price: process.env.STRIPE_PRICE_ID!,
                quantity: 1
            }],
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
        };

        // Only add trial if user hasn't had one before
        if (!hasHadTrial) {
            sessionConfig.subscription_data = {
                trial_period_days: 7,
                trial_settings: {
                    end_behavior: {
                        missing_payment_method: 'cancel'
                    }
                }
            };
            sessionConfig.payment_method_collection = 'if_required';
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);

        return NextResponse.json({ url: session.url }, { headers: corsHeaders });
    } catch (err: any) {
        console.log('Checkout error:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}