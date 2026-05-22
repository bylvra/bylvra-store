import React from 'react';

const Section = ({ title, children }) => (
  <div style={{ marginBottom: '40px' }}>
    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1A1A1A', marginBottom: '12px' }}>{title}</h2>
    {children}
    <div style={{ height: '1px', background: '#F0F0F0', marginTop: '32px' }} />
  </div>
);

const P = ({ children }) => <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.8, marginBottom: '12px' }}>{children}</p>;

export default function PrivacyPolicy() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#fff' }}>
      <div style={{ background: '#FAFAFA', padding: '72px 24px', textAlign: 'center', borderBottom: '1px solid #F0F0F0' }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', color: '#1A1A1A', letterSpacing: '-1.5px', marginBottom: '12px' }}>Privacy Policy</h1>
        <p style={{ fontSize: '14px', color: '#888' }}>Last updated: May 1, 2026</p>
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 24px 96px' }}>
        <P>At BYLVRA Beauty ("Lumara," "we," "our," or "us"), we are committed to protecting your personal data and your right to privacy. This Privacy Policy explains what information we collect, how we use it, and what rights you have regarding your data.</P>
        <P>By using our website and purchasing our products, you agree to the collection and use of information in accordance with this policy.</P>

        <Section title="Information We Collect">
          <P><strong>Information you provide directly:</strong> When you place an order, create an account, or contact us, we collect your name, email address, phone number, billing and shipping address, and payment information (note: full card details are processed by our secure payment processor and are never stored on our servers).</P>
          <P><strong>Information collected automatically:</strong> When you visit our website, we automatically collect certain information including your IP address, browser type, device type, pages viewed, referring URLs, and time spent on pages. This is collected via cookies and similar tracking technologies.</P>
          <P><strong>Communications:</strong> If you contact us via email or our contact form, we retain the content of your messages and our responses.</P>
        </Section>

        <Section title="How We Use Your Information">
          <P>We use the information we collect to: process and fulfil your orders; send order confirmations and shipping updates; respond to your customer service inquiries; send promotional emails if you have opted in (you can opt out at any time); improve our website and product offerings; prevent fraud and maintain security; comply with legal obligations.</P>
          <P>We do not sell your personal information to third parties. Full stop.</P>
        </Section>

        <Section title="Cookies and Tracking Technologies">
          <P>We use cookies and similar technologies to: remember your cart contents; maintain your session; analyse how our website is used (via Google Analytics); enable social sharing features; run retargeting advertising on platforms such as Meta and Google.</P>
          <P>You can control or delete cookies through your browser settings. Note that disabling cookies may affect the functionality of our website, including your cart.</P>
        </Section>

        <Section title="Sharing with Third Parties">
          <P>We share your information only with trusted third parties who help us operate our business:</P>
          <P>— <strong>Payment processors</strong> (Stripe, PayPal): to process transactions securely<br/>
          — <strong>Shipping carriers</strong> (USPS, UPS, FedEx, DHL): to fulfil and deliver your orders<br/>
          — <strong>Email service providers</strong>: to send transactional and marketing emails<br/>
          — <strong>Analytics providers</strong> (Google Analytics): to understand website usage<br/>
          — <strong>Legal authorities</strong>: when required by law or to protect our rights</P>
        </Section>

        <Section title="Data Security">
          <P>We implement industry-standard security measures to protect your personal information. Our website uses SSL/TLS encryption (HTTPS) for all data transmission. Payment information is processed by PCI-DSS compliant processors. We regularly review and update our security practices.</P>
          <P>While we take reasonable precautions, no transmission over the internet is 100% secure. We cannot guarantee absolute security of your data.</P>
        </Section>

        <Section title="Your Rights">
          <P>Depending on your jurisdiction, you may have the following rights regarding your personal data: the right to access data we hold about you; the right to correct inaccurate data; the right to deletion ("right to be forgotten"); the right to restrict or object to processing; the right to data portability; the right to withdraw consent at any time.</P>
          <P>To exercise any of these rights, email us at privacy@bylvra.shop. We will respond within 30 days.</P>
        </Section>

        <Section title="Data Retention">
          <P>We retain your personal data for as long as necessary to fulfil the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Order records are retained for 7 years for tax and accounting purposes. Marketing data is retained until you unsubscribe.</P>
        </Section>

        <Section title="Children's Privacy">
          <P>Our website is not directed at children under 16 years of age. We do not knowingly collect personal information from children under 16. If you believe we have inadvertently collected such information, please contact us immediately.</P>
        </Section>

        <Section title="Changes to This Policy">
          <P>We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting a prominent notice on our website. The date at the top of this policy indicates when it was last updated.</P>
        </Section>

        <Section title="Contact Us">
          <P>For any privacy-related questions or concerns, contact us at:<br/>
          <strong>Email:</strong> privacy@bylvra.shop<br/>
          <strong>General support:</strong> contactbylvra@gmail.com</P>
        </Section>
      </div>
    </div>
  );
}
