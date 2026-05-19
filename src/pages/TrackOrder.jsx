import React, { useState } from 'react';
import { Order } from '../api/entities';
import { Package, Truck, CheckCircle, Clock, MapPin, AlertCircle } from 'lucide-react';

const STATUS_STEPS = [
  { key: 'pending',    icon: Clock,        label: 'Order Confirmed',  desc: 'We received your order' },
  { key: 'processing', icon: Package,      label: 'Processing',       desc: 'Being prepared for dispatch' },
  { key: 'shipped',    icon: Truck,        label: 'Shipped',          desc: 'On its way to you' },
  { key: 'delivered',  icon: CheckCircle,  label: 'Delivered',        desc: 'Arrived at your door' },
];

const STATUS_ORDER = ['pending', 'processing', 'shipped', 'delivered'];

export default function TrackOrder() {
  const [form, setForm] = useState({ orderNumber: '', email: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const orders = await Order.filter({ order_number: form.orderNumber.trim().toUpperCase() });
      const order = orders?.find(o => o.customer_email?.toLowerCase() === form.email.trim().toLowerCase());
      if (order) {
        setResult(order);
      } else {
        setError('No order found matching that order number and email. Please check your details and try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const currentStepIndex = result ? STATUS_ORDER.indexOf(result.status) : -1;

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#fff' }}>
      {/* Header */}
      <div style={{ background: '#FAFAFA', padding: '72px 24px', textAlign: 'center', borderBottom: '1px solid #F0F0F0' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: '#B8E0D2', marginBottom: '12px' }}>Order Status</p>
        <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: '800', color: '#1A1A1A', letterSpacing: '-1.5px', marginBottom: '16px' }}>Track Your Order</h1>
        <p style={{ fontSize: '16px', color: '#666', maxWidth: '400px', margin: '0 auto' }}>Enter your order number and email to see real-time delivery status.</p>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '64px 24px' }}>
        {/* Search form */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', border: '1px solid #F0F0F0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', marginBottom: '40px' }}>
          <form onSubmit={handleSearch}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px', color: '#555', marginBottom: '6px', textTransform: 'uppercase' }}>Order Number</label>
              <input
                type="text"
                value={form.orderNumber}
                onChange={e => setForm(p => ({ ...p, orderNumber: e.target.value }))}
                placeholder="e.g. BL123456"
                required
                style={{ width: '100%', border: '1.5px solid #E0E0E0', borderRadius: '6px', padding: '14px 16px', fontSize: '15px', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#1A1A1A'}
                onBlur={e => e.target.style.borderColor = '#E0E0E0'}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px', color: '#555', marginBottom: '6px', textTransform: 'uppercase' }}>Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="Email used at checkout"
                required
                style={{ width: '100%', border: '1.5px solid #E0E0E0', borderRadius: '6px', padding: '14px 16px', fontSize: '15px', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#1A1A1A'}
                onBlur={e => e.target.style.borderColor = '#E0E0E0'}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', background: '#1A1A1A', color: '#fff', border: 'none', padding: '16px', borderRadius: '6px', fontSize: '14px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Searching…' : 'Track Order'}
            </button>
          </form>

          {error && (
            <div style={{ marginTop: '20px', padding: '14px 16px', background: '#FFF5F5', border: '1px solid #FECACA', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <AlertCircle size={16} style={{ color: '#EF4444', flexShrink: 0, marginTop: '1px' }} />
              <p style={{ fontSize: '14px', color: '#7F1D1D' }}>{error}</p>
            </div>
          )}
        </div>

        {/* Result */}
        {result && (
          <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', border: '1px solid #F0F0F0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Order Number</p>
                <p style={{ fontSize: '20px', fontWeight: '800', color: '#1A1A1A' }}>{result.order_number}</p>
              </div>
              <div style={{
                padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase',
                background: result.status === 'delivered' ? '#F0FDF4' : result.status === 'shipped' ? '#EFF6FF' : '#FAFAFA',
                color: result.status === 'delivered' ? '#166534' : result.status === 'shipped' ? '#1D4ED8' : '#555',
                border: result.status === 'delivered' ? '1px solid #BBF7D0' : result.status === 'shipped' ? '1px solid #BFDBFE' : '1px solid #E0E0E0',
              }}>
                {result.status?.charAt(0).toUpperCase() + result.status?.slice(1)}
              </div>
            </div>

            {/* Progress tracker */}
            <div style={{ position: 'relative', marginBottom: '40px' }}>
              {/* Line */}
              <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', height: '2px', background: '#F0F0F0', zIndex: 0 }} />
              <div style={{ position: 'absolute', top: '20px', left: '20px', height: '2px', background: '#1A1A1A', zIndex: 1, width: `${Math.max(0, (currentStepIndex / (STATUS_STEPS.length - 1)) * 100)}%`, transition: 'width 0.5s ease' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                {STATUS_STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const done = i <= currentStepIndex;
                  return (
                    <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', flex: 1 }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: done ? '#1A1A1A' : '#fff',
                        border: `2px solid ${done ? '#1A1A1A' : '#E0E0E0'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.3s',
                      }}>
                        <Icon size={16} color={done ? '#fff' : '#ccc'} />
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '11px', fontWeight: done ? '700' : '400', color: done ? '#1A1A1A' : '#aaa' }}>{step.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order items */}
            {result.items?.length > 0 && (
              <div>
                <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: '#888', marginBottom: '16px' }}>Items Ordered</p>
                {result.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F5F5F5', fontSize: '14px' }}>
                    <span style={{ color: '#1A1A1A', fontWeight: '500' }}>{item.name} <span style={{ color: '#888', fontWeight: '400' }}>× {item.quantity}</span></span>
                    <span style={{ fontWeight: '700' }}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 0', fontSize: '15px', fontWeight: '800' }}>
                  <span>Total</span>
                  <span>${result.total?.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Tracking number */}
            {result.tracking_number && (
              <div style={{ marginTop: '24px', padding: '16px', background: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#166534', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tracking Number</p>
                <p style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A1A', fontFamily: 'monospace' }}>{result.tracking_number}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
