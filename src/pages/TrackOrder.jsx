import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';

const STEPS = [
  { icon: <CheckCircle size={20}/>, label: 'Order Confirmed', time: 'Immediately after purchase' },
  { icon: <Clock size={20}/>, label: 'Processing', time: '1–3 business days' },
  { icon: <Package size={20}/>, label: 'Dispatched', time: 'Carrier picks up package' },
  { icon: <Truck size={20}/>, label: 'In Transit', time: '7–15 business days' },
  { icon: <MapPin size={20}/>, label: 'Out for Delivery', time: 'Day of delivery' },
  { icon: <CheckCircle size={20}/>, label: 'Delivered', time: 'At your door' },
];

export default function TrackOrder() {
  const [form, setForm] = useState({ orderNumber: '', email: '' });
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#fff' }}>
      <div style={{ background: '#FAFAFA', padding: '72px 24px', textAlign: 'center', borderBottom: '1px solid #F0F0F0' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: '#B8E0D2', marginBottom: '12px' }}>Order Status</p>
        <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: '800', color: '#1A1A1A', letterSpacing: '-1.5px', marginBottom: '16px' }}>Track Your Order</h1>
        <p style={{ fontSize: '16px', color: '#666', maxWidth: '400px', margin: '0 auto' }}>Enter your order number and email to see real-time status.</p>
      </div>

      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', border: '1px solid #F0F0F0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', marginBottom: '48px' }}>
          <form onSubmit={handleSearch}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px', color: '#555', marginBottom: '6px', textTransform: 'uppercase' }}>Order Number</label>
              <input
                type="text"
                value={form.orderNumber}
                onChange={e => setForm(p => ({ ...p, orderNumber: e.target.value }))}
                placeholder="e.g. LM123456"
                required
                style={{ width: '100%', border: '1.5px solid #E0E0E0', borderRadius: '6px', padding: '14px 16px', fontSize: '15px', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px', color: '#555', marginBottom: '6px', textTransform: 'uppercase' }}>Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="email used at checkout"
                required
                style={{ width: '100%', border: '1.5px solid #E0E0E0', borderRadius: '6px', padding: '14px 16px', fontSize: '15px', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}
              />
            </div>
            <button type="submit" style={{ width: '100%', background: '#1A1A1A', color: '#fff', border: 'none', padding: '16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Track Order
            </button>
          </form>

          {searched && (
            <div style={{ marginTop: '24px', padding: '20px', background: '#FFF8E7', borderRadius: '8px', border: '1px solid #FFE082' }}>
              <p style={{ fontSize: '14px', color: '#92400E', fontWeight: '500', lineHeight: 1.6 }}>
                We couldn't find an order matching those details. Please double-check your order number (found in your confirmation email) and try again, or <a href="/pages/contact" style={{ color: '#1A1A1A', fontWeight: '700' }}>contact our support team</a>.
              </p>
            </div>
          )}
        </div>

        {/* Order timeline visual */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A1A', marginBottom: '32px' }}>Standard Order Timeline</h2>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '19px', top: '0', bottom: '0', width: '2px', background: '#F0F0F0', zIndex: 0 }} />
            {STEPS.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '20px', marginBottom: '28px', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                  background: i < 3 ? '#1A1A1A' : '#F5F5F5',
                  border: `2px solid ${i < 3 ? '#1A1A1A' : '#E0E0E0'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: i < 3 ? '#fff' : '#BBB',
                }}>
                  {step.icon}
                </div>
                <div style={{ paddingTop: '8px' }}>
                  <p style={{ fontSize: '15px', fontWeight: '600', color: i < 3 ? '#1A1A1A' : '#888', marginBottom: '2px' }}>{step.label}</p>
                  <p style={{ fontSize: '13px', color: '#AAA' }}>{step.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '48px', background: '#FAFAFA', borderRadius: '12px', padding: '28px', border: '1px solid #F0F0F0', textAlign: 'center' }}>
          <p style={{ fontWeight: '700', color: '#1A1A1A', marginBottom: '8px' }}>Need help with your order?</p>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '16px' }}>Our team responds within 24 hours.</p>
          <a href="/pages/contact" style={{ display: 'inline-block', background: '#1A1A1A', color: '#fff', textDecoration: 'none', padding: '12px 28px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>Contact Support</a>
        </div>
      </div>
    </div>
  );
}
