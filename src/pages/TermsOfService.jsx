import React from 'react';

const Section = ({ title, children }) => (
  <div style={{ marginBottom: '40px' }}>
    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1A1A1A', marginBottom: '12px' }}>{title}</h2>
    {children}
    <div style={{ height: '1px', background: '#F0F0F0', marginTop: '32px' }} />
  </div>
);
const P = ({ children }) => <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.8, marginBottom: '12px' }}>{children}</p>;

export default function TermsOfService() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#fff' }}>
      <div style={{ background: '#FAFAFA', padding: '72px 24px', textAlign: 'center', borderBottom: '1px solid #F0F0F0' }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', color: '#1A1A1A', letterSpacing: '-1.5px', marginBottom: '12px' }}>Terms of Service</h1>
        <p style={{ fontSize: '14px', color: '#888' }}>Last updated: May 1, 2026</p>
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 24px 96px' }}>
        <P>These Terms of Service ("Terms") govern your access to and use of the Lumara Beauty website ("Site") and the purchase of products from Lumara Beauty ("Lumara," "we," "our," or "us"). By accessing our Site or placing an order, you agree to be bound by these Terms.</P>

        <Section title="1. Use of the Website">
          <P>You must be at least 18 years of age to use this Site and place orders. By using this Site, you represent and warrant that you are 18 years of age or older. You agree to use the Site only for lawful purposes and in accordance with these Terms. You may not use the Site in any way that violates applicable laws or regulations.</P>
        </Section>

        <Section title="2. Product Information and Pricing">
          <P>We make every effort to accurately display the colour, descriptions, dimensions, and prices of our products. However, we cannot guarantee that your device's display of colours will be accurate. Prices are subject to change without notice. We reserve the right to limit quantities or refuse service to anyone at our discretion.</P>
          <P>All prices are listed in USD. Applicable taxes will be calculated and added at checkout based on your shipping address.</P>
        </Section>

        <Section title="3. Orders and Purchase Terms">
          <P>When you place an order, you are making an offer to purchase. We reserve the right to accept or decline any order at our discretion. Order confirmation emails do not constitute acceptance of your order — acceptance occurs when your order is dispatched.</P>
          <P>If we are unable to fulfil your order (e.g. due to stock availability, pricing error, or suspected fraud), we will notify you promptly and issue a full refund to your original payment method.</P>
        </Section>

        <Section title="4. Payment">
          <P>All payments are processed securely through our third-party payment processors (Stripe, PayPal). We accept Visa, Mastercard, American Express, PayPal, and Apple Pay. By submitting payment information, you represent that you are the authorised user of the payment method and that the information is accurate.</P>
          <P>We reserve the right to cancel any order where we believe payment fraud may have occurred and to report such incidents to the appropriate authorities.</P>
        </Section>

        <Section title="5. Shipping and Delivery">
          <P>Shipping timelines are estimates and are not guaranteed. Lumara is not liable for delays caused by carriers, customs, natural disasters, or other circumstances beyond our control. Risk of loss and title for items passes to you upon delivery to the carrier.</P>
        </Section>

        <Section title="6. Returns and Refunds">
          <P>Our returns and refund process is governed by our Returns Policy, which is incorporated into these Terms by reference. Please review our Returns Policy before making a purchase.</P>
        </Section>

        <Section title="7. Intellectual Property">
          <P>All content on this Site — including text, images, logos, product descriptions, and design — is the property of Lumara Beauty and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works from any Site content without our express written permission.</P>
        </Section>

        <Section title="8. Limitation of Liability">
          <P>To the fullest extent permitted by law, Lumara Beauty shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our Site or products, even if we have been advised of the possibility of such damages.</P>
          <P>Our total liability to you for any claim arising from the use of our Site or products shall not exceed the amount you paid for the relevant product or service.</P>
        </Section>

        <Section title="9. Disclaimer of Warranties">
          <P>Our Site and products are provided "as is" without warranties of any kind, express or implied. We do not warrant that the Site will be uninterrupted, error-free, or free of viruses. Product results described on our Site are based on clinical studies and individual results may vary.</P>
        </Section>

        <Section title="10. Dispute Resolution">
          <P>Any disputes arising from these Terms or your use of our Site shall first be resolved through good-faith negotiation. If we cannot resolve a dispute informally within 30 days, either party may pursue binding arbitration under the rules of the American Arbitration Association. Class action lawsuits are waived to the fullest extent permitted by law.</P>
        </Section>

        <Section title="11. Governing Law">
          <P>These Terms are governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to conflict of law principles. Any legal action relating to these Terms must be brought in the courts of Delaware.</P>
        </Section>

        <Section title="12. Changes to Terms">
          <P>We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated date. Your continued use of the Site after changes are posted constitutes your acceptance of the revised Terms.</P>
        </Section>

        <Section title="13. Contact">
          <P>For questions about these Terms, please contact us at:<br/><strong>Email:</strong> legal@lumara.com<br/><strong>General support:</strong> hello@lumara.com</P>
        </Section>
      </div>
    </div>
  );
}
