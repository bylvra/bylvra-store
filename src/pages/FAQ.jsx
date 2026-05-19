import React, { useState } from 'react';

const FAQS = [
  { q: 'How long does shipping take?', a: 'Standard shipping takes 7–15 business days. Express shipping (5–10 business days) is available at checkout. Orders are processed within 1–3 business days before dispatch. You\'ll receive a tracking number by email once your order ships.' },
  { q: 'Do you offer free shipping?', a: 'Yes! All orders over $50 qualify for free standard shipping automatically — no code needed. For orders under $50, standard shipping is $6.99.' },
  { q: 'How do I track my order?', a: 'Once your order ships, you\'ll receive a tracking email with your carrier and tracking number. You can also visit our Track Order page and enter your order number and email address to see real-time status.' },
  { q: 'Do you ship internationally?', a: 'Yes, we ship to most countries worldwide. International orders typically take 10–20 business days. Please note that customs fees and import duties are the responsibility of the customer and vary by country.' },
  { q: 'What is your return policy?', a: 'We offer a 30-day return window from the date of delivery. Items must be in original, unused condition with original packaging. To initiate a return, email hello@bylvra.shop with your order number. Refunds are processed within 5–10 business days of receiving the returned item.' },
  { q: 'Can I return an opened product?', a: 'For hygiene reasons, skincare products that have been opened or used are not eligible for return. However, if you experienced an adverse reaction or the product arrived damaged, please contact us — we\'ll make it right regardless.' },
  { q: 'Are your products safe for sensitive skin?', a: 'Most BYLVRA products are formulated without fragrance, essential oils, and common sensitisers. Each product page lists all ingredients clearly. If you have specific skin concerns or allergies, we recommend patch-testing for 24 hours before full use.' },
  { q: 'How do LED light therapy devices work?', a: 'LED light therapy devices emit specific wavelengths of light that penetrate skin at different depths. Red light (630–660nm) stimulates fibroblasts to produce collagen. Blue light (415nm) kills acne-causing bacteria. Near-infrared (830–850nm) reduces inflammation and accelerates tissue repair. Consistent 10-minute daily sessions produce the best results.' },
  { q: 'Is the microcurrent device safe for everyone?', a: 'The LiftWave Microcurrent Device is not recommended for people with pacemakers, metal implants in the face, active acne, or who are pregnant. If you have any medical conditions, consult your healthcare provider before use. Otherwise, it is safe for daily use.' },
  { q: 'Can I use the derma roller with other products?', a: 'Yes — and it\'s highly recommended. Rolling before applying serums (especially hyaluronic acid, peptides, or vitamin C) increases absorption by up to 200%. Avoid using retinol or acids immediately post-rolling to prevent irritation. Wait 24 hours before applying strong actives.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit and debit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. All transactions are secured with 256-bit SSL encryption. We do not store payment card details.' },
  { q: 'Can I change or cancel my order?', a: 'Orders can be modified or cancelled within 2 hours of placement. After that, orders enter our processing queue and cannot be changed. Contact hello@bylvra.shop immediately with your order number if you need to make changes.' },
  { q: 'How do I use a discount code?', a: 'Enter your discount code in the "Discount Code" field in your cart before proceeding to checkout. Only one code can be applied per order. Codes cannot be applied after an order is placed.' },
  { q: 'Are BYLVRA products cruelty-free?', a: 'Yes. All BYLVRA products are cruelty-free — we do not conduct or commission animal testing at any stage of development. Our devices and skincare formulas are tested on human volunteers only.' },
  { q: 'How long until I see results?', a: 'It depends on the product. Immediate-effect products (ice globes, peel masks, ZeroSpot patches) show results within one use. Serums and devices targeting collagen or pigmentation typically show meaningful results in 4–8 weeks of consistent use. We publish clinical data for each product so you know exactly what to expect.' },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #F0F0F0' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '16px' }}>
        <span style={{ fontSize: '16px', fontWeight: '600', color: '#1A1A1A', lineHeight: 1.4 }}>{q}</span>
        <span style={{ fontSize: '22px', color: '#B8E0D2', fontWeight: '300', flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(45deg)' : 'none', display: 'inline-block' }}>+</span>
      </button>
      {open && (
        <div style={{ paddingBottom: '22px', fontSize: '15px', color: '#555', lineHeight: 1.8, maxWidth: '720px' }}>
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#fff' }}>
      <div style={{ background: '#FAFAFA', padding: '72px 24px', textAlign: 'center', borderBottom: '1px solid #F0F0F0' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: '#B8E0D2', marginBottom: '12px' }}>Help Centre</p>
        <h1 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: '800', color: '#1A1A1A', letterSpacing: '-1.5px', marginBottom: '16px' }}>Frequently Asked Questions</h1>
        <p style={{ fontSize: '16px', color: '#666', maxWidth: '480px', margin: '0 auto' }}>Everything you need to know about BYLVRA, our products, and your orders.</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '64px 24px 96px' }}>
        {[
          { section: 'Shipping & Delivery', items: FAQS.slice(0, 4) },
          { section: 'Returns & Refunds', items: FAQS.slice(4, 6) },
          { section: 'Products & Usage', items: FAQS.slice(6, 10) },
          { section: 'Payments & Orders', items: FAQS.slice(10, 13) },
          { section: 'Brand & Values', items: FAQS.slice(13) },
        ].map((section, si) => (
          <div key={si} style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#B8E0D2', marginBottom: '8px' }}>{section.section}</h2>
            <div>
              {section.items.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
            </div>
          </div>
        ))}

        <div style={{ background: '#FAFAFA', borderRadius: '16px', padding: '40px', textAlign: 'center', border: '1px solid #F0F0F0', marginTop: '16px' }}>
          <p style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A1A', marginBottom: '8px' }}>Still have questions?</p>
          <p style={{ color: '#888', marginBottom: '24px' }}>Our support team responds within 24 hours.</p>
          <a href="/pages/contact" style={{ display: 'inline-block', background: '#1A1A1A', color: '#fff', textDecoration: 'none', padding: '14px 32px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>Contact Us</a>
        </div>
      </div>
    </div>
  );
}
