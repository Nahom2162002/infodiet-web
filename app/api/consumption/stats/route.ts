import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import Consumption from '@/models/Consumption';
import Budget from '@/models/Budget';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });

        if (user.plan !== 'pro') {
            return NextResponse.json({ error: 'Upgrade to Pro to view your dashboard', locked: true }, { status: 403, headers: corsHeaders });
        }

        const today = new Date().toISOString().split('T')[0];

        // Get last 7 days
        const dates = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        });

        const [consumption, budget] = await Promise.all([
            Consumption.find({ userId: user._id, date: { $in: dates } }),
            Budget.findOne({ userId: user._id })
        ]);

        // Today's consumption by category
        const todayConsumption: Record<string, number> = {};
        consumption
            .filter(e => e.date === today)
            .forEach(e => {
                todayConsumption[e.category] = (todayConsumption[e.category] || 0) + e.minutes;
            });

        // Weekly consumption by category
        const weeklyConsumption: Record<string, number> = {};
        consumption.forEach(e => {
            weeklyConsumption[e.category] = (weeklyConsumption[e.category] || 0) + e.minutes;
        });

        // Daily totals for chart
        const dailyTotals = dates.map(date => {
            const dayEntries = consumption.filter(e => e.date === date);
            const total = dayEntries.reduce((sum, e) => sum + e.minutes, 0);
            const d = new Date(date);
            return {
                date: d.toLocaleDateString('en-US', { weekday: 'short' }),
                minutes: Math.round(total),
                educational: Math.round(dayEntries.filter(e => e.category === 'educational').reduce((sum, e) => sum + e.minutes, 0)),
                entertainment: Math.round(dayEntries.filter(e => e.category === 'entertainment').reduce((sum, e) => sum + e.minutes, 0)),
                social: Math.round(dayEntries.filter(e => e.category === 'social').reduce((sum, e) => sum + e.minutes, 0)),
                news: Math.round(dayEntries.filter(e => e.category === 'news').reduce((sum, e) => sum + e.minutes, 0))
            };
        }).reverse();

        // Calculate information quality score (0-100) — educational vs
        // entertainment ratio, not a share of total browsing.
        const totalMinutes = Object.values(weeklyConsumption).reduce((a, b) => a + b, 0);
        const educationalMinutes = weeklyConsumption.educational || 0;
        const entertainmentMinutes = weeklyConsumption.entertainment || 0;
        const qualityDenominator = educationalMinutes + entertainmentMinutes;
        const qualityScore = qualityDenominator > 0 ? Math.round((educationalMinutes / qualityDenominator) * 100) : 0;

        // Budget status — which categories are over budget today
        const budgets = budget?.budgets || {};
        const budgetStatus = Object.entries(todayConsumption).map(([category, minutes]) => {
            const limit = budgets[category] ?? -1;
            return {
                category,
                minutes: Math.round(minutes),
                limit,
                overBudget: limit !== -1 && minutes > limit,
                percentage: limit !== -1 ? Math.round((minutes / limit) * 100) : 0
            };
        });

        return NextResponse.json({
            todayConsumption,
            weeklyConsumption,
            dailyTotals,
            qualityScore,
            budgetStatus,
            totalMinutesToday: Math.round(Object.values(todayConsumption).reduce((a, b) => a + b, 0)),
            totalMinutesWeek: Math.round(totalMinutes)
        }, { headers: corsHeaders });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}