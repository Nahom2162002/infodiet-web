const GRAY = 'oklch(0.65 0.01 160)';

export default function CancelPage() {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'radial-gradient(120% 100% at 50% 0%, oklch(0.19 0.03 160) 0%, oklch(0.14 0.015 160) 55%, oklch(0.12 0.01 160) 100%)',
            color: 'oklch(0.95 0.01 160)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '60px 24px',
            fontFamily: 'Inter, system-ui, sans-serif',
        }}>
            <div style={{
                width: '100%',
                maxWidth: 560,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 20,
                textAlign: 'center',
            }}>
                <div style={{
                    width: 60,
                    height: 60,
                    borderRadius: 17,
                    background: `conic-gradient(${GRAY} 0deg 250deg, oklch(0.3 0.02 160) 250deg 360deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 20px oklch(0.65 0.01 160 / 0.3)`,
                }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'oklch(0.14 0.015 160)' }} />
                </div>

                <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em' }}>
                    Trial Cancelled
                </div>

                <div style={{ fontSize: 15, lineHeight: 1.6, color: 'oklch(0.7 0.01 160)', maxWidth: 440 }}>
                    Your free trial has been cancelled and you won&rsquo;t be charged.
                    Close this tab and return to the extension to keep using InfoDiet with the free plan.
                </div>

                <div style={{
                    width: '100%',
                    background: 'oklch(0.2 0.02 160)',
                    border: '1px solid oklch(0.65 0.01 160 / 0.25)',
                    borderRadius: 16,
                    padding: '20px 24px',
                    marginTop: 8,
                }}>
                    <div style={{ fontSize: 14, lineHeight: 1.6, color: 'oklch(0.8 0.01 160)' }}>
                        Changed your mind? You can start a new trial or upgrade to Pro anytime from the extension.
                    </div>
                </div>
            </div>
        </div>
    );
}
