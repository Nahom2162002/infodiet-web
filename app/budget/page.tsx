'use client';
import { useEffect, useState } from 'react';
import { CATEGORIES } from '../categories';

interface Budgets {
    [category: string]: number;
}

export default function BudgetPage() {
    const [budgets, setBudgets] = useState<Budgets>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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
            headers: { 'authorization': `Bearer ${t}` }
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
        setSuccess('');

        try {
            const res = await fetch('/api/budget', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ budgets })
            });
            const data = await res.json();
            if (data.budgets) {
                setBudgets(data.budgets);
                setSuccess('Budgets saved successfully!');
                setTimeout(() => setSuccess(''), 3000);
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

    if (loading) return (
        <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
            <div style={styles.spinner} />
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>Loading your budgets...</p>
        </div>
    );

    if (error && !budgets) return (
        <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#ff6b6b' }}>{error}</p>
        </div>
    );

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <a
                        href={`/dashboard?token=${token}`}
                        style={{ color: '#00c896', fontSize: 14, textDecoration: 'none' }}
                    >
                        ← Back to Dashboard
                    </a>
                    <button onClick={() => window.close()} style={styles.closeLink}>
                        Close & back to extension →
                    </button>
                </div>
                <h1 style={styles.title}>⏱ Daily Budgets</h1>
                <p style={styles.subtitle}>
                    Set how much time you want to spend on each content category per day.
                    Set to unlimited for categories you don't want to limit.
                </p>
            </div>

            {locked && (
                <div style={{
                    background: 'linear-gradient(135deg, rgba(0,200,150,0.08), rgba(0,165,122,0.05))',
                    border: '1px solid rgba(0,200,150,0.25)',
                    borderRadius: 16,
                    padding: '24px 20px',
                    textAlign: 'center',
                    marginBottom: 24
                }}>
                    <p style={{ fontSize: 28, margin: '0 0 8px' }}>⭐</p>
                    <h2 style={{ color: 'white', fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>
                        Daily budgets are a Pro feature
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '0 0 20px', lineHeight: 1.6 }}>
                        Upgrade to set per-category time limits and have InfoDiet block access automatically once you hit them.
                    </p>
                    <a
                        href="/#pricing"
                        style={{
                            display: 'inline-block',
                            padding: '10px 24px',
                            borderRadius: 8,
                            background: 'linear-gradient(135deg, #00c896, #00a57a)',
                            color: 'white',
                            textDecoration: 'none',
                            fontSize: 14,
                            fontWeight: 700
                        }}
                    >
                        See Pro pricing
                    </a>
                </div>
            )}

            {/* Category budgets */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                marginBottom: 32,
                opacity: locked ? 0.4 : 1,
                pointerEvents: locked ? 'none' : 'auto'
            }}>
                {Object.entries(CATEGORIES).map(([key, cat]) => {
                    const budget = budgets[key] ?? cat.defaultBudget;
                    const isUnlimited = budget === -1;

                    return (
                        <div key={key} style={styles.card}>
                            {/* Category header */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 16
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontSize: 20 }}>{cat.emoji}</span>
                                    <div>
                                        <p style={{ color: 'white', fontSize: 14, fontWeight: 600, margin: 0 }}>
                                            {cat.label}
                                        </p>
                                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>
                                            {isUnlimited ? 'Unlimited' : `${budget} minutes per day`}
                                        </p>
                                    </div>
                                </div>

                                {/* Unlimited toggle */}
                                <button
                                    onClick={() => toggleUnlimited(key)}
                                    style={{
                                        padding: '4px 10px',
                                        borderRadius: 20,
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        background: isUnlimited
                                            ? 'rgba(0,200,150,0.15)'
                                            : 'rgba(255,255,255,0.05)',
                                        color: isUnlimited ? '#00c896' : 'rgba(255,255,255,0.4)',
                                        fontSize: 11,
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {isUnlimited ? '∞ Unlimited' : 'Set unlimited'}
                                </button>
                            </div>

                            {/* Slider */}
                            {!isUnlimited && (
                                <>
                                    <input
                                        type="range"
                                        min={5}
                                        max={240}
                                        step={5}
                                        value={budget}
                                        onChange={e => handleSliderChange(key, parseInt(e.target.value))}
                                        style={{
                                            width: '100%',
                                            accentColor: cat.color,
                                            cursor: 'pointer'
                                        }}
                                    />

                                    {/* Quick presets */}
                                    <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                                        {[15, 30, 60, 90, 120].map(preset => (
                                            <button
                                                key={preset}
                                                onClick={() => handleSliderChange(key, preset)}
                                                style={{
                                                    padding: '3px 10px',
                                                    borderRadius: 20,
                                                    border: '1px solid rgba(255,255,255,0.15)',
                                                    background: budget === preset
                                                        ? cat.color
                                                        : 'rgba(255,255,255,0.05)',
                                                    color: 'white',
                                                    fontSize: 11,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {preset >= 60 ? `${preset / 60}h` : `${preset}m`}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Save button */}
            {error && <p style={{ color: '#ff6b6b', textAlign: 'center', marginBottom: 12 }}>{error}</p>}
            {success && <p style={{ color: '#00c896', textAlign: 'center', marginBottom: 12 }}>{success}</p>}

            {!locked && (
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        width: '100%',
                        maxWidth: 400,
                        display: 'block',
                        margin: '0 auto',
                        padding: '14px',
                        borderRadius: 10,
                        border: 'none',
                        background: 'linear-gradient(135deg, #00c896, #00a57a)',
                        color: 'white',
                        fontSize: 15,
                        fontWeight: 700,
                        cursor: saving ? 'not-allowed' : 'pointer',
                        opacity: saving ? 0.7 : 1
                    }}
                >
                    {saving ? 'Saving...' : 'Save Budgets'}
                </button>
            )}
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 0%, #0a2e1a, #0a0f0d)',
        padding: '40px 24px 80px',
        fontFamily: 'Inter, sans-serif',
        width: '100%',
        boxSizing: 'border-box',
        maxWidth: 600,
        margin: '0 auto'
    },
    header: {
        marginBottom: 32
    },
    closeLink: {
        padding: 0,
        border: 'none',
        background: 'transparent',
        color: '#00c896',
        fontSize: 14,
        cursor: 'pointer'
    },
    title: {
        color: 'white',
        fontSize: 28,
        fontWeight: 700,
        margin: '0 0 8px'
    },
    subtitle: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        lineHeight: 1.6,
        margin: 0
    },
    card: {
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: '20px'
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