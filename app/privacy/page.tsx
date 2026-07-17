import Link from 'next/link';
import styles from '../legal.module.css';

const bg = 'oklch(20% 0.025 155)';
const fg = 'oklch(96% 0.008 90)';
const accent = 'oklch(58% 0.13 155)';
const serif = 'var(--font-lora), serif';
const sans = 'var(--font-inter), sans-serif';

const sections = [
  {
    title: '1. Who We Are',
    content: 'InfoDiet is a Chrome extension and web service operated by Nahom Ashagrea. We help users track and manage their information consumption online. You can contact us at nahomashagrea2002@gmail.com.'
  },
  {
    title: '2. What Data We Collect',
    content: `We collect the following information when you use InfoDiet:

- Account information: your username and email address when you create an account
- Browsing consumption data: the content categories and time spent on websites you visit while InfoDiet is active (we do not store full URLs or page content — only the domain and category)
- Budget settings: the daily time limits you configure per content category
- Subscription data: your plan status (free or pro) and Stripe customer ID for billing
- Technical data: standard server logs including IP address and browser type`
  },
  {
    title: '3. What We Do NOT Collect',
    content: `InfoDiet is built with privacy in mind. We do not collect:

- The full URLs or page titles of sites you visit
- The content of any pages you read
- Your search queries
- Any personally identifiable browsing history beyond domain-level category tracking`
  },
  {
    title: '4. How We Use Your Data',
    content: `We use your data to:

- Provide and operate the InfoDiet service
- Show you your information consumption stats and trends
- Enforce your daily category budgets
- Sync your data across devices
- Process payments via Stripe
- Send password reset emails when requested
- Improve the product based on usage patterns

We do not sell your data to third parties. We do not use your data for advertising.`
  },
  {
    title: '5. Data Storage',
    content: 'Your data is stored securely in MongoDB Atlas hosted in the United States. Passwords are hashed using bcrypt and are never stored in plain text. Payment information is handled entirely by Stripe and never stored on our servers.'
  },
  {
    title: '6. Third Party Services',
    content: `We use the following third party services:

- Stripe — payment processing (stripe.com/privacy)
- MongoDB Atlas — database hosting (mongodb.com/legal/privacy-policy)
- Vercel — hosting and infrastructure (vercel.com/legal/privacy-policy)
- Resend — transactional email (resend.com/legal/privacy-policy)

Each of these services has their own privacy policy governing how they handle data.`
  },
  {
    title: '7. Data Retention',
    content: 'We retain your account and consumption data for as long as your account is active. Consumption data older than 90 days may be aggregated and anonymized. If you delete your account, your personal data will be removed within 30 days.'
  },
  {
    title: '8. Your Rights',
    content: `You have the right to:

- Access the personal data we hold about you
- Request correction of inaccurate data
- Request deletion of your account and associated data
- Export your consumption data

To exercise any of these rights, contact us at nahomashagrea2002@gmail.com.`
  },
  {
    title: '9. Cookies and Local Storage',
    content: "InfoDiet does not use cookies for tracking or advertising. The Chrome extension uses browser local storage solely to store your authentication token, today's consumption data, and budget settings locally on your device for performance purposes."
  },
  {
    title: "10. Children's Privacy",
    content: 'InfoDiet is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us and we will delete it promptly.'
  },
  {
    title: '11. Changes to This Policy',
    content: 'We may update this privacy policy from time to time. We will notify users of significant changes via email. Continued use of InfoDiet after changes constitutes acceptance of the updated policy.'
  },
  {
    title: '12. Contact',
    content: 'If you have any questions about this privacy policy, contact us at nahomashagrea2002@gmail.com.'
  }
];

export default function PrivacyPolicy() {
  return (
    <main
      className={styles.main}
      style={{
        fontFamily: sans,
        background: bg,
        minHeight: '100vh',
        color: fg,
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <Link
          href="/"
          style={{
            color: accent,
            fontSize: 14,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span style={{ width: 16, height: 16, borderRadius: '50%', background: accent, display: 'inline-block' }} />
          Back to InfoDiet
        </Link>

        <h1 className={styles.title} style={{ fontFamily: serif, fontWeight: 600, margin: '32px 0 8px', color: 'oklch(97% 0.006 90)' }}>
          Privacy Policy
        </h1>
        <p style={{ color: 'oklch(96% 0.008 90 / 0.4)', fontSize: 14, marginBottom: 48 }}>
          Last updated: July 14, 2026
        </p>

        {sections.map((section) => (
          <div
            key={section.title}
            className={styles.section}
            style={{
              borderBottom: '1px solid oklch(96% 0.008 90 / 0.07)',
            }}
          >
            <h2 className={styles.sectionTitle} style={{ fontFamily: serif, fontWeight: 600, marginBottom: 12, color: 'oklch(97% 0.006 90)' }}>
              {section.title}
            </h2>
            <p
              className={styles.body}
              style={{
                color: 'oklch(96% 0.008 90 / 0.6)',
                lineHeight: 1.8,
                whiteSpace: 'pre-line',
                margin: 0,
              }}
            >
              {section.content}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
