'use client';
import { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

interface Stats {
    todayConsumption: Record<string, number>;
    weeklyConsumption: Record<string, number>;
    dailyTotals: {
        date: string;
        minutes: number;
        educational: number;
        entertainment: number;
        social: number;
        news: number;
    }[];
    qualityScore: number;
    budgetStatus: {
        category: string;
        minutes: number;
        limit: number;
        overBudget: boolean;
        percentage: number;
    }[];
    totalMinutesToday: number;
    totalMinutesWeek: number;
}

const CATEGORY_META: Record<string, { label: string; emoji: string; color: string }> = {
    news:           { label: 'News & Politics',       emoji: '📰', color: '#ff6b6b' },
    social:         { label: 'Social Media',           emoji: '📱', color: '#ffd93d' },
    entertainment:  { label: 'Entertainment',          emoji: '🎬', color: '#ff922b' },
    educational:    { label: 'Educational',            emoji: '📚', color: '#00c896' },
    shopping:       { label: 'Shopping',               emoji: '🛍️', color: '#cc5de8' },
    forums:         { label: 'Forums',                 emoji: '💬', color: '#339af0' },
    gaming:         { label: 'Gaming',                 emoji: '🎮', color: '#f06595' },
    other:          { label: 'Other',                  emoji: '🌐', color: 'rgba(255,255,255,0.3)' }
};

const formatMinutes = (mins: number) => {
    if (!mins || mins < 1) return '0m';
    if (mins < 60) return `${Math.round(mins)}m`;
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

const getQualityLabel = (score: number) => {
    if (score >= 70) return { label: 'Excellent', color: '#00c896' };
    if (score >= 50) return { label: 'Good', color: '#ffd93d' };
    if (score >= 30) return { label: 'Fair', color: '#ff922b' };
    return { label: 'Poor', color: '#ff6b6b' };
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: '#111a16',
                border: '1px solid rgba(0,200,150,0.2)',
                borderRadius: 8,
                padding: '8px 12px'
            }}>
                <p style={{ color: 'white', margin: '0 0 4px', fontWeight: 600 }}>{label}</p>
                {payload.map((p: any, i: number) => (
                    <p key={i} style={{ color: p.color, margin: '2px 0', fontSize: 12 }}>
                        {p.name}: {formatMinutes(p.value)}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'today' | 'week'>('today');

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get('token');
        if (!token) {
            setError('No token provided. Please open this from the extension.');
            setLoading(false);
            return;
        }

        fetch('/api/consumption/stats', {
            headers: { 'authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) setError(data.error);
                else setStats(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load stats');
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
            <div style={styles.spinner} />
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>Loading your information diet...</p>
        </div>
    );

    if (error) return (
        <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <p style={{ fontSize: 48 }}>⚠️</p>
            <p style={{ color: '#ff6b6b' }}>{error}</p>
        </div>
    );

    if (!stats) return null;

    const quality = getQualityLabel(stats.qualityScore);

    // Pie chart data — weekly consumption by category
    const pieData = Object.entries(stats.weeklyConsumption)
        .filter(([, mins]) => mins > 0)
        .map(([cat, mins]) => ({
            name: CATEGORY_META[cat]?.label || cat,
            value: Math.round(mins),
            color: CATEGORY_META[cat]?.color || '#888'
        }))
        .sort((a, b) => b.value - a.value);

    // Today's consumption for bar chart
    const todayBarData = Object.entries(stats.todayConsumption)
        .filter(([, mins]) => mins > 0)
        .map(([cat, mins]) => ({
            name: CATEGORY_META[cat]?.emoji + ' ' + (CATEGORY_META[cat]?.label.split(' ')[0] || cat),
            minutes: Math.round(mins),
            color: CATEGORY_META[cat]?.color || '#888'
        }))
        .sort((a, b) => b.minutes - a.minutes);

    const hasData = stats.totalMinutesWeek > 0;

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>🥗 InfoDiet</h1>
                <p style={styles.subtitle}>Your information diet dashboard</p>
                <a
                    href={`/budget?token=${new URLSearchParams(window.location.search).get('token')}`}
                    style={{
                    display: 'inline-block',
                    marginTop: 12,
                    padding: '8px 20px',
                    borderRadius: 8,
                    border: '1px solid rgba(0,200,150,0.3)',
                    background: 'rgba(0,200,150,0.05)',
                    color: '#00c896',
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: 'none'
                }}
                >
                    ⚙️ Manage Budgets
                </a>
            </div>

            {/* Quality Score */}
            <div style={{
                ...styles.card,
                textAlign: 'center',
                marginBottom: 24,
                background: `linear-gradient(135deg, rgba(0,200,150,0.1), rgba(0,165,122,0.05))`,
                border: `1px solid rgba(0,200,150,0.2)`
            }}>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>
                    Weekly Information Quality Score
                </p>
                <p style={{ fontSize: 56, fontWeight: 800, color: quality.color, margin: '0 0 4px' }}>
                    {stats.qualityScore}
                </p>
                <p style={{ color: quality.color, fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>
                    {quality.label}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>
                    Based on ratio of educational vs entertainment content
                </p>
            </div>

            {/* Stat Cards */}
            <div style={styles.cardRow}>
                <div style={styles.statCard}>
                    <p style={styles.cardLabel}>Today</p>
                    <p style={styles.cardValue}>{formatMinutes(stats.totalMinutesToday)}</p>
                </div>
                <div style={styles.statCard}>
                    <p style={styles.cardLabel}>This Week</p>
                    <p style={styles.cardValue}>{formatMinutes(stats.totalMinutesWeek)}</p>
                </div>
                <div style={styles.statCard}>
                    <p style={styles.cardLabel}>Over Budget</p>
                    <p style={{ ...styles.cardValue, color: stats.budgetStatus.filter(b => b.overBudget).length > 0 ? '#ff6b6b' : '#00c896' }}>
                        {stats.budgetStatus.filter(b => b.overBudget).length}
                    </p>
                </div>
            </div>

            {/* Tab Toggle */}
            <div style={{
                display: 'flex',
                gap: 8,
                marginBottom: 20,
                background: 'rgba(255,255,255,0.04)',
                padding: 4,
                borderRadius: 10
            }}>
                {(['today', 'week'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: 8,
                            border: 'none',
                            background: activeTab === tab
                                ? 'linear-gradient(135deg, #00c896, #00a57a)'
                                : 'transparent',
                            color: activeTab === tab ? 'white' : 'rgba(255,255,255,0.4)',
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        {tab === 'today' ? "Today's Diet" : 'Weekly Overview'}
                    </button>
                ))}
            </div>

            {!hasData ? (
                <div style={styles.emptyState}>
                    <p style={{ fontSize: 48 }}>🌱</p>
                    <p style={styles.emptyTitle}>No data yet</p>
                    <p style={styles.emptyText}>
                        Browse the web with InfoDiet active and your consumption data will appear here.
                    </p>
                </div>
            ) : activeTab === 'today' ? (
                <>
                    {/* Today's breakdown bar chart */}
                    {todayBarData.length > 0 && (
                        <div style={styles.chartContainer}>
                            <h2 style={styles.chartTitle}>Today's Breakdown</h2>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={todayBarData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                    <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
                                    <YAxis tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} tickFormatter={formatMinutes} width={45} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar
                                        dataKey="minutes"
                                        radius={[6, 6, 0, 0]}
                                        shape={(props: any) => {
                                            const { x, y, width, height, index } = props;
                                            return (
                                                <rect
                                                    x={x} y={y}
                                                    width={width} height={height}
                                                    fill={todayBarData[index]?.color || '#00c896'}
                                                    rx={6} ry={6}
                                                />
                                            );
                                        }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Budget status */}
                    {stats.budgetStatus.length > 0 && (
                        <div style={styles.chartContainer}>
                            <h2 style={styles.chartTitle}>Budget Status</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {stats.budgetStatus
                                    .sort((a, b) => b.percentage - a.percentage)
                                    .map((item, i) => {
                                        const meta = CATEGORY_META[item.category];
                                        const color = item.overBudget ? '#ff6b6b' : item.percentage >= 80 ? '#ffd93d' : '#00c896';
                                        return (
                                            <div key={i}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                                    <span style={{ color: 'white', fontSize: 13 }}>
                                                        {meta?.emoji} {meta?.label || item.category}
                                                    </span>
                                                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                                                        {formatMinutes(item.minutes)} / {item.limit}m
                                                        {item.overBudget && <span style={{ color: '#ff6b6b', marginLeft: 6 }}>OVER</span>}
                                                    </span>
                                                </div>
                                                <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
                                                    <div style={{
                                                        height: '100%',
                                                        width: `${Math.min(item.percentage, 100)}%`,
                                                        background: color,
                                                        borderRadius: 3,
                                                        transition: 'width 0.3s ease'
                                                    }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <>
                    {/* Weekly stacked bar chart */}
                    <div style={styles.chartContainer}>
                        <h2 style={styles.chartTitle}>Daily Breakdown — Last 7 Days</h2>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={stats.dailyTotals} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
                                <YAxis tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} tickFormatter={formatMinutes} width={45} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="educational" name="Educational" stackId="a" fill="#00c896" />
                                <Bar dataKey="social" name="Social" stackId="a" fill="#ffd93d" />
                                <Bar dataKey="entertainment" name="Entertainment" stackId="a" fill="#ff922b" />
                                <Bar dataKey="news" name="News" stackId="a" fill="#ff6b6b" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Weekly pie chart */}
                    {pieData.length > 0 && (
                        <div style={styles.chartContainer}>
                            <h2 style={styles.chartTitle}>Weekly Content Mix</h2>
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: any) => formatMinutes(value)}
                                        contentStyle={{
                                            background: '#111a16',
                                            border: '1px solid rgba(0,200,150,0.2)',
                                            borderRadius: 8
                                        }}
                                        labelStyle={{ color: 'white' }}
                                    />
                                    <Legend
                                        formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Weekly category totals */}
                    <div style={styles.chartContainer}>
                        <h2 style={styles.chartTitle}>Weekly Totals</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {Object.entries(stats.weeklyConsumption)
                                .filter(([, mins]) => mins > 0)
                                .sort(([, a], [, b]) => b - a)
                                .map(([cat, mins], i) => {
                                    const meta = CATEGORY_META[cat];
                                    const total = stats.totalMinutesWeek;
                                    const pct = total > 0 ? Math.round((mins / total) * 100) : 0;
                                    return (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <span style={{ fontSize: 16, flexShrink: 0 }}>{meta?.emoji}</span>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                                                    <span style={{ color: 'white', fontSize: 12 }}>{meta?.label || cat}</span>
                                                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                                                        {formatMinutes(mins)} ({pct}%)
                                                    </span>
                                                </div>
                                                <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
                                                    <div style={{
                                                        height: '100%',
                                                        width: `${pct}%`,
                                                        background: meta?.color || '#888',
                                                        borderRadius: 2
                                                    }} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 0%, #0a2e1a, #0a0f0d)',
        padding: '40px 24px 60px',
        fontFamily: 'Inter, sans-serif',
        width: '100%',
        boxSizing: 'border-box'
    },
    header: {
        textAlign: 'center',
        marginBottom: 32
    },
    title: {
        color: 'white',
        fontSize: 28,
        fontWeight: 700,
        margin: 0
    },
    subtitle: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
        marginTop: 6
    },
    card: {
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: '24px'
    },
    cardRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 24
    },
    statCard: {
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: '16px',
        textAlign: 'center'
    },
    cardLabel: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: 11,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em',
        margin: '0 0 6px'
    },
    cardValue: {
        color: 'white',
        fontSize: 22,
        fontWeight: 700,
        margin: 0
    },
    chartContainer: {
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 20
    },
    chartTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 600,
        margin: '0 0 20px'
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 24px',
        color: 'rgba(255,255,255,0.4)'
    },
    emptyTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 600,
        margin: '12px 0 8px'
    },
    emptyText: {
        fontSize: 14,
        maxWidth: 320,
        margin: '0 auto',
        lineHeight: 1.6
    },
    spinner: {
        width: 40,
        height: 40,
        border: '3px solid rgba(0,200,150,0.1)',
        borderTop: '3px solid #00c896',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
    }
};