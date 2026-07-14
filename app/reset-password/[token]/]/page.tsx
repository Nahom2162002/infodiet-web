'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';

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

    return (
        <main style={{
            fontFamily: 'Inter, sans-serif',
            background: 'radial-gradient(circle at 50% 0%, #0a2e1a, #0a0f0d)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24
        }}>
            <div style={{
                background: 'rgba(0,200,150,0.05)',
                border: '1px solid rgba(0,200,150,0.2)',
                borderRadius: 16,
                padding: '40px 32px',
                width: '100%',
                maxWidth: 400,
                display: 'flex',
                flexDirection: 'column',
                gap: 16
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 8 }}>
                    <p style={{ fontSize: 40, margin: 0 }}>🥗</p>
                    <h1 style={{ color: 'white', fontSize: 22, fontWeight: 700, margin: '8px 0 4px' }}>
                        Reset Password
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>
                        InfoDiet
                    </p>
                </div>

                {/* New password */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>New Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        style={{
                            padding: '10px 14px',
                            borderRadius: 8,
                            border: '1px solid rgba(0,200,150,0.3)',
                            background: 'rgba(0,200,150,0.05)',
                            color: 'white',
                            fontSize: 14,
                            outline: 'none'
                        }}
                    />
                </div>

                {/* Password requirements */}
                {password && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {requirements.map((req, i) => (
                            <p key={i} style={{
                                color: req.met ? '#00c896' : '#ff6b6b',
                                fontSize: 11,
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

                {/* Confirm password */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Confirm Password</label>
                    <input
                        type="password"
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        placeholder="Confirm new password"
                        style={{
                            padding: '10px 14px',
                            borderRadius: 8,
                            border: '1px solid rgba(0,200,150,0.3)',
                            background: 'rgba(0,200,150,0.05)',
                            color: 'white',
                            fontSize: 14,
                            outline: 'none'
                        }}
                    />
                </div>

                {error && (
                    <p style={{ color: '#ff6b6b', fontSize: 13, margin: 0, textAlign: 'center' }}>
                        {error}
                    </p>
                )}

                {message && (
                    <p style={{ color: '#00c896', fontSize: 13, margin: 0, textAlign: 'center', lineHeight: 1.5 }}>
                        {message}
                    </p>
                )}

                <button
                    onClick={handleReset}
                    disabled={loading}
                    style={{
                        padding: '12px',
                        borderRadius: 10,
                        border: 'none',
                        background: loading
                            ? 'rgba(0,200,150,0.3)'
                            : 'linear-gradient(135deg, #00c896, #00a57a)',
                        color: 'white',
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        marginTop: 4
                    }}
                >
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </div>
        </main>
    );
}