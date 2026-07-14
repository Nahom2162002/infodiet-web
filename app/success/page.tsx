export default function SuccessPage() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'radial-gradient(circle at 50% 0%, #0a2e1a, #0a0f0d)',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div style={{
                textAlign: 'center',
                padding: 40,
                maxWidth: 480
            }}>
                <p style={{ fontSize: 64, margin: '0 0 24px' }}>🥗</p>
                <h1 style={{
                    color: 'white',
                    fontSize: 28,
                    fontWeight: 700,
                    margin: '0 0 12px'
                }}>
                    Welcome to InfoDiet Pro!
                </h1>
                <p style={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: 16,
                    lineHeight: 1.7,
                    margin: '0 0 32px'
                }}>
                    Your purchase is complete. You now have lifetime access to all Pro features.
                    Close this tab and return to the extension to get started.
                </p>
                <div style={{
                    background: 'rgba(0,200,150,0.08)',
                    border: '1px solid rgba(0,200,150,0.2)',
                    borderRadius: 12,
                    padding: '16px 24px',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: 14,
                    lineHeight: 1.6
                }}>
                    💡 Your Pro access will activate automatically within a few seconds.
                    If it doesn't appear right away, close and reopen the extension.
                </div>
            </div>
        </div>
    );
}