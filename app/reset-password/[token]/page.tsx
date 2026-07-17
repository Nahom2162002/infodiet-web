'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';

const GREEN = 'oklch(0.75 0.15 155)';
const RED = 'oklch(0.68 0.18 25)';

export default function ResetPasswordPage() {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const requirements = [
        { text: 'At least 8 characters', met: password.length >= 8 },
        { text: 'At least one uppercase letter', met: /[A-Z]/.test(password) },
        { text: 'At least one lowercase letter', met: /[a-z]/.test(password) },
        { text: 'At least one number', met: /[0-9]/.test(password) },
        { text: 'At least one symbol', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
    ];

    const handleReset = async () => {
        if (!password || !confirm) {
            setError('Please fill in all fields');
            return;
        }
        if (password !== confirm) {
            setError('Passwords do not match');
            return;
        }
        if (requirements.some(r => !r.met)) {
            setError('Password does not meet requirements');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/auth/reset-password/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();
            if (data.message) {
                setMessage('Password reset successful! You can now log in to the extension.');
                setError('');
            } else {
                setError(data.error);
            }
        } catch {
            setError('Connection failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const bg = 'radial-gradient(120% 100% at 50% 0%, oklch(0.19 0.03 160) 0%, oklch(0.14 0.015 160) 55%, oklch(0.12 0.01 160) 100%)';
    const cardBg = 'oklch(0.2 0.02 160)';
    const fg = 'oklch(0.95 0.01 160)';
    const dim = 'oklch(0.65 0.02 160)';

    const inputStyle: React.CSSProperties = {
        padding: '12px 14px',
        borderRadius: 10,
        border: '1px solid oklch(1 0 0 / 0.12)',
        background: 'oklch(1 0 0 / 0.04)',
        color: fg,
        fontSize: 14,
        outline: 'none',
        fontFamily: 'inherit',
        width: '100%',
        boxSizing: 'border-box',
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: bg,
            color: fg,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '60px 24px',
            fontFamily: 'Inter, system-ui, sans-serif',
        }}>
            <div style={{
                width: '100%',
                maxWidth: 420,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
            }}>
                {/* Header */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center', marginBottom: 4 }}>
                    <div style={{
                        width: 60,
                        height: 60,
                        borderRadius: 17,
                        background: `conic-gradient(${GREEN} 0deg 250deg, oklch(0.3 0.02 160) 250deg 360deg)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 20px oklch(0.75 0.15 155 / 0.3)`,
                    }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'oklch(0.14 0.015 160)' }} />
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>
                        Reset Password
                    </div>
                    <div style={{ fontSize: 14, color: dim, lineHeight: 1.5 }}>
                        Choose a new password for your InfoDiet account.
                    </div>
                </div>

                {/* Card */}
                <div style={{
                    background: cardBg,
                    border: '1px solid oklch(1 0 0 / 0.07)',
                    borderRadius: 18,
                    padding: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                }}>
                    {message ? (
                        <p style={{ color: GREEN, fontSize: 14, margin: 0, textAlign: 'center', lineHeight: 1.6 }}>
                            {message}
                        </p>
                    ) : (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <label style={{ color: dim, fontSize: 13, fontWeight: 600 }}>New Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleReset()}
                                    placeholder="Enter new password"
                                    style={inputStyle}
                                />
                            </div>

                            {password && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    {requirements.map((req, i) => (
                                        <p key={i} style={{
                                            color: req.met ? GREEN : RED,
                                            fontSize: 12,
                                            margin: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6
                                        }}>
                                            {req.met ? '✓' : '✗'} {req.text}
                                        </p>
                                    ))}
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <label style={{ color: dim, fontSize: 13, fontWeight: 600 }}>Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirm}
                                    onChange={e => setConfirm(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleReset()}
                                    placeholder="Confirm new password"
                                    style={inputStyle}
                                />
                            </div>

                            {error && (
                                <p style={{ color: RED, fontSize: 13, margin: 0, textAlign: 'center' }}>
                                    {error}
                                </p>
                            )}

                            <button
                                onClick={handleReset}
                                disabled={loading}
                                style={{
                                    padding: 14,
                                    borderRadius: 12,
                                    border: 'none',
                                    background: GREEN,
                                    color: 'oklch(0.14 0.02 160)',
                                    fontSize: 15,
                                    fontWeight: 700,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.7 : 1,
                                }}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
