import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import Budget from '@/models/Budget';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Daily budgets are a Pro feature — free users get unlimited (-1) budgets
// for every category, which the extension already treats as "don't block".
const UNLIMITED_BUDGETS = {
    news: -1, social: -1, entertainment: -1, educational: -1,
    shopping: -1, forums: -1, gaming: -1, other: -1
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// GET — fetch user's budgets
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });

        if (user.plan !== 'pro') {
            return NextResponse.json({ budgets: UNLIMITED_BUDGETS, locked: true }, { headers: corsHeaders });
        }

        let budget = await Budget.findOne({ userId: user._id });

        // Create default budget if none exists
        if (!budget) {
            budget = new Budget({ userId: user._id });
            await budget.save();
        }

        return NextResponse.json({ budgets: budget.budgets }, { headers: corsHeaders });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}

// PUT — update user's budgets
export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });

        if (user.plan !== 'pro') {
            return NextResponse.json({ error: 'Upgrade to Pro to set custom budgets' }, { status: 403, headers: corsHeaders });
        }

        const { budgets } = await req.json();

        const updated = await Budget.findOneAndUpdate(
            { userId: user._id },
            { $set: { budgets, updatedAt: new Date() } },
            { upsert: true, new: true }
        );

        return NextResponse.json({ budgets: updated.budgets }, { headers: corsHeaders });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}