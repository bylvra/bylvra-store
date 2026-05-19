import React from 'react';
import { RotateCcw, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function ReturnsPolicy() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#fff' }}>
      <div style={{ background: '#FAFAFA', padding: '72px 24px', textAlign: 'center', borderBottom: '1px solid #F0F0F0' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: '#B8E0D2', marginBottom: '12px' }}>Returns & Refunds</p>
        <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: '800', color: '#1A1A1A', letterSpacing: '-1.5px', marginBottom: '16px' }}>Returns Policy</h1>
        <p style={{ fontSize: '16px', color: '#666', maxWidth: '480px', margin: '0 auto' }}>30-day returns, no hoops. Your satisfaction is our guarantee.</p>
      </div>

      <div style={{ maxWidth: '720px', margin: '64px auto', padding: '0 24px 96px' }}>
        <div style={{ background: '#F0FAF5', border: '1px solid #B8E0D2', borderRadius: '12px', padding: '28px', marginBottom: '48px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <CheckCircle size={24} style={{ color: '#2D9E6B', flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: '17px', fontWeight: '700', color: '#1A5F3D', marginBottom: '8px' }}>30-Day Satisfaction Guarantee</p>
            <p style={{ fontSize: '14px', color: '#2D6B4E', lineHeight: 1.7 }}>If you're not completely satisfied with your purchase for any reason, contact us within 30 days of delivery and we'll make it right. No complicated forms, no lengthy back-and-forths.</p>
          </div>
        </div>

        {[
          {
            icon: <RotateCcw size={20}/>,
            title: 'Return Window',
            body: 'You have 30 days from the date your order is delivered to initiate a return. Returns requested after 30 days will not be accepted unless the item is defective or arrived damaged.'
          },
          {
            icon: <CheckCircle size={20}/>,
            title: 'Eligible Items',
            body: 'Items are eligible for return if they are:\n— In original, unused condition\n— In original packaging with all included accessories\n— Not marked as Final Sale at the time of purchase\n\nFor hygiene reasons, the following cannot be returned once opened: skincare serums, toners, masks, lip treatments, and lash serums. This does not apply if the item arrived damaged or defective.'
          },
          {
            icon: <AlertCircle size={20}/>,
            title: 'Damaged or Defective Items',
            body: 'If your item arrived damaged, defective, or incorrect, please contact us within 7 days of delivery at hello@lumara.com with:\n— Your order number\n— A photo of the damaged item and packaging\n\nWe will arrange a replacement or full refund at no cost to you, including return shipping.'
          },
          {
            icon: <Clock size={20}/>,
            title: 'Refund Timeline',
            body: 'Once we receive and inspect your return (1–3 business days), you will receive an email confirmation. Refunds are then processed to your original payment method within 5–10 business days. Credit card refunds may take an additional 3–5 days to appear depending on your bank.'
          },
          {
            icon: <Package size={20}/>,
            title: 'How to Initiate a Return',
            body: 'Step 1: Email hello@lumara.com with subject "Return Request — [Order Number]"\nStep 2: Include your order number, the item(s) you wish to return, and reason\nStep 3: We\'ll reply within 24 hours with your return shipping label\nStep 4: Pack the item securely and drop it at your nearest carrier location\nStep 5: Receive your refund within 5–10 business days of us receiving the item'
          },
          {
            icon: <Globe size={20}/>,
            title: 'Return Shipping Costs',
            body: 'For standard returns (change of mind, size/fit issues), return shipping costs are the responsibility of the customer. We provide a pre-paid label for your convenience — the cost is deducted from your refund.\n\nFor damaged, defective, or incorrectly shipped items, return shipping is fully covered by Lumara at no cost to you.'
          },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{ color: '#B8E0D2' }}>{s.icon}</span>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1A1A1A' }}>{s.title}</h2>
            </div>
            {s.body.split('\n').map((line, j) => (
              line === '' ? <br key={j}/> : <p key={j} style={{ fontSize: '15px', color: '#555', lineHeight: 1.8, marginBottom: '4px' }}>{line}</p>
            ))}
            <div style={{ height: '1px', background: '#F0F0F0', marginTop: '32px' }} />
          </div>
        ))}

        <div style={{ background: '#1A1A1A', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
          <p style={{ color: '#B8E0D2', fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>Need to Return Something?</p>
          <p style={{ color: '#fff', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>We're here to help.</p>
          <p style={{ color: '#aaa', marginBottom: '24px', fontSize: '14px' }}>Email us at hello@lumara.com and we'll have you sorted within 24 hours.</p>
          <a href="/pages/contact" style={{ display: 'inline-block', background: '#B8E0D2', color: '#1A1A1A', textDecoration: 'none', padding: '14px 32px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>Contact Support</a>
        </div>
      </div>
    </div>
  );
}

function Package({ size, style }) {
  return <svg width={size} height={size} style={style} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
}
function Globe({ size, style }) {
  return <svg width={size} height={size} style={style} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
}
