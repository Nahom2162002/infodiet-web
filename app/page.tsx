import Link from 'next/link';
import Image from 'next/image';
import styles from './landing.module.css';

const categories = [
  { label: 'News & Politics', hue: 250, pct: 62 },
  { label: 'Social Media', hue: 320, pct: 78 },
  { label: 'Entertainment', hue: 300, pct: 55 },
  { label: 'Educational', hue: 140, pct: 41 },
  { label: 'Shopping', hue: 70, pct: 20 },
  { label: 'Forums & Communities', hue: 200, pct: 33 },
  { label: 'Gaming', hue: 280, pct: 15 },
  { label: 'Other', hue: 230, pct: 8 },
].map((c) => ({
  ...c,
  color: `oklch(65% 0.09 ${c.hue})`,
  borderColor: `oklch(65% 0.09 ${c.hue} / 0.35)`,
}));

const topCategories = categories.slice(0, 4);

const features = [
  {
    title: 'Automatic Tracking',
    desc: 'InfoDiet quietly notices how much time you spend in each category as you browse — no manual logging required.',
    free: true,
  },
  {
    title: 'Information Quality Score',
    desc: 'See your weekly ratio of educational vs. entertainment content as one simple score.',
    free: false,
  },
  {
    title: 'Daily Budgets',
    desc: 'Set gentle daily limits per category. InfoDiet nudges you when you hit one, with a 10-minute grace window.',
    free: false,
  },
  {
    title: 'Trend Dashboard',
    desc: 'See your daily and weekly patterns with simple charts, so you know which categories are dominating your attention.',
    free: false,
  },
  {
    title: 'Budget Alerts',
    desc: 'A quiet nudge the moment you approach or exceed your daily limit for any category.',
    free: false,
  },
  {
    title: 'Cross-Device Sync',
    desc: 'Your consumption data and budgets sync across all your Chrome browsers automatically.',
    free: false,
  },
].map((f) => ({
  ...f,
  tagLabel: f.free ? 'FREE' : 'PRO',
  tagBg: f.free ? 'oklch(96% 0.008 90 / 0.1)' : 'oklch(58% 0.13 155 / 0.15)',
  tagColor: f.free ? 'oklch(96% 0.008 90 / 0.5)' : 'oklch(58% 0.13 155)',
  tagBorder: f.free
    ? '1px solid oklch(96% 0.008 90 / 0.1)'
    : '1px solid oklch(58% 0.13 155 / 0.3)',
}));

const steps = [
  {
    step: '1',
    title: 'Install InfoDiet',
    desc: 'Add InfoDiet to Chrome for free. Create a free account to sync your data.',
  },
  {
    step: '2',
    title: 'Browse normally',
    desc: 'InfoDiet runs quietly in the background, categorizing every site you visit and tracking your time.',
  },
  {
    step: '3',
    title: 'See your information diet',
    desc: "Open the extension anytime for today's breakdown, or the dashboard for weekly trends and your quality score.",
  },
  {
    step: '4',
    title: 'Set healthy limits',
    desc: 'Upgrade to Pro to set daily budgets per category, with gentle nudges when you approach them.',
  },
];

const freeItems = ['Automatic content tracking', 'All 8 content categories', "Today's consumption view"];
const proItems = [
  'Everything in Free',
  'Daily budgets per category',
  'Gentle budget nudges',
  'Information quality score',
  'Weekly trend dashboard',
  'Budget alerts',
  'Cross-device sync',
];

const bg = 'oklch(20% 0.025 155)';
const fg = 'oklch(96% 0.008 90)';
const accent = 'oklch(58% 0.13 155)';
const accentDark = 'oklch(18% 0.02 155)';
const card = 'oklch(24% 0.02 155)';
const serif = 'var(--font-lora), serif';
const sans = 'var(--font-inter), sans-serif';

