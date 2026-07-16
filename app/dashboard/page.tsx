'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CATEGORY_META, CATEGORY_ORDER } from '../categoryMeta';

interface Stats {
    todayConsumption: Record<string, number>;
    weeklyConsumption: Record<string, number>;
    qualityScore: number;
    budgets: Record<string, number>;
    totalMinutesToday: number;
    totalMinutesWeek: number;
}

const GREEN = 'oklch(0.75 0.15 155)';
const AMBER = 'oklch(0.78 0.15 85)';
const RED = 'oklch(0.68 0.18 25)';

const fmt = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    if (h <= 0) return `${m}m`;
    return `${h}h ${m > 0 ? `${m}m` : ''}`.trim();
};

const getQualityLabel = (score: number) => {
    if (score >= 67) return { label: 'Great', color: GREEN };
    if (score >= 34) return { label: 'Fair', color: AMBER };
    return { label: 'Poor', color: RED };
};

interface CategoryView {
    key: string;
    label: string;
    shortLabel: string;
    letter: string;
    status: 'neutral' | 'over' | 'near' | 'good';
    chipBg: string;
    chipFg: string;
    rightLabel: string;
    barWidth: string;
    barColor: string;
    barSolid: string;
    chartHeight: string;
}

function buildCategories(consumption: Record<string, number>, budgets: Record<string, number>, isWeek: boolean): CategoryView[] {
    const used = CATEGORY_ORDER.map(key => consumption[key] || 0);
    const max = Math.max(...used, 1);

    return CATEGORY_ORDER.map((key, i) => {
        const meta = CATEGORY_META[key];
        const usedMins = used[i];
        const dailyLimit = budgets[key] ?? -1;
        const limit = dailyLimit === -1 ? -1 : (isWeek ? dailyLimit * 7 : dailyLimit);
        const isUnlimited = limit === -1;
        const pct = isUnlimited ? Math.min(100, (usedMins / 120) * 100) : Math.min(100, (usedMins / limit) * 100);
        const status: CategoryView['status'] = isUnlimited ? 'neutral' : pct >= 100 ? 'over' : pct >= 75 ? 'near' : 'good';
        const barColor = isUnlimited ? 'oklch(0.5 0.02 160)' : status === 'over' ? RED : status === 'near' ? AMBER : GREEN;

        return {
            key,
            label: meta.label,
            shortLabel: meta.short,
            letter: meta.letter,
            status,
            chipBg: `oklch(0.32 0.06 ${meta.hue})`,
            chipFg: `oklch(0.85 0.08 ${meta.hue})`,
            rightLabel: isUnlimited ? `${fmt(usedMins)} · no limit` : `${fmt(usedMins)} / ${fmt(limit)}`,
            barWidth: `${pct}%`,
            barColor,
            barSolid: `oklch(0.65 0.13 ${meta.hue})`,
            chartHeight: `${Math.max(4, (usedMins / max) * 100)}%`,
        };
    });
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [error, setError] = useState('');
    const [locked, setLocked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'today' | 'week'>('today');
    const [token, setToken] = useState('');

    useEffect(() => {
        const t = new URLSearchParams(window.location.search).get('token');
        if (!t) {
            setError('No token provided. Please open this from the extension.');
            setLoading(false);
            return;
        }
        setToken(t);

        fetch('/api/consumption/stats', {
            headers: { authorization: `Bearer ${t}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.locked) setLocked(true);
                else if (data.error) setError(data.error);
                else setStats(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load stats');
                setLoading(false);
            });
    }, []);

    const cardBg = 'oklch(0.2 0.02 160)';
    const fg = 'oklch(0.95 0.01 160)';
    const dim = 'oklch(0.65 0.02 160)';

    const shellStyle: React.CSSProperties = {
        minHeight: '100vh',
        background: 'radial-gradient(120% 100% at 50% 0%, oklch(0.19 0.03 160) 0%, oklch(0.14 0.015 160) 55%, oklch(0.12 0.01 160) 100%)',
        color: fg,
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 24px 80px',
        fontFamily: 'Inter, system-ui, sans-serif',
        width: '100%',
        boxSizing: 'border-box',
    };

    if (loading) return (
        <div style={{ ...shellStyle, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <div style={styles.spinner} />
                <p style={{ color: dim }}>Loading your information diet...</p>
            </div>
        </div>
    );

    if (locked) return (
        <div style={{ ...shellStyle, alignItems: 'center' }}>
            <div style={{
                background: cardBg,
                border: '1px solid oklch(0.75 0.15 155 / 0.3)',
                borderRadius: 20,
                padding: '32px 28px',
                textAlign: 'center',
                maxWidth: 380
            }}>
                <p style={{ fontSize: 32, margin: '0 0 8px' }}>⭐</p>
                <h2 style={{ color: fg, fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>
                    The dashboard is a Pro feature
                </h2>
                <p style={{ color: dim, fontSize: 13, margin: '0 0 20px', lineHeight: 1.6 }}>
                    Upgrade to see your weekly trends, information quality score, and budget status charts.
                </p>
                <Link
                    href="/#pricing"
                    style={{
                        display: 'inline-block',
                        padding: '10px 24px',
                        borderRadius: 10,
                        background: GREEN,
                        color: 'oklch(0.14 0.02 160)',
                        textDecoration: 'none',
                        fontSize: 14,
                        fontWeight: 700
                    }}
                >
                    See Pro pricing
                </Link>
            </div>
        </div>
    );

    if (error) return (
        <div style={{ ...shellStyle, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <p style={{ fontSize: 48, margin: 0 }}>⚠️</p>
                <p style={{ color: RED, margin: 0 }}>{error}</p>
            </div>
        </div>
    );

    if (!stats) return null;

    const quality = getQualityLabel(stats.qualityScore);
    const isWeek = view === 'week';
    const consumption = isWeek ? stats.weeklyConsumption : stats.todayConsumption;
    const categories = buildCategories(consumption, stats.budgets, isWeek);
    const overBudgetCount = categories.filter(c => c.status === 'over').length;

    return (
        <div style={shellStyle}>
            <div style={{ width: '100%', maxWidth: 820, display: 'flex', flexDirection: 'column', gap: 22 }}>

                {/* Header */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center', paddingTop: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            width: 34, height: 34, borderRadius: 10,
                            background: `conic-gradient(${GREEN} 0deg 250deg, oklch(0.3 0.02 160) 250deg 360deg)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'oklch(0.14 0.015 160)' }} />
                        </div>
                        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>InfoDiet</div>
                    </div>
                    <div style={{ fontSize: 15, color: dim }}>Your information diet dashboard</div>
                    <a
                        href={`/budget?token=${token}`}
                        style={{
                            padding: '10px 20px',
                            borderRadius: 10,
                            border: '1px solid oklch(0.75 0.15 155 / 0.4)',
                            color: GREEN,
                            fontSize: 14,
                            fontWeight: 700,
                            textDecoration: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Manage Budgets
                    </a>
                </div>

                {/* Quality Score */}
                <div style={{
                    background: cardBg,
                    border: '1px solid oklch(1 0 0 / 0.07)',
                    borderRadius: 20,
                    padding: 32,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: dim, textTransform: 'uppercase' }}>
                        Weekly Information Quality Score
                    </div>
                    <div style={{ fontSize: 56, fontWeight: 800, color: quality.color, lineHeight: 1.1, marginTop: 8 }}>
                        {stats.qualityScore}
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: quality.color }}>{quality.label}</div>
                    <div style={{ fontSize: 13, color: dim, marginTop: 4 }}>
                        Based on ratio of educational vs entertainment content
                    </div>
                </div>

                {/* Stat cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                    <div style={styles.statCard(cardBg)}>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'oklch(0.55 0.02 160)', textTransform: 'uppercase' }}>Today</div>
                        <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>{fmt(stats.totalMinutesToday)}</div>
                    </div>
                    <div style={styles.statCard(cardBg)}>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'oklch(0.55 0.02 160)', textTransform: 'uppercase' }}>This Week</div>
                        <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>{fmt(stats.totalMinutesWeek)}</div>
                    </div>
                    <div style={styles.statCard(cardBg)}>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'oklch(0.55 0.02 160)', textTransform: 'uppercase' }}>Over Budget</div>
                        <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6, color: overBudgetCount > 0 ? RED : GREEN }}>{overBudgetCount}</div>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', background: 'oklch(1 0 0 / 0.05)', padding: 4, borderRadius: 12, gap: 4 }}>
                    {(['today', 'week'] as const).map(tab => (
                        <div
                            key={tab}
                            onClick={() => setView(tab)}
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                padding: 12,
                                borderRadius: 9,
                                fontSize: 14,
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'background 0.15s',
                                background: view === tab ? GREEN : 'transparent',
                                color: view === tab ? 'oklch(0.14 0.02 160)' : dim,
                            }}
                        >
                            {tab === 'today' ? "Today's Diet" : 'Weekly Overview'}
                        </div>
                    ))}
                </div>

                {/* Breakdown chart */}
                <div style={{ background: cardBg, border: '1px solid oklch(1 0 0 / 0.07)', borderRadius: 20, padding: 28 }}>
                    <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 24 }}>
                        {isWeek ? 'Weekly Breakdown' : "Today's Breakdown"}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 200, borderLeft: '1px solid oklch(1 0 0 / 0.1)', borderBottom: '1px solid oklch(1 0 0 / 0.1)', padding: '0 8px' }}>
                        {categories.map(cat => (
                            <div key={cat.key} style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                                <div style={{ width: '100%', borderRadius: '6px 6px 0 0', background: cat.barSolid, height: cat.chartHeight }} />
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8, padding: '0 8px', marginTop: 8 }}>
                        {categories.map(cat => (
                            <div key={cat.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.barSolid }} />
                                <div style={{ fontSize: 10, color: dim, textAlign: 'center', lineHeight: 1.2 }}>{cat.shortLabel}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Budget status */}
                <div style={{ background: cardBg, border: '1px solid oklch(1 0 0 / 0.07)', borderRadius: 20, padding: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ fontSize: 17, fontWeight: 700 }}>Budget Status</div>
                    {categories.map(cat => (
                        <div key={cat.key}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 30, height: 30, borderRadius: 9, background: cat.chipBg, color: cat.chipFg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                                        {cat.letter}
                                    </div>
                                    <div style={{ fontSize: 14, fontWeight: 600 }}>{cat.label}</div>
                                </div>
                                <div style={{ fontSize: 13, color: dim, fontVariantNumeric: 'tabular-nums' }}>{cat.rightLabel}</div>
                            </div>
                            <div style={{ width: '100%', height: 6, borderRadius: 999, background: 'oklch(1 0 0 / 0.07)', overflow: 'hidden' }}>
                                <div style={{ height: '100%', borderRadius: 999, background: cat.barColor, width: cat.barWidth, transition: 'width 0.4s ease' }} />
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

const styles = {
    statCard: (cardBg: string): React.CSSProperties => ({
        background: cardBg,
        border: '1px solid oklch(1 0 0 / 0.06)',
        borderRadius: 16,
        padding: 20,
        textAlign: 'center',
    }),
    spinner: {
        width: 40,
        height: 40,
        border: '3px solid oklch(0.75 0.15 155 / 0.15)',
        borderTop: `3px solid ${GREEN}`,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
    } as React.CSSProperties
};
