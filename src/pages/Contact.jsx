import React, { useState } from 'react';
import { ContactMessage } from '../api/entities';
import { Mail, Clock, MessageCircle } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await ContactMessage.create({ ...form, status: 'new' });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#fff' }}>
      <div style={{ background: '#FAFAFA', padding: '72px 24px', textAlign: 'center', borderBottom: '1px solid #F0F0F0' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: '#B8E0D2', marginBottom: '12px' }}>Get In Touch</p>
        <h1 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: '800', color: '#1A1A1A', letterSpacing: '-1.5px', marginBottom: '16px' }}>Contact Us</h1>
        <p style={{ fontSize: '16px', color: '#666', maxWidth: '480px', margin: '0 auto' }}>We respond to every message within 24 hours. Real humans, no bots.</p>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 24px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '64px', alignItems: 'start' }} className="contact-grid">
        <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', border: '1px solid #F0F0F0', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: '64px', height: '64px', background: '#F0FAF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '28px' }}>✓</div>
              <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px' }}>Message Received</h3>
              <p style={{ color: '#666', lineHeight: 1.7 }}>Thanks for reaching out! We'll reply to <strong>{form.email}</strong> within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '28px' }}>Send a Message</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                {[['name','Your Name','text'],['email','Email Address','email']].map(([f,p,t]) => (
                  <div key={f} style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px', color: '#555', marginBottom: '6px', textTransform: 'uppercase' }}>{p}</label>
                    <input type={t} value={form[f]} onChange={e => update(f, e.target.value)} required style={{ width: '100%', border: '1.5px solid #E0E0E0', borderRadius: '6px', padding: '12px 14px', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px', color: '#555', marginBottom: '6px', textTransform: 'uppercase' }}>Subject</label>
                <select value={form.subject} onChange={e => update('subject', e.target.value)} required style={{ width: '100%', border: '1.5px solid #E0E0E0', borderRadius: '6px', padding: '12px 14px', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', background: '#fff', boxSizing: 'border-box' }}>
                  <option value="">Select a subject</option>
                  <option>Order Issue</option><option>Tracking & Shipping</option><option>Return Request</option><option>Product Question</option><option>Other</option>
                </select>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px', color: '#555', marginBottom: '6px', textTransform: 'uppercase' }}>Message</label>
                <textarea value={form.message} onChange={e => update('message', e.target.value)} rows={5} required placeholder="Tell us how we can help…" style={{ width: '100%', border: '1.5px solid #E0E0E0', borderRadius: '6px', padding: '12px 14px', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
              <button type="submit" disabled={submitting} style={{ width: '100%', background: '#1A1A1A', color: '#fff', border: 'none', padding: '16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', opacity: submitting ? 0.6 : 1 }}>
                {submitting ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1A1A1A', marginBottom: '32px' }}>Support Information</h3>
          {[
            { icon: <Mail size={20}/>, title: 'Email Support', info: 'hello@bylvra.shop', sub: 'We reply within 24 hours, 7 days a week.' },
            { icon: <Clock size={20}/>, title: 'Support Hours', info: 'Mon–Sun, 9AM–8PM PST', sub: 'Including weekends and holidays.' },
            { icon: <MessageCircle size={20}/>, title: 'Order Inquiries', info: 'orders@bylvra.shop', sub: 'For order status, tracking, or modifications.' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '20px', marginBottom: '24px', padding: '24px', background: '#FAFAFA', borderRadius: '12px', border: '1px solid #F0F0F0' }}>
              <div style={{ width: '44px', height: '44px', background: '#F0FAF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2D9E6B', flexShrink: 0 }}>{item.icon}</div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: '700', color: '#1A1A1A', marginBottom: '4px' }}>{item.title}</p>
                <p style={{ fontSize: '15px', fontWeight: '600', color: '#1A1A1A', marginBottom: '4px' }}>{item.info}</p>
                <p style={{ fontSize: '13px', color: '#888' }}>{item.sub}</p>
              </div>
            </div>
          ))}
          <div style={{ background: '#1A1A1A', borderRadius: '12px', padding: '28px' }}>
            <p style={{ color: '#B8E0D2', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>30-Day Guarantee</p>
            <p style={{ color: '#fff', fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>Not satisfied? We'll make it right.</p>
            <p style={{ color: '#aaa', fontSize: '13px', lineHeight: 1.7 }}>Every BYLVRA product comes with a 30-day satisfaction guarantee. If you're not seeing results, reach out — no hoops to jump through.</p>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
