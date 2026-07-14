import Link from 'next/link';

export default function LandingPage() {
  return (
    <main style={{
      fontFamily: 'Inter, sans-serif',
      background: 'radial-gradient(circle at 50% 0%, #0a2e1a, #0d0d0d)',
      minHeight: '100vh',
      color: 'white'
    }}>

      {/* Nav */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 40px',
        borderBottom: '1px solid rgba(0,200,150,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 24 }}>🥗</span>
          <span style={{ fontSize: 20, fontWeight: 700 }}>InfoDiet</span>
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <a href="#features" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, textDecoration: 'none' }}>Features</a>
          <a href="#how-it-works" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, textDecoration: 'none' }}>How it works</a>
          <a href="#pricing" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, textDecoration: 'none' }}>Pricing</a>
          <a
            href="https://chrome.google.com/webstore"
            target="_blank"
            rel="noreferrer"
            style={{
              background: 'linear-gradient(135deg, #00c896, #00a57a)',
              color: 'white',
              padding: '8px 18px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            Add to Chrome — Free
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        textAlign: 'center',
        padding: '100px 24px 80px',
        maxWidth: 760,
        margin: '0 auto'
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(0,200,150,0.1)',
          border: '1px solid rgba(0,200,150,0.3)',
          borderRadius: 20,
          padding: '6px 16px',
          fontSize: 13,
          color: '#00c896',
          marginBottom: 24
        }}>
          Chrome Extension — Free to install
        </div>
        <h1 style={{
          fontSize: 52,
          fontWeight: 800,
          lineHeight: 1.15,
          margin: '0 0 24px',
          background: 'linear-gradient(135deg, #ffffff, rgba(255,255,255,0.7))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Your brain deserves<br />a healthy diet.
        </h1>
        <p style={{
          fontSize: 18,
          color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.7,
          margin: '0 0 40px',
          maxWidth: 560,
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          InfoDiet tracks how you consume information online and helps you
          set healthy limits — so you spend more time learning and less time
          mindlessly scrolling.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="https://chrome.google.com/webstore"
            target="_blank"
            rel="noreferrer"
            style={{
              background: 'linear-gradient(135deg, #00c896, #00a57a)',
              color: 'white',
              padding: '14px 32px',
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            Add to Chrome — It's Free
          </a>
          <a
            href="#how-it-works"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'white',
              padding: '14px 32px',
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            See how it works
          </a>
        </div>
      </section>

      {/* Social proof */}
      <section style={{
        textAlign: 'center',
        padding: '0 24px 80px',
        color: 'rgba(255,255,255,0.3)',
        fontSize: 13
      }}>
        Track your information diet across 8 content categories
      </section>

      {/* Category pills */}
      <section style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
        padding: '0 24px 80px',
        maxWidth: 700,
        margin: '0 auto'
      }}>
        {[
          { emoji: '📰', label: 'News & Politics', color: '#ff6b6b' },
          { emoji: '📱', label: 'Social Media', color: '#ffd93d' },
          { emoji: '🎬', label: 'Entertainment', color: '#ff922b' },
          { emoji: '📚', label: 'Educational', color: '#00c896' },
          { emoji: '🛍️', label: 'Shopping', color: '#cc5de8' },
          { emoji: '💬', label: 'Forums', color: '#339af0' },
          { emoji: '🎮', label: 'Gaming', color: '#f06595' },
          { emoji: '🌐', label: 'Other', color: 'rgba(255,255,255,0.3)' },
        ].map((cat, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            borderRadius: 20,
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${cat.color}33`,
            fontSize: 13,
            color: 'rgba(255,255,255,0.7)'
          }}>
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </div>
        ))}
      </section>

      {/* Features */}
      <section id="features" style={{
        maxWidth: 1000,
        margin: '0 auto',
        padding: '80px 24px'
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: 36,
          fontWeight: 700,
          marginBottom: 16
        }}>
          Everything you need for a healthy information diet
        </h2>
        <p style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.5)',
          fontSize: 16,
          marginBottom: 56,
          maxWidth: 500,
          margin: '0 auto 56px'
        }}>
          Free to start. Upgrade when you're ready for the full toolkit.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20
        }}>
          {[
            {
              emoji: '📊',
              title: 'Automatic Tracking',
              desc: 'InfoDiet silently tracks how much time you spend on each category of content as you browse — no manual logging required.',
              free: true
            },
            {
              emoji: '🎯',
              title: 'Information Quality Score',
              desc: 'See your weekly ratio of educational vs entertainment content as a single score. Know at a glance how healthy your information diet is.',
              free: false
            },
            {
              emoji: '⏱',
              title: 'Daily Budgets',
              desc: 'Set daily time limits per category. InfoDiet blocks access when you hit your limit and lets you override for 10 minutes if needed.',
              free: false
            },
            {
              emoji: '📈',
              title: 'Trend Dashboard',
              desc: 'See your daily and weekly consumption patterns with charts. Understand which categories are dominating your attention.',
              free: false
            },
            {
              emoji: '🚨',
              title: 'Budget Alerts',
              desc: 'Get notified the moment you approach or exceed your daily limit for any content category.',
              free: false
            },
            {
              emoji: '🔄',
              title: 'Cross-Device Sync',
              desc: 'Your consumption data and budgets sync across all your Chrome browsers automatically.',
              free: false
            }
          ].map((f, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16,
              padding: '28px 24px'
            }}>
              <p style={{ fontSize: 32, margin: '0 0 12px' }}>{f.emoji}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>{f.title}</h3>
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 20,
                  background: f.free ? 'rgba(255,255,255,0.1)' : 'rgba(0,200,150,0.15)',
                  color: f.free ? 'rgba(255,255,255,0.5)' : '#00c896',
                  border: f.free ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,200,150,0.3)'
                }}>
                  {f.free ? 'FREE' : 'PRO'}
                </span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{
        maxWidth: 700,
        margin: '0 auto',
        padding: '80px 24px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 16 }}>
          How it works
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, marginBottom: 56 }}>
          Up and running in under a minute
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, textAlign: 'left' }}>
          {[
            {
              step: '1',
              title: 'Install InfoDiet',
              desc: 'Add InfoDiet to Chrome for free from the Chrome Web Store. Create a free account to sync your data.'
            },
            {
              step: '2',
              title: 'Browse normally',
              desc: 'InfoDiet runs silently in the background, automatically categorizing every site you visit and tracking your time.'
            },
            {
              step: '3',
              title: 'See your information diet',
              desc: 'Open the extension anytime to see today\'s breakdown. Open the dashboard for your weekly trends and quality score.'
            },
            {
              step: '4',
              title: 'Set healthy limits',
              desc: 'Upgrade to Pro to set daily budgets per category. InfoDiet will block access when you hit your limit.'
            }
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00c896, #00a57a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 16,
                flexShrink: 0
              }}>
                {s.step}
              </div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 6px' }}>{s.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{
        maxWidth: 700,
        margin: '0 auto',
        padding: '80px 24px'
      }}>
        <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 700, marginBottom: 16 }}>
          Simple pricing
        </h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 16, marginBottom: 56 }}>
          Start free. Upgrade when you're ready.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Free */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16,
            padding: '32px 28px'
          }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Free</h3>
            <p style={{ fontSize: 36, fontWeight: 800, margin: '0 0 4px' }}>$0</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 28px' }}>Forever free</p>
            {[
              'Automatic content tracking',
              'All 8 content categories',
              'Today\'s consumption view'
            ].map((f, i) => (
              <p key={i} style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: 14,
                margin: '0 0 10px',
                display: 'flex',
                gap: 8,
                alignItems: 'center'
              }}>
                <span style={{ color: '#00c896' }}>✓</span> {f}
              </p>
            ))}
            <a
              href="https://chrome.google.com/webstore"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: 28,
                padding: '12px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600
              }}
            >
              Get started free
            </a>
          </div>

          {/* Pro */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,200,150,0.08), rgba(0,165,122,0.05))',
            border: '1px solid rgba(0,200,150,0.25)',
            borderRadius: 16,
            padding: '32px 28px',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: -12,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #00c896, #00a57a)',
              color: 'white',
              fontSize: 11,
              fontWeight: 700,
              padding: '4px 14px',
              borderRadius: 20,
              whiteSpace: 'nowrap'
            }}>
              MOST POPULAR
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Pro</h3>
            <p style={{ fontSize: 36, fontWeight: 800, margin: '0 0 4px' }}>
              $5<span style={{ fontSize: 16, fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>/month</span>
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 28px' }}>
              7-day free trial — no credit card required
            </p>
            {[
              'Everything in Free',
              'Daily budgets per category',
              'Budget blocking',
              'Information quality score',
              'Weekly trend dashboard',
              'Budget alerts',
              'Cross-device sync'
            ].map((f, i) => (
              <p key={i} style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: 14,
                margin: '0 0 10px',
                display: 'flex',
                gap: 8,
                alignItems: 'center'
              }}>
                <span style={{ color: '#00c896' }}>✓</span> {f}
              </p>
            ))}
            <a
              href="https://chrome.google.com/webstore"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: 28,
                padding: '12px',
                borderRadius: 8,
                background: 'linear-gradient(135deg, #00c896, #00a57a)',
                color: 'white',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 700
              }}
            >
              Start Free Trial
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        textAlign: 'center',
        padding: '80px 24px 100px',
        maxWidth: 600,
        margin: '0 auto'
      }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 16 }}>
          Ready to eat healthier?
        </h2>
        <p style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: 16,
          marginBottom: 40,
          lineHeight: 1.7
        }}>
          Join people who are taking control of what they feed their minds every day.
        </p>
        <a
          href="https://chrome.google.com/webstore"
          target="_blank"
          rel="noreferrer"
          style={{
            background: 'linear-gradient(135deg, #00c896, #00a57a)',
            color: 'white',
            padding: '16px 40px',
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Add to Chrome — It's Free
        </a>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '32px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>🥗</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
            © {new Date().getFullYear()} InfoDiet. All rights reserved.
          </span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textDecoration: 'none' }}>
            Privacy Policy
          </Link>
          <Link href="/terms" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textDecoration: 'none' }}>
            Terms of Service
          </Link>
        </div>
      </footer>

    </main>
  );
}