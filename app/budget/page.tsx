'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '../categories';
import { CATEGORY_META, CATEGORY_ORDER } from '../categoryMeta';

interface Budgets {
    [category: string]: number;
}

const GREEN = 'oklch(0.75 0.15 155)';
const PRESETS = [
    { label: '15m', value: 15 },
    { label: '30m', value: 30 },
    { label: '1h', value: 60 },
    { label: '1.5h', value: 90 },
    { label: '2h', value: 120 },
];

const fmt = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h <= 0) return `${m} minutes per day`;
    if (m === 0) return `${h} ${h === 1 ? 'hour' : 'hours'} per day`;
    return `${h}h ${m}m per day`;
};

export default function BudgetPage() {
    const [budgets, setBudgets] = useState<Budgets>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [saved, setSaved] = useState(false);
    const [token, setToken] = useState('');
    const [locked, setLocked] = useState(false);

    useEffect(() => {
        const t = new URLSearchParams(window.location.search).get('token');
        if (!t) {
            setError('No token provided. Please open this from the extension.');
            setLoading(false);
            return;
        }
        setToken(t);

        fetch('/api/budget', {
            headers: { authorization: `Bearer ${t}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.budgets) {
                    setBudgets(data.budgets);
                    setLocked(!!data.locked);
                } else {
                    setError(data.error);
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load budgets');
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setError('');
        setSaved(false);

        try {
            const res = await fetch('/api/budget', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ budgets })
            });
            const data = await res.json();
            if (data.budgets) {
                setBudgets(data.budgets);
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } else {
                setError(data.error);
            }
        } catch {
            setError('Failed to save budgets');
        } finally {
            setSaving(false);
        }
    };

    const handleSliderChange = (category: string, value: number) => {
        setBudgets(prev => ({ ...prev, [category]: value }));
    };

    const toggleUnlimited = (category: string) => {
        setBudgets(prev => ({
            ...prev,
            [category]: prev[category] === -1
                ? CATEGORIES[category].defaultBudget
                : -1
        }));
    };

    const bg = 'radial-gradient(120% 100% at 50% 0%, oklch(0.19 0.03 160) 0%, oklch(0.14 0.015 160) 55%, oklch(0.12 0.01 160) 100%)';
    const cardBg = 'oklch(0.2 0.02 160)';
    const fg = 'oklch(0.95 0.01 160)';
    const dim = 'oklch(0.65 0.02 160)';

    const shellStyle: React.CSSProperties = {
        minHeight: '100vh',
        background: bg,
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
                <p style={{ color: dim }}>Loading your budgets...</p>
            </div>
        </div>
    );

    if (error && Object.keys(budgets).length === 0) return (
        <div style={{ ...shellStyle, alignItems: 'center' }}>
            <p style={{ color: 'oklch(0.68 0.18 25)' }}>{error}</p>
        </div>
    );

    return (
        <div style={shellStyle}>
            <div style={{ width: '100%', maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 22 }}>

                {/* Top nav */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link href={`/dashboard?token=${token}`} style={{ fontSize: 14, fontWeight: 600, textDecoration: 'none', color: GREEN }}>
                        &larr; Back to Dashboard
                    </Link>
                    <button
                        onClick={() => window.close()}
                        style={{ fontSize: 14, fontWeight: 600, textDecoration: 'none', color: GREEN, border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
                    >
                        Close &amp; back to extension &rarr;
                    </button>
                </div>

                {/* Header */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: `conic-gradient(${GREEN} 0deg 250deg, oklch(0.3 0.02 160) 250deg 360deg)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'oklch(0.14 0.015 160)' }} />
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>Daily Budgets</div>
                    </div>
                    <div style={{ fontSize: 15, color: dim, lineHeight: 1.5 }}>
                        Set how much time you want to spend on each content category per day. Set to unlimited for categories you don&apos;t want to limit.
                    </div>
                </div>

                {locked && (
                    <div style={{
                        background: cardBg,
                        border: '1px solid oklch(0.75 0.15 155 / 0.3)',
                        borderRadius: 18,
                        padding: '24px 20px',
                        textAlign: 'center'
                    }}>
                        <p style={{ fontSize: 28, margin: '0 0 8px' }}>⭐</p>
                        <h2 style={{ color: fg, fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>
                            Daily budgets are a Pro feature
                        </h2>
                        <p style={{ color: dim, fontSize: 13, margin: '0 0 20px', lineHeight: 1.6 }}>
                            Upgrade to set per-category time limits and have InfoDiet block access automatically once you hit them.
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
                )}

                {/* Category cards */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                    opacity: locked ? 0.4 : 1,
                    pointerEvents: locked ? 'none' : 'auto'
                }}>
                    {CATEGORY_ORDER.map(key => {
                        const meta = CATEGORY_META[key];
                        const budget = budgets[key] ?? CATEGORIES[key].defaultBudget;
                        const isUnlimited = budget === -1;
                        const color = `oklch(0.65 0.13 ${meta.hue})`;

                        return (
                            <div key={key} style={{ background: cardBg, border: '1px solid oklch(1 0 0 / 0.07)', borderRadius: 18, padding: 24 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{
                                            width: 36, height: 36, borderRadius: 10,
                                            background: `oklch(0.32 0.06 ${meta.hue})`,
                                            color: `oklch(0.85 0.08 ${meta.hue})`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 14, fontWeight: 700
                                        }}>
                                            {meta.letter}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 16, fontWeight: 700 }}>{meta.label}</div>
                                            <div style={{ fontSize: 13, color: dim, marginTop: 2 }}>
                                                {isUnlimited ? 'Unlimited' : fmt(budget)}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleUnlimited(key)}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: 999,
                                            fontSize: 13,
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                            border: `1px solid ${isUnlimited ? GREEN : 'oklch(1 0 0 / 0.14)'}`,
                                            background: isUnlimited ? 'oklch(0.75 0.15 155 / 0.12)' : 'transparent',
                                            color: isUnlimited ? GREEN : 'oklch(0.75 0.02 160)',
                                        }}
                                    >
                                        {isUnlimited ? '∞ Unlimited' : 'Set unlimited'}
                                    </button>
                                </div>

                                {!isUnlimited && (
                                    <>
                                        <input
                                            type="range"
                                            min={5}
                                            max={120}
                                            step={5}
                                            value={budget}
                                            onChange={e => handleSliderChange(key, parseInt(e.target.value))}
                                            style={{
                                                width: '100%',
                                                accentColor: color,
                                                cursor: 'pointer'
                                            }}
                                        />
                                        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                                            {PRESETS.map(preset => (
                                                <button
                                                    key={preset.value}
                                                    onClick={() => handleSliderChange(key, preset.value)}
                                                    style={{
                                                        padding: '8px 16px',
                                                        borderRadius: 999,
                                                        fontSize: 13,
                                                        fontWeight: 700,
                                                        cursor: 'pointer',
                                                        border: '1px solid oklch(1 0 0 / 0.12)',
                                                        background: budget === preset.value ? color : 'oklch(1 0 0 / 0.04)',
                                                        color: budget === preset.value ? 'oklch(0.14 0.02 160)' : 'oklch(0.75 0.02 160)',
                                                    }}
                                                >
                                                    {preset.label}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>

                {error && <p style={{ color: 'oklch(0.68 0.18 25)', textAlign: 'center', margin: 0 }}>{error}</p>}

                {!locked && (
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                            textAlign: 'center',
                            padding: 16,
                            borderRadius: 14,
                            border: 'none',
                            background: saved ? 'oklch(0.7 0.02 160)' : GREEN,
                            color: 'oklch(0.14 0.02 160)',
                            fontSize: 16,
                            fontWeight: 700,
                            cursor: saving ? 'not-allowed' : 'pointer',
                            opacity: saving ? 0.7 : 1
                        }}
                    >
                        {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Budgets'}
                    </button>
                )}
            </div>
        </div>
    );
}

const styles = {
    spinner: {
        width: 40,
        height: 40,
        border: '3px solid oklch(0.75 0.15 155 / 0.15)',
        borderTop: `3px solid ${GREEN}`,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
    } as React.CSSProperties
};