export default function LandingPage() {
  return (
    <main style={{ fontFamily: sans, background: bg, minHeight: '100vh', color: fg }}>
      <nav
        className={styles.nav}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid oklch(96% 0.008 90 / 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Image
            src="/InfoDietIcon-32x32.png"
            alt="InfoDiet"
            width={22}
            height={22}
            style={{ borderRadius: '50%', display: 'inline-block' }}
          />
          <span style={{ fontFamily: serif, fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>
            InfoDiet
          </span>
        </div>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          <div className={styles.navLinks}>
            <a href="#features" style={{ color: 'oklch(96% 0.008 90 / 0.6)', fontSize: 14, textDecoration: 'none' }}>
              Features
            </a>
            <a href="#how-it-works" style={{ color: 'oklch(96% 0.008 90 / 0.6)', fontSize: 14, textDecoration: 'none' }}>
              How it works
            </a>
            <a href="#pricing" style={{ color: 'oklch(96% 0.008 90 / 0.6)', fontSize: 14, textDecoration: 'none' }}>
              Pricing
            </a>
          </div>
          <a
            href="https://chromewebstore.google.com/detail/infodiet/ccpifliaifaalcknogjdkppmilganoam"
            target="_blank"
            rel="noreferrer"
            style={{
              background: accent,
              color: accentDark,
              padding: '9px 20px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Add to Chrome
          </a>
        </div>
      </nav>

      <section
        className={styles.hero}
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          display: 'grid',
          alignItems: 'center',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-block',
              background: 'oklch(58% 0.13 155 / 0.12)',
              border: '1px solid oklch(58% 0.13 155 / 0.3)',
              borderRadius: 20,
              padding: '6px 16px',
              fontSize: 13,
              color: accent,
              marginBottom: 24,
            }}
          >
            A gentler way to notice your screen habits
          </div>
          <h1
            className={styles.heroTitle}
            style={{
              fontFamily: serif,
              fontWeight: 600,
              lineHeight: 1.18,
              margin: '0 0 22px',
              color: 'oklch(97% 0.006 90)',
            }}
          >
            Feed your mind
            <br />
            the way you&apos;d feed your body.
          </h1>
          <p
            style={{
              fontSize: 17,
              color: 'oklch(96% 0.008 90 / 0.6)',
              lineHeight: 1.7,
              margin: '0 0 36px',
              maxWidth: 460,
            }}
          >
            InfoDiet quietly notices what you read, watch, and scroll — then
            helps you nudge the balance toward what actually nourishes you.
            No shaming, no lockouts. Just a clearer picture, one day at a time.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a
              href="https://chromewebstore.google.com/detail/infodiet/ccpifliaifaalcknogjdkppmilganoam"
              target="_blank"
              rel="noreferrer"
              style={{
                background: accent,
                color: accentDark,
                padding: '14px 30px',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Add to Chrome
            </a>
            <a
              href="#how-it-works"
              style={{
                background: 'oklch(96% 0.008 90 / 0.06)',
                border: '1px solid oklch(96% 0.008 90 / 0.12)',
                color: fg,
                padding: '14px 30px',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              See how it works
            </a>
          </div>
        </div>

        <div
          style={{
            background: card,
            border: '1px solid oklch(96% 0.008 90 / 0.08)',
            borderRadius: 20,
            padding: 28,
            boxShadow: '0 24px 60px oklch(10% 0.02 155 / 0.4)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ fontSize: 13, color: 'oklch(96% 0.008 90 / 0.5)' }}>This week&apos;s information diet</span>
            <span style={{ fontSize: 11, color: 'oklch(96% 0.008 90 / 0.35)' }}>Sample data</span>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 24,
              alignItems: 'center',
              marginBottom: 24,
              paddingBottom: 24,
              borderBottom: '1px solid oklch(96% 0.008 90 / 0.08)',
            }}
          >
            <div
              style={{
                width: 92,
                height: 92,
                borderRadius: '50%',
                background: `conic-gradient(${accent} 0deg 259deg, oklch(96% 0.008 90 / 0.08) 259deg 360deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: '50%',
                  background: card,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 20, fontWeight: 700, fontFamily: serif }}>72</span>
                <span style={{ fontSize: 9, color: 'oklch(96% 0.008 90 / 0.4)', letterSpacing: '0.03em' }}>
                  QUALITY
                </span>
              </div>
            </div>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600 }}>Nourishing week</p>
              <p style={{ margin: 0, fontSize: 13, color: 'oklch(96% 0.008 90 / 0.5)', lineHeight: 1.6 }}>
                Up 8 points from last week — more educational reading, less scrolling after 9pm.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {topCategories.map((c) => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: c.color }} />
                <span style={{ fontSize: 12, color: 'oklch(96% 0.008 90 / 0.6)', width: 108, flexShrink: 0 }}>
                  {c.label}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    background: 'oklch(96% 0.008 90 / 0.08)',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ height: '100%', borderRadius: 3, width: `${c.pct}%`, background: c.color }} />
                </div>
                <span style={{ fontSize: 11, color: 'oklch(96% 0.008 90 / 0.4)', width: 28, textAlign: 'right' }}>
                  {c.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ textAlign: 'center', padding: '40px 24px 72px', color: 'oklch(96% 0.008 90 / 0.35)', fontSize: 13 }}>
        Tracked quietly across 8 everyday content categories
      </section>

      <section
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          justifyContent: 'center',
          padding: '0 24px 88px',
          maxWidth: 760,
          margin: '0 auto',
        }}
      >
        {categories.map((c) => (
          <div
            key={c.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 20,
              background: 'oklch(96% 0.008 90 / 0.04)',
              border: `1px solid ${c.borderColor}`,
              fontSize: 13,
              color: 'oklch(96% 0.008 90 / 0.7)',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: c.color }} />
            <span>{c.label}</span>
          </div>
        ))}
      </section>

      <section id="features" style={{ maxWidth: 1040, margin: '0 auto', padding: '72px 24px' }}>
        <h2 style={{ textAlign: 'center', fontFamily: serif, fontSize: 32, fontWeight: 600, marginBottom: 14 }}>
          A calmer relationship with your screen
        </h2>
        <p
          style={{
            textAlign: 'center',
            color: 'oklch(96% 0.008 90 / 0.5)',
            fontSize: 16,
            marginBottom: 52,
            maxWidth: 480,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Free to start. Upgrade when you&apos;re ready for the full toolkit.
        </p>
        <div className={styles.featuresGrid} style={{ display: 'grid', gap: 20 }}>
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                background: card,
                border: '1px solid oklch(96% 0.008 90 / 0.07)',
                borderRadius: 16,
                padding: '26px 24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: accent }} />
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{f.title}</h3>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 20,
                    background: f.tagBg,
                    color: f.tagColor,
                    border: f.tagBorder,
                  }}
                >
                  {f.tagLabel}
                </span>
              </div>
              <p style={{ color: 'oklch(96% 0.008 90 / 0.5)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" style={{ maxWidth: 680, margin: '0 auto', padding: '72px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: serif, fontSize: 32, fontWeight: 600, marginBottom: 14 }}>How it works</h2>
        <p style={{ color: 'oklch(96% 0.008 90 / 0.5)', fontSize: 16, marginBottom: 52 }}>
          Up and running in under a minute
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, textAlign: 'left' }}>
          {steps.map((s) => (
            <div key={s.step} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: accent,
                  color: accentDark,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 15,
                  flexShrink: 0,
                  fontFamily: serif,
                }}
              >
                {s.step}
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px' }}>{s.title}</h3>
                <p style={{ color: 'oklch(96% 0.008 90 / 0.5)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" style={{ maxWidth: 700, margin: '0 auto', padding: '72px 24px' }}>
        <h2 style={{ textAlign: 'center', fontFamily: serif, fontSize: 32, fontWeight: 600, marginBottom: 14 }}>
          Simple pricing
        </h2>
        <p style={{ textAlign: 'center', color: 'oklch(96% 0.008 90 / 0.5)', fontSize: 16, marginBottom: 52 }}>
          Start free. Upgrade when you&apos;re ready.
        </p>
        <div className={styles.pricingGrid} style={{ display: 'grid', gap: 20 }}>
          <div
            style={{
              background: card,
              border: '1px solid oklch(96% 0.008 90 / 0.08)',
              borderRadius: 16,
              padding: '32px 28px',
            }}
          >
            <h3 style={{ fontSize: 19, fontWeight: 700, margin: '0 0 8px' }}>Free</h3>
            <p style={{ fontSize: 34, fontWeight: 700, margin: '0 0 4px', fontFamily: serif }}>$0</p>
            <p style={{ color: 'oklch(96% 0.008 90 / 0.4)', fontSize: 13, margin: '0 0 26px' }}>Forever free</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {freeItems.map((item) => (
                <p
                  key={item}
                  style={{
                    color: 'oklch(96% 0.008 90 / 0.7)',
                    fontSize: 14,
                    margin: 0,
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: accent }}>✓</span> {item}
                </p>
              ))}
            </div>
            <a
              href="https://chromewebstore.google.com/detail/infodiet/ccpifliaifaalcknogjdkppmilganoam"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: 26,
                padding: 12,
                borderRadius: 8,
                border: '1px solid oklch(96% 0.008 90 / 0.15)',
                color: fg,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Get started free
            </a>
          </div>

          <div
            style={{
              background: 'oklch(26% 0.025 155)',
              border: '1px solid oklch(58% 0.13 155 / 0.3)',
              borderRadius: 16,
              padding: '32px 28px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -12,
                left: '50%',
                transform: 'translateX(-50%)',
                background: accent,
                color: accentDark,
                fontSize: 11,
                fontWeight: 700,
                padding: '4px 14px',
                borderRadius: 20,
                whiteSpace: 'nowrap',
              }}
            >
              MOST POPULAR
            </div>
            <h3 style={{ fontSize: 19, fontWeight: 700, margin: '0 0 8px' }}>Pro</h3>
            <p style={{ fontSize: 34, fontWeight: 700, margin: '0 0 4px', fontFamily: serif }}>$3.00/month</p>
            <p style={{ color: 'oklch(96% 0.008 90 / 0.4)', fontSize: 13, margin: '0 0 26px' }}>
              7-day free trial · cancel anytime
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {proItems.map((item) => (
                <p
                  key={item}
                  style={{
                    color: 'oklch(96% 0.008 90 / 0.7)',
                    fontSize: 14,
                    margin: 0,
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: accent }}>✓</span> {item}
                </p>
              ))}
            </div>
            <a
              href="https://chromewebstore.google.com/detail/infodiet/ccpifliaifaalcknogjdkppmilganoam"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: 26,
                padding: 12,
                borderRadius: 8,
                background: accent,
                color: accentDark,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Upgrade to Pro
            </a>
          </div>
        </div>
      </section>

      <section style={{ textAlign: 'center', padding: '72px 24px 96px', maxWidth: 580, margin: '0 auto' }}>
        <h2 style={{ fontFamily: serif, fontSize: 32, fontWeight: 600, marginBottom: 14 }}>
          Ready for a healthier feed?
        </h2>
        <p style={{ color: 'oklch(96% 0.008 90 / 0.5)', fontSize: 16, marginBottom: 36, lineHeight: 1.7 }}>
          Join people who are learning to feed their minds a little more intentionally, one day at a time.
        </p>
        <a
          href="https://chromewebstore.google.com/detail/infodiet/ccpifliaifaalcknogjdkppmilganoam"
          target="_blank"
          rel="noreferrer"
          style={{
            background: accent,
            color: accentDark,
            padding: '16px 38px',
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          Add to Chrome
        </a>
      </section>

      <footer
        className={styles.footer}
        style={{
          borderTop: '1px solid oklch(96% 0.008 90 / 0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'oklch(58% 0.13 155 / 0.6)', display: 'inline-block' }} />
          <span style={{ color: 'oklch(96% 0.008 90 / 0.3)', fontSize: 13 }}>
            © {new Date().getFullYear()} InfoDiet. All rights reserved.
          </span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/privacy" style={{ color: 'oklch(96% 0.008 90 / 0.3)', fontSize: 13, textDecoration: 'none' }}>
            Privacy Policy
          </Link>
          <Link href="/terms" style={{ color: 'oklch(96% 0.008 90 / 0.3)', fontSize: 13, textDecoration: 'none' }}>
            Terms of Service
          </Link>
        </div>
      </footer>
    </main>
  );
}
