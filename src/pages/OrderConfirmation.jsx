import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';

export default function OrderConfirmation() {
  const [params] = useSearchParams();
  const orderNum = params.get('order') || 'LM000000';

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#fff', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ maxWidth: '560px', width: '100%', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', background: '#F0FAF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '2px solid #B8E0D2' }}>
          <CheckCircle size={36} style={{ color: '#2D9E6B' }} />
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1A1A1A', letterSpacing: '-1px', marginBottom: '12px' }}>Order Confirmed!</h1>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '8px' }}>Thank you for your order.</p>
        <p style={{ fontSize: '22px', fontWeight: '700', color: '#1A1A1A', marginBottom: '32px' }}>{orderNum}</p>

        <div style={{ background: '#FAFAFA', borderRadius: '16px', padding: '32px', border: '1px solid #F0F0F0', marginBottom: '32px', textAlign: 'left' }}>
          {[
            { icon: <Mail size={18}/>, title: 'Confirmation Email Sent', desc: 'Check your inbox for your order receipt and details.' },
            { icon: <Package size={18}/>, title: 'Processing: 1–3 Business Days', desc: 'Your order enters our fulfilment queue immediately.' },
            { icon: <CheckCircle size={18}/>, title: 'Tracking Number Incoming', desc: 'You\'ll receive tracking info once your package ships.' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: i < 2 ? '24px' : '0', paddingBottom: i < 2 ? '24px' : '0', borderBottom: i < 2 ? '1px solid #F0F0F0' : 'none' }}>
              <div style={{ width: '40px', height: '40px', background: '#F0FAF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2D9E6B', flexShrink: 0 }}>{item.icon}</div>
              <div>
                <p style={{ fontSize: '15px', fontWeight: '700', color: '#1A1A1A', marginBottom: '4px' }}>{item.title}</p>
                <p style={{ fontSize: '13px', color: '#888' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/pages/track-order" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#1A1A1A', color: '#fff', textDecoration: 'none', padding: '14px 28px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Track Order <ArrowRight size={14}/>
          </Link>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F5F5F5', color: '#1A1A1A', textDecoration: 'none', padding: '14px 28px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
