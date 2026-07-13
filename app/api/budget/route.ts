import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import Budget from '@/models/Budget';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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