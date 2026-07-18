import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import Consumption from '@/models/Consumption';
import { getLastNDateStrings } from '@/lib/date';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// GET — fetch consumption for a date range
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });

        const { searchParams } = new URL(req.url);
        const days = parseInt(searchParams.get('days') || '7');
        const timeZone = searchParams.get('tz') || 'UTC';

        // Get date range
        const dates = getLastNDateStrings(days, timeZone);

        const consumption = await Consumption.find({
            userId: user._id,
            date: { $in: dates }
        });

        // Group by date and category
        const grouped: Record<string, Record<string, number>> = {};
        consumption.forEach(entry => {
            if (!grouped[entry.date]) grouped[entry.date] = {};
            grouped[entry.date][entry.category] = (grouped[entry.date][entry.category] || 0) + entry.minutes;
        });

        return NextResponse.json({ consumption: grouped, dates }, { headers: corsHeaders });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}

// POST — record consumption data from extension
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });

        const { domain, category, minutes, date } = await req.json();

        if (!domain || !category || !minutes || !date) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400, headers: corsHeaders });
        }

        // Upsert — add minutes to existing record or create new one
        await Consumption.findOneAndUpdate(
            { userId: user._id, date, category, domain },
            { $inc: { minutes } },
            { upsert: true, new: true }
        );

        return NextResponse.json({ message: 'Consumption recorded' }, { headers: corsHeaders });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}